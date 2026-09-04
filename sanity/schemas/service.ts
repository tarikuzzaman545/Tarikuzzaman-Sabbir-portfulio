/**
 * `service` — one card in the Services grid.
 *
 * Mirrors the `Service` interface in `lib/content/types.ts`.
 */

import type { SchemaType } from './schemaTypes';

export const service: SchemaType = {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 48 },
      validation: (rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences on what the client actually receives.',
      validation: (rule) => rule.required().max(320),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description:
        'Must be one of these names — they map to imported Lucide icons. An unknown name falls back to a neutral icon rather than crashing.',
      options: {
        list: [
          { title: 'Camera', value: 'camera' },
          { title: 'Sparkles', value: 'sparkles' },
          { title: 'Film', value: 'film' },
          { title: 'Layout', value: 'layout' },
          { title: 'Wand', value: 'wand' },
          { title: 'Layers', value: 'layers' },
          { title: 'Zap', value: 'zap' },
          { title: 'Shield', value: 'shield' },
        ],
      },
      initialValue: 'sparkles',
      validation: (rule) => rule.required(),
    },
    {
      name: 'includes',
      title: 'What is included',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Concrete deliverables, not adjectives. Three to five works best.',
    },
    {
      name: 'startingAt',
      title: 'Starting price',
      type: 'string',
      description:
        'Display string, e.g. "$0.40 / product". Leave blank to show "On request" instead.',
    },
    {
      name: 'turnaround',
      title: 'Turnaround',
      type: 'string',
      description: 'e.g. "48 hours for a standard batch".',
      validation: (rule) => rule.required().max(60),
    },
    {
      name: 'orderRank',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'turnaround' },
    prepare(selection) {
      const { title, subtitle } = selection as { title?: string; subtitle?: string };
      return { title: title ?? 'Untitled service', subtitle };
    },
  },
};
