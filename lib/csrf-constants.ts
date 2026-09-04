/**
 * CSRF names, split out so client code can import them.
 *
 * WHY THIS FILE EXISTS SEPARATELY FROM lib/csrf.ts
 * ────────────────────────────────────────────────
 * `lib/csrf.ts` imports `node:crypto` for HMAC signing. Importing it from a
 * client component would drag a Node built-in into the browser bundle, which
 * fails the build outright — and rightly so, since the signing secret must never
 * be shipped to a browser.
 *
 * The forms only need to know what to *call* the header. That is not secret and
 * has no dependencies, so it lives here. `lib/csrf.ts` re-exports both names, so
 * server code can keep importing from the one module that owns the logic.
 */

/** Cookie holding the signed token — half of the double-submit pair. */
export const CSRF_COOKIE_NAME = 'portfolio.csrf';

/** Request header carrying the same token — the other half. */
export const CSRF_HEADER_NAME = 'x-csrf-token';
