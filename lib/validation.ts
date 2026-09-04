/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VALIDATION — one schema, both sides of the wire
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  The same Zod schemas run in the browser (instant field feedback) and on the
 *  server (the only validation that actually counts). Client-side validation is
 *  a convenience for honest users; it is not a security control, because anyone
 *  can POST directly to the route. So the server re-validates from scratch and
 *  never trusts a field just because the form said it was fine.
 *
 *  SANITISATION POSITION
 *  ─────────────────────
 *  Input is normalised (trimmed, control characters stripped, length-capped)
 *  but NOT HTML-escaped here. Escaping happens at the point of output, which
 *  for this app means:
 *
 *    • React JSX escapes automatically when rendering to the page
 *    • `escapeHtml()` in `lib/email.ts` escapes before interpolating into the
 *      notification email's HTML body
 *
 *  Escaping on input instead is the classic mistake: it stores mangled data
 *  ("O&#39;Brien"), and it breaks the moment the same value is rendered into a
 *  non-HTML context like a plain-text email.
 */

import { z } from 'zod';

import { siteConfig } from '@/site.config';

/* ── Normalisers ──────────────────────────────────────────────────────────── */

/**
 * Strip characters that have no business in a form field.
 *
 * Removes C0/C1 control characters except tab and newline, plus zero-width and
 * bidirectional-override characters. The bidi ones matter: U+202E can visually
 * reverse text, which is a real spoofing vector in an email notification.
 */
function stripControlChars(value: string): string {
  return (
    value
      // C0 controls except \t and \n, plus DEL and the C1 range.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
      // Zero-width characters, bidirectional overrides/isolates, and the BOM.
      .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g, '')
  );
}

/** Collapse runs of whitespace to single spaces. For single-line fields. */
function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Collapse excess blank lines but keep paragraph breaks. For the message body. */
function normaliseMultiline(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** A single-line text field: control chars stripped, whitespace collapsed. */
function singleLine(max: number) {
  return z
    .string()
    .transform((v) => collapseWhitespace(stripControlChars(v)))
    .pipe(z.string().max(max));
}

/* ── Field schemas ────────────────────────────────────────────────────────── */

const nameSchema = z
  .string({ required_error: 'Please tell me your name.' })
  // Cap the raw input before transforming, so a megabyte-long "name" is
  // rejected without doing regex work on it first.
  .max(200, 'That name is too long.')
  .transform((v) => collapseWhitespace(stripControlChars(v)))
  .pipe(
    z
      .string()
      .min(2, 'Please enter at least 2 characters.')
      .max(80, 'Please keep it under 80 characters.')
      // Letters from any script, plus the punctuation real names contain.
      // Deliberately permissive: rejecting a legitimate name is worse than
      // accepting an odd one, since the value is only ever escaped on output.
      .regex(
        /^[\p{L}\p{M}][\p{L}\p{M}'’\-.\s]*$/u,
        'Please use letters, spaces, hyphens and apostrophes only.',
      ),
  );

const emailSchema = z
  .string({ required_error: 'Please enter your email address.' })
  .max(320, 'That email address is too long.')
  .transform((v) => stripControlChars(v).trim().toLowerCase())
  .pipe(
    z
      .string()
      .min(5, 'Please enter your email address.')
      // Zod's built-in email check, then a stricter structural pass. Belt and
      // braces, because this value ends up in an email header context.
      .email('That does not look like a valid email address.')
      .max(254, 'That email address is too long.')
      .refine((v) => !v.includes('..'), 'That email address has a formatting error.')
      .refine((v) => {
        const at = v.lastIndexOf('@');
        if (at < 1) return false;
        const domain = v.slice(at + 1);
        // Require a dot-separated TLD of at least two letters.
        return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/.test(
          domain,
        );
      }, 'Please enter a complete email address, including the domain.'),
  );

/**
 * Project type and budget are constrained to the exact options rendered in the
 * form. An arbitrary string here would let someone inject content straight into
 * my inbox, so `z.enum` over the config values is the right shape — and it also
 * means adding an option to `site.config.ts` automatically updates validation.
 */
const projectTypeSchema = z.enum(
  siteConfig.form.projectTypes as unknown as [string, ...string[]],
  { errorMap: () => ({ message: 'Please choose a project type from the list.' }) },
);

const budgetSchema = z.enum(
  siteConfig.form.budgetRanges as unknown as [string, ...string[]],
  { errorMap: () => ({ message: 'Please choose a budget range from the list.' }) },
);

const messageSchema = z
  .string({ required_error: 'Please add a short message.' })
  .max(10_000, 'That message is too long.')
  .transform((v) => normaliseMultiline(stripControlChars(v)))
  .pipe(
    z
      .string()
      .min(20, 'Please add a little more detail — at least 20 characters.')
      .max(4000, 'Please keep it under 4,000 characters.'),
  );

/**
 * Honeypot. A real browser never fills this, because it is hidden from layout
 * and from assistive technology, and it carries `autocomplete="off"` plus
 * `tabindex="-1"`. Bots that parse the DOM and fill every input trip it.
 *
 * Any value at all is a rejection. The route responds with a success shape
 * anyway — telling a bot it was detected just teaches it to try again.
 */
const honeypotSchema = z
  .string()
  .max(200)
  .optional()
  .transform((v) => (typeof v === 'string' ? v.trim() : ''));

/* ── Composed schemas ─────────────────────────────────────────────────────── */

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  projectType: projectTypeSchema,
  budget: budgetSchema,
  message: messageSchema,
  /** Honeypot — see above. Named innocuously so bots do not skip it. */
  company: honeypotSchema,
  /**
   * Elapsed milliseconds between the form mounting and submitting.
   *
   * A human cannot read five fields and write twenty characters in under three
   * seconds. This is a soft signal used alongside the honeypot; on its own it
   * would false-positive on someone pasting a prepared message, which is why
   * rejection needs the timing AND something else to be wrong.
   */
  elapsedMs: z.coerce.number().int().nonnegative().optional(),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormData = z.output<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: emailSchema,
  /** Optional first name, purely for a friendlier confirmation email. */
  name: singleLine(80).optional(),
  company: honeypotSchema,
});

export type NewsletterInput = z.input<typeof newsletterSchema>;
export type NewsletterData = z.output<typeof newsletterSchema>;

/* ── Error shaping ────────────────────────────────────────────────────────── */

/** Field name → first error message. One message per field is all the UI shows. */
export type FieldErrors = Record<string, string>;

/**
 * Flatten a ZodError into `{ fieldName: message }`.
 *
 * Only the first error per field is kept — stacking three complaints under one
 * input is noise, and the user fixes them one at a time regardless.
 */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== 'string') continue;
    if (out[key] === undefined) out[key] = issue.message;
  }
  return out;
}

/**
 * Decide whether a submission is spam.
 *
 * Two independent signals, and the honeypot alone is enough because a filled
 * hidden field has no innocent explanation. The timing check needs corroboration
 * — someone pasting a prepared message can legitimately submit fast — so it
 * only fires when the message also looks machine-generated.
 */
export function isLikelySpam(data: ContactFormData): boolean {
  // 1. Honeypot filled — no legitimate client does this.
  if (data.company.length > 0) return true;

  // 2. Implausibly fast, combined with link-stuffing. Either alone is weak;
  //    together they are the signature of an automated submission.
  const tooFast = typeof data.elapsedMs === 'number' && data.elapsedMs > 0 && data.elapsedMs < 3000;
  const linkCount = (data.message.match(/https?:\/\//gi) ?? []).length;
  if (tooFast && linkCount >= 2) return true;

  // 3. More than four links in a message that is mostly links. Real enquiries
  //    reference a store or two, not a list.
  if (linkCount > 4) return true;

  return false;
}
