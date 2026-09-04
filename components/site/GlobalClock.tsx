'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  GLOBAL CLOCK WIDGET — BOTTOM LEFT CORNER
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  - Displays live ticking UTC time
 *  - Detects visitor's local country code (e.g. BD, US, UK, CA, IN, etc.)
 *  - Displays visitor's local time with live pulsating status indicator
 *  - Styled in 3D Liquid Glass Pill aesthetic
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/** Common timezone-to-country mapping */
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
    if (TIMEZONE_TO_COUNTRY[tz]) {
      return TIMEZONE_TO_COUNTRY[tz];
    }
    // Fallback: Check if prefix or country name can be deduced
    if (tz.startsWith('America/')) return 'US';
    if (tz.startsWith('Europe/')) return 'EU';
    if (tz.startsWith('Australia/')) return 'AU';
    return 'LOCAL';
  } catch {
    return 'LOCAL';
  }
}

function formatTwoDigits(n: number): string {
  return n.toString().padStart(2, '0');
}

export function GlobalClock() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [countryCode, setCountryCode] = useState('BD');

  useEffect(() => {
    setMounted(true);
    setCountryCode(getCountryCode());

    const updateClocks = () => {
      const now = new Date();

      // UTC Time
      const uHours = formatTwoDigits(now.getUTCHours());
      const uMinutes = formatTwoDigits(now.getUTCMinutes());
      const uSeconds = formatTwoDigits(now.getUTCSeconds());
      setUtcTime(`${uHours}:${uMinutes}:${uSeconds}`);

      // Local Time
      const lHours = formatTwoDigits(now.getHours());
      const lMinutes = formatTwoDigits(now.getMinutes());
      const lSeconds = formatTwoDigits(now.getSeconds());
      setLocalTime(`${lHours}:${lMinutes}:${lSeconds}`);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Live UTC and Local Clocks"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 pointer-events-auto select-none"
    >
      <div className="liquid-glass-floating-pill rounded-full px-3.5 py-1.5 flex items-center gap-2.5 sm:gap-3 text-[11px] font-mono tracking-tight text-slate-300 shadow-[0_12px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(0,245,155,0.18)]">
        {/* Pulsing Live Green Status Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
        </span>

        {/* UTC Clock */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-bold text-[9.5px] uppercase tracking-wider">
            UTC
          </span>
          <span className="font-semibold text-white tabular-nums">{utcTime}</span>
        </div>

        {/* Hairline Divider */}
        <span className="h-3 w-px bg-emerald-500/35" aria-hidden="true" />

        {/* Visitor Country Clock */}
        <div className="flex items-center gap-1">
          <span className="text-[#00E676] font-extrabold text-[9.5px] uppercase tracking-wider">
            {countryCode}
          </span>
          <span className="font-semibold text-white tabular-nums">{localTime}</span>
        </div>
      </div>
    </motion.aside>
  );
}
