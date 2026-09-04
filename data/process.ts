/**
 * The five-step working process, rendered as a vertical timeline.
 *
 * `clientAction` is what the client has to do at that step. Stating it plainly
 * on the site prevents the most common project delay, which is a brief sitting
 * half-finished because nobody said what was needed.
 */

import type { ProcessStep } from '@/lib/content/types';

export const process: ProcessStep[] = [
  {
    order: 1,
    title: 'Brief',
    description:
      'You send product links, any reference photos you already have, and your storefront standard — background colour, output size, naming convention if you have one. If you do not have one, we settle it here, because retrofitting a naming scheme at product four hundred is miserable.',
    clientAction: 'Product links, references, and your target output spec.',
    duration: 'Same day',
  },
  {
    order: 2,
    title: 'Concept & spec lock',
    description:
      'I generate a small representative sample and we agree the model, the framing, the crop and the background before volume starts. This step exists to move all the disagreement to the front of the project, where it costs a day instead of a re-run.',
    clientAction: 'Approve the sample, or tell me exactly what to change.',
    duration: '1–2 days',
  },
  {
    order: 3,
    title: 'Generation',
    description:
      'The full batch runs against the approved spec. Each product moves through its complete shot list with the reference locked, so the set reads as one shoot rather than six separate images. Anything that fails three attempts gets flagged and set aside rather than burning credits on a garment the model will not read.',
    duration: '48 hours for a standard batch',
  },
  {
    order: 4,
    title: 'Revisions',
    description:
      'You review a contact sheet — the whole batch on one page — instead of opening files individually. Flag anything that misses and it gets regenerated. Revisions are scoped to the agreed spec, which is why step two matters.',
    clientAction: 'Mark what needs another pass.',
    duration: '1–2 days',
  },
  {
    order: 5,
    title: 'Delivery',
    description:
      'Final files arrive named to your convention, at your target dimensions, in the folder structure your upload process expects. No renaming on your side, no resizing, no second pass.',
    duration: 'Same day as sign-off',
  },
];
