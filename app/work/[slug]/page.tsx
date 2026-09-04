/**
 * /work/[slug] — an individual case study.
 *
 * STATIC AT BUILD, ROBUST AT RUNTIME
 * ──────────────────────────────────
 * `generateStaticParams` prerenders one HTML file per project, so every case
 * study is a static document a crawler can index and a visitor gets instantly.
 * `dynamicParams` is left at its default (true) so a project added in Sanity
 * after the build still renders on-demand instead of 404-ing — the `notFound()`
 * guard below only fires for a slug that genuinely does not exist in the content.
 *
 * `generateMetadata` gives each case study its own title, description, canonical
 * and OG image, which is the entire point of promoting these out of a lightbox
 * and onto real URLs: they can now be shared and ranked individually.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CaseStudy } from '@/components/portfolio/CaseStudy';
import { getProjects } from '@/lib/content';
import { absoluteUrl, siteConfig } from '@/site.config';

interface CaseStudyPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const projects = await getProjects();
  const project = projects.find((entry) => entry.slug === params.slug);
  if (!project) return {};

  const url = absoluteUrl(`/work/${project.slug}`);

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: `${project.title} · ${siteConfig.shortName}`,
      description: project.summary,
      url,
      images: [
        {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.cover.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} · ${siteConfig.shortName}`,
      description: project.summary,
      images: [project.cover.src],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const projects = await getProjects();
  const index = projects.findIndex((entry) => entry.slug === params.slug);
  if (index === -1) notFound();

  const project = projects[index];
  if (!project) notFound();

  // Ordered prev/next through the same list the /work grid uses, so browsing
  // sequentially through case studies follows the same order as the portfolio.
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return <CaseStudy project={project} prev={prev} next={next} />;
}
