/**
 * `project` — a portfolio case study.
 *
 * Mirrors the `Project` interface in `lib/content/types.ts`. If you add a field
 * here, add it there and in the adapter's `normaliseProject`.
 */

import type { SchemaField, SchemaType, ValidationRule } from './schemaTypes';

/** Reusable image field factory. `alt` is required on every image, because a
 *  missing alt on a portfolio image is an accessibility defect, not a nicety. */
function imageField(name: string, title: string, required = false): SchemaField {
  return {
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description:
          'Describe what is actually in the frame — garment, angle, background. Screen readers and image search both use this.',
        validation: (rule) => rule.required().min(10).max(220),
      },
    ],
    ...(required ? { validation: (rule: ValidationRule) => rule.required() } : {}),
  };
}

export const project: SchemaType = {
  name: 'project',
  title: 'Project / Case study',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The headline for the case study. Written as a claim, not a label.',
      validation: (rule) => rule.required().max(120),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL fragment and lightbox deep link. Generate from the title.',
      options: { source: 'title', maxLength: 64 },
      validation: (rule) => rule.required(),
    },
    {
      name: 'client',
      title: 'Client',
      type: 'string',
      description: 'Real brand name. Get permission before publishing it.',
      validation: (rule) => rule.required().max(80),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Drives the portfolio filter. Must match one of these exactly.',
      options: {
        list: [
          { title: 'Fashion & Apparel', value: 'fashion' },
          { title: 'Product', value: 'product' },
          { title: 'Ad & Video', value: 'video' },
          { title: 'Web', value: 'web' },
        ],
        layout: 'radio',
      },
      initialValue: 'product',
      validation: (rule) => rule.required(),
    },
    {
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 2,
      description: 'Grid-card teaser. Under 140 characters reads best.',
      validation: (rule) => rule.required().max(200),
    },
    {
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Four digits, e.g. 2026.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured projects get a larger cell in the grid and sort first.',
      initialValue: false,
    },
    {
      name: 'orderRank',
      title: 'Manual sort order',
      type: 'number',
      description: 'Lower numbers appear first within the featured / non-featured groups.',
      initialValue: 100,
    },
    imageField('cover', 'Cover image', true),
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      description: 'Additional frames shown in the lightbox. Keep the aspect ratio consistent.',
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required().min(10).max(220),
            },
          ],
        },
      ],
    },
    {
      name: 'challenge',
      title: 'The challenge',
      type: 'text',
      rows: 5,
      description: 'What the client arrived with, and why the obvious solution did not work.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'approach',
      title: 'The approach',
      type: 'text',
      rows: 7,
      description: 'What you actually did. Be specific about tools and prompt strategy.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'outcome',
      title: 'The outcome',
      type: 'text',
      rows: 4,
      description: 'What the client got, and what changed for them because of it.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      description: 'Hard numbers. Two to four reads best; more than that becomes noise.',
      of: [
        {
          type: 'object',
          name: 'metric',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The number itself, e.g. "1,500+" or "$0.40".',
              validation: (rule) => rule.required().max(24),
            },
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            },
            {
              name: 'note',
              title: 'Note',
              type: 'string',
              description: 'Optional clarification of how the number was measured.',
            },
          ],
        },
      ],
    },
    {
      name: 'tools',
      title: 'Tools used',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'comparison',
      title: 'Before / after',
      type: 'object',
      description:
        'Optional comparison slider. Both frames MUST share the same aspect ratio or the handle will not line up.',
      fields: [
        imageField('before', 'Before'),
        imageField('after', 'After'),
        {
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'One line explaining what changed.',
          validation: (rule) => rule.max(160),
        },
      ],
    },
    {
      name: 'video',
      title: 'Video embed',
      type: 'object',
      description:
        'Only YouTube and Vimeo are permitted — the Content Security Policy frame-src allows no other host.',
      fields: [
        {
          name: 'provider',
          title: 'Provider',
          type: 'string',
          options: {
            list: [
              { title: 'YouTube', value: 'youtube' },
              { title: 'Vimeo', value: 'vimeo' },
            ],
            layout: 'radio',
          },
          initialValue: 'youtube',
        },
        {
          name: 'videoId',
          title: 'Video ID',
          type: 'string',
          description:
            'The bare id only, not the full URL. YouTube: the part after v=. Vimeo: the numeric id.',
        },
        {
          name: 'title',
          title: 'Accessible title',
          type: 'string',
          description: 'Announced by screen readers as the iframe title.',
        },
        imageField('poster', 'Poster frame'),
      ],
    },
  ],
  preview: {
    select: { title: 'title', client: 'client', category: 'category', media: 'cover' },
    prepare(selection) {
      const { title, client, category, media } = selection as {
        title?: string;
        client?: string;
        category?: string;
        media?: unknown;
      };
      return {
        title: title ?? 'Untitled project',
        subtitle: [client, category].filter(Boolean).join(' · '),
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Featured first',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'orderRank', direction: 'asc' },
      ],
    },
    {
      title: 'Newest first',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
};
