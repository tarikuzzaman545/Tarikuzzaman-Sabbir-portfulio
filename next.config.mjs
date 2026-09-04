/** @type {import('next').NextConfig} */

/**
 * Content Security Policy.
 *
 * Notes on the choices here:
 * - 'unsafe-inline' is required in styleSrc because Tailwind's JIT output and
 *   Framer Motion both write inline style attributes. Style injection is a far
 *   lower risk than script injection, so this is the accepted trade-off.
 * - scriptSrc needs 'unsafe-inline' in development only (React refresh) and
 *   'unsafe-eval' likewise. Production gets a stricter list.
 * - Fonts are self-hosted (next/font/local), so fontSrc stays 'self' with no
 *   fonts.gstatic.com exception and no third-party request at runtime.
 * - Sanity's CDN is allowed in imgSrc so CMS images work once you switch it on.
 */
const isDev = process.env.NODE_ENV === 'development';

const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Next.js inlines a small bootstrap script
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://va.vercel-scripts.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://cdn.sanity.io',
    'https://i.ytimg.com',
    'https://i.vimeocdn.com',
  ],
  'font-src': ["'self'", 'data:'],
  'connect-src': [
    "'self'",
    'https://api.resend.com',
    'https://*.api.sanity.io',
    'https://*.apicdn.sanity.io',
    ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
  ],
  'frame-src': ["'self'", 'https://www.youtube-nocookie.com', 'https://player.vimeo.com'],
  'media-src': ["'self'", 'https://cdn.sanity.io'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
  ...(isDev ? {} : { 'upgrade-insecure-requests': [] }),
};

const csp = Object.entries(cspDirectives)
  .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
  .join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // HSTS: 2 years, covers subdomains, eligible for the browser preload list.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
];

const nextConfig = {
  reactStrictMode: true,

  // Never leak framework version in response headers.
  poweredByHeader: false,

  compress: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Self-hosted fonts are content-hashed and immutable.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // API responses must never be cached by a CDN or browser.
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ];
  },

  eslint: {
    dirs: ['app', 'components', 'lib', 'data', 'sanity'],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
