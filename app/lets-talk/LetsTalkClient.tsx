'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ArrowRight,
  Sparkles,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
} from 'lucide-react';

import { EmailInput } from '@/components/forms/EmailInput';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { useCsrf } from '@/lib/use-csrf';
import { cn } from '@/lib/utils';
import type { DirectContactInput, FieldErrors } from '@/lib/validation';
import { isPlaceholder, siteConfig } from '@/site.config';

const SERVICES = [
  'AI Product Photography',
  'Commercial Catalog Retouching',
  'Visual Automation & Pipeline',
  'Virtual Fashion & Model Shoots',
  'Cosmetics & Luxury Visuals',
  'E-commerce Creative Direction',
  'Other Inquiries',
];

export function LetsTalkClient() {
  const { fetchToken } = useCsrf();

  const emailReady = !isPlaceholder(siteConfig.contact.email);
  const whatsappReady = !isPlaceholder(siteConfig.contact.whatsapp);
  const locationReady = !isPlaceholder(siteConfig.location);

  const [formData, setFormData] = useState<DirectContactInput>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    service: SERVICES[0]!,
    message: '',
    company: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => setTouchedFields((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const csrfToken = await fetchToken();
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        setStatus('error');
        if (resData.fields) {
          setFieldErrors(resData.fields);
        }
        setErrorMessage(resData.error || 'Something went wrong. Please check your fields and try again.');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your internet connection and try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas text-ink pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* ── Signature Ambient Emerald Shaders ──────────────────────────── */}
      <div
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full -z-10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-20 right-10 w-[450px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00F59B]" />
            <span>Direct Inquiries</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Let’s Talk.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-ink-muted max-w-2xl leading-relaxed">
            Have a project in mind? Drop a line below and get a turnaround estimate and project breakdown within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Direct Info & Booking Card ──────────────── */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Card */}
            <div className="liquid-glass-card p-5 rounded-2xl flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#00F59B] border border-emerald-500/25">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">Email</p>
                {emailReady ? (
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm sm:text-base font-semibold text-ink hover:text-[#00F59B] transition-colors truncate block"
                  >
                    {siteConfig.contact.email}
                  </a>
                ) : (
                  <p className="text-sm sm:text-base font-semibold text-ink-muted">—</p>
                )}
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="liquid-glass-card p-5 rounded-2xl flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#00F59B] border border-emerald-500/25">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">WhatsApp</p>
                {whatsappReady ? (
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-semibold text-ink hover:text-[#00F59B] transition-colors truncate block"
                  >
                    {siteConfig.contact.phone || siteConfig.contact.whatsapp}
                  </a>
                ) : (
                  <p className="text-sm sm:text-base font-semibold text-ink-muted">—</p>
                )}
              </div>
            </div>

            {/* Response Time Card */}
            <div className="liquid-glass-card p-5 rounded-2xl flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#00F59B] border border-emerald-500/25">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">Response Time</p>
                <p className="text-sm sm:text-base font-semibold text-ink">Within 24 hours</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="liquid-glass-card p-5 rounded-2xl flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-[#00F59B] border border-emerald-500/25">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">Location</p>
                <p className="text-sm sm:text-base font-semibold text-ink">
                  {locationReady ? siteConfig.location : '—'}
                </p>
              </div>
            </div>

            {/* Social Profiles Row */}
            <div className="pt-2 flex items-center gap-3">
              {siteConfig.socials.instagram && (
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="liquid-glass-floating-pill flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-white hover:text-[#00F59B] transition-all"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {siteConfig.socials.facebook && (
                <a
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="liquid-glass-floating-pill flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-white hover:text-[#00F59B] transition-all"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {siteConfig.socials.linkedin && (
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="liquid-glass-floating-pill flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-white hover:text-[#00F59B] transition-all"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {siteConfig.socials.x && (
                <a
                  href={siteConfig.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="liquid-glass-floating-pill flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:text-white hover:text-[#00F59B] transition-all"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Book a Strategy Call Spotlight Card */}
            <div className="mt-6 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#082016] via-[#05140E] to-[#020805] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-5 opacity-10 pointer-events-none">
                <Calendar className="w-24 h-24 text-[#00F59B]" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-wider text-[#00F59B] mb-3">
                  <Sparkles className="w-3 h-3" />
                  <span>1-on-1 Consultation</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Book a Strategy Call</h3>
                <p className="text-xs text-ink-muted mb-4 leading-relaxed">
                  Prefer a live meeting? Pick a convenient time on my calendar to evaluate your brand&apos;s visual pipeline.
                </p>
                <Link
                  href="/contact"
                  className="btn-neon inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all"
                >
                  <span>Choose Date & Time</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right Column: Direct Contact Form ─────────────────────── */}
          <div className="lg:col-span-7">
            <div className="liquid-glass-card rounded-3xl p-6 sm:p-9 shadow-2xl">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-[#00F59B] border border-emerald-500/30 mb-5">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h2>
                  <p className="text-ink-muted max-w-md mx-auto text-sm leading-relaxed mb-6">
                    Thank you for reaching out. I have received your message and will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        service: SERVICES[0]!,
                        message: '',
                        company: '',
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#00F59B] hover:bg-emerald-500/10 transition-colors"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Error Notification */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm"
                      >
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company ?? ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="lets-talk-name" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                        Name <span className="text-[#00F59B]">*</span>
                      </label>
                      <input
                        id="lets-talk-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        onBlur={() => markTouched('name')}
                        placeholder="Your full name"
                        className={cn(
                          'w-full rounded-xl sm:rounded-2xl bg-surface/70 border px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none transition-all',
                          (touchedFields.name && (formData.name.trim().length === 0 || formData.name.trim().length < 2)) || fieldErrors.name
                            ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : formData.name.trim().length >= 2
                            ? 'border-[#00F59B]/80'
                            : 'border-line hover:border-line-strong focus:border-[#00F59B]',
                        )}
                      />
                      {((touchedFields.name && (formData.name.trim().length === 0 || formData.name.trim().length < 2)) || fieldErrors.name) && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 pl-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.name || 'Please enter your full name (minimum 2 characters)'}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lets-talk-email" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                        Email <span className="text-[#00F59B]">*</span>
                      </label>
                      <EmailInput
                        id="lets-talk-email"
                        value={formData.email}
                        onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
                        placeholder="you@company.com"
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 pl-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone / WhatsApp (Optional) */}
                  <div>
                    <label htmlFor="lets-talk-phone" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                      Phone / WhatsApp (Optional)
                    </label>
                    <PhoneInput
                      id="lets-talk-phone"
                      value={formData.phone ?? ''}
                      onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 pl-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Subject & Service Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="lets-talk-subject" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                        Subject <span className="text-[#00F59B]">*</span>
                      </label>
                      <input
                        id="lets-talk-subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                        onBlur={() => markTouched('subject')}
                        placeholder="e.g. Catalog Photography Sprint"
                        className={cn(
                          'w-full rounded-xl sm:rounded-2xl bg-surface/70 border px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none transition-all',
                          (touchedFields.subject && (formData.subject.trim().length === 0 || formData.subject.trim().length < 2)) || fieldErrors.subject
                            ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : formData.subject.trim().length >= 2
                            ? 'border-[#00F59B]/80'
                            : 'border-line hover:border-line-strong focus:border-[#00F59B]',
                        )}
                      />
                      {((touchedFields.subject && (formData.subject.trim().length === 0 || formData.subject.trim().length < 2)) || fieldErrors.subject) && (
                        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 pl-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.subject || 'Subject must be at least 2 characters'}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lets-talk-service" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                        Service <span className="text-[#00F59B]">*</span>
                      </label>
                      <select
                        id="lets-talk-service"
                        value={formData.service}
                        onChange={(e) => setFormData((prev) => ({ ...prev, service: e.target.value }))}
                        className="w-full rounded-xl sm:rounded-2xl bg-surface/90 border border-line px-4 py-3 text-sm text-ink focus:outline-none focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B] transition-all"
                      >
                        {SERVICES.map((s) => (
                          <option key={s} value={s} className="bg-[#081A12] text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="lets-talk-message" className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                      Message <span className="text-[#00F59B]">*</span>
                    </label>
                    <textarea
                      id="lets-talk-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      onBlur={() => markTouched('message')}
                      placeholder="Tell me about your products, timeline, and goals..."
                      className={cn(
                        'w-full rounded-xl sm:rounded-2xl bg-surface/70 border px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none transition-all resize-none',
                        (touchedFields.message && (formData.message.trim().length === 0 || formData.message.trim().length < 5)) || fieldErrors.message
                          ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                          : formData.message.trim().length >= 5
                          ? 'border-[#00F59B]/80'
                          : 'border-line hover:border-line-strong focus:border-[#00F59B]',
                      )}
                    />
                    {((touchedFields.message && (formData.message.trim().length === 0 || formData.message.trim().length < 5)) || fieldErrors.message) && (
                      <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5 pl-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fieldErrors.message || 'Message must be at least 5 characters'}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="btn-neon inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
