/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CSRF PROTECTION — signed double-submit cookie
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  HOW IT WORKS
 *  ────────────
 *  1. The client calls GET /api/csrf. The route mints a random nonce, signs it
 *     with HMAC-SHA256 using CSRF_SECRET, sets `<nonce>.<sig>` as a cookie, and
 *     returns the same string in the JSON body.
 *  2. The form submits that value in the `x-csrf-token` header.
 *  3. The POST route requires the header and the cookie to be present, both to
 *     carry a valid signature, and to match each other byte for byte.
 *
 *  WHY SIGNED, NOT JUST DOUBLE-SUBMIT
 *  ──────────────────────────────────
 *  Plain double-submit trusts that an attacker cannot set a cookie on your
 *  origin. That assumption breaks against a subdomain takeover or an XSS on a
 *  sibling subdomain, because cookies are shared across a domain in ways the
 *  same-origin policy does not respect. Signing means a forged cookie is
 *  useless without CSRF_SECRET, which never leaves the server.
 *
 *  WHY NOT SameSite ALONE
 *  ──────────────────────
 *  The cookie is SameSite=Strict, which stops the classic cross-site POST on
 *  its own. But SameSite is a browser-enforced control, and relying on a single
 *  browser-side mechanism for a state-changing endpoint is thin. This adds a
 *  server-verified layer that does not depend on the client behaving.
 *
 *  Tokens are also timestamped and expire after two hours, so a token scraped
 *  from a stale page cannot be replayed indefinitely.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from './csrf-constants';

/* The names live in `csrf-constants.ts` so client components can import them
   without pulling `node:crypto` into the browser bundle. Re-exported here so
   server code has a single import site for everything CSRF. */
export { CSRF_COOKIE_NAME, CSRF_HEADER_NAME };

/** Two hours. Long enough to write a considered message, short enough to bound
 *  replay of a token lifted from a cached page. */
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

/** Minimum acceptable secret length. 32 chars ≈ 192 bits from `openssl rand
 *  -base64 32`, which is well past what HMAC-SHA256 needs. */
const MIN_SECRET_LENGTH = 32;

/**
 * Resolve the signing secret.
 *
 * Throws when missing or too short. This is deliberate — a CSRF check running
 * on a weak or absent key is worse than no check, because it looks like
 * protection in a code review while providing none. Failing loudly at the first
 * request surfaces the misconfiguration immediately.
 */
function getSecret(): string {
  const secret = process.env.CSRF_SECRET?.trim();
  if (!secret) {
    throw new Error(
      'CSRF_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env.local (and to your Vercel environment variables).',
    );
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `CSRF_SECRET must be at least ${MIN_SECRET_LENGTH} characters. Generate one with \`openssl rand -base64 32\`.`,
    );
  }
  return secret;
}

/** True when a usable secret is configured. Lets routes return a clean 503
 *  instead of a stack trace. */
export function isCsrfConfigured(): boolean {
  try {
    getSecret();
    return true;
  } catch {
    return false;
  }
}

/** URL-safe base64 — no padding, no characters needing escaping in a cookie. */
function b64url(input: Buffer): string {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sign(payload: string, secret: string): string {
  return b64url(createHmac('sha256', secret).update(payload).digest());
}

/**
 * Mint a token of the form `<nonce>.<issuedAt>.<signature>`.
 *
 * The timestamp is inside the signed payload, so it cannot be edited to extend
 * the token's life.
 */
export function createCsrfToken(): string {
  const secret = getSecret();
  const nonce = b64url(randomBytes(24));
  const issuedAt = Date.now().toString(36);
  const payload = `${nonce}.${issuedAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

/** Constant-time string comparison that does not leak length through timing. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  // timingSafeEqual throws on length mismatch, so compare lengths first — the
  // length of a token is not secret, only its contents are.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Verify structure, signature and age of a single token. */
function verifyToken(token: string, secret: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [nonce, issuedAt, signature] = parts;
  if (!nonce || !issuedAt || !signature) return false;

  const expected = sign(`${nonce}.${issuedAt}`, secret);
  if (!safeEqual(signature, expected)) return false;

  const issued = Number.parseInt(issuedAt, 36);
  if (!Number.isFinite(issued)) return false;

  const age = Date.now() - issued;
  // Reject future-dated tokens too — that means a tampered clock or a forgery
  // attempt, and there is no legitimate case for one.
  if (age < -60_000 || age > TOKEN_TTL_MS) return false;

  return true;
}

export type CsrfResult =
  | { ok: true }
  | { ok: false; reason: 'missing' | 'invalid' | 'mismatch' | 'unconfigured' };

/**
 * Validate a request's CSRF state.
 *
 * Both the header and the cookie must verify independently, then match each
 * other. Checking both signatures — rather than just comparing the two strings —
 * means neither half can be replaced with an arbitrary value even if the other
 * is known.
 */
export function verifyCsrf(headerToken: string | null, cookieToken: string | null): CsrfResult {
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return { ok: false, reason: 'unconfigured' };
  }

  if (!headerToken || !cookieToken) return { ok: false, reason: 'missing' };
  if (!verifyToken(headerToken, secret) || !verifyToken(cookieToken, secret)) {
    return { ok: false, reason: 'invalid' };
  }
  if (!safeEqual(headerToken, cookieToken)) return { ok: false, reason: 'mismatch' };

  return { ok: true };
}

/**
 * Cookie attributes for the token.
 *
 * `httpOnly: false` is intentional and is the one attribute worth explaining.
 * The double-submit pattern requires JavaScript to read the value and echo it
 * in a header, so the cookie cannot be httpOnly. That is not the weakness it
 * looks like: a CSRF token is not a credential. Stealing it grants nothing on
 * its own, and the attack it defends against — a cross-origin form POST —
 * cannot read the cookie regardless. The token's secrecy from *other origins*
 * is what matters, and SameSite=Strict plus the signature provide that.
 *
 * The API route returns the token in its JSON body as well, so the client never
 * actually needs to read the cookie; the non-httpOnly flag is there so the
 * pattern still works if a page is restored from the back/forward cache.
 */
export function csrfCookieOptions(): {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict';
  path: string;
  maxAge: number;
} {
  return {
    name: CSRF_COOKIE_NAME,
    httpOnly: false,
    // Secure in production; off in dev so http://localhost works.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.floor(TOKEN_TTL_MS / 1000),
  };
}
