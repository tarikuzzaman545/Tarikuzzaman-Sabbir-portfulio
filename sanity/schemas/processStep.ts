/**
 * `processStep` — one node on the Process timeline.
 *
 * Mirrors the `ProcessStep` interface in `lib/content/types.ts`.
 */

import type { SchemaType } from './schemaTypes';

export const processStep: SchemaType = {
  name: 'processStep',
  title: 'Process step',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Step number',
      type: 'number',
      description: 'Starts at 1. Drives both the sort order and the numeral shown.',
      validation: (rule) => rule.required().integer().positive(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Single word or short phrase, e.g. "Brief", "Generation".',
      validation: (rule) => rule.required().max(40),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'What happens at this step, and why it is structured this way.',
      validation: (rule) => rule.required(),
    },
    {
      name: 'clientAction',
      title: 'What the client does',
      type: 'string',
      description:
        'Optional. Stating this plainly prevents the most common project delay — a brief left half-finished because nobody said what was needed.',
      validation: (rule) => rule.max(160),
    },
    {
      name: 'duration',
      title: 'Typical duration',
      type: 'string',
      description: 'e.g. "Same day", "1–2 days".',
      validation: (rule) => rule.required().max(40),
    },
  ],
  preview: {
    select: { title: 'title', order: 'order', duration: 'duration' },
    prepare(selection) {
      const { title, order, duration } = selection as {
        title?: string;
        order?: number;
        duration?: string;
      };
      return {
        title: `${order ?? '?'}. ${title ?? 'Untitled step'}`,
        subtitle: duration,
      };
    },
  },
  orderings: [
    {
      title: 'Step order',
      name: 'stepOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
};
