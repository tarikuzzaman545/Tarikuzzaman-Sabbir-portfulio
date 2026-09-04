'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NEWSLETTER FORM
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  A single email field in the footer. Same defences as the contact form —
 *  shared Zod schema, CSRF token, honeypot — but a much smaller surface, so the
 *  UI collapses to one input, one button and one status line.
 *
 *  WHY THE SUCCESS STATE REPLACES THE FORM
 *  ───────────────────────────────────────
 *  After a successful signup the inputs are unmounted and a confirmation takes
 *  their place. Leaving an empty field sitting there invites a second submission,
 *  and the rate limit is three per hour — so the second attempt would fail and
 *  read as though the first one had not worked.
 *
 *  DUPLICATE SIGNUPS
 *  ─────────────────
 *  The route returns success for an address already on the list, deliberately, so
 *  the endpoint cannot be used to test whether someone is subscribed. This
 *  component therefore has no "already subscribed" branch to render — by design,
 *  it cannot tell the difference.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { CSRF_HEADER_NAME } from '@/lib/csrf-constants';
import { useCsrf } from '@/lib/use-csrf';
import { cn } from '@/lib/utils';
import { newsletterSchema } from '@/lib/validation';

type Submission =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

interface ApiResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  fields?: Record<string, string>;
}

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [submission, setSubmission] = useState<Submission>({ kind: 'idle' });

  // useId keeps the label/input/error association unique even if this component
  // is ever rendered twice on one page, and it is stable across SSR and hydration.
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  const { fetchToken, prime, reset: resetCsrf } = useCsrf();
  const reduceMotion = useReducedMotion();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submission.kind === 'sending') return;

      /* ── Client gate ──────────────────────────────────────────────────── */
      const parsed = newsletterSchema.safeParse({ email, company });
      if (!parsed.success) {
        const first = parsed.error.issues.find((issue) => issue.path[0] === 'email');
        setError(first?.message ?? 'Please enter a valid email address.');
        setSubmission({ kind: 'idle' });
        inputRef.current?.focus();
        return;
      }

      setError(undefined);
      setSubmission({ kind: 'sending' });

      const token = await fetchToken();
      if (!token) {
        setSubmission({
          kind: 'error',
          message: 'Could not start a secure session. Please reload and try again.',
        });
        return;
      }

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            [CSRF_HEADER_NAME]: token,
          },
          body: JSON.stringify({ email, company }),
        });

        const data = (await response.json().catch(() => ({}))) as ApiResponse;

        if (response.ok && data.ok) {
          setSubmission({
            kind: 'success',
            message: data.message ?? 'You are on the list.',
          });
          setEmail('');
          return;
        }

        if (response.status === 403) resetCsrf();
        if (data.fields?.email) setError(data.fields.email);

        setSubmission({
          kind: 'error',
          message: data.error ?? 'Could not sign you up. Please try again.',
        });
      } catch {
        setSubmission({
          kind: 'error',
          message: 'Could not reach the server. Please try again.',
        });
      }
    },
    [email, company, fetchToken, resetCsrf, submission.kind],
  );

  const sending = submission.kind === 'sending';

  /* ── Success replaces the form entirely ─────────────────────────────────── */
  if (submission.kind === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'flex items-start gap-2.5 rounded-xl border border-success/35 bg-success/[0.08] px-4 py-3 text-sm leading-relaxed text-success',
          className,
        )}
      >
        <CheckCircle2 className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{submission.message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocus={prime} noValidate className={cn('w-full', className)}>
      {/* Honeypot — same off-screen technique as the contact form. */}
      <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${inputId}-company`}>Company (leave empty)</label>
        <input
          id={`${inputId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {/* The label is visually hidden, not absent. A placeholder is not a label:
          it disappears on the first keystroke and is not reliably announced. */}
      <label htmlFor={inputId} className="sr-only">
        Email address for the newsletter
      </label>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@company.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            // Clear a stale error as soon as they start correcting it.
            if (error) setError(undefined);
            if (submission.kind === 'error') setSubmission({ kind: 'idle' });
            prime();
          }}
          aria-invalid={error !== undefined}
          aria-describedby={error !== undefined ? errorId : undefined}
          disabled={sending}
          className="field flex-1"
        />

        <button
          type="submit"
          disabled={sending}
          // The visible text is an icon, so the accessible name comes from here.
          aria-label="Subscribe to the newsletter"
          className="btn-outline shrink-0 px-4"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {(error !== undefined || submission.kind === 'error') && (
            <motion.p
              id={errorId}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-danger"
            >
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {error ?? (submission.kind === 'error' ? submission.message : '')}
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
