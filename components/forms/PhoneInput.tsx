'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Country {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const countries: Country[] = [
  // ── Priority (shown first) ──
  { code: 'BD', name: 'Bangladesh',     dial: '+880', flag: '🇧🇩' },
  { code: 'US', name: 'United States',  dial: '+1',   flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44',  flag: '🇬🇧' },
  { code: 'CA', name: 'Canada',         dial: '+1',   flag: '🇨🇦' },
  { code: 'AU', name: 'Australia',      dial: '+61',  flag: '🇦🇺' },
  { code: 'AE', name: 'UAE',            dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia',   dial: '+966', flag: '🇸🇦' },
  { code: 'IN', name: 'India',          dial: '+91',  flag: '🇮🇳' },
  { code: 'SG', name: 'Singapore',      dial: '+65',  flag: '🇸🇬' },
  { code: 'MY', name: 'Malaysia',       dial: '+60',  flag: '🇲🇾' },
  { code: 'DE', name: 'Germany',        dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', name: 'France',         dial: '+33',  flag: '🇫🇷' },
  { code: 'IT', name: 'Italy',          dial: '+39',  flag: '🇮🇹' },
  { code: 'ES', name: 'Spain',          dial: '+34',  flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands',    dial: '+31',  flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland',    dial: '+41',  flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden',         dial: '+46',  flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark',        dial: '+45',  flag: '🇩🇰' },
  { code: 'NO', name: 'Norway',         dial: '+47',  flag: '🇳🇴' },
  { code: 'PK', name: 'Pakistan',       dial: '+92',  flag: '🇵🇰' },
  // ── Other common countries ──
  { code: 'JP', name: 'Japan',          dial: '+81',  flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea',    dial: '+82',  flag: '🇰🇷' },
  { code: 'CN', name: 'China',          dial: '+86',  flag: '🇨🇳' },
  { code: 'BR', name: 'Brazil',         dial: '+55',  flag: '🇧🇷' },
  { code: 'TR', name: 'Turkey',         dial: '+90',  flag: '🇹🇷' },
  { code: 'ID', name: 'Indonesia',      dial: '+62',  flag: '🇮🇩' },
  { code: 'TH', name: 'Thailand',       dial: '+66',  flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam',        dial: '+84',  flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines',    dial: '+63',  flag: '🇵🇭' },
  { code: 'NZ', name: 'New Zealand',    dial: '+64',  flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland',        dial: '+353', flag: '🇮🇪' },
  { code: 'ZA', name: 'South Africa',   dial: '+27',  flag: '🇿🇦' },
  { code: 'KW', name: 'Kuwait',         dial: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar',          dial: '+974', flag: '🇶🇦' },
  { code: 'OM', name: 'Oman',           dial: '+968', flag: '🇴🇲' },
];

const phoneRules: Record<string, { min: number; max: number; label: string }> = {
  BD: { min: 10, max: 11, label: '10-11 digits' },
  US: { min: 10, max: 10, label: '10 digits' },
  CA: { min: 10, max: 10, label: '10 digits' },
  GB: { min: 10, max: 10, label: '10 digits' },
  AU: { min: 9,  max: 9,  label: '9 digits' },
  IN: { min: 10, max: 10, label: '10 digits' },
  AE: { min: 9,  max: 9,  label: '9 digits' },
  SA: { min: 9,  max: 9,  label: '9 digits' },
  SG: { min: 8,  max: 8,  label: '8 digits' },
  MY: { min: 9,  max: 10, label: '9-10 digits' },
};

const DEFAULT_RULE = { min: 6, max: 15, label: '6-15 digits' };

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  id?: string;
  className?: string;
}

const DEFAULT_COUNTRY: Country = countries[0]!;

export function PhoneInput({ value, onChange, id, className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const rule = useMemo(() => phoneRules[selectedCountry.code] || DEFAULT_RULE, [selectedCountry]);

  useEffect(() => {
    if (value) {
      const dialCode = selectedCountry.dial;
      if (value.startsWith(dialCode)) {
        setPhoneNumber(value.replace(dialCode, ''));
      }
    }
  }, [value, selectedCountry.dial]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search),
    );
  }, [searchTerm]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, rule.max);
    setPhoneNumber(digits);
    onChange(`${selectedCountry.dial}${digits}`);
  };

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setPhoneNumber('');
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
    setTimeout(() => phoneInputRef.current?.focus(), 0);
  };

  const isValid = phoneNumber.length >= rule.min && phoneNumber.length <= rule.max;
  const isTooShort = isBlurred && phoneNumber.length > 0 && phoneNumber.length < rule.min;
  const isInvalid = isTooShort;

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      <div
        className={cn(
          'flex h-[52px] w-full rounded-2xl border bg-[#0A0D0B] transition-all duration-200',
          isInvalid
            ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            : isValid
            ? 'border-[#00F59B]/80 bg-emerald-950/15 shadow-[0_0_15px_rgba(0,245,155,0.15)]'
            : 'border-white/10 hover:border-white/20 focus-within:border-[#00F59B]/70',
        )}
      >
        {/* Country Selector Dropdown Trigger */}
        <div className="relative border-r border-white/10" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-full items-center gap-2 px-3.5 hover:bg-white/5 transition-colors rounded-l-2xl text-slate-200"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-xs font-mono font-medium text-slate-300">{selectedCountry.dial}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 text-slate-500 transition-transform', isOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full left-0 z-[60] mt-2 w-[270px] rounded-2xl border border-white/15 bg-[#0A0E0C] shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden"
              >
                {/* Search Header */}
                <div className="sticky top-0 p-2.5 bg-[#0A0E0C] border-b border-white/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      className="w-full bg-[#141A17] pl-8 pr-3 py-1.5 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#00F59B]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Country List */}
                <div className="max-h-[240px] overflow-y-auto">
                  {filteredCountries.map((c, i) => (
                    <button
                      key={`${c.code}-${i}`}
                      type="button"
                      onClick={() => handleCountrySelect(c)}
                      className={cn(
                        'w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 transition-colors text-left',
                        selectedCountry.code === c.code && 'bg-[#00F59B]/10',
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{c.flag}</span>
                        <div>
                          <p className="text-xs font-medium text-slate-200">{c.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{c.dial}</p>
                        </div>
                      </div>
                      {selectedCountry.code === c.code && <Check className="w-3.5 h-3.5 text-[#00F59B]" />}
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-500">No countries found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Input Box */}
        <div className="relative flex-1">
          <input
            ref={phoneInputRef}
            id={id}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onBlur={() => setIsBlurred(true)}
            placeholder="01XXXXXXXXX"
            className="h-full w-full bg-transparent px-4 text-sm text-white placeholder:text-slate-600 outline-none font-mono"
          />

          {/* Character counter / badge */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <span
              className={cn(
                'text-[10px] font-mono',
                isValid ? 'text-[#00F59B]' : 'text-slate-600',
              )}
            >
              {phoneNumber.length} / {rule.max}
            </span>
          </div>
        </div>
      </div>

      {/* Red Alert if too short */}
      <AnimatePresence>
        {isTooShort && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400 font-medium flex items-center gap-1.5 pl-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {selectedCountry.name} phone numbers must be {rule.label}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
