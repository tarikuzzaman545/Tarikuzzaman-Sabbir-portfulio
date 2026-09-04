'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTACT FORM
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  CLIENT VALIDATION IS THE SAME ZOD SCHEMA THE SERVER USES
 *  ────────────────────────────────────────────────────────
 *  `contactFormSchema` is imported from lib/validation.ts — the identical module
 *  app/api/contact/route.ts imports. This is the whole point of putting schemas
 *  in lib rather than inline: the two sides cannot drift, so a field that passes
 *  here cannot fail there for a different reason.
 *
 *  To be explicit about the security position: the client check is a UX
 *  affordance and nothing more. It exists so someone finds out about a typo
 *  before a round trip. The server re-validates from scratch and trusts nothing
 *  that arrives, because anything running in the browser can be bypassed with
 *  one curl command.
 *
 *  WHEN ERRORS APPEAR
 *  ──────────────────
 *  On blur for a field the user has left, and on submit for everything. NOT on
 *  every keystroke — telling someone their email is invalid while they are on
 *  the third character of typing it is hostile. Once a field has an error,
 *  though, it revalidates as they type so the error clears the instant it is
 *  fixed rather than waiting for another blur.
 *
 *  SPAM PROTECTION, THREE LAYERS
 *  ─────────────────────────────
 *    1. Honeypot — a field named `company` (bots fill anything plausible;
 *       naming it `honeypot` would let them skip it), hidden from sight and from
 *       assistive tech, with autocomplete off so no browser ever fills it.
 *    2. Timing — `elapsedMs` from mount to submit. A human cannot complete this
 *       in under three seconds. Combined with link count on the server.
 *    3. Rate limiting + CSRF on the route itself.
 *
 *  ACCESSIBILITY
 *  ─────────────
 *  Every input has a real <label> with `htmlFor`. Errors are wired with
 *  `aria-describedby` and `aria-invalid`, so a screen reader announces the
 *  message when focus lands on the field. The submit result goes into a
 *  `role="status"` live region, because a visual success banner is invisible to
 *  a screen reader user whose focus is still on the button.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCsrf } from '@/lib/use-csrf';
import { CSRF_HEADER_NAME } from '@/lib/csrf-constants';
import { contactFormSchema, type FieldErrors } from '@/lib/validation';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/site.config';

type FieldName = 'name' | 'email' | 'projectType' | 'budget' | 'message';

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  company: string;
}

const EMPTY: FormState = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
  company: '',
};

type Submission =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

interface ApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  fields?: FieldErrors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submission, setSubmission] = useState<Submission>({ kind: 'idle' });

  const mountedAt = useRef<number>(Date.now());
  const statusRef = useRef<HTMLDivElement>(null);
  const { fetchToken, prime, reset: resetCsrf, status: csrfStatus } = useCsrf();
  const reduceMotion = useReducedMotion();

  /* Reset the timing baseline on mount. Not in useState's initialiser, because
     that runs during render and would be wrong if React remounted the tree. */
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  /** Validates the whole payload and returns per-field errors. */
  const validate = useCallback((state: FormState): FieldErrors => {
    const result = contactFormSchema.safeParse({
      ...state,
      elapsedMs: Date.now() - mountedAt.current,
    });
    if (result.success) return {};
    const out: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key !== 'string') continue;
      if (out[key] === undefined) out[key] = issue.message;
    }
    return out;
  }, []);

  const setField = useCallback(
    (field: FieldName, value: string) => {
      setValues((previous) => {
        const next = { ...previous, [field]: value };
        // Revalidate as they type only for fields already showing an error, so
        // the message disappears the moment it is fixed.
        setErrors((currentErrors) => {
          if (currentErrors[field] === undefined) return currentErrors;
          const fresh = validate(next);
          const updated = { ...currentErrors };
          if (fresh[field] === undefined) delete updated[field];
          else updated[field] = fresh[field];
          return updated;
        });
        return next;
      });
      prime();
    },
    [validate, prime],
  );

  const handleBlur = useCallback(
    (field: FieldName) => {
      setTouched((previous) => ({ ...previous, [field]: true }));
      const fresh = validate(values);
      setErrors((previous) => {
        const updated = { ...previous };
        if (fresh[field] === undefined) delete updated[field];
        else updated[field] = fresh[field];
        return updated;
      });
    },
    [validate, values],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submission.kind === 'sending') return;

      /* ── Client gate ──────────────────────────────────────────────────── */
      const clientErrors = validate(values);
      if (Object.keys(clientErrors).length > 0) {
        setErrors(clientErrors);
        setTouched({ name: true, email: true, projectType: true, budget: true, message: true });
        setSubmission({ kind: 'error', message: 'Please fix the highlighted fields.' });

        // Move focus to the first invalid control so a keyboard user is taken to
        // the problem rather than left at the submit button.
        const order: FieldName[] = ['name', 'email', 'projectType', 'budget', 'message'];
        const firstBad = order.find((field) => clientErrors[field] !== undefined);
        if (firstBad) document.getElementById(`contact-${firstBad}`)?.focus();
        return;
      }

      setSubmission({ kind: 'sending' });

      /* ── CSRF ─────────────────────────────────────────────────────────── */
      const token = await fetchToken();
      if (!token) {
        setSubmission({
          kind: 'error',
          message:
            'Form security could not be initialised. Please reload the page, or email me directly.',
        });
        return;
      }

      /* ── Send ─────────────────────────────────────────────────────────── */
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            [CSRF_HEADER_NAME]: token,
          },
          body: JSON.stringify({
            ...values,
            elapsedMs: Date.now() - mountedAt.current,
          }),
        });

        const data = (await response.json().catch(() => ({}))) as ApiResponse;

        if (response.ok && data.ok) {
          setSubmission({
            kind: 'success',
            message: data.message ?? 'Thanks — your message is on its way.',
          });
          setValues(EMPTY);
          setErrors({});
          setTouched({});
          mountedAt.current = Date.now();
          return;
        }

        // 403 almost always means an expired token; drop it so a retry mints a
        // fresh one instead of resending the stale value.
        if (response.status === 403) resetCsrf();

        if (data.fields) setErrors(data.fields);

        setSubmission({
          kind: 'error',
          message: data.error ?? 'Something went wrong. Please try again.',
        });
      } catch {
        setSubmission({
          kind: 'error',
          message:
            'Could not reach the server. Check your connection and try again, or email me directly.',
        });
      }
    },
    [values, validate, fetchToken, resetCsrf, submission.kind],
  );

  /* Move focus to the status banner on success, so the confirmation is
     announced and a keyboard user is not left focused on a now-empty form. */
  useEffect(() => {
    if (submission.kind === 'success') statusRef.current?.focus();
  }, [submission.kind]);

  const sending = submission.kind === 'sending';
  const showError = (field: FieldName) => touched[field] === true && errors[field] !== undefined;

  const describedBy = useMemo(
    () => (field: FieldName) => (showError(field) ? `contact-${field}-error` : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [touched, errors],
  );

  return (
    <form onSubmit={handleSubmit} onFocus={prime} noValidate className="space-y-5">
      {/* ── Honeypot ──────────────────────────────────────────────────────────
          Positioned off-screen rather than display:none — some bots skip
          display:none fields specifically because it is the obvious tell.
          aria-hidden + tabIndex -1 keep it away from real users entirely. */}
      <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company (leave this empty)</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => setValues((p) => ({ ...p, company: event.target.value }))}
        />
      </div>

      {/* ── Name + email ─────────────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-name"
          label="Your name"
          error={showError('name') ? errors.name : undefined}
        >
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Jane Doe"
            value={values.name}
            onChange={(event) => setField('name', event.target.value)}
            onBlur={() => handleBlur('name')}
            aria-invalid={showError('name')}
            aria-describedby={describedBy('name')}
            className="field"
            disabled={sending}
          />
        </Field>

        <Field
          id="contact-email"
          label="Email"
          error={showError('email') ? errors.email : undefined}
        >
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            // Helps mobile keyboards without weakening the real validation.
            inputMode="email"
            required
            maxLength={254}
            placeholder="you@company.com"
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            onBlur={() => handleBlur('email')}
            aria-invalid={showError('email')}
            aria-describedby={describedBy('email')}
            className="field"
            disabled={sending}
          />
        </Field>
      </div>

      {/* ── Project type + budget ────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contact-projectType"
          label="Project type"
          error={showError('projectType') ? errors.projectType : undefined}
        >
          <select
            id="contact-projectType"
            name="projectType"
            required
            value={values.projectType}
            onChange={(event) => setField('projectType', event.target.value)}
            onBlur={() => handleBlur('projectType')}
            aria-invalid={showError('projectType')}
            aria-describedby={describedBy('projectType')}
            className="field"
            disabled={sending}
          >
            <option value="" disabled>
              Select one…
            </option>
            {siteConfig.form.projectTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="contact-budget"
          label="Budget"
          error={showError('budget') ? errors.budget : undefined}
          hint="A range is fine — it helps me scope honestly."
        >
          <select
            id="contact-budget"
            name="budget"
            required
            value={values.budget}
            onChange={(event) => setField('budget', event.target.value)}
            onBlur={() => handleBlur('budget')}
            aria-invalid={showError('budget')}
            aria-describedby={describedBy('budget')}
            className="field"
            disabled={sending}
          >
            <option value="" disabled>
              Select a range…
            </option>
            {siteConfig.form.budgetRanges.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* ── Message ──────────────────────────────────────────────────────── */}
      <Field
        id="contact-message"
        label="What are you working on?"
        error={showError('message') ? errors.message : undefined}
      >
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={20}
          maxLength={4000}
          placeholder="Product category, roughly how many SKUs, where the images need to end up, and any deadline you are working to."
          value={values.message}
          onChange={(event) => setField('message', event.target.value)}
          onBlur={() => handleBlur('message')}
          aria-invalid={showError('message')}
          aria-describedby={describedBy('message')}
          className="field resize-y"
          disabled={sending}
        />
        {/* Character counter. aria-hidden because maxLength already constrains
            the field and announcing a number on every keystroke is noise. */}
        <p className="mt-1.5 text-right text-xs text-ink-muted" aria-hidden="true">
          {values.message.length} / 4000
        </p>
      </Field>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={sending} className="btn-gold group min-w-[11rem]">
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Send
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>

        <p className="text-xs leading-relaxed text-ink-muted">
          I reply within one working day. Your details are used only to answer you.
        </p>
      </div>

      {/* ── Status ────────────────────────────────────────────────────────────
          role="status" is polite — it will not interrupt a screen reader
          mid-sentence, which role="alert" would. tabIndex allows the programmatic
          focus move on success. */}
      <div
        ref={statusRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="scroll-mt-32 outline-none"
      >
        <AnimatePresence mode="wait">
          {(submission.kind === 'success' || submission.kind === 'error') && (
            <motion.div
              key={submission.kind}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed',
                submission.kind === 'success'
                  ? 'border-success/35 bg-success/[0.08] text-success'
                  : 'border-danger/35 bg-danger/[0.07] text-danger',
              )}
            >
              {submission.kind === 'success' ? (
                <CheckCircle2 className="mt-px h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-px h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden="true" />
              )}
              <span>{submission.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Surfaced only when the token endpoint has actually failed, so a normal
          visit never sees a security warning. */}
      {csrfStatus === 'unavailable' && submission.kind !== 'error' && (
        <p className="text-xs text-danger">
          Form security is unavailable right now. Please reload the page before sending.
        </p>
      )}
    </form>
  );
}

/* ── Field wrapper ────────────────────────────────────────────────────────── */

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
      {error && (
        // The id matches the aria-describedby on the input above.
        <p id={`${id}-error`} className="field-error">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
