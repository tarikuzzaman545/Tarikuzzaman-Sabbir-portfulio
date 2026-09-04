/**
 * JSON-LD structured data.
 *
 * WHY THREE GRAPH NODES, NOT ONE BLOB
 * ───────────────────────────────────
 * Search engines resolve `@id` references across a `@graph`, so declaring the
 * Person, the WebSite and the ProfilePage separately and cross-linking them
 * gives a cleaner entity model than one overloaded Person object. It is also
 * what lets `mainEntity` on the page point at the same Person node the WebSite
 * names as its author, instead of duplicating the identity three times.
 *
 * `dangerouslySetInnerHTML` is required — React escapes text children, which
 * would turn the JSON's quotes into entities and make it unparseable. The value
 * is not user input; it is built from site.config.ts at build time. The one real
 * risk is a `</script>` sequence inside a config string closing the tag early,
 * so the serialised output has `<` escaped as `<`, which is valid JSON and
 * inert in HTML.
 *
 * Placeholder values are stripped before serialising. Emitting
 * `"email": "FILL_ME"` would be worse than emitting nothing — it publishes a
 * broken claim about the entity.
 */

import { absoluteUrl, isPlaceholder, siteConfig } from '@/site.config';

/** Escapes the only sequence that can break out of a <script> element. */
function serialise(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function JsonLd() {
  const personId = `${siteConfig.url}/#person`;
  const siteId = `${siteConfig.url}/#website`;

  const sameAs = Object.values(siteConfig.socials).filter((url) => !isPlaceholder(url));

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': personId,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    jobTitle: siteConfig.role,
    description: siteConfig.valueProp,
    image: absoluteUrl('/og.jpg'),
    knowsAbout: [
      'AI product photography',
      'Prompt engineering',
      'E-commerce catalog imagery',
      'Generative image pipelines',
      'Next.js',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Khulna',
      addressCountry: 'BD',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: siteConfig.education.institutionFull,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Khulna',
        addressCountry: 'BD',
      },
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(isPlaceholder(siteConfig.contact.email) ? {} : { email: siteConfig.contact.email }),
  };

  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    url: siteConfig.url,
    name: siteConfig.seo.defaultTitle,
    description: siteConfig.valueProp,
    inLanguage: 'en',
    author: { '@id': personId },
    publisher: { '@id': personId },
  };

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${siteConfig.url}/#profilepage`,
    url: siteConfig.url,
    name: siteConfig.seo.defaultTitle,
    isPartOf: { '@id': siteId },
    about: { '@id': personId },
    mainEntity: { '@id': personId },
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [person, website, profilePage],
  };

  return (
    <script
      type="application/ld+json"
      // Not executable script, so no CSP nonce is required for this type.
      dangerouslySetInnerHTML={{ __html: serialise(graph) }}
    />
  );
}

/**
 * Per-project CreativeWork markup, rendered inside the portfolio section.
 *
 * Kept separate from the graph above because the project list is fetched
 * asynchronously through the content adapter, and the head-level graph should
 * not have to wait on a Sanity round trip to render.
 */
export function ProjectsJsonLd({
  projects,
}: {
  projects: readonly { slug: string; title: string; client: string; summary: string; year: string }[];
}) {
  if (projects.length === 0) return null;

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Selected work — ${siteConfig.name}`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        url: absoluteUrl(`/work/${project.slug}`),
        dateCreated: project.year,
        creator: { '@id': `${siteConfig.url}/#person` },
        // The client is the commissioning party, which is what `sourceOrganization`
        // means in schema.org terms.
        sourceOrganization: { '@type': 'Organization', name: project.client },
      },
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialise(payload) }} />
  );
}
