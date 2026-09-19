'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Camera,
  Layers,
  Send,
  User,
  Building,
  AlertCircle,
} from 'lucide-react';

import { EmailInput } from '@/components/forms/EmailInput';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { useCsrf } from '@/lib/use-csrf';
import { cn } from '@/lib/utils';

const AVAILABLE_SERVICES = [
  { id: 'ai-product', label: 'AI Product Photography', desc: 'Catalog-ready studio shots with realistic shadows' },
  { id: 'fashion-model', label: 'Fashion & Model Shoot', desc: 'Virtual high-fashion models tailored to your brand' },
  { id: 'cosmetics-luxury', label: 'Cosmetics & Luxury Visuals', desc: 'Water splashes, stone textures & studio caustics' },
  { id: 'ugc-video', label: 'UGC Character & Video Ads', desc: 'Engaging 9:16 vertical video creatives for Meta & TikTok' },
  { id: 'catalog-pack', label: 'E-commerce Catalog Pack', desc: 'Multi-angle white-background & lifestyle imagery' },
  { id: 'branding', label: 'Brand Art Direction', desc: 'Full aesthetic overhaul & creative prompt pipelines' },
];

const PRODUCT_CATEGORIES = [
  'Jewelry & Watches',
  'Apparel & Fashion',
  'Cosmetics & Skincare',
  'Footwear & Sneakers',
  'Supplements & Health',
  'Electronics & Gadgets',
  'Bags & Accessories',
  'Food & Beverages',
  'Other Products',
];

const BUDGET_RANGES = [
  'Under $250',
  '$250 – $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500+',
  'Not sure yet',
];

const TIME_SLOTS = [
  { time: '11:00 AM', utc: '05:00 UTC' },
  { time: '02:00 PM', utc: '08:00 UTC' },
  { time: '04:00 PM', utc: '10:00 UTC' },
  { time: '06:00 PM', utc: '12:00 UTC' },
  { time: '08:00 PM', utc: '14:00 UTC' },
  { time: '10:00 PM', utc: '16:00 UTC' },
];

const REFERRALS = [
  'Instagram',
  'LinkedIn',
  'Facebook',
  'Client Referral / Word of mouth',
  'X / Twitter',
  'Google Search',
  'Other',
];

export function BookPageClient() {
  const { fetchToken } = useCsrf();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [selectedServices, setSelectedServices] = useState<string[]>(['AI Product Photography']);
  const [productCategory, setProductCategory] = useState('Apparel & Fashion');
  const [budget, setBudget] = useState('$500 – $1,000');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState('04:00 PM');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [referral, setReferral] = useState('Instagram');
  const [honeypot, setHoneypot] = useState('');
  const [clientTouched, setClientTouched] = useState<Record<string, boolean>>({});
  const markClientTouched = (field: string) => setClientTouched((prev) => ({ ...prev, [field]: true }));

  // Generate next 14 calendar days (excluding Sundays)
  const availableDays = useMemo(() => {
    const days: { dateStr: string; label: string; weekday: string; fullDate: string }[] = [];
    const now = new Date();
    let current = new Date(now.getTime() + 24 * 60 * 60 * 1000); // start tomorrow

    while (days.length < 12) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0) {
        // Skip Sunday
        const weekday = current.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const fullDate = current.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
        days.push({
          dateStr: current.toISOString().split('T')[0] ?? '',
          label: monthDay,
          weekday,
          fullDate,
        });
      }
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }
    return days;
  }, []);

  const effectiveDate = selectedDate || (availableDays[0] ? availableDays[0].fullDate : '');

  const toggleService = (label: string) => {
    setSelectedServices((prev) =>
      prev.includes(label) ? (prev.length > 1 ? prev.filter((s) => s !== label) : prev) : [...prev, label],
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) return Boolean(productCategory && budget);
    if (step === 3) return Boolean(effectiveDate && selectedTime);
    if (step === 4) return clientName.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[a-zA-Z0-9-]{2,}$/.test(email);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canProceed()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = await fetchToken();
      if (token) headers['X-CSRF-Token'] = token;

      const res = await fetch('/api/book', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          clientName,
          email,
          whatsapp,
          companyName,
          services: selectedServices,
          productCategory,
          budget,
          notes,
          selectedDate: effectiveDate,
          selectedTime,
          referral,
          honeypot,
        }),
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setIsSuccess(true);
      } else {
        setErrorMessage(json.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Network error. Please try again or reach out directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* ── Heading ── */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-floating-pill text-[11px] font-mono uppercase tracking-widest text-[#00F59B] mb-4">
          <Zap className="w-3.5 h-3.5 text-[#00F59B]" />
          1-on-1 Visual Strategy Session
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-4">
          Book a Strategy Call <br />
          <span className="text-gradient-neon">With Sabbir</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Discuss your product line, get custom AI camera & lighting recommendations, and receive a tailored turnaround plan — 100% free with zero obligation.
        </p>
      </div>

      {/* ── Progress Wizard Indicator ── */}
      {!isSuccess && (
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-950/60 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-[#00F59B] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[
              { s: 1, label: 'Services' },
              { s: 2, label: 'Scope' },
              { s: 3, label: 'Schedule' },
              { s: 4, label: 'Details' },
            ].map((item) => (
              <button
                key={item.s}
                type="button"
                onClick={() => item.s < step && setStep(item.s)}
                disabled={item.s > step}
                className="relative z-10 flex flex-col items-center group cursor-pointer disabled:cursor-not-allowed"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    step === item.s
                      ? 'bg-[#00F59B] text-black shadow-[0_0_20px_rgba(0,245,155,0.6)] scale-110'
                      : step > item.s
                        ? 'bg-emerald-800 text-[#00F59B] border border-emerald-400/40'
                        : 'bg-[#061C12] text-slate-500 border border-emerald-900/40'
                  }`}
                >
                  {step > item.s ? '✓' : item.s}
                </div>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider mt-2 transition-colors ${
                    step === item.s ? 'text-[#00F59B] font-bold' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      {isSuccess ? (
        /* ── Success Screen ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass-card rounded-3xl p-8 sm:p-14 max-w-2xl mx-auto text-center border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-[#00F59B] flex items-center justify-center mx-auto mb-6 text-[#00F59B]">
            <CheckCircle className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white mb-3">
            You're All Booked, {clientName.split(' ')[0]}! 🎉
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Your 1-on-1 visual strategy call is confirmed. A calendar invitation and summary have been sent to{' '}
            <span className="text-[#00F59B] font-mono font-semibold">{email}</span>.
          </p>

          <div className="bg-[#03130B]/90 border border-emerald-500/20 rounded-2xl p-6 mb-8 text-left space-y-3">
            <div className="flex items-center gap-3 text-white text-sm font-semibold">
              <Calendar className="w-4 h-4 text-[#00F59B]" />
              <span>{effectiveDate}</span>
            </div>
            <div className="flex items-center gap-3 text-white text-sm font-semibold">
              <Clock className="w-4 h-4 text-[#00F59B]" />
              <span>{selectedTime} (GMT+6 / Bangladesh Time)</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <Layers className="w-4 h-4 text-[#00F59B]" />
              <span>Services: {selectedServices.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-neon font-bold text-sm tracking-wider"
            >
              Back to Home
            </Link>
            <Link
              href="/work"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full liquid-glass-floating-pill text-slate-200 text-sm font-medium hover:text-white transition-colors"
            >
              Explore Portfolio Gallery
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Form Steps ── */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="liquid-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              {/* Invisible honeypot */}
              <input
                type="text"
                name="company_website_url_hp"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="sr-only"
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                {/* ── STEP 1: SERVICES ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#00F59B] uppercase tracking-wider block mb-1">
                        Step 1 of 4
                      </span>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                        Which services are you interested in?
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {AVAILABLE_SERVICES.map((s) => {
                        const active = selectedServices.includes(s.label);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleService(s.label)}
                            className={`px-5 py-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 ${
                              active
                                ? 'border-[#00F59B] bg-emerald-500/15 shadow-[0_0_20px_rgba(0,245,155,0.2)]'
                                : 'border-emerald-500/15 bg-[#03130B]/60 hover:border-emerald-500/40 hover:bg-[#03130B]'
                            }`}
                          >
                            <span className={`text-sm font-semibold tracking-wide ${active ? 'text-[#00F59B]' : 'text-white'}`}>
                              {s.label}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                                active ? 'bg-[#00F59B] text-black font-bold' : 'border border-emerald-500/30'
                              }`}
                            >
                              {active && '✓'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: SCOPE & BUDGET ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#00F59B] uppercase tracking-wider block mb-1">
                        Step 2 of 4
                      </span>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                        Tell us about your product & scope
                      </h2>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                        Product Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setProductCategory(cat)}
                            className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                              productCategory === cat
                                ? 'bg-[#00F59B] text-black font-semibold shadow-[0_0_15px_rgba(0,245,155,0.3)]'
                                : 'liquid-glass-floating-pill text-slate-300 hover:text-white'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Selection */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                        Estimated Project Budget
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {BUDGET_RANGES.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b)}
                            className={`p-3 rounded-xl text-xs font-medium text-center border transition-all ${
                              budget === b
                                ? 'border-[#00F59B] bg-emerald-500/15 text-[#00F59B] font-bold'
                                : 'border-emerald-500/15 bg-[#03130B]/60 text-slate-300 hover:border-emerald-500/40'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Notes */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Product Links or Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. link to your Shopify store, Instagram handle, or specific visual moodboard ideas..."
                        className="w-full rounded-2xl bg-[#03130B]/80 border border-emerald-500/20 p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F59B] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: SCHEDULE ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#00F59B] uppercase tracking-wider block mb-1">
                        Step 3 of 4
                      </span>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                        Pick a Date & Preferred Time
                      </h2>
                    </div>

                    {/* Date Horizontal Picker */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                        Select a Day (Next 2 Weeks)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {availableDays.map((d) => (
                          <button
                            key={d.dateStr}
                            type="button"
                            onClick={() => setSelectedDate(d.fullDate)}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                              selectedDate === d.fullDate
                                ? 'border-[#00F59B] bg-emerald-500/20 shadow-[0_0_15px_rgba(0,245,155,0.3)]'
                                : 'border-emerald-500/15 bg-[#03130B]/60 hover:border-emerald-500/40'
                            }`}
                          >
                            <span className="text-[10px] font-mono uppercase text-slate-400">{d.weekday}</span>
                            <span
                              className={`text-sm font-bold mt-1 ${
                                selectedDate === d.fullDate ? 'text-[#00F59B]' : 'text-white'
                              }`}
                            >
                              {d.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-3.5 rounded-xl border text-left transition-all ${
                              selectedTime === slot.time
                                ? 'border-[#00F59B] bg-emerald-500/20 text-[#00F59B]'
                                : 'border-emerald-500/15 bg-[#03130B]/60 text-slate-200 hover:border-emerald-500/40'
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold text-sm">
                              <Clock className="w-3.5 h-3.5 text-[#00F59B]" />
                              <span>{slot.time}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{slot.utc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 4: CLIENT DETAILS ── */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="font-mono text-xs text-[#00F59B] uppercase tracking-wider block mb-1">
                        Step 4 of 4
                      </span>
                      <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                        Your Contact Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                          Your Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            onBlur={() => markClientTouched('name')}
                            placeholder="John Doe"
                            className={cn(
                              'w-full rounded-xl bg-[#03130B]/80 border pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all',
                              clientTouched.name && clientName.trim().length < 2
                                ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                : clientName.trim().length >= 2
                                ? 'border-[#00F59B]/80'
                                : 'border-emerald-500/20 focus:border-[#00F59B]',
                            )}
                          />
                        </div>
                        {clientTouched.name && clientName.trim().length < 2 && (
                          <p className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1.5 pl-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            Please enter your full name (minimum 2 characters)
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                          Work or Personal Email *
                        </label>
                        <EmailInput
                          id="book-email"
                          value={email}
                          onChange={setEmail}
                          placeholder="john@brand.com"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                          WhatsApp / Phone (Optional)
                        </label>
                        <PhoneInput
                          id="book-phone"
                          value={whatsapp}
                          onChange={setWhatsapp}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                          Company / Brand Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Velmora Studio"
                            className="w-full rounded-xl bg-[#03130B]/80 border border-emerald-500/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F59B] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        How Did You Hear About Sabbir?
                      </label>
                      <select
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        className="w-full rounded-xl bg-[#03130B]/90 border border-emerald-500/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00F59B]"
                      >
                        {REFERRALS.map((r) => (
                          <option key={r} value={r} className="bg-[#040D09] text-white">
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                        {errorMessage}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Navigation Buttons ── */}
              <div className="flex items-center justify-between pt-8 mt-6 border-t border-emerald-500/15">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-3 rounded-full btn-neon font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next Step <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !canProceed()}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full btn-neon font-bold text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,245,155,0.4)]"
                  >
                    {isSubmitting ? (
                      'Confirming Booking...'
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Confirm Strategy Call
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── Right Column: Live Booking Summary & Guarantee ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="liquid-glass-card rounded-3xl p-6 border border-emerald-500/25">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#00F59B] mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Booking Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-emerald-400/80 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Session Type</span>
                  <p className="text-white font-semibold">15-Minute Visual Strategy Call</p>
                </div>

                <div>
                  <span className="text-emerald-400/80 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Selected Date & Time</span>
                  <p className="text-white font-semibold">
                    {effectiveDate || 'Selecting...'} at {selectedTime} (GMT+6)
                  </p>
                </div>

                <div>
                  <span className="text-emerald-400/80 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Product Category</span>
                  <p className="text-white font-semibold">{productCategory}</p>
                </div>

                <div>
                  <span className="text-emerald-400/80 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Estimated Budget</span>
                  <p className="text-[#00F59B] font-mono font-semibold">{budget}</p>
                </div>

                <div>
                  <span className="text-emerald-400/80 font-mono text-[10px] uppercase tracking-wider block mb-0.5">Services ({selectedServices.length})</span>
                  <ul className="space-y-1 mt-1">
                    {selectedServices.map((s) => (
                      <li key={s} className="text-white font-medium flex items-center gap-1.5">
                        <span className="text-[#00F59B]">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="liquid-glass-card rounded-2xl p-5 border border-emerald-500/15 space-y-3.5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#00F59B] shrink-0" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Pressure Guarantee</h4>
              </div>

              <div className="flex items-center gap-3">
                <Camera className="w-4 h-4 text-[#00F59B] shrink-0" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Sample Preview</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
