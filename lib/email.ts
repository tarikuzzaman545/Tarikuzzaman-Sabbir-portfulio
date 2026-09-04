/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EMAIL DELIVERY — Resend
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  ESCAPING HAPPENS HERE, NOT IN VALIDATION
 *  ────────────────────────────────────────
 *  `lib/validation.ts` normalises input but leaves it as literal text. This file
 *  is the output boundary for the HTML email, so this is where escaping belongs.
 *  Every interpolated value goes through `escapeHtml()`; the plain-text
 *  alternative uses the raw values, which is correct, because escaping a plain
 *  text body would show the user `&amp;` instead of `&`.
 *
 *  HEADER INJECTION
 *  ────────────────
 *  `replyTo` carries a user-supplied address. Newlines in a header value are the
 *  classic injection vector (`\r\nBcc: victim@…`), so it is validated as a
 *  structural email address by Zod upstream AND stripped of CR/LF here. Two
 *  independent checks, because this one is genuinely dangerous.
 *
 *  FAILURE BEHAVIOUR
 *  ─────────────────
 *  Nothing throws. Every function returns a discriminated result the route can
 *  turn into a user-facing message, because "email provider is down" and
 *  "your message was invalid" deserve different responses, and an unhandled
 *  throw would collapse them into the same 500.
 */

import { Resend } from 'resend';

import { siteConfig } from '@/site.config';

import type { ContactFormData, NewsletterData } from './validation';

/* ── Configuration ────────────────────────────────────────────────────────── */

function getApiKey(): string {
  return process.env.RESEND_API_KEY?.trim() ?? '';
}

function getFromAddress(): string {
  // Resend's shared sandbox sender works without domain verification, which
  // makes local testing possible before DNS is set up.
  return process.env.RESEND_FROM_EMAIL?.trim() || 'Portfolio <onboarding@resend.dev>';
}

function getToAddress(): string {
  const configured = process.env.CONTACT_TO_EMAIL?.trim();
  if (configured) return configured;
  // Fall back to the address in site.config, but only if it is a real value —
  // 'FILL_ME' would just produce a bounced send.
  const fromConfig = siteConfig.contact.email;
  if (fromConfig && !fromConfig.includes('FILL_ME')) return fromConfig;
  return '';
}

/** True when a send can actually be attempted. */
export function isEmailConfigured(): boolean {
  return getApiKey().length > 0 && getToAddress().length > 0;
}

/** Lazily constructed so importing this module never requires a key. */
let client: Resend | null = null;
function getClient(): Resend | null {
  const key = getApiKey();
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

/* ── Escaping helpers ─────────────────────────────────────────────────────── */

/**
 * Escape text for interpolation into HTML.
 *
 * Covers the five characters that matter in element and attribute contexts.
 * Single and double quotes are both escaped so the same function is safe inside
 * an attribute value, not just in element text.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Strip CR/LF from a value destined for an email header. */
function sanitiseHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/** Escape, then convert newlines to <br> for the message body. Order matters:
 *  escaping first means a literal "<br>" typed by the user stays visible text. */
function escapeHtmlWithBreaks(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

/* ── Result type ──────────────────────────────────────────────────────────── */

export type EmailResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: 'unconfigured' | 'provider' | 'unknown'; message: string };

/* ── Shared template chrome ───────────────────────────────────────────────── */

/**
 * Email HTML uses inline styles and table-free layout on purpose.
 *
 * Mail clients strip <style> blocks unpredictably (Gmail's web client removes
 * some at-rules, Outlook ignores others entirely), so anything that must render
 * has to be inline. The palette matches the site so the notification looks like
 * it came from the same place.
 */
const BRAND = {
  cream: '#FAFAF8',
  ink: '#1A1A18',
  inkSoft: '#4A4A45',
  gold: '#C8A96E',
  line: '#E5E2DA',
  surface: '#FFFFFF',
} as const;

function wrapEmail(heading: string, bodyHtml: string, footerNote: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.cream};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(heading)}</div>
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <div style="border-left:3px solid ${BRAND.gold};padding-left:14px;margin-bottom:28px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.gold};font-weight:600;">
        ${escapeHtml(siteConfig.shortName)} · Portfolio
      </p>
      <h1 style="margin:6px 0 0;font-size:21px;line-height:1.3;font-weight:600;color:${BRAND.ink};">
        ${escapeHtml(heading)}
      </h1>
    </div>

    <div style="background-color:${BRAND.surface};border:1px solid ${BRAND.line};border-radius:14px;padding:26px;">
      ${bodyHtml}
    </div>

    <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:${BRAND.inkSoft};">
      ${escapeHtml(footerNote)}
    </p>
  </div>
</body>
</html>`;
}

/** One label/value row in the details block. */
function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:0 0 4px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.gold};font-weight:600;">${escapeHtml(label)}</td>
  </tr>
  <tr>
    <td style="padding:0 0 16px;font-size:15px;line-height:1.5;color:${BRAND.ink};">${escapeHtml(value)}</td>
  </tr>`;
}

/* ── Contact notification ─────────────────────────────────────────────────── */

/**
 * Send the contact-form notification to my inbox.
 *
 * `replyTo` is set to the sender's address, so hitting reply in the mail client
 * goes to the client rather than to the Resend sender — the single most useful
 * detail in a form notification and the one most often left out.
 */
export async function sendContactNotification(data: ContactFormData): Promise<EmailResult> {
  const resend = getClient();
  const to = getToAddress();

  if (!resend || !to) {
    return {
      ok: false,
      reason: 'unconfigured',
      message:
        'Email delivery is not configured. Set RESEND_API_KEY and CONTACT_TO_EMAIL in your environment.',
    };
  }

  const submittedAt = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: siteConfig.timezone,
  }).format(new Date());

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      ${detailRow('From', `${data.name} · ${data.email}`)}
      ${detailRow('Project type', data.projectType)}
      ${detailRow('Budget', data.budget)}
      ${detailRow('Received', `${submittedAt} (${siteConfig.timezone})`)}
    </table>

    <div style="border-top:1px solid ${BRAND.line};margin:4px 0 20px;"></div>

    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.gold};font-weight:600;">Message</p>
    <div style="font-size:15px;line-height:1.7;color:${BRAND.ink};white-space:normal;">
      ${escapeHtmlWithBreaks(data.message)}
    </div>

    <div style="margin-top:24px;">
      <a href="mailto:${escapeHtml(data.email)}"
         style="display:inline-block;background-color:${BRAND.ink};color:${BRAND.cream};text-decoration:none;padding:11px 20px;border-radius:999px;font-size:14px;font-weight:500;">
        Reply to ${escapeHtml(data.name)}
      </a>
    </div>`;

  const text = [
    `New enquiry via ${siteConfig.url}`,
    '',
    `From:         ${data.name} <${data.email}>`,
    `Project type: ${data.projectType}`,
    `Budget:       ${data.budget}`,
    `Received:     ${submittedAt} (${siteConfig.timezone})`,
    '',
    'Message',
    '───────',
    data.message,
    '',
    `Reply directly to this email to reach ${data.name}.`,
  ].join('\n');

  try {
    const { data: sent, error } = await resend.emails.send({
      from: getFromAddress(),
      to: [to],
      // Newlines stripped: this value lands in a header.
      subject: sanitiseHeaderValue(`New enquiry — ${data.name} · ${data.projectType}`),
      // `reply_to`, not `replyTo` — the Resend 3.x SDK uses the API's snake_case
      // field name directly. Hitting reply in your mail client then addresses the
      // sender rather than the no-reply `from` address.
      reply_to: sanitiseHeaderValue(data.email),
      html: wrapEmail(
        'New project enquiry',
        bodyHtml,
        'Sent by the contact form on your portfolio. Reply to this email to respond directly to the sender.',
      ),
      text,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[email] Resend rejected the contact notification:', error);
      return {
        ok: false,
        reason: 'provider',
        message: 'The email provider rejected the message.',
      };
    }
    return { ok: true, id: sent?.id ?? null };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[email] Unexpected failure sending contact notification:', error);
    return {
      ok: false,
      reason: 'unknown',
      message: 'Could not reach the email provider.',
    };
  }
}

/* ── Sender acknowledgement ───────────────────────────────────────────────── */

/**
 * Confirmation to the person who filled in the form.
 *
 * Deliberately secondary: the route awaits the notification to me and treats
 * this as best-effort, because if the acknowledgement fails I still received
 * the enquiry, and failing the whole submission over a courtesy email would
 * lose real leads.
 */
export async function sendContactAcknowledgement(data: ContactFormData): Promise<EmailResult> {
  const resend = getClient();
  if (!resend) {
    return { ok: false, reason: 'unconfigured', message: 'Email delivery is not configured.' };
  }

  const firstName = data.name.split(' ')[0] ?? data.name;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:${BRAND.ink};">
      Hi ${escapeHtml(firstName)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${BRAND.inkSoft};">
      Thanks for getting in touch — your message reached me and I read every one personally.
      I usually reply within one working day from ${escapeHtml(siteConfig.location)}.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:${BRAND.inkSoft};">
      Here is what you sent, for your records:
    </p>

    <div style="background-color:${BRAND.cream};border:1px solid ${BRAND.line};border-radius:10px;padding:18px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
        ${detailRow('Project type', data.projectType)}
        ${detailRow('Budget', data.budget)}
      </table>
      <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.gold};font-weight:600;">Your message</p>
      <div style="font-size:14px;line-height:1.7;color:${BRAND.inkSoft};">
        ${escapeHtmlWithBreaks(data.message)}
      </div>
    </div>

    <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:${BRAND.inkSoft};">
      — ${escapeHtml(siteConfig.name)}<br />
      <span style="color:${BRAND.gold};">${escapeHtml(siteConfig.role)}</span>
    </p>`;

  const text = [
    `Hi ${firstName},`,
    '',
    'Thanks for getting in touch — your message reached me and I read every one personally.',
    `I usually reply within one working day from ${siteConfig.location}.`,
    '',
    'What you sent:',
    `  Project type: ${data.projectType}`,
    `  Budget:       ${data.budget}`,
    '',
    data.message,
    '',
    `— ${siteConfig.name}`,
    siteConfig.role,
  ].join('\n');

  try {
    const { data: sent, error } = await resend.emails.send({
      from: getFromAddress(),
      to: [sanitiseHeaderValue(data.email)],
      subject: sanitiseHeaderValue(`Thanks for reaching out, ${firstName}`),
      html: wrapEmail(
        'Your message has been received',
        bodyHtml,
        `You are receiving this because you submitted the contact form on ${siteConfig.url}. No subscription was created.`,
      ),
      text,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[email] Resend rejected the acknowledgement:', error);
      return { ok: false, reason: 'provider', message: 'Acknowledgement was not delivered.' };
    }
    return { ok: true, id: sent?.id ?? null };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[email] Unexpected failure sending acknowledgement:', error);
    return { ok: false, reason: 'unknown', message: 'Acknowledgement was not delivered.' };
  }
}

/* ── Newsletter ───────────────────────────────────────────────────────────── */

/**
 * Handle a newsletter signup.
 *
 * Two paths, chosen by configuration. With `RESEND_AUDIENCE_ID` set the contact
 * is stored in a Resend Audience, which is the real answer. Without it, the
 * signup is emailed to me so no subscriber is ever silently dropped — a signup
 * that vanishes because a variable was unset is the worst outcome here.
 */
export async function subscribeToNewsletter(data: NewsletterData): Promise<EmailResult> {
  const resend = getClient();
  if (!resend) {
    return {
      ok: false,
      reason: 'unconfigured',
      message: 'Newsletter signup is not configured. Set RESEND_API_KEY.',
    };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

  if (audienceId) {
    try {
      const { data: created, error } = await resend.contacts.create({
        email: data.email,
        ...(data.name ? { firstName: data.name } : {}),
        audienceId,
        unsubscribed: false,
      });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('[email] Resend rejected the newsletter contact:', error);
        return { ok: false, reason: 'provider', message: 'Could not complete the signup.' };
      }
      return { ok: true, id: created?.id ?? null };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[email] Unexpected failure creating newsletter contact:', error);
      return { ok: false, reason: 'unknown', message: 'Could not complete the signup.' };
    }
  }

  // No audience configured — notify me instead of losing the address.
  const to = getToAddress();
  if (!to) {
    return {
      ok: false,
      reason: 'unconfigured',
      message: 'Newsletter signup is not configured. Set RESEND_AUDIENCE_ID or CONTACT_TO_EMAIL.',
    };
  }

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
      ${detailRow('Email', data.email)}
      ${data.name ? detailRow('Name', data.name) : ''}
    </table>
    <p style="margin:0;font-size:14px;line-height:1.7;color:${BRAND.inkSoft};">
      Set <strong>RESEND_AUDIENCE_ID</strong> to store signups in a Resend Audience automatically
      instead of receiving them by email.
    </p>`;

  try {
    const { data: sent, error } = await resend.emails.send({
      from: getFromAddress(),
      to: [to],
      subject: sanitiseHeaderValue(`Newsletter signup — ${data.email}`),
      // See the note on the contact notification: snake_case is the SDK's field.
      reply_to: sanitiseHeaderValue(data.email),
      html: wrapEmail('New newsletter signup', bodyHtml, 'Sent by the newsletter form on your portfolio.'),
      text: [
        'New newsletter signup',
        '',
        `Email: ${data.email}`,
        ...(data.name ? [`Name:  ${data.name}`] : []),
        '',
        'Set RESEND_AUDIENCE_ID to store signups in a Resend Audience automatically.',
      ].join('\n'),
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[email] Resend rejected the newsletter notification:', error);
      return { ok: false, reason: 'provider', message: 'Could not complete the signup.' };
    }
    return { ok: true, id: sent?.id ?? null };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[email] Unexpected failure sending newsletter notification:', error);
    return { ok: false, reason: 'unknown', message: 'Could not complete the signup.' };
  }
}
