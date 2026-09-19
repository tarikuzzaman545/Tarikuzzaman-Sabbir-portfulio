# 🧠 PROJECT_CONTEXT.md — Living Project Memory & Technical Blueprint

> **Single Source of Truth for MD Tarikuzzaman Sabbir's Portfolio & Digital Studio**  
> *Last Updated: September 10, 2026*  
> **Protocol**: This is a living document. Any new feature discussion, architectural pivot, bug fix, or design decision MUST be logged here immediately.

---

## 1. Project Overview & Identity

- **Owner / Identity**: **MD Tarikuzzaman Sabbir**
- **Roles**: Commercial AI Product Photographer, Creative Director, Prompt Engineer, Co-founder of WEBRING.
- **Location**: Khulna, Bangladesh (`Asia/Dhaka` timezone).
- **Core Value Proposition**:
  - Transforming factory/raw product photos into high-converting luxury studio catalog imagery without physical photoshoots or sample shipping.
  - Generating AI fashion model campaigns and UGC video ads for TikTok, Meta Ads, and YouTube Shorts.
  - High-impact commercial brand identity, packaging visuals, and e-commerce visual strategy.
- **Production / Target Domain**: `https://sabbir.studio`
- **GitHub Repository**: [tarikuzzaman545/Tarikuzzaman-Sabbir-portfulio](https://github.com/tarikuzzaman545/Tarikuzzaman-Sabbir-portfulio)

---

## 2. Technology Stack & Key Dependencies

| Technology / Library | Version | Role / Purpose |
| :--- | :--- | :--- |
| **Next.js** | `14.2.35` | App Router, React Server Components (RSC), route prefetching, SEO feeds (`sitemap.ts`, `robots.ts`) |
| **React & React DOM** | `18.3.1` | UI rendering, client-side state, concurrent features |
| **TypeScript** | `5.9.3` | Strict type safety, strong contracts across mock data and component props |
| **Tailwind CSS** | `3.4.19` | Utility-first styling with custom CSS design tokens & liquid glass shaders |
| **Framer Motion** | `11.18.2` | Spring physics, parallax tracking (`useScroll`, `useSpring`, `useTransform`), layout morphing |
| **Lucide React** | `0.400.0` | Lightweight modern line icons |
| **Zod** | `3.25.76` | Runtime input validation (contact forms, API payloads) |
| **Resend** | `3.5.0` | Transactional email delivery for client contact inquiries |
| **Next-Themes** | `0.3.0` | Dark/light theme provider with flash-prevention hydration config |
| **Sanity / Next-Sanity** | `9.12.3` | Headless CMS readiness & schema definitions (`sanity/`) |
| **clsx & tailwind-merge** | `2.1.1 / 2.6.1` | Conflict-free conditional CSS class merging (`cn()` utility) |

---

## 3. Architecture & Directory Layout

```
├── app/                              # Next.js App Router root
│   ├── (routes)/
│   │   ├── about/page.tsx            # About Sabbir, agency, education, philosophy
│   │   ├── contact/page.tsx          # Full-page inquiry form with budget & project types
│   │   ├── services/page.tsx         # Detailed service breakdown & deliverables
│   │   └── work/                     # Portfolio showcase
│   │       ├── [slug]/page.tsx       # Dynamic case study detail view
│   │       └── page.tsx              # Filterable work gallery
│   ├── api/
│   │   ├── contact/route.ts          # Contact form POST handler with honeypot & rate-limit
│   │   ├── csrf/route.ts             # Cryptographic CSRF token generation & validation
│   │   └── newsletter/route.ts       # Newsletter subscription endpoint
│   ├── globals.css                   # Theme tokens, liquid glass classes, kinetic stretch CSS
│   ├── layout.tsx                    # Root layout, self-hosted Poppins fonts, background shaders
│   ├── manifest.ts                   # PWA webmanifest config
│   ├── page.tsx                      # Primary 1:1 Homepage
│   ├── robots.ts & sitemap.ts        # Search engine discovery feeds
├── components/                       # Modular UI components
│   ├── forms/                        # ContactForm, NewsletterForm
│   ├── portfolio/                    # BeforeAfter slider, CaseStudy card, Lightbox modal, PortfolioGrid
│   ├── sections/                     # Hero, ServicesGrid, FeaturedWork, WhyChooseMe, ProcessTimeline, ClientFeedback, CtaBanner
│   ├── seo/                          # JsonLd.tsx (Schema.org Person & ProfessionalService graph)
│   ├── site/                         # Header (morphing island), GlobalClock, ParallaxBackground, KineticTextScroll, Footer
│   └── ui/                           # Icon, Reveal (IntersectionObserver wrapper)
├── data/                             # Mock & static content datasets
│   ├── homeContent.ts                # Hero copy, stats, trusted brand partners
│   ├── process.ts                    # 4-step creative process
│   ├── projects.ts                   # Case study items with before/after comparisons
│   ├── services.ts                   # 6 core service definitions & deliverable checklists
│   └── testimonials.ts               # Client reviews and quotes
├── lib/                              # Shared helper utilities
│   ├── content/                      # Content types & fetch fallbacks
│   ├── csrf.ts & use-csrf.ts         # CSRF security implementation
│   ├── email.ts                      # Resend email client helper
│   ├── rate-limit.ts                 # In-memory sliding window rate limiter
│   └── utils.ts                      # cn() classname merger
├── public/
│   ├── fonts/                        # Self-hosted Poppins (.woff: 300, 400, 500, 700)
│   ├── img/
│   │   ├── bg/                       # site-bg.png (3D emerald wave background)
│   │   ├── brand/                    # logo.png (Official 3D emerald 'S' ribbon)
│   │   └── hero/                     # sabbir-hero.png (High-res cutout)
├── sanity/                           # Sanity Studio schemas (projects, services, process)
├── site.config.ts                    # Central Single Source of Truth (socials, metadata, SEO keywords)
└── tailwind.config.ts                # Custom emerald/canvas color mappings and glass shadows
```

---

## 4. Visual Design System & Shader Rules

### Colors & CSS Tokens
- **Backgrounds**: Deep Obsidian Canvas (`#020805`, `#040D09`), Surface Glass (`#081A12`), Surface Raised (`#0C241A`).
- **Typography**: Primary Heading Ink (`#F8FAFC`), Mint Subtitle (`#A7F3D0`), Muted Specs (`#64748B`).
- **Signature Accents**: Electric Neon Emerald (`#00F59B`, `#00E676`), Midtone Emerald (`#10B981`, `#059669`).
- **Hairlines & Glass Borders**: `rgba(16, 185, 129, 0.18)` to `rgba(16, 185, 129, 0.38)`.

### 3D Liquid Glass Materials (`globals.css`)
1. `.liquid-glass-floating-pill`:
   - Multi-stop gradient: `linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(6, 28, 18, 0.88) 35%, rgba(3, 15, 10, 0.94) 100%)`.
   - Top specular bevel highlight: `border-top: 1.5px solid rgba(255, 255, 255, 0.45)`.
   - Side/bottom rim: `border: 1px solid rgba(0, 245, 155, 0.28)`.
   - Inner refraction + drop shadow: `inset 0 1px 1px rgba(255,255,255,0.35)` and `0 16px 36px -8px rgba(0,0,0,0.85)`.
2. `.liquid-glass-card`:
   - Smooth 3D hover elevation (`translateY(-4px)`), increased rim border brightness (`rgba(0, 245, 155, 0.55)`), and ambient emerald bloom.
3. `.btn-neon`:
   - High-contrast neon green gradient, black text (`#020805`), glowing emerald shadow.

---

## 5. Historical Discussion & Key Decisions Log (Chronological)

This section preserves the critical reasoning, user feedback, bug resolutions, and decisions made across the conversation history:

### 1. 3D Liquid Glass & Visual Identity Alignment
- **Discussion/Request**: Move from standard dark template to a custom 3D emerald liquid glass UI matching uploaded design mockups.
- **Decision**: Architected `.liquid-glass-floating-pill`, `.liquid-glass-card`, `.btn-neon`, and deep obsidian emerald tokens in `app/globals.css`. Integrated Sabbir's portrait cutout directly into the scene with atmospheric glows and handwritten doodles ("Ideas Designs Reality", "Better Visuals Brighter Brands").

### 2. Live Global Clock Widget Evolution (`components/site/GlobalClock.tsx`)
- **Discussion/Request**: A live UTC watch in the top right corner showing UTC time, visitor's country code & local time, and date with organic breathing motion.
- **Iteration 1**: Placed inside `Header.tsx` — Rejected by user as it crowded the navbar. Moved to fixed viewport corner (`fixed top-2.5 right-3 sm:top-3.5 sm:right-6 z-50`).
- **Iteration 2**: Stacked into 2 vertically aligned pills (`Time` on top, `Date` on bottom) with identical dimensions.
- **Iteration 3 (Final)**: User requested: *"date ta sorai dau valo dekhai na website e"* — The date pill was completely removed. Now only the ultra-sleek, compact Live Time Capsule (`[ • UTC 16:15 | BD 10:15 PM ]`) floats with a pulsing neon dot and gentle organic breathing.

### 3. Background Wallpaper & Parallax Depth (`components/site/ParallaxBackground.tsx`)
- **Discussion/Request**: When scrolling, the background image was moving 1:1 with content, losing depth and feeling flat. Low-res wallpaper was also pixelating on high-DPI displays.
- **Decision**: Created `ParallaxBackground.tsx` using Framer Motion `useScroll` and `useSpring` (`stiffness: 90, damping: 28`) translating at -12% travel. Applied soft cinematic lens blur (`blur-[12px] sm:blur-[14px]`) to prevent pixelation.

### 4. Rubber-Band Scroll Feel: Full-Page Wrapper vs. Kinetic Text Elongation
- **Discussion/Request**: User wanted an elastic rubber-band feel when scrolling ("rabar er moto feel").
- **Problem**: Initial full-page wrapper (`ElasticScrollWrapper.tsx`) intercepted wheel events and scaled the entire DOM tree, causing heavy repaints and severe scroll lag ("lac lac dicc website").
- **Decision**: Deleted `ElasticScrollWrapper.tsx` entirely to restore 100% native 120 FPS hardware scrolling. Built `KineticTextScroll.tsx` listening passively via `requestAnimationFrame` to set `--text-stretch-y`. Only typography (`h1, h2, h3, .kinetic-text`) elastically stretches vertically up to `1.045` and snaps back in 90ms with zero layout shifts.

### 5. Signature Dynamic Morphing Header Optimization (`components/site/Header.tsx`)
- **Discussion/Request**: The dynamic morphing navbar was lagging on scroll, and the "Let's Talk" CTA took too long to slide into the capsule.
- **Issue 1 (Lag)**: 500ms transitions on CPU layout properties were causing reflows. Reduced to a snappy 200ms ease-out GPU-promoted transition (`transform-gpu`).
- **Issue 2 (Sharp Box Glitch)**: User noted: *"jokhon sob gula ak sathe round box er vitor duche , age akta littme time er jonno char kona alta box dekha jacce..."*. The container had `rounded-full` only when `scrolled`. During transition from 0px to 9999px radius, a rectangular box flashed. **Fix**: Moved `rounded-full` permanently into the base container class so it is round at millisecond zero.
- **Issue 3 (Fast-Scroll Desync)**: Fast trackpad flick-scrolling bypassed delayed `requestAnimationFrame` gates. **Fix**: Removed `rAF` gating from scroll check; listener directly evaluates `window.scrollY > 15` instantaneously.

### 6. Living Ambient Undulating Wave Motion
- **Discussion/Request**: User instructed: *"baground ta piche , hlka hlka norbe mane motion e thakbe emon akta kicu koro"*. The background felt too static when idle.
- **Decision**: Added dual-layer motion in `ParallaxBackground.tsx`. Outer layer handles scroll parallax; inner layer runs a continuous 14-second organic undulating wave loop (`x, y, scale` looping smoothly on the GPU) so the background breathes with living energy even when reading or paused.

### 7. Entity SEO & Google Knowledge Graph
- **Discussion/Request**: User provided official profiles (Facebook, Instagram, LinkedIn, X, Pinterest) and instructed to link them for Google search ranking so searching "Tarikuzzaman Sabbir" associates all existing social posts, hashtags (`#tarikuzzaman_sabbir`, `#sabbir`), and ranks the site #1.
- **Decision**: Integrated `Person.sameAs` in `JsonLd.tsx` linking all verified profiles. Updated `site.config.ts` as the single source of truth for all links and keywords (`Tarikuzzaman Sabbir`, `MD Tarikuzzaman Sabbir`, `tarikuzzaman_sabbir`, `sabbir`). Updated Hero & Footer links with `target="_blank" rel="noreferrer"`.

### 8. Instant Page Route Pre-fetching
- **Discussion/Request**: User noticed page clicks (e.g. going to `/about` or `/services`) had a compile lag on local dev.
- **Decision**: Added Next.js `prefetch={true}` across all desktop and mobile navigation links, plus `router.prefetch(href)` on `onMouseEnter` so the moment a user hovers over any link, the route payload streams ahead of time for 0ms page transitions.

### 9. Dev Server Cache Desync & Testimonial SVG Dimensions
- **Discussion/Request**: User encountered an unstyled page with a gigantic green circle ("DK" initials) covering the screen.
- **Root Cause**: An orphaned Node process held port 3000 with stale cache, throwing 404 for `layout.css`. When CSS dropped, unconstrained testimonial SVGs expanded to full viewport width.
- **Fix**: Cleared `.next` cache, restarted clean server, and locked testimonial avatars in `ClientFeedback.tsx` to fixed `40x40px` with strict inline container guards.

### 10. Claude Arena Prototype Analysis & Creative Expansion
- **Discussion/Request**: User tested a prompt in Claude (viewable at `https://01a07310-cc9b-7fb7-b61a-d29fd0adb190.arena.site/`), liked its storytelling and Midjourney prompt badge, and instructed:
  - Keep the project here safely (*"tumi voi peyo na ami eta emonei niya rakchi, ami ei folder ei baki kaj korbo pera nai"*).
  - Add a dedicated **Blog Page** (`/blog`).
  - Introduce innovative, interesting new features from our own creative thinking.
- **Decisions & Innovations Added to Master Blueprint**:
  1. **Dedicated Blog System (`/blog`)**: Articles on AI prompt engineering, Flux vs Midjourney v6 comparisons, and e-commerce CTR growth.
  2. **Interactive AI Prompt Studio & Terminal (`PromptStudio.tsx`)**: Interactive glass card where clients select lighting, camera, and product to live-compile a Midjourney/Flux prompt with 1-click copy.
  3. **Studio Cost vs. AI Savings Calculator (`CostCalculator.tsx`)**: Interactive slider demonstrating $3,000+ budget and 12-day turnaround savings compared to physical studios.
  4. **200% High-Precision Texture Loupe**: Magnifier lens on Before/After slider to inspect luxury fabric weaves and jewelry caustics.
  5. **Vertical 9:16 UGC Video Ad Player**: Smartphone mockup showcasing realistic AI model video ads.

### 11. WEBRING Feature Ingestion: 1-on-1 Strategy Call & Project Booking Flow
- **Discussion/Request**: User identified the older `WEBRING` project in `Documents/` and instructed to bring over the consultation booking and contact features, plus provide clear guidance on required API keys and email setups.
- **Implementation**:
  1. Built dedicated multi-step booking route: `app/book/page.tsx` and `app/book/BookPageClient.tsx` featuring 4-step glass wizard (Services ➔ Project Scope & Budget ➔ Next 14-Day Calendar & Time Slots in GMT+6 ➔ Contact Details).
  2. Built API route: `app/api/book/route.ts` with Zod validation (`bookingFormSchema`), rate limiting (`CONTACT_LIMIT`), Resend email notifications for Sabbir, and confirmation emails for clients. Added support for optional Google Sheets sync via `GOOGLE_SHEET_URL`.
  3. Integrated Strategy Call invitation cards into `components/sections/Contact.tsx` and dual CTAs into `components/sections/CtaBanner.tsx`.
  4. Verified 100% type safety (`tsc --noEmit` passed with 0 errors).

---

## 6. Coding Standards & Conventions

1. **Server vs. Client Boundary**:
   - Keep page containers (`app/**/page.tsx`) as Server Components for optimal SEO and metadata generation.
   - Restrict `'use client'` strictly to interactive leaf components (animations, scroll listeners, modals, form inputs).
2. **Styling Standards**:
   - Use Tailwind utility classes with CSS variables (`text-ink`, `bg-canvas`, `border-line`).
   - For glassmorphic components, use `.liquid-glass-floating-pill`, `.liquid-glass-card`, or `.btn-neon`.
   - Never use arbitrary unconstrained image sizes; always define explicit aspect ratios or `width`/`height`.
3. **Animation Performance (60-120 FPS Guarantee)**:
   - Always animate GPU-composited properties (`transform`, `opacity`, `scale`). Never animate CPU layout reflow properties (`height`, `max-width`, `margin`, `padding`) in high-frequency scroll loops.
   - Add `transform-gpu` and `will-change-transform` to animated Framer Motion nodes.
4. **Data Management**:
   - All social links, contact emails, and personal metadata MUST be imported from `site.config.ts`.
   - Never hardcode external profile URLs directly inside component markup.

---

- [x] **1-on-1 Visual Strategy Call & Booking System (`/book`, `/contact`, & `/api/book`)**:
  - Full 4-step multi-step interactive booking wizard migrated from WEBRING.
  - Interactive date & time picker, timezone indicator (GMT+6), service tag selection, and Resend confirmation emails.
  - Set as the primary content of the `/contact` route per user requirements.
  - Ultra-clean UI polish: removed all cluttered small grey subtitle descriptions from service cards, headers, and sidebar guarantee boxes, ensuring a sleek, high-contrast, minimalist look.
  - Live condition checks & red alerts: integrated dedicated `EmailInput` (blocks spaces, auto-lowercases, enforces `@` and domain validation with instant red alert borders & icons) and `PhoneInput` (country digit validation with instant warning).
- [x] **WEBRING Direct Contact Interface (`/lets-talk` & `/api/contact`)**:
  - Designed strictly in Sabbir's portfolio signature 3D Liquid Glass & Deep Emerald obsidian theme.
  - Left column: Dynamic cards referencing Sabbir's `siteConfig` (blank/placeholder protected), response expectations (Within 24 hours), Sabbir's verified social media profiles (Instagram, LinkedIn, Facebook, X), and a 1-on-1 strategy call booking shortcut. All Webring company details removed.
  - Right column: Clean liquid glass form with Name, Email (`EmailInput` with live space-stripping and `@` validation), Country Flag `PhoneInput`, Subject, Service dropdown, and Message textarea with `.btn-neon` button `<Send /> SEND MESSAGE`.
  - Live red alert banners and dynamic border states on blur / invalid submission.
  - Ultra-clean aesthetic: zero clutter, zero fluff, zero extraneous comments.
  - Linked directly from the floating liquid glass header's "Let's Talk" CTA buttons and banner CTAs.
- [x] **Vercel Web Analytics Integration (`@vercel/analytics`)**:
  - Added `@vercel/analytics/next` to `app/layout.tsx` for real-time visitor tracking and page view metrics on Vercel deployment.
  - Verified Content Security Policy in `next.config.mjs` allows `https://va.vercel-scripts.com` in `script-src`.
- [x] **Google Analytics 4 (GA4) Integration (`G-GNLM89GWFN`)**:
  - Built dedicated `GoogleAnalytics` component (`components/seo/GoogleAnalytics.tsx`) leveraging Next.js `<Script strategy="afterInteractive" />`.
  - Configured `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-GNLM89GWFN` with seamless fallback so tracking works both locally and on Vercel immediately.
  - Whitelisted Google Analytics origins in `next.config.mjs` CSP (`googletagmanager.com`, `*.google-analytics.com`, `*.analytics.google.com`).
- [ ] **Interactive ROI & Revenue Lift Calculator (`CostCalculator.tsx`)**:
  - Bring over the slider math from WEBRING into a 3D Liquid Glass card calculating revenue lift and ROI percentage.
- [ ] **Dedicated High-End Blog System (`/blog` & `/blog/[slug]`)**:
  - Educational articles on AI prompt engineering, Flux vs Midjourney v6 comparisons, and e-commerce case studies.
- [ ] **Interactive AI Prompt Studio & Terminal (`PromptStudio.tsx`)**:
  - Interactive glass playground with lighting, camera, and product selectors compiling a live Midjourney prompt string with 1-click copy.
- [ ] **200% High-Precision Texture Loupe**:
  - Magnifying inspection glass on Before/After slider for luxury fabric, jewelry, and cosmetic detail inspection.
- [ ] **Vertical 9:16 UGC Video Ad Player**:
  - Interactive smartphone mockup displaying realistic AI model video ads.

---

## 8. Living Memory Protocol for Future Sessions

1. **Always Read Before Modifying**: At the beginning of any session or major task, reference `PROJECT_CONTEXT.md` to ground context.
2. **Explain Before Changing**: Clearly state the purpose, affected files, and architecture before executing code modifications.
3. **Automatic Updates**: When any discussion concludes with a new decision, when a roadmap item is completed, or when a bug fix is introduced, update this file immediately.

---

*This document is the persistent brain of the Sabbir Portfolio codebase.*
