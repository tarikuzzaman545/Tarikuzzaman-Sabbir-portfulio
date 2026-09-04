/**
 * POST /api/contact — contact form submission.
 *
 * ORDER OF CHECKS, AND WHY
 * ────────────────────────
 * Cheap rejections come first so an attacker cannot make the server do expensive
 * work before being turned away:
 *
 *   1. Content-Type          — wrong type is a malformed or cross-origin post
 *   2. Origin                — rejects cross-site submissions outright
 *   3. Rate limit            — before parsing, so flooding costs the server little
 *   4. Body size             — before JSON.parse, so a huge payload is never parsed
 *   5. CSRF                  — before validation, since it is cheaper
 *   6. Schema validation     — the expensive-ish step
 *   7. Spam heuristics       — needs validated data to judge
 *   8. Send email            — the only step with an external dependency
 *
 * WHAT THE RESPONSE REVEALS
 * ─────────────────────────
 * Spam submissions get a 200 with the normal success shape. Telling a bot it was
 * detected teaches it what to change; letting it believe it succeeded does not.
 * Genuine failures get honest, specific errors, because a real person needs to
 * know what to fix.
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrf } from '@/lib/csrf';
import { isEmailConfigured, sendContactAcknowledgement, sendContactNotification } from '@/lib/email';
import { CONTACT_LIMIT, checkRateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';
import { contactFormSchema, isLikelySpam, toFieldErrors, type FieldErrors } from '@/lib/validation';
import { siteConfig } from '@/site.config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** 64 KB. The message field caps at 4,000 characters, so anything approaching
 *  this is not a legitimate enquiry. */
const MAX_BODY_BYTES = 64 * 1024;

interface SuccessBody {
  ok: true;
  message: string;
}

interface ErrorBody {
  ok: false;
  error: string;
  fields?: FieldErrors;
}

function success(headers: Record<string, string> = {}): NextResponse<SuccessBody> {
  return NextResponse.json<SuccessBody>(
    {
      ok: true,
      message: 'Thanks — your message is on its way. I usually reply within one working day.',
    },
    { status: 200, headers },
  );
}

function failure(
  status: number,
  error: string,
  extra: { fields?: FieldErrors; headers?: Record<string, string> } = {},
): NextResponse<ErrorBody> {
  return NextResponse.json<ErrorBody>(
    { ok: false, error, ...(extra.fields ? { fields: extra.fields } : {}) },
    { status, headers: extra.headers },
  );
}

/**
 * Same-origin check.
 *
 * Belongs alongside CSRF rather than instead of it — `Origin` is set by the
 * browser on cross-origin POSTs and cannot be forged by page JavaScript, but it
 * is absent on some legitimate requests and trivially set by a non-browser
 * client. So: reject a *mismatched* origin, accept a missing one, and let the
 * CSRF token be the check that a non-browser client cannot pass.
 */
function isOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const allowed = new Set<string>();

  // The request's own host, as seen through Vercel's proxy.
  const forwardedHost = request.headers.get('x-forwarded-host');
  if (forwardedHost) allowed.add(forwardedHost.split(',')[0]?.trim() ?? '');

  const host = request.headers.get('host');
  if (host) allowed.add(host.trim());

  // The configured canonical domain.
  if (!siteConfig.url.includes('FILL_ME')) {
    try {
      allowed.add(new URL(siteConfig.url).host);
    } catch {
      /* Malformed config URL — the host headers above still cover the real case. */
    }
  }

  // Vercel preview deployments get generated hostnames, so allow the platform's
  // own reported URL for this deployment.
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) allowed.add(vercelUrl);

  allowed.delete('');
  return allowed.has(originHost);
}

export async function POST(request: Request): Promise<NextResponse<SuccessBody | ErrorBody>> {
  /* ── 1. Content type ─────────────────────────────────────────────────── */
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return failure(415, 'Unsupported content type. Send JSON.');
  }

  /* ── 2. Origin ───────────────────────────────────────────────────────── */
  if (!isOriginAllowed(request)) {
    return failure(403, 'Request blocked: origin not allowed.');
  }

  /* ── 3. Rate limit ───────────────────────────────────────────────────── */
  const limit = checkRateLimit(getRateLimitKey(request, 'contact'), CONTACT_LIMIT);
  const limitHeaders = rateLimitHeaders(limit);
  if (!limit.success) {
    const seconds = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000));
    const minutes = Math.ceil(seconds / 60);
    return failure(
      429,
      `You have sent several messages already. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
      { headers: limitHeaders },
    );
  }

  /* ── 4. Body size, checked before parsing ────────────────────────────── */
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return failure(413, 'That message is too large.', { headers: limitHeaders });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return failure(400, 'Could not read the request body.', { headers: limitHeaders });
  }

  // Content-Length can lie or be absent under chunked encoding, so measure the
  // bytes we actually received.
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return failure(413, 'That message is too large.', { headers: limitHeaders });
  }

  /* ── 5. CSRF ─────────────────────────────────────────────────────────── */
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  const cookieToken = readCookie(request.headers.get('cookie'), CSRF_COOKIE_NAME);
  const csrf = verifyCsrf(headerToken, cookieToken);

  if (!csrf.ok) {
    if (csrf.reason === 'unconfigured') {
      return failure(
        503,
        'Form security is not configured on the server. Set CSRF_SECRET in your environment.',
        { headers: limitHeaders },
      );
    }
    // Expired or missing tokens are the common case for a real person who left a
    // tab open, so the message tells them what actually helps: reload.
    return failure(403, 'Your session expired. Please reload the page and try again.', {
      headers: limitHeaders,
    });
  }

  /* ── 6. Parse + validate ─────────────────────────────────────────────── */
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return failure(400, 'Malformed request body.', { headers: limitHeaders });
  }

  let data;
  try {
    data = contactFormSchema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      return failure(422, 'Please check the highlighted fields.', {
        fields: toFieldErrors(error),
        headers: limitHeaders,
      });
    }
    return failure(400, 'Could not process that submission.', { headers: limitHeaders });
  }

  /* ── 7. Spam heuristics ──────────────────────────────────────────────── */
  if (isLikelySpam(data)) {
    // Deliberate silent discard. Logged so a false positive is diagnosable, with
    // only the domain recorded rather than the full address.
    const domain = data.email.split('@')[1] ?? 'unknown';
    // eslint-disable-next-line no-console
    console.warn(`[contact] Discarded a submission flagged as spam. Sender domain: ${domain}`);
    return success(limitHeaders);
  }

  /* ── 8. Send ─────────────────────────────────────────────────────────── */
  if (!isEmailConfigured()) {
    const fallback = siteConfig.contact.email;
    const hint =
      fallback && !fallback.includes('FILL_ME')
        ? ` In the meantime you can email me directly at ${fallback}.`
        : '';
    return failure(503, `Email delivery is not configured yet.${hint}`, { headers: limitHeaders });
  }

  const notification = await sendContactNotification(data);
  if (!notification.ok) {
    const fallback = siteConfig.contact.email;
    const hint =
      fallback && !fallback.includes('FILL_ME') ? ` Please email me directly at ${fallback}.` : '';
    return failure(502, `Your message could not be sent right now.${hint}`, {
      headers: limitHeaders,
    });
  }

  // Best-effort acknowledgement. The enquiry is already safely delivered, so a
  // failure here is logged and ignored rather than surfaced as a failed submit.
  const ack = await sendContactAcknowledgement(data);
  if (!ack.ok) {
    // eslint-disable-next-line no-console
    console.warn('[contact] Notification sent, but the acknowledgement failed:', ack.message);
  }

  return success(limitHeaders);
}

/**
 * Read a single cookie from a raw Cookie header.
 *
 * Hand-parsed rather than using `next/headers` `cookies()` so this route stays a
 * plain `Request` handler — easier to unit test, and no dependency on request
 * scope.
 */
function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() !== name) continue;
    const value = part.slice(eq + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return null;
}

/** Anything other than POST is a mistake or a probe. 405 with Allow is the
 *  correct, boring answer. */
export async function GET(): Promise<NextResponse<ErrorBody>> {
  return failure(405, 'Method not allowed.', { headers: { Allow: 'POST' } });
}
