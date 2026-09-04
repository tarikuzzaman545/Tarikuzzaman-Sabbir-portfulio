/**
 * /services — deliverables and the five-step process.
 *
 * Composes the two existing sections under a page-level <h1>. The Services grid
 * carries the deliverable cards and pricing; the Process timeline sets
 * expectations for how an engagement actually runs. Both are server-rendered from
 * the content adapter, fetched in parallel.
 */

import type { Metadata } from 'next';

import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { PageHeader } from '@/components/site/PageHeader';
import { getProcess, getServices } from '@/lib/content';
import { absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Deliverables, pricing and turnaround for AI product photography, fashion imagery, prompt-pipeline setup and ad video — plus the five-step process from brief to delivery.',
  alternates: { canonical: absoluteUrl('/services') },
  openGraph: {
    title: 'Services · MD Tarikuzzaman Sabbir',
    description:
      'Deliverables, pricing and the five-step process — from brief to catalog-ready delivery.',
    url: absoluteUrl('/services'),
  },
};

export default async function ServicesPage() {
  const [services, processSteps] = await Promise.all([getServices(), getProcess()]);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Imagery delivered as a repeatable system"
        lead="Every engagement leaves you with more than a folder of images — a documented pipeline you can run again. Here is what I deliver, what it costs, and exactly how it runs."
      />

      <Services services={services} />
      <Process steps={processSteps} />
    </>
  );
}
