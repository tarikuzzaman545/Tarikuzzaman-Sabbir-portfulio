/**
 * `testimonial` — a client quote.
 *
 * Mirrors the `Testimonial` interface in `lib/content/types.ts`.
 *
 * A note that belongs in the schema itself: publish real quotes only, and get
 * permission before attaching a real name and company to one. The field
 * descriptions below say so, because the person filling this in six months from
 * now will not have read the README.
 */

import type { SchemaType } from './schemaTypes';

export const testimonial: SchemaType = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      description:
        'The client’s actual words, verbatim. Trim for length if you must, but do not rewrite — a slightly awkward real sentence beats a polished invented one.',
      validation: (rule) => rule.required().min(40).max(600),
    },
    {
      name: 'author',
      title: 'Author name',
      type: 'string',
      description: 'Real name. Ask permission before publishing it.',
      validation: (rule) => rule.required().max(80),
    },
    {
      name: 'role',
      title: 'Role & company',
      type: 'string',
      description: 'e.g. "Founder, Kain".',
      validation: (rule) => rule.required().max(80),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'The rating they actually gave, 1 to 5.',
      options: {
        list: [
          { title: '5 — Excellent', value: 5 },
          { title: '4', value: 4 },
          { title: '3', value: 3 },
          { title: '2', value: 2 },
          { title: '1', value: 1 },
        ],
        layout: 'radio',
      },
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(5).integer(),
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where the review came from, e.g. "Upwork". Shown as a small label.',
      validation: (rule) => rule.max(40),
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      description:
        'Optional. Leave empty and an initials monogram renders instead, which looks intentional rather than broken.',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'e.g. "Portrait of Jane Doe".',
          validation: (rule) => rule.required().min(5).max(160),
        },
      ],
    },
    {
      name: 'orderRank',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first. Put your strongest quote at the top.',
      initialValue: 100,
    },
  ],
  preview: {
    select: { author: 'author', role: 'role', media: 'avatar', rating: 'rating' },
    prepare(selection) {
      const { author, role, media, rating } = selection as {
        author?: string;
        role?: string;
        media?: unknown;
        rating?: number;
      };
      const stars = typeof rating === 'number' ? '★'.repeat(Math.max(1, Math.min(5, rating))) : '';
      return {
        title: author ?? 'Unnamed',
        subtitle: [role, stars].filter(Boolean).join(' · '),
        media,
      };
    },
  },
};
