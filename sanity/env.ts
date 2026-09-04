/**
 * Sanity environment resolution.
 *
 * Every value is optional. The whole point of the hybrid content layer is that
 * the site builds and runs with no Sanity project at all, so nothing in here
 * throws on a missing variable — `isSanityConfigured` simply returns false and
 * the adapter falls back to the local files in `data/`.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2024-10-01';

/**
 * Read token. Only required for private datasets — public datasets are
 * readable without one. Server-only: never prefixed with NEXT_PUBLIC_, so it
 * cannot leak into the client bundle.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || '';

/**
 * True when there is enough configuration to attempt a Sanity fetch.
 *
 * A project id is the only hard requirement — dataset and apiVersion both have
 * sensible defaults above.
 */
export const isSanityConfigured: boolean = projectId.length > 0;

/**
 * Whether to use Sanity's CDN. The CDN is cached and cheaper, but it cannot
 * serve authenticated requests, so a token implies direct API access.
 */
export const useCdn: boolean = readToken.length === 0;
