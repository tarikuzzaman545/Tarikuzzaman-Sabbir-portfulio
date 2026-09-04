'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  COMPACT DUAL-CAPSULE LIVE TIME & DATE WIDGET (TOP RIGHT)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  - 2 separate ultra-compact liquid glass pills:
 *      1. Time Capsule: [ • UTC 15:43 | BD 9:43 PM ]
 *      2. Date Capsule: [ Fri, Sep 4 ]
 *  - Organic breathing motion (gentle inhale/exhale float)
 *  - Fixed across the entire website at top-right corner
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  'Asia/Dhaka': 'BD',
  'Europe/London': 'UK',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Los_Angeles': 'US',
  'America/Denver': 'US',
  'America/Phoenix': 'US',
  'America/Detroit': 'US',
  'America/Indianapolis': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Montreal': 'CA',
  'America/Edmonton': 'CA',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Dubai': 'AE',
  'Asia/Singapore': 'SG',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH',
  'Europe/Vienna': 'AT',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI',
  'Europe/Dublin': 'IE',
  'Asia/Riyadh': 'SA',
  'Asia/Qatar': 'QA',
  'Asia/Kuwait': 'KW',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Bangkok': 'TH',
  'Asia/Jakarta': 'ID',
  'Asia/Karachi': 'PK',
  'Asia/Colombo': 'LK',
  'America/Sao_Paulo': 'BR',
};

function getCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIMEZONE_TO_COUNTRY[tz]) return TIMEZONE_TO_COUNTRY[tz];
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'EU';
    if (tz.startsWith('Australia/')) return 'AU';
    return 'BD';
  } catch {
    return 'BD';
  }
}

export function GlobalClock() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const [localTimeStr, setLocalTimeStr] = useState('');
  const [utcTimeStr, setUtcTimeStr] = useState('');
  const [countryCode, setCountryCode] = useState('BD');

  useEffect(() => {
    setMounted(true);
    setCountryCode(getCountryCode());

    const updateClock = () => {
      const now = new Date();

      // Date: "Fri, Sep 4"
      const d = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setDateStr(d);

      // Local Time: "9:43 PM"
      const t = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLocalTimeStr(t);

      // UTC Time: "15:43"
      const uHours = now.getUTCHours().toString().padStart(2, '0');
      const uMins = now.getUTCMinutes().toString().padStart(2, '0');
      setUtcTimeStr(`${uHours}:${uMins}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <aside
      aria-label="Live UTC, Local Time and Date"
      className="fixed top-2.5 right-3 sm:top-3.5 sm:right-6 z-50 pointer-events-auto select-none"
    >
      {/* Smooth Organic Breathing Animation */}
      <motion.div
        animate={{
          y: [0, -3, 0],
          scale: [1, 1.018, 1],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="flex flex-col items-stretch gap-1 w-[168px] sm:w-[176px]"
      >
        {/* ── Section 1 (Top): Time Capsule (UTC + Country Local Time) ── */}
        <div className="w-full h-6 sm:h-[26px] liquid-glass-floating-pill rounded-full px-2 flex items-center justify-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] tracking-tight shadow-[0_8px_20px_rgba(0,0,0,0.8)] border border-emerald-500/35">
          {/* Live pulsing green dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
          </span>

          {/* UTC Time */}
          <span className="text-slate-300 font-semibold tabular-nums">
            <span className="text-slate-400 font-bold text-[8.5px] mr-0.5">UTC</span>
            {utcTimeStr}
          </span>

          <span className="text-emerald-500/40 font-bold text-[9px]">|</span>

          {/* Local Country Time */}
          <span className="text-white font-bold tabular-nums">
            <span className="text-[#00E676] font-extrabold text-[8.5px] mr-0.5">{countryCode}</span>
            {localTimeStr}
          </span>
        </div>

        {/* ── Section 2 (Bottom): Date Capsule (Identical Same Size) ── */}
        <div className="w-full h-6 sm:h-[26px] liquid-glass-floating-pill rounded-full px-2 flex items-center justify-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] tracking-tight text-slate-200 font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.8)] border border-emerald-500/35 whitespace-nowrap">
          <svg
            className="w-2.5 h-2.5 text-[#00E676] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="tabular-nums">{dateStr}</span>
        </div>
      </motion.div>
    </aside>
  );
}
