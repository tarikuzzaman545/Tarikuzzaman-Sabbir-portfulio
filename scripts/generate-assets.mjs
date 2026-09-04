import fs from 'fs';
import path from 'path';

const publicImg = path.resolve('public/img');

// 1. Brands
const brands = [
  { name: 'Velmora', tag: 'FASHION', icon: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#10B981" stroke-width="2" fill="none"/>` },
  { name: 'Lunari', tag: 'BEAUTY', icon: `<circle cx="12" cy="12" r="8" stroke="#10B981" stroke-width="2" fill="none"/><path d="M12 4a8 8 0 0 1 8 8 8 8 0 0 1-8 8" fill="#10B981" opacity="0.4"/>` },
  { name: 'Kleanic', tag: 'SKINCARE', icon: `<path d="M6 6l12 12M18 6L6 18" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>` },
  { name: 'NEXA', tag: 'FOOTWEAR', icon: `<path d="M4 20L14 4h6L10 20H4z" fill="#10B981"/>` },
  { name: 'Boxigo', tag: 'PACKAGING', icon: `<rect x="4" y="4" width="16" height="16" rx="3" stroke="#10B981" stroke-width="2" fill="none"/><path d="M4 10h16M10 4v16" stroke="#10B981" stroke-width="1.5"/>` },
  { name: 'Fyndra', tag: 'LIFESTYLE', icon: `<path d="M12 2C6.5 2 2 6.5 2 12c0 5 4 9 9 10 5.5 0 10-4.5 10-10C21 5 16 2 12 2z" stroke="#10B981" stroke-width="2" fill="none"/><path d="M12 2c0 5 4 9 9 10" stroke="#10B981" stroke-width="2"/>` }
];

brands.forEach(b => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50">
    <g transform="translate(10, 13)">
      <svg width="24" height="24" viewBox="0 0 24 24">${b.icon}</svg>
    </g>
    <text x="44" y="28" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" letter-spacing="0.06em">${b.name.toUpperCase()}</text>
    <text x="44" y="39" fill="#10B981" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="600" letter-spacing="0.22em">${b.tag}</text>
  </svg>`;
  fs.writeFileSync(path.join(publicImg, 'brands', `${b.name.toLowerCase()}.svg`), svg);
});

// Helper for generating stylized, rich SVG card illustrations
function createCardSvg(title, subtitle, iconSvg, gradientColors, accentText) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
    <defs>
      <radialGradient id="bg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stop-color="${gradientColors[0]}"/>
        <stop offset="50%" stop-color="${gradientColors[1]}"/>
        <stop offset="100%" stop-color="#020805"/>
      </radialGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00F59B" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#10B981" stop-opacity="0.05"/>
      </linearGradient>
      <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="35" />
      </filter>
    </defs>
    <rect width="600" height="450" fill="url(#bg)"/>
    <circle cx="300" cy="180" r="140" fill="#00F59B" opacity="0.16" filter="url(#blurFilter)"/>
    <rect x="20" y="20" width="560" height="410" rx="20" fill="none" stroke="url(#glow)" stroke-width="1.5"/>
    
    <!-- Central Icon / Illustration -->
    <g transform="translate(300, 180)">
      ${iconSvg}
    </g>
    
    ${accentText ? `
      <rect x="50" y="50" width="130" height="28" rx="14" fill="#00F59B" fill-opacity="0.15" stroke="#00F59B" stroke-width="1"/>
      <text x="115" y="68" fill="#00F59B" font-family="sans-serif" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="0.1em">${accentText}</text>
    ` : ''}

    <text x="300" y="375" fill="#F8FAFC" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="700" text-anchor="middle" letter-spacing="-0.02em">${title}</text>
    <text x="300" y="405" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" font-weight="400" text-anchor="middle">${subtitle}</text>
  </svg>`;
}

// 2. Services Images
const services = [
  {
    file: '01-ai-product-photography.svg',
    title: 'AI Product Photography',
    subtitle: 'Studio-quality product images without studio setup',
    tag: 'STUDIO GRADE',
    grad: ['#063321', '#03170E'],
    icon: `<g transform="translate(-40, -40)"><rect x="10" y="20" width="60" height="45" rx="8" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><circle cx="40" cy="42" r="16" fill="#041F14" stroke="#00F59B" stroke-width="2.5"/><circle cx="40" cy="42" r="8" fill="#00F59B" opacity="0.6"/><circle cx="58" cy="28" r="3" fill="#00F59B"/><path d="M25 20L32 10h16l7 10" stroke="#00F59B" stroke-width="2" fill="#0A3E28"/></g>`
  },
  {
    file: '02-ai-model-photography.svg',
    title: 'AI Model Photography',
    subtitle: 'Use your custom model or mine for perfect brand shots',
    tag: 'CUSTOM MODEL',
    grad: ['#093826', '#041B12'],
    icon: `<g transform="translate(-40, -45)"><circle cx="40" cy="30" r="18" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><path d="M16 75c0-14 10-24 24-24s24 10 24 24" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><circle cx="40" cy="30" r="12" fill="#00F59B" opacity="0.3"/></g>`
  },
  {
    file: '03-ugc-ads-video.svg',
    title: 'UGC & Ads Video',
    subtitle: 'Scroll-stopping UGC videos and high-converting ad creatives',
    tag: 'MOTION ADS',
    grad: ['#073523', '#031A10'],
    icon: `<g transform="translate(-40, -35)"><rect x="12" y="15" width="46" height="40" rx="8" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><polygon points="32,27 48,35 32,43" fill="#00F59B"/><polygon points="58,25 72,18 72,52 58,45" fill="#0A3E28" stroke="#00F59B" stroke-width="2"/></g>`
  },
  {
    file: '04-poster-design.svg',
    title: 'Poster & Social Media Design',
    subtitle: 'Creative posters for ads, campaigns and social branding',
    tag: 'CAMPAIGN ART',
    grad: ['#0B402B', '#051E14'],
    icon: `<g transform="translate(-35, -45)"><rect x="15" y="10" width="42" height="60" rx="6" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><line x1="24" y1="24" x2="48" y2="24" stroke="#00F59B" stroke-width="3" stroke-linecap="round"/><line x1="24" y1="36" x2="42" y2="36" stroke="#00F59B" stroke-width="2" stroke-linecap="round"/><circle cx="36" cy="52" r="8" fill="#00F59B" opacity="0.5"/></g>`
  },
  {
    file: '05-website-design.svg',
    title: 'Website Design',
    subtitle: 'Modern, responsive, high-converting websites for brands',
    tag: 'NEXT.JS BUILD',
    grad: ['#083321', '#03170E'],
    icon: `<g transform="translate(-45, -35)"><rect x="10" y="12" width="70" height="45" rx="6" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><line x1="2" y1="57" x2="88" y2="57" stroke="#00F59B" stroke-width="4" stroke-linecap="round"/><rect x="20" y="22" width="22" height="24" rx="3" fill="#00F59B" opacity="0.4"/><line x1="50" y1="25" x2="72" y2="25" stroke="#00F59B" stroke-width="2.5"/><line x1="50" y1="35" x2="68" y2="35" stroke="#00F59B" stroke-width="2"/></g>`
  },
  {
    file: '06-prompt-engineering.svg',
    title: 'Prompt Engineering',
    subtitle: 'Custom AI prompts and pipelines for consistent brand results',
    tag: 'AI PIPELINES',
    grad: ['#093A27', '#041B12'],
    icon: `<g transform="translate(-40, -35)"><rect x="10" y="15" width="60" height="45" rx="8" fill="#041E14" stroke="#00F59B" stroke-width="2.5"/><text x="18" y="38" fill="#00F59B" font-family="monospace" font-size="16" font-weight="700">&gt; /gen</text><rect x="56" y="27" width="3" height="13" fill="#00F59B"/></g>`
  },
  {
    file: '07-brand-content.svg',
    title: 'Brand Content Creation',
    subtitle: 'Visual content that builds brand identity and sells products',
    tag: 'ECOMMERCE',
    grad: ['#0A3D29', '#051D13'],
    icon: `<g transform="translate(-30, -45)"><rect x="16" y="24" width="28" height="48" rx="8" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><rect x="23" y="12" width="14" height="12" rx="3" fill="#00F59B"/><circle cx="30" cy="48" r="7" fill="#00F59B" opacity="0.4"/></g>`
  },
  {
    file: '08-consultation.svg',
    title: 'Consultation & Support',
    subtitle: 'Need guidance? Let’s talk about your creative vision',
    tag: 'STRATEGY',
    grad: ['#063321', '#03170E'],
    icon: `<g transform="translate(-40, -40)"><path d="M15 20h40a10 10 0 0 1 10 10v16a10 10 0 0 1-10 10H30l-12 10V56h-3a10 10 0 0 1-10-10V30a10 10 0 0 1 10-10z" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><circle cx="28" cy="38" r="3" fill="#00F59B"/><circle cx="40" cy="38" r="3" fill="#00F59B"/><circle cx="52" cy="38" r="3" fill="#00F59B"/></g>`
  }
];

services.forEach(s => {
  const content = createCardSvg(s.title, s.subtitle, s.icon, s.grad, s.tag);
  fs.writeFileSync(path.join(publicImg, 'services', s.file), content);
});

// 3. Featured Work Images
const featuredWork = [
  {
    file: '01-fashion-hoodie.svg',
    title: 'Fashion Brand',
    subtitle: 'AI Product + Model Shoot (Beige Hoodie)',
    tag: 'FASHION',
    grad: ['#093A27', '#03160D'],
    icon: `<g transform="translate(-40, -45)"><path d="M25 20c-5 12-15 18-20 22l8 14 12-8v35h30V48l12 8 8-14c-5-4-15-10-20-22-3 8-12 12-15 12s-12-4-15-12z" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/></g>`
  },
  {
    file: '02-footwear-sneaker.svg',
    title: 'Footwear Brand',
    subtitle: 'Commercial Product Photography (Green Sneaker)',
    tag: 'SHOES',
    grad: ['#083824', '#041B11'],
    icon: `<g transform="translate(-45, -30)"><path d="M10 40c8-10 24-20 40-15 12 4 18 12 25 15 8 3 15 2 15 10 0 6-15 10-40 10s-45-4-45-12c0-4 3-6 5-8z" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><path d="M30 38l25-10" stroke="#00F59B" stroke-width="2.5"/></g>`
  },
  {
    file: '03-accessories-bag.svg',
    title: 'Accessories Brand',
    subtitle: 'Bags & Luxury Lifestyle Shoot (Emerald Handbag)',
    tag: 'BAGS',
    grad: ['#0B422D', '#051E13'],
    icon: `<g transform="translate(-40, -40)"><rect x="12" y="28" width="56" height="42" rx="8" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><path d="M26 28V18a14 14 0 0 1 28 0v10" fill="none" stroke="#00F59B" stroke-width="3"/><circle cx="40" cy="48" r="4" fill="#00F59B"/></g>`
  },
  {
    file: '04-beauty-skincare.svg',
    title: 'Beauty Brand',
    subtitle: 'Luxury Cosmetics & Skincare Set (Jars & Serums)',
    tag: 'COSMETICS',
    grad: ['#073522', '#03170E'],
    icon: `<g transform="translate(-40, -40)"><rect x="15" y="24" width="24" height="44" rx="6" fill="#0A3E28" stroke="#00F59B" stroke-width="2"/><rect x="22" y="14" width="10" height="10" rx="2" fill="#00F59B"/><circle cx="52" cy="46" r="16" fill="#0A3E28" stroke="#00F59B" stroke-width="2"/><rect x="42" y="32" width="20" height="6" rx="2" fill="#00F59B"/></g>`
  },
  {
    file: '05-fragrance-perfume.svg',
    title: 'Fragrance Brand',
    subtitle: 'Luxury Perfume Product Photography (Glass & Gold)',
    tag: 'FRAGRANCE',
    grad: ['#0A3E28', '#041A10'],
    icon: `<g transform="translate(-30, -45)"><rect x="12" y="26" width="36" height="46" rx="8" fill="#0A3E28" stroke="#00F59B" stroke-width="2.5"/><rect x="22" y="12" width="16" height="14" rx="3" fill="#00F59B"/><circle cx="30" cy="48" r="8" fill="#00F59B" opacity="0.4"/></g>`
  }
];

featuredWork.forEach(w => {
  const content = createCardSvg(w.title, w.subtitle, w.icon, w.grad, w.tag);
  fs.writeFileSync(path.join(publicImg, 'featured-work', w.file), content);
});

// 4. Testimonials Avatars
const avatars = [
  { file: 'james-carter.svg', name: 'James Carter', initials: 'JC', role: 'E-commerce Brand Owner', color: '#10B981' },
  { file: 'sophia-lee.svg', name: 'Sophia Lee', initials: 'SL', role: 'Marketing Manager', color: '#00F59B' },
  { file: 'daniel-kim.svg', name: 'Daniel Kim', initials: 'DK', role: 'Startup Founder', color: '#34D399' }
];

avatars.forEach(a => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="#062618" stroke="${a.color}" stroke-width="3"/>
    <text x="50" y="58" fill="#F8FAFC" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="700" text-anchor="middle">${a.initials}</text>
  </svg>`;
  fs.writeFileSync(path.join(publicImg, 'testimonials', a.file), svg);
  fs.writeFileSync(path.join(publicImg, 'cta', a.file), svg);
});

console.log('All placeholder image assets generated successfully!');
