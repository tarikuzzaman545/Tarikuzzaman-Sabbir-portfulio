/**
 * `tool` — one badge in the Tech & Tools row.
 *
 * Mirrors the `Tool` interface in `lib/content/types.ts`.
 */

import type { SchemaType } from './schemaTypes';

export const tool: SchemaType = {
  name: 'tool',
  title: 'Tool',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    },
    {
      name: 'purpose',
      title: 'What you use it for',
      type: 'string',
      description: 'One short clause. Shown on hover and to screen readers.',
      validation: (rule) => rule.required().max(120),
    },
    {
      name: 'group',
      title: 'Group',
      type: 'string',
      description:
        'Grouping matters here — "what you generate with" and "what you ship on" are different claims, and clients read them differently.',
      options: {
        list: [
          { title: 'Generation', value: 'generation' },
          { title: 'Post & correction', value: 'post' },
          { title: 'Build', value: 'build' },
          { title: 'Delivery', value: 'delivery' },
        ],
        layout: 'radio',
      },
      initialValue: 'generation',
      validation: (rule) => rule.required(),
    },
    {
      name: 'orderRank',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first within a group.',
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'purpose' },
    prepare(selection) {
      const { title, subtitle } = selection as { title?: string; subtitle?: string };
      return { title: title ?? 'Unnamed tool', subtitle };
    },
  },
};
