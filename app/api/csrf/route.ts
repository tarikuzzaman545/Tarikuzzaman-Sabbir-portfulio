/**
 * GET /api/csrf — mint a CSRF token.
 *
 * The token is returned in the JSON body AND set as a cookie. The form sends the
 * body value back in the `x-csrf-token` header on submit; the POST route then
 * requires header and cookie to match. See `lib/csrf.ts` for why the pattern is
 * signed rather than a plain double-submit.
 *
 * `force-dynamic` matters here: a cached CSRF token would be handed to every
 * visitor, which defeats the entire mechanism.
 */

import { NextResponse } from 'next/server';

import { createCsrfToken, csrfCookieOptions, isCsrfConfigured } from '@/lib/csrf';
import { CSRF_LIMIT, checkRateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request): Promise<NextResponse> {
  // Rate-limited so the endpoint cannot be used as a free HMAC oracle or a
  // cheap way to burn CPU.
  const limit = checkRateLimit(getRateLimitKey(request, 'csrf'), CSRF_LIMIT);
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please wait a moment.' },
      { status: 429, headers: rateLimitHeaders(limit) },
    );
  }

  if (!isCsrfConfigured()) {
    // 503 rather than 500: the code is fine, the deployment is incomplete.
    return NextResponse.json(
      {
        ok: false,
        error:
          'Form security is not configured on the server. Set CSRF_SECRET in your environment.',
      },
      { status: 503, headers: rateLimitHeaders(limit) },
    );
  }

  const token = createCsrfToken();
  const cookie = csrfCookieOptions();

  const response = NextResponse.json(
    { ok: true, token },
    { status: 200, headers: rateLimitHeaders(limit) },
  );

  response.cookies.set({
    name: cookie.name,
    value: token,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });

  // Belt and braces alongside `force-dynamic` — some intermediary caches respect
  // headers more reliably than framework hints.
  response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

  return response;
}
