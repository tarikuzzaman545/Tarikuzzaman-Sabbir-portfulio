/**
 * POST /api/newsletter — newsletter signup.
 *
 * Same defence sequence as the contact route, with a tighter rate limit (3 per
 * hour) because nobody subscribes four times legitimately.
 *
 * One behavioural difference worth noting: a duplicate signup returns success.
 * Responding "you are already subscribed" would turn the endpoint into a
 * subscriber-enumeration oracle, which leaks whether a given address is on the
 * list. Resend deduplicates on its side, so an idempotent success is both
 * safer and more truthful about the outcome.
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrf } from '@/lib/csrf';
import { subscribeToNewsletter } from '@/lib/email';
import { NEWSLETTER_LIMIT, checkRateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';
import { newsletterSchema, toFieldErrors, type FieldErrors } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BODY_BYTES = 4 * 1024;

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
    { ok: true, message: 'You are on the list. Thanks for subscribing.' },
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

export async function POST(request: Request): Promise<NextResponse<SuccessBody | ErrorBody>> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return failure(415, 'Unsupported content type. Send JSON.');
  }

  const limit = checkRateLimit(getRateLimitKey(request, 'newsletter'), NEWSLETTER_LIMIT);
  const limitHeaders = rateLimitHeaders(limit);
  if (!limit.success) {
    return failure(429, 'Too many attempts. Please try again later.', { headers: limitHeaders });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return failure(400, 'Could not read the request body.', { headers: limitHeaders });
  }
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return failure(413, 'Request body too large.', { headers: limitHeaders });
  }

  const csrf = verifyCsrf(
    request.headers.get(CSRF_HEADER_NAME),
    readCookie(request.headers.get('cookie'), CSRF_COOKIE_NAME),
  );
  if (!csrf.ok) {
    if (csrf.reason === 'unconfigured') {
      return failure(503, 'Form security is not configured on the server.', {
        headers: limitHeaders,
      });
    }
    return failure(403, 'Your session expired. Please reload the page and try again.', {
      headers: limitHeaders,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return failure(400, 'Malformed request body.', { headers: limitHeaders });
  }

  let data;
  try {
    data = newsletterSchema.parse(parsed);
  } catch (error) {
    if (error instanceof ZodError) {
      return failure(422, 'Please check your email address.', {
        fields: toFieldErrors(error),
        headers: limitHeaders,
      });
    }
    return failure(400, 'Could not process that signup.', { headers: limitHeaders });
  }

  // Honeypot: silent success, same reasoning as the contact route.
  if (data.company.length > 0) {
    return success(limitHeaders);
  }

  const result = await subscribeToNewsletter(data);
  if (!result.ok) {
    if (result.reason === 'unconfigured') {
      return failure(503, 'Newsletter signup is not configured yet.', { headers: limitHeaders });
    }
    return failure(502, 'Could not complete the signup right now. Please try again later.', {
      headers: limitHeaders,
    });
  }

  return success(limitHeaders);
}

export async function GET(): Promise<NextResponse<ErrorBody>> {
  return failure(405, 'Method not allowed.', { headers: { Allow: 'POST' } });
}
