'use client';

/**
 * CSRF token acquisition for forms.
 *
 * WHY THE TOKEN IS FETCHED LAZILY, NOT ON MOUNT
 * ─────────────────────────────────────────────
 * Fetching on mount would hit /api/csrf on every single page view, including the
 * overwhelming majority where nobody touches a form. That is a wasted dynamic
 * function invocation per visitor and it puts a `no-store` request on the
 * critical path for no benefit.
 *
 * Instead the token is minted on first interaction — the first focus or keypress
 * in the form — which is early enough that it has always arrived by the time
 * anyone finishes typing, and late enough that a bounce costs nothing.
 *
 * WHY THE TOKEN IS CACHED IN A REF, NOT STATE
 * ───────────────────────────────────────────
 * The token's value never affects what is rendered. Putting it in state would
 * trigger a re-render of the whole form the moment it arrives, for no visual
 * change. A ref holds it without that cost. The one thing that IS rendered — the
 * "form security unavailable" case — gets its own piece of state.
 *
 * The in-flight promise is also cached, so a rapid focus/blur/focus does not
 * fire three requests.
 */

import { useCallback, useRef, useState } from 'react';

export type CsrfStatus = 'idle' | 'ready' | 'unavailable';

interface CsrfResponse {
  ok?: boolean;
  token?: string;
  error?: string;
}

export function useCsrf() {
  const tokenRef = useRef<string | null>(null);
  const inFlightRef = useRef<Promise<string | null> | null>(null);
  const [status, setStatus] = useState<CsrfStatus>('idle');

  const fetchToken = useCallback(async (): Promise<string | null> => {
    if (tokenRef.current) return tokenRef.current;
    if (inFlightRef.current) return inFlightRef.current;

    const request = (async () => {
      try {
        const response = await fetch('/api/csrf', {
          method: 'GET',
          // The cookie is the other half of the double-submit pair, so it must
          // be sent and stored. 'same-origin' is the default but stating it
          // makes the dependency explicit.
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        const data = (await response.json().catch(() => ({}))) as CsrfResponse;

        if (!response.ok || !data.ok || typeof data.token !== 'string') {
          setStatus('unavailable');
          return null;
        }

        tokenRef.current = data.token;
        setStatus('ready');
        return data.token;
      } catch {
        // Offline, or the request was blocked. The submit handler surfaces this
        // as a normal error state rather than a thrown exception.
        setStatus('unavailable');
        return null;
      } finally {
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = request;
    return request;
  }, []);

  /**
   * Called on first interaction. Fire-and-forget: the returned promise is
   * deliberately not awaited by the caller, and rejections cannot escape because
   * fetchToken catches internally.
   */
  const prime = useCallback(() => {
    if (tokenRef.current === null) void fetchToken();
  }, [fetchToken]);

  /**
   * Drop the cached token. Called after a 403, since the most likely cause is an
   * expired token and the next attempt should mint a fresh one rather than
   * resend the stale one.
   */
  const reset = useCallback(() => {
    tokenRef.current = null;
    inFlightRef.current = null;
    setStatus('idle');
  }, []);

  return { fetchToken, prime, reset, status };
}
