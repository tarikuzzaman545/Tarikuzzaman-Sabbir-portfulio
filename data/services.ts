/**
 * Services offered, rendered as the card grid in the Services section.
 *
 * `startingAt` is optional — omit it and the card shows "On request" instead,
 * which is the right call for scoped work where a number would mislead.
 */

import type { Service } from '@/lib/content/types';

export const services: Service[] = [
  {
    slug: 'product-photography',
    title: 'AI Product Photography',
    icon: 'camera',
    description:
      'Catalog-ready product imagery generated from the links and reference shots you already have — no studio booking, no shipping samples.',
    includes: [
      'Six locked angles per product: front, cropped front, 45°, side, back, detail',
      'Every colorway gets its own complete set',
      'Background hex locked to your storefront standard',
      'Delivered with upload-ready filenames, so your team can automate ingest',
      'Failed shots flagged rather than forced through',
    ],
    startingAt: '$0.40 / product',
    turnaround: '48 hours for a standard batch',
  },
  {
    slug: 'fashion-on-model',
    title: 'Fashion & Apparel on Model',
    icon: 'sparkles',
    description:
      'Garments on a consistent model across a full rotation, with the construction replicated rather than approximated.',
    includes: [
      'Face and body consistency held across all angles in a set',
      'Structural garment description, so straps and cutouts are not invented',
      'Skin-tone locking across the whole set',
      'Hair-placement overrides so back construction stays visible',
      'Hands and limbs constrained — nothing cropped, nothing extra',
    ],
    turnaround: '48–72 hours per batch',
  },
  {
    slug: 'prompt-engineering',
    title: 'Prompt Engineering & Pipeline Setup',
    icon: 'wand',
    description:
      'The system, not the output. I build you a repeatable pipeline your own team can run, and document it so it survives me.',
    includes: [
      'Reference-locking system tuned to your product category',
      'Named shot conventions and a delivery folder structure that scales',
      'Hex and colour locking for brand consistency',
      'Documented failure modes and the specific fix for each',
      'Handover session plus written runbook',
    ],
    turnaround: '1–2 weeks, scope dependent',
  },
  {
    slug: 'ad-video',
    title: 'Marketing & Ad Video',
    icon: 'film',
    description:
      'Short-form product and UGC-style motion creative for paid social, built to be tested in variants rather than shipped once.',
    includes: [
      'Vertical 9:16 native, built for feed and story placements',
      'Multiple hooks cut from a single generation run',
      'Product identity held frame to frame, not morphing mid-shot',
      'Simple, credible camera moves — push-in, slow orbit',
      'Sound design and captions on request',
    ],
    turnaround: '3–5 days per concept',
  },
  {
    slug: 'web-build',
    title: 'AI-Assisted Website Build',
    icon: 'layout',
    description:
      'Fast, genuinely fast sites on Next.js, with a CMS behind them so you are never calling a developer to change a date.',
    includes: [
      'Next.js and Tailwind front end, deployed on Vercel',
      'Sanity CMS with a content model built for your actual business',
      'Security headers, CSP, form validation and rate limiting as standard',
      'Responsive and accessible — keyboard navigation and WCAG AA contrast',
      'SEO groundwork: metadata, structured data, sitemap',
    ],
    turnaround: '2–4 weeks',
  },
  {
    slug: 'bulk-cleanup',
    title: 'Bulk Image Correction',
    icon: 'layers',
    description:
      'Bringing a catalog assembled from many sources onto one visual standard, at volumes where manual editing stops being viable.',
    includes: [
      'One target standard agreed up front: background, exposure, crop',
      'Batch processing with a visual QA pass per batch, not per job',
      'Upscaling and sharpening where source files are weak',
      'The standard documented and handed over',
    ],
    turnaround: 'Volume dependent — quoted per batch',
  },
];
