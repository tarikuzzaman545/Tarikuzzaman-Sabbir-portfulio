/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  RATE LIMITING — in-process sliding window
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  READ THIS BEFORE YOU SCALE
 *  ──────────────────────────
 *  State lives in module memory. That has two consequences you should know
 *  about rather than discover:
 *
 *    1. It resets on cold start. A serverless function that has been idle
 *       forgets every counter when it wakes.
 *    2. It is per-instance. Two concurrent Vercel instances keep separate
 *       counters, so the effective limit is roughly N × the configured limit.
 *
 *  For a personal portfolio contact form this is the right trade-off — it stops
 *  the realistic threat (a script hammering one endpoint) with zero
 *  infrastructure, zero latency and zero cost. It is not a defence against a
 *  distributed attack, and it was never going to be.
 *
 *  WHEN TO UPGRADE
 *  ───────────────
 *  If you start seeing spam that survives this, move the store to Upstash Redis.
 *  The swap is small and localised:
 *
 *      npm install @upstash/ratelimit @upstash/redis
 *
 *      import { Ratelimit } from '@upstash/ratelimit';
 *      import { Redis } from '@upstash/redis';
 *
 *      const limiter = new Ratelimit({
 *        redis: Redis.fromEnv(),
 *        limiter: Ratelimit.slidingWindow(5, '10 m'),
 *      });
 *
 *      const { success, remaining, reset } = await limiter.limit(key);
 *
 *  Only `checkRateLimit` needs to change; every call site keeps working, because
 *  the return shape below is deliberately the same shape Upstash returns.
 *
 *  WHY SLIDING WINDOW
 *  ──────────────────
 *  A fixed window lets someone send the full quota at 09:59:59 and the full
 *  quota again at 10:00:00 — double the intended rate at the boundary. Tracking
 *  individual timestamps and expiring them as they age avoids that entirely.
 */

/** One caller's request timestamps, newest last. */
interface WindowEntry {
  timestamps: number[];
  /** When this entry becomes eligible for sweeping. */
  expiresAt: number;
}

const store = new Map<string, WindowEntry>();

/** Hard cap on tracked keys, so a spray of unique IPs cannot grow the map
 *  without bound. At the cap the oldest entries are evicted first. */
const MAX_KEYS = 10_000;

/** How often to sweep expired entries, in requests rather than on a timer — a
 *  setInterval would keep a serverless function's event loop alive. */
const SWEEP_EVERY = 100;
let requestsSinceSweep = 0;

function sweep(now: number): void {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
  // Still over the cap after sweeping — evict oldest-first. Map preserves
  // insertion order, so iteration gives us that for free.
  if (store.size > MAX_KEYS) {
    const excess = store.size - MAX_KEYS;
    let removed = 0;
    for (const key of store.keys()) {
      store.delete(key);
      if (++removed >= excess) break;
    }
  }
}

export interface RateLimitConfig {
  /** Maximum requests allowed inside the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether this request is allowed. */
  success: boolean;
  /** The configured limit, for the X-RateLimit-Limit header. */
  limit: number;
  /** Requests still available in the current window. */
  remaining: number;
  /** Epoch ms when the window frees up. Drives Retry-After. */
  reset: number;
}

/** Contact form: 5 submissions per 10 minutes. Generous for a person who sends
 *  one message and re-reads it; restrictive for a script. */
export const CONTACT_LIMIT: RateLimitConfig = { limit: 5, windowMs: 10 * 60 * 1000 };

/** Newsletter: 3 per hour. Nobody subscribes four times legitimately. */
export const NEWSLETTER_LIMIT: RateLimitConfig = { limit: 3, windowMs: 60 * 60 * 1000 };

/** CSRF token minting: 30 per 10 minutes. Loose, because a legitimate page load
 *  fetches one, but bounded so the endpoint cannot be used as a CPU sink. */
export const CSRF_LIMIT: RateLimitConfig = { limit: 30, windowMs: 10 * 60 * 1000 };

/**
 * Check and record a request against a key.
 *
 * Calling this counts the request when it is allowed. Blocked requests are not
 * recorded, so a caller who keeps hammering while limited does not extend their
 * own penalty indefinitely — they simply wait out the original window.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();

  if (++requestsSinceSweep >= SWEEP_EVERY) {
    requestsSinceSweep = 0;
    sweep(now);
  }

  const windowStart = now - config.windowMs;
  const entry = store.get(key);

  // Keep only timestamps still inside the window.
  const recent = entry ? entry.timestamps.filter((t) => t > windowStart) : [];

  if (recent.length >= config.limit) {
    // Oldest surviving timestamp determines when a slot frees up.
    const oldest = recent[0] ?? now;
    // Persist the trimmed list so the entry does not grow while blocked.
    store.set(key, { timestamps: recent, expiresAt: oldest + config.windowMs });
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: oldest + config.windowMs,
    };
  }

  recent.push(now);
  const oldest = recent[0] ?? now;
  store.set(key, { timestamps: recent, expiresAt: oldest + config.windowMs });

  return {
    success: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - recent.length),
    reset: oldest + config.windowMs,
  };
}

/**
 * Derive a rate-limit key from the request.
 *
 * On Vercel, `x-forwarded-for` is set by the platform's proxy and its leftmost
 * entry is the real client. Reading it is only safe *because* we are behind that
 * trusted proxy — on a self-hosted setup with no proxy, the header is
 * client-controlled and trivially spoofed, so it would need to be replaced with
 * the socket address.
 *
 * The prefix namespaces routes, so hitting the contact form does not consume the
 * newsletter allowance.
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  let ip = 'unknown';
  if (forwarded) {
    // Leftmost is the origin client; everything after is proxy chain.
    const first = forwarded.split(',')[0]?.trim();
    if (first) ip = first;
  } else if (realIp) {
    ip = realIp.trim();
  }

  // Cap the length so a hostile header cannot bloat a map key.
  return `${prefix}:${ip.slice(0, 64)}`;
}

/** Standard rate-limit headers. Included on success as well as failure, so a
 *  well-behaved client can back off before it gets blocked. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.reset / 1000)),
  };
  if (!result.success) {
    const seconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    headers['Retry-After'] = String(seconds);
  }
  return headers;
}

/** Test/maintenance hook — clears all counters. Not used by the app itself. */
export function resetRateLimits(): void {
  store.clear();
  requestsSinceSweep = 0;
}
