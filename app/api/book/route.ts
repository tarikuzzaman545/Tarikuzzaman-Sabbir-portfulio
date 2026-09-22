/**
 * POST /api/book — 1:1 strategy call & project booking handler.
 */

import { NextResponse } from 'next/server';

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME, verifyCsrf } from '@/lib/csrf';
import { isEmailConfigured, sendBookingAcknowledgement, sendBookingNotification } from '@/lib/email';
import { CONTACT_LIMIT, checkRateLimit, getRateLimitKey, rateLimitHeaders } from '@/lib/rate-limit';
import { bookingFormSchema, toFieldErrors, type FieldErrors } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

function success(headers: Record<string, string> = {}): NextResponse<SuccessBody> {
  return NextResponse.json<SuccessBody>(
    {
      ok: true,
      message: 'Your call is booked! I have sent a confirmation to your email.',
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

export async function POST(request: Request): Promise<NextResponse<SuccessBody | ErrorBody>> {
  // 1. Content-Type check
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return failure(415, 'Content-Type must be application/json');
  }

  // 2. Rate limit check
  const rateLimitKey = getRateLimitKey(request, 'book');
  const rateResult = checkRateLimit(rateLimitKey, CONTACT_LIMIT);
  const rlHeaders = rateLimitHeaders(rateResult);

  if (!rateResult.success) {
    return failure(429, 'Too many requests. Please wait a few minutes before trying again.', {
      headers: rlHeaders,
    });
  }

  // 3. Body size guard
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return failure(413, 'Request payload exceeds maximum allowed size.', { headers: rlHeaders });
  }

  // 4. CSRF verification
  const csrf = verifyCsrf(
    request.headers.get(CSRF_HEADER_NAME),
    readCookie(request.headers.get('cookie'), CSRF_COOKIE_NAME),
  );

  if (!csrf.ok) {
    if (csrf.reason === 'unconfigured') {
      return failure(503, 'Form security is not configured on the server.', { headers: rlHeaders });
    }
    return failure(403, 'Your session expired. Please reload the page and try again.', { headers: rlHeaders });
  }

  // 5. Parse JSON
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return failure(400, 'Invalid JSON body.', { headers: rlHeaders });
  }

  // 6. Schema validation
  const parsed = bookingFormSchema.safeParse(rawBody);
  if (!parsed.success) {
    return failure(422, 'Please correct the highlighted fields.', {
      fields: toFieldErrors(parsed.error),
      headers: rlHeaders,
    });
  }

  const data = parsed.data;

  // 7. Silent honeypot rejection for bots
  if (data.honeypot && data.honeypot.length > 0) {
    return success(rlHeaders);
  }

  // 8. Optional: Sync with Google Sheets Webhook
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL?.trim();
  if (googleSheetUrl) {
    try {
      await fetch(googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          clientName: data.clientName,
          email: data.email,
          whatsapp: data.whatsapp || '',
          company: data.companyName || '',
          services: data.services.join(', '),
          productCategory: data.productCategory,
          budget: data.budget,
          selectedDate: data.selectedDate,
          selectedTime: data.selectedTime,
          notes: data.notes || '',
          referral: data.referral || '',
          submittedAt: new Date().toISOString(),
        }),
      });
    } catch (sheetErr) {
      // Non-blocking error
      // eslint-disable-next-line no-console
      console.warn('[booking] Google Sheets webhook failed:', sheetErr);
    }
  }

  // 9. Send Email Notifications via Resend
  if (!isEmailConfigured()) {
    return failure(
      503,
      'Booking system email delivery is not configured yet. Please reach out via WhatsApp or LinkedIn.',
      { headers: rlHeaders },
    );
  }

  const notifyResult = await sendBookingNotification(data);
  if (!notifyResult.ok) {
    return failure(502, 'Could not deliver your booking request. Please try again shortly.', {
      headers: rlHeaders,
    });
  }

  // Best-effort client confirmation email
  void sendBookingAcknowledgement(data);

  return success(rlHeaders);
}
