/**
 * GROQ queries.
 *
 * Each one projects the Sanity document shape into something close to the
 * `lib/content/types` shape, so the adapter's normalisation step stays thin.
 * Image assets are returned raw (with the `_ref` intact) because the URL and
 * the intrinsic dimensions are both derived from that ref client-side in
 * `sanity/client.ts`.
 */

/** Image projection reused by every query below. */
const IMAGE = `{
  alt,
  asset
}`;

export const PROJECTS_QUERY = /* groq */ `
*[_type == "project" && !(_id in path("drafts.**"))] | order(featured desc, orderRank asc, year desc) {
  "slug": slug.current,
  title,
  client,
  category,
  summary,
  year,
  featured,
  "cover": cover ${IMAGE},
  "gallery": coalesce(gallery[] ${IMAGE}, []),
  challenge,
  approach,
  outcome,
  "metrics": coalesce(metrics[]{ label, value, note }, []),
  "tools": coalesce(tools, []),
  "comparison": comparison {
    "before": before ${IMAGE},
    "after": after ${IMAGE},
    caption
  },
  "video": video {
    provider,
    "id": videoId,
    title,
    "poster": poster ${IMAGE}
  }
}
`;

export const SERVICES_QUERY = /* groq */ `
*[_type == "service" && !(_id in path("drafts.**"))] | order(orderRank asc, title asc) {
  "slug": slug.current,
  title,
  description,
  icon,
  "includes": coalesce(includes, []),
  startingAt,
  turnaround
}
`;

export const PROCESS_QUERY = /* groq */ `
*[_type == "processStep" && !(_id in path("drafts.**"))] | order(order asc) {
  order,
  title,
  description,
  clientAction,
  duration
}
`;

export const TESTIMONIALS_QUERY = /* groq */ `
*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(orderRank asc, _createdAt desc) {
  "id": _id,
  quote,
  author,
  role,
  rating,
  source,
  "avatar": avatar ${IMAGE}
}
`;

export const TOOLS_QUERY = /* groq */ `
*[_type == "tool" && !(_id in path("drafts.**"))] | order(orderRank asc, name asc) {
  name,
  purpose,
  group
}
`;
