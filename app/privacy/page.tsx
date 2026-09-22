import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/site/PageHeader';
import { siteConfig, absoluteUrl } from '@/site.config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${siteConfig.name} portfolio. Learn how your data is handled with transparency and respect.`,
  alternates: { canonical: absoluteUrl('/privacy') },
  openGraph: {
    title: `Privacy Policy · ${siteConfig.name}`,
    description: 'Learn how your data is collected, used, and protected.',
    url: absoluteUrl('/privacy'),
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal & Transparency"
        title="Privacy Policy"
        lead="Your privacy is paramount. Here is how your information is handled with care, confidentiality, and integrity."
      />

      <section className="section pt-0">
        <div className="shell max-w-4xl">
          <div className="liquid-glass-card rounded-3xl p-8 sm:p-12 border border-emerald-500/20 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs uppercase tracking-wider pb-4 border-b border-emerald-500/15">
              <Shield className="w-4 h-4" />
              <span>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                1. Information We Collect
              </h2>
              <p>
                When you interact with this portfolio through the contact form, direct inquiry, or 1-on-1 strategy call booking, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li><strong className="text-white">Contact Information:</strong> Your name, email address, WhatsApp or phone number, and company name.</li>
                <li><strong className="text-white">Project Details:</strong> Information submitted regarding creative briefs, brand requirements, budget, and scheduling preferences.</li>
                <li><strong className="text-white">Usage Analytics:</strong> Privacy-focused web analytics (via Vercel Analytics and Google Analytics) collecting anonymous device types, page views, and geographic regions without tracking personal identities.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                2. How Your Information Is Used
              </h2>
              <p>
                Any information you provide is strictly used for legitimate business collaboration purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li>To respond to your inquiries and schedule discovery sessions.</li>
                <li>To prepare tailored proposals, creative concepts, and AI image production scopes.</li>
                <li>We never sell, rent, or trade your personal data or project confidential assets to third parties.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                3. Security & Retention
              </h2>
              <p>
                We employ secure transmission protocols (TLS/HTTPS), signed CSRF protections, and trusted delivery infrastructure (Resend, Vercel) to protect against unauthorized access. Project assets and communications are retained only as long as necessary to complete project agreements and fulfill accounting obligations.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">4. Contact & Inquiries</h2>
              <p>
                If you have questions regarding this Privacy Policy or wish to modify any information previously submitted, please contact:
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
                href="/terms"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Terms of Service →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
