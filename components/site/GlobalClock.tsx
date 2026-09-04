'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIVE DATE & TIME WIDGET (TOP RIGHT)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  - Displays Date & Local Time: e.g. "Fri Sep 4  9:35 PM" (macOS style)
 *  - Automatically detects visitor's country code (e.g. BD, US, UK, CA, IN, etc.)
 *  - Displays live ticking UTC time
 *  - Live pulsating emerald indicator dot
 *  - 3D Liquid Glass Pill aesthetic
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

      // Date: "Fri Sep 4" (exact match to macOS menu bar format)
      const d = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setDateStr(d);

      // Local Time: "9:35 PM"
      const t = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLocalTimeStr(t);

      // UTC Time: "15:35 UTC"
      const uHours = now.getUTCHours().toString().padStart(2, '0');
      const uMins = now.getUTCMinutes().toString().padStart(2, '0');
      setUtcTimeStr(`${uHours}:${uMins} UTC`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      aria-label="Live Date and Clocks"
      className="inline-flex items-center gap-2 rounded-full liquid-glass-floating-pill px-3 py-1 text-[11px] sm:text-xs font-mono tracking-tight text-slate-200 select-none shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
    >
      {/* Pulsing Live Green Status Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
      </span>

      {/* Country Code + Date + Time: e.g. "BD Fri Sep 4  9:35 PM" */}
      <span className="font-semibold text-white whitespace-nowrap">
        <span className="text-[#00E676] font-bold mr-1.5">{countryCode}</span>
        {dateStr} &nbsp;{localTimeStr}
      </span>

      {/* Divider */}
      <span className="h-3 w-px bg-emerald-500/35 hidden xl:inline-block" aria-hidden="true" />

      {/* UTC Time */}
      <span className="text-slate-400 font-medium text-[10.5px] whitespace-nowrap hidden xl:inline-block">
        {utcTimeStr}
      </span>
    </div>
  );
}
