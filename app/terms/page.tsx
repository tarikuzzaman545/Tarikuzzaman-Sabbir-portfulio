import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck, ShieldCheck, Scale, AlertCircle, ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/site/PageHeader';
import { siteConfig, absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service and commercial engagement standards for ${siteConfig.name}.`,
  alternates: { canonical: absoluteUrl('/terms') },
  openGraph: {
    title: `Terms of Service · ${siteConfig.name}`,
    description: 'Commercial terms, intellectual property, and service delivery policies.',
    url: absoluteUrl('/terms'),
  },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Commercial Terms"
        title="Terms of Service"
        lead="Clear guidelines and standards governing visual production services, intellectual property, and collaboration."
      />

      <section className="section pt-0">
        <div className="shell max-w-4xl">
          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/20 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs uppercase tracking-wider pb-4 border-b border-emerald-500/15">
              <Scale className="w-4 h-4" />
              <span>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                1. Scope of Creative Services
              </h2>
              <p>
                {siteConfig.name} provides AI product photography, visual concept design, virtual model staging, prompt engineering, and e-commerce creative asset production. Specific deliverable counts, turnaround times, and file specifications are formally defined in individual project scopes or proposals.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                2. Intellectual Property & Commercial Rights
              </h2>
              <p>
                Upon receipt of full payment for agreed milestones:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li><strong className="text-white">Commercial License:</strong> Clients receive worldwide, non-exclusive commercial rights to deploy and publish delivered visual assets across all digital and marketing channels.</li>
                <li><strong className="text-white">Portfolio Showcase:</strong> Unless explicitly restricted via an executed Non-Disclosure Agreement (NDA) prior to kickoff, {siteConfig.name} reserves the right to exhibit completed visual work in public portfolios, case studies, and reels.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-400" />
                3. Revisions & Approvals
              </h2>
              <p>
                Each project phase incorporates iterative review rounds to align on lighting, model poses, composition, and texture fidelity. Revisions outside the original scope or radical shifts in creative direction after milestone sign-off may be billed at standard hourly or sprint rates.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">4. Inquiries & Custom Contracts</h2>
              <p>
                For enterprise brand contracts, white-label arrangements, or custom NDAs, please contact directly:
              </p>
              <p className="font-mono text-emerald-400">
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>

            <div className="pt-6 border-t border-emerald-500/15 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
