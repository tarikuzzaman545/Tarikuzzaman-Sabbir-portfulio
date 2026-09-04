'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIVE CLOCK WIDGET — RIGHT TOP CORNER (2 LINES)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Line 1: UTC Time | [Country] Time (e.g. UTC 15:40 | BD 9:40 PM)
 *  Line 2: Date (e.g. Fri Sep 4)
 *  Position: Fixed at Right Top Corner
 */

import { useEffect, useState } from 'react';

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

      // Date: "Fri Sep 4"
      const d = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setDateStr(d);

      // Local Time: "9:40 PM"
      const t = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLocalTimeStr(t);

      // UTC Time: "15:40"
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
      aria-label="Live UTC and Local Date and Clocks"
      className="fixed top-2.5 right-3 sm:top-3.5 sm:right-6 z-50 pointer-events-auto select-none"
    >
      <div className="liquid-glass-floating-pill rounded-2xl px-3 py-1.5 flex flex-col items-end justify-center font-mono tracking-tight shadow-[0_10px_28px_rgba(0,0,0,0.85),0_0_20px_rgba(0,245,155,0.18)] border border-emerald-500/35 backdrop-blur-2xl">
        {/* Line 1: UTC time | [Country] time */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs leading-none">
          {/* Pulsing Live Green Status Dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
          </span>

          {/* UTC Time */}
          <span className="text-slate-300 font-semibold tabular-nums">
            <span className="text-slate-400 font-bold text-[9.5px] mr-1">UTC</span>
            {utcTimeStr}
          </span>

          <span className="text-emerald-500/50 font-bold text-[10px]">|</span>

          {/* Country + Local Time */}
          <span className="text-white font-bold tabular-nums">
            <span className="text-[#00E676] font-extrabold text-[10px] mr-1">{countryCode}</span>
            {localTimeStr}
          </span>
        </div>

        {/* Line 2: Date (e.g. Fri Sep 4) */}
        <div className="text-[10px] sm:text-[10.5px] font-semibold text-slate-300 tracking-wide mt-1 leading-none">
          {dateStr}
        </div>
      </div>
    </aside>
  );
}
