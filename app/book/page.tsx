import type { Metadata } from 'next';

import { absoluteUrl, siteConfig } from '@/site.config';
import { BookPageClient } from './BookPageClient';

export const metadata: Metadata = {
  title: `Book a Strategy Call · ${siteConfig.name}`,
  description:
    'Schedule a 1-on-1 visual strategy call with MD Tarikuzzaman Sabbir. Discuss custom AI product photography, model shoots, and turnaround times for your brand.',
  alternates: { canonical: absoluteUrl('/book') },
};

export default function BookPage() {
  return <BookPageClient />;
}
