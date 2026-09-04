/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TESTIMONIALS — deliberately shipped empty. Read this before filling it in.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  This is the one array in the project I have not populated for you, and the
 *  reason is not laziness — it is that a testimonial is a quote attributed to a
 *  named real person. Writing those for you would mean inventing words and
 *  putting a real client's name under them. That is a misrepresentation risk
 *  you carry, not me, so the honest default is empty.
 *
 *  The section is fully built and fully working. `components/sections/
 *  Testimonials.tsx` returns null when this array is empty, so the site renders
 *  correctly right now with the section simply absent — no gap, no broken
 *  layout, nothing that looks unfinished. Add one entry and the section appears.
 *
 *  WHERE TO GET REAL ONES
 *  ──────────────────────
 *  Your Upwork profile reviews are the fastest source — copy the client's
 *  written feedback verbatim, use the star rating they actually gave, and set
 *  `source: 'Upwork'`. For direct clients, a one-line WhatsApp or email
 *  compliment is enough; just ask before publishing it with their name.
 *
 *  Trim quotes for length if you need to, but do not rewrite them. A slightly
 *  awkward real sentence is worth more than a polished invented one, and
 *  readers can tell the difference more often than people expect.
 *
 *  COPY THIS SHAPE
 *  ───────────────
 *
 *    {
 *      id: 'kain-founder',
 *      quote: 'Paste their actual words here, verbatim.',
 *      author: 'Their name',
 *      role: 'Founder, Kain',
 *      rating: 5,
 *      source: 'Upwork',
 *      // Optional. Omit it entirely and an initials monogram renders instead,
 *      // which looks intentional rather than like a missing image.
 *      avatar: {
 *        src: '/testimonials/kain-founder.jpg',
 *        alt: 'Portrait of the founder of Kain',
 *        width: 200,
 *        height: 200,
 *      },
 *    },
 *
 *  `rating` is typed as 1 | 2 | 3 | 4 | 5, so an out-of-range number fails the
 *  build rather than rendering six stars.
 */

import type { Testimonial } from '@/lib/content/types';

export const testimonials: Testimonial[] = [];
