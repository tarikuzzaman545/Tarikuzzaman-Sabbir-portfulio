import type { Metadata } from 'next';

import { BookPageClient } from '@/app/book/BookPageClient';
import { absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'Book a Strategy Call · Contact',
  description:
    'Schedule a 1-on-1 strategy call with Sabbir. Select services, pick a date & time, and explore AI visual transformations for your brand.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: 'Book a Strategy Call · MD Tarikuzzaman Sabbir',
    description:
      'Schedule a 1-on-1 strategy call. Pick a date & time to discuss AI product visuals and brand pipelines.',
    url: absoluteUrl('/contact'),
  },
};

export default function ContactPage() {
  return <BookPageClient />;
}

