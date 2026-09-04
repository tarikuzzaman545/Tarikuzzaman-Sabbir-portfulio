/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOMEPAGE — EXACT 1:1 REPLICA OF THE UPLOADED DESIGNS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Sections:
 *  1. Hero (Photo, Floating Glass Cards, Stats Bar, Brand Logos)
 *  2. ServicesGrid (What I Do — 8 Liquid Glass Cards)
 *  3. FeaturedWork (Real Products. Real Results — Category Filter & 5 Cards)
 *  4. WhyChooseMe (Why Brands Work With Me — 4 Feature Cards + Doodle)
 *  5. ProcessTimeline (My Process — 4 Connected Steps)
 *  6. ClientFeedback (Client Feedback — 3 Liquid Glass Testimonials)
 *  7. CtaBanner (Ready to Create Something Amazing? + Avatars)
 */

import type { Metadata } from 'next';

import { ClientFeedback } from '@/components/sections/ClientFeedback';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Hero } from '@/components/sections/Hero';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { WhyChooseMe } from '@/components/sections/WhyChooseMe';
import { absoluteUrl, siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — AI Product Photographer & Creative Designer` },
  description:
    'High-end AI product photography, fashion on custom model shoots, UGC video ads, and creative design for modern brands.',
  alternates: { canonical: absoluteUrl('/') },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <FeaturedWork />
      <WhyChooseMe />
      <ProcessTimeline />
      <ClientFeedback />
      <CtaBanner />
    </>
  );
}
