/**
 * /about — bio, approach and the working stack.
 *
 * The About section carries the narrative (CSE student at NUBTK, the AI product
 * photography journey, how the work is run as a pipeline). The Stack section
 * lists the tools grouped by what they actually do. Tools are fetched from the
 * content adapter; the About copy is static.
 */

import type { Metadata } from 'next';

import { About } from '@/components/sections/About';
import { Stack } from '@/components/sections/Stack';
import { PageHeader } from '@/components/site/PageHeader';
import { getTools } from '@/lib/content';
import { absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'About',
  description:
    'A Computer Science & Engineering student in Khulna building AI product-photography pipelines — reference-locking, structural prompts and documented systems, not one-off renders.',
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: 'About · MD Tarikuzzaman Sabbir',
    description:
      'CSE student and AI product photographer building repeatable image pipelines for e-commerce brands.',
    url: absoluteUrl('/about'),
  },
};

export default async function AboutPage() {
  const tools = await getTools();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="The person behind the pipeline"
        lead="I am a Computer Science student who generates product imagery for e-commerce brands — and treats it as an engineering problem rather than a folder of one-off outputs."
      />

      <About />
      <Stack tools={tools} />
    </>
  );
}
