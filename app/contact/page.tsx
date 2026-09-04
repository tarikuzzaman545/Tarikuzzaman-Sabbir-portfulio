/**
 * /contact — the working contact form plus direct routes.
 *
 * The Contact section already contains everything this page needs: the validated
 * form with project-type and budget options, and the panel of direct links
 * (email, WhatsApp, social profiles) that appears only once real values replace
 * the FILL_ME placeholders in site.config.ts. The page just supplies the <h1>.
 */

import type { Metadata } from 'next';

import { Contact } from '@/components/sections/Contact';
import { PageHeader } from '@/components/site/PageHeader';
import { absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell me what you are shooting. Send a product link and a rough count and get a fixed price, a turnaround date, and a free sample before you commit to the batch.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: 'Contact · MD Tarikuzzaman Sabbir',
    description:
      'Send a product link and a rough count — get a fixed price, a turnaround date, and a free sample.',
    url: absoluteUrl('/contact'),
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s plan your shoot"
        lead="A product link and a rough count is enough to start. I reply within one working day — usually the same day."
      />

      <Contact />
    </>
  );
}
