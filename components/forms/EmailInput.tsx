'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function EmailInput({
  value,
  onChange,
  id = 'email-input',
  placeholder = 'you@example.com',
  className,
  required = true,
}: EmailInputProps) {
  const [isBlurred, setIsBlurred] = useState(false);

  // Clean email: no spaces, strictly lowercase
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\s+/g, '').toLowerCase();
    onChange(cleaned);
  };

  // Block spacebar completely
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
    }
  };

  // Standard robust email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z0-9-]{2,}$/;
  const isValid = emailRegex.test(value);
  const isInvalid = isBlurred && value.length > 0 && !isValid;

  const getErrorMessage = () => {
    if (!value.includes('@')) {
      return "Email must contain '@' symbol (e.g. name@domain.com)";
    }
    const parts = value.split('@');
    if (!parts[1] || !parts[1].includes('.')) {
      return "Email must include a valid domain (e.g. domain.com)";
    }
    return 'Please enter a valid email address with no spaces';
  };

  return (
    <div className={cn('space-y-1.5 w-full', className)}>
      <div
        className={cn(
          'relative flex h-[52px] w-full items-center rounded-xl sm:rounded-2xl border bg-black/40 px-3.5 transition-all duration-200',
          isInvalid
            ? 'border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
            : isValid
            ? 'border-[#00F59B]/80 bg-emerald-950/15 shadow-[0_0_15px_rgba(0,245,155,0.15)]'
            : 'border-white/10 hover:border-white/20 focus-within:border-[#00F59B]/70',
        )}
      >
        <Mail
          className={cn(
            'w-4 h-4 shrink-0 transition-colors mr-2.5',
            isInvalid ? 'text-red-400' : isValid ? 'text-[#00F59B]' : 'text-slate-500',
          )}
        />

        <input
          id={id}
          type="email"
          name="email"
          required={required}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          value={value}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsBlurred(true)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none pr-8 font-mono"
        />

        {/* Status Indicator Icon */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
          <AnimatePresence mode="wait">
            {isValid && (
              <motion.div
                key="valid-check"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-5 h-5 rounded-full bg-emerald-500/20 text-[#00F59B] border border-[#00F59B]/40 flex items-center justify-center text-[10px] font-bold"
              >
                <Check className="w-3 h-3" />
              </motion.div>
            )}
            {isInvalid && (
              <motion.div
                key="invalid-alert"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center"
              >
                <AlertCircle className="w-3 h-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Red Alert Banner */}
      <AnimatePresence>
        {isInvalid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400 font-medium flex items-center gap-1.5 pl-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{getErrorMessage()}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
