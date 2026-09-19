import type { Metadata } from 'next';

import { absoluteUrl } from '@/site.config';
import { LetsTalkClient } from './LetsTalkClient';

export const metadata: Metadata = {
  title: "Let's Talk · Direct Inquiries",
  description:
    "Have a project in mind? Drop us a line and we'll get back to you within 24 hours.",
  alternates: { canonical: absoluteUrl('/lets-talk') },
  openGraph: {
    title: "Let's Talk · MD Tarikuzzaman Sabbir",
    description:
      "Direct project inquiries, commercial photography, visual pipeline & creative direction.",
    url: absoluteUrl('/lets-talk'),
  },
};

export default function LetsTalkPage() {
  return <LetsTalkClient />;
}
