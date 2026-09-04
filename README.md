# MD Tarikuzzaman Sabbir — Portfolio Website

> **AI Product Photographer & Creative Designer**  
> High-performance, production-ready portfolio built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Liquid Glass UI Kit**.

[![Website Status](https://img.shields.io/badge/Status-Live%20Ready-00E676?style=for-the-badge&logo=next.js&logoColor=white)](https://github.com/tarikuzzaman545/Tarikuzzaman-Sabbir-portfulio)
[![License](https://img.shields.io/badge/License-MIT-059669?style=for-the-badge)](LICENSE)

---

## 📖 Overview

This repository powers the personal portfolio and digital storefront of **MD Tarikuzzaman Sabbir**, an **AI Product Photographer, Creative Designer, Prompt Engineer, and Website Designer** based in Khulna, Bangladesh.

The website is engineered to showcase high-conversion AI visual craftsmanship:
- **Factory-to-Studio Transformation**: Turning flat/factory photos of dresses, bags, footwear, cosmetics, and jewelry into high-end studio photography with custom AI models.
- **UGC Character & Ads Video Production**: Realistic AI model reviews and product demo videos for TikTok, Meta Ads, and YouTube Shorts.
- **Commercial Poster & Brand Identity Design**: High-impact advertising creatives for global e-commerce and retail brands.

---

## 🎨 Visual Identity & Design System

The visual language follows the **Liquid Glass UI Kit** aesthetic on a dark obsidian emerald backdrop:

- **Canvas Background**: Deep Emerald Obsidian (`#040D09`, `#081A12`) with atmospheric radial emerald glows (`blur-[140px]`) and film grain overlay.
- **Signature Accent**: Electric Neon Emerald (`#00E676`, `#00F59B`) paired with soft emerald hairlines (`rgba(16, 185, 129, 0.25)`).
- **3D Liquid Glass Refraction (`.liquid-glass-floating-pill`)**:
  - **Top Specular Edge**: `border-top: 1.5px solid rgba(255, 255, 255, 0.55)` for real glass bevel reflections.
  - **Prismatic Dispersion**: Iridescent purple (`rgba(168, 85, 247, 0.25)`) and emerald rim glows underneath the glass.
  - **Frosted Blur**: Multi-layered `backdrop-filter: blur(30px) saturate(190%)`.
  - **3D Elevation**: Deep atmospheric drop shadows (`shadow-[0_24px_50px_rgba(0,0,0,0.95)]`).
- **Typography**: Clean, self-hosted modern sans-serif (**Poppins**) with precision optical kerning.

---

## ⚡ Core Sections & Feature Architecture

### 1. Dynamic Morphing Liquid Glass Header (`components/site/Header.tsx`)
A custom-engineered floating navigation bar inspired by Dynamic Island and Apple UI physics:
- **Initial State (Page Top)**:
  - **Left**: Official 3D Emerald 'S' Ribbon Logo, brand name `TARIKUZZAMAN SABBIR`, and subtitle `AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER`.
  - **Center**: A dedicated, floating **Round Liquid Glass Capsule** (`rounded-full`) exclusively holding the navigation links (`Home`, `About`, `Services`, `Portfolio`, `Contact`).
  - **Right**: The glowing neon `Let's Talk ↗` action button.
- **On Scroll State (Dynamic Morph)**:
  - As the user scrolls down, the central round capsule smoothly widens to absorb the Logo, Name, and "Let's Talk" CTA into **one unified floating liquid glass island**.
  - The tagline `AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER` smoothly slides left into the logo and collapses (`-translate-x-6 opacity-0 max-h-0`).
  - `TARIKUZZAMAN SABBIR` gently enlarges for high legibility.
  - The entire header hovers off the screen edges with zero straight/edge-to-edge navbar borders.
- **Mobile Experience**: Responsive drawer with smooth Framer Motion enter/exit transitions and floating glass pill cards.

### 2. 1:1 Hero Showcase (`components/sections/Hero.tsx`)
- **Natural Photo Integration**: High-resolution cutout of Sabbir smoothly blended directly into the atmospheric scene with ambient backlighting (no bounding box).
- **Floating 3D Glass Badges**:
  - *"Turning Products Into Best Sellers"* featuring an AI Powered Visuals indicator.
  - *"Based in Khulna, Bangladesh"* with emerald map pin.
- **Handwritten Creative Doodles**: Custom SVG doodles (*"Ideas Designs Reality"* and *"Better Visuals Brighter Brands"*).
- **Social Connect Hub**: 5 custom liquid glass social pills (Facebook, Instagram, LinkedIn, X/Twitter, Pinterest).
- **Metric Highlights**: 150+ Projects Completed, 80+ Happy Clients, 3+ Years Experience, 100% Client Satisfaction.
- **Brand Partner Logos**: Velmora Fashion, Lunari Beauty, Kleanic Skincare, NEXA Footwear, Boxigo Packaging, and Fyndra Lifestyle.

### 3. Creative Solutions for Modern Brands (`components/sections/ServicesGrid.tsx`)
- 6 interactive liquid glass service cards:
  1. **AI Fashion & Model Shoot** (`Camera` icon)
  2. **Product Staging & Commercial** (`Sparkles` icon)
  3. **Cosmetics & Luxury Visuals** (`PenTool` icon)
  4. **UGC Character & Ads Video** (`Video` icon)
  5. **Footwear & Accessories** (`User` icon)
  6. **Packaging & Website Graphics** (`Monitor` icon)
- Each card features deliverable checklists, category tags, and glowing hover states.

### 4. Interactive Portfolio & Before/After Slider (`components/portfolio/`)
- Interactive before-and-after slider comparing factory/raw client photos with final AI studio renders.
- Lightbox modal with zoom and high-resolution inspection.
- Filterable case study gallery by category (Fashion, Cosmetics, Footwear, Bags, Ads).

### 5. Client Testimonials, Process, & Contact (`components/sections/`)
- **Process Timeline**: 4-step workflow (Briefing ➔ Prompt Engineering ➔ AI Generation ➔ Studio Retouching).
- **Client Feedback**: Real client reviews and rating cards.
- **Contact & Inquiry System**: Form with honeypot spam protection, CSRF token validation, and Resend email integration.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14** | React Framework (App Router, Server Components & Static Site Generation) |
| **TypeScript** | Type-safe development with strict validation |
| **Tailwind CSS** | Utility-first styling with custom tokens and liquid glass utilities |
| **Framer Motion** | Physics-based animations, layout transitions, and scroll listeners |
| **Lucide React** | Feather-light modern iconography |
| **Zod** | Runtime schema validation for forms and API routes |
| **Resend** | Transactional email delivery for client contact requests |

---

## 📁 Project Directory Structure

```
├── app/
│   ├── api/
│   │   ├── contact/route.ts      # Contact form submission endpoint
│   │   ├── csrf/route.ts         # CSRF security endpoint
│   │   └── newsletter/route.ts   # Newsletter subscription endpoint
│   ├── globals.css               # Design tokens, variables & .liquid-glass-floating-pill styles
│   ├── layout.tsx                # Root layout with self-hosted fonts & metadata
│   ├── page.tsx                  # Home page assembling all primary sections
│   ├── robots.ts & sitemap.ts    # Search engine optimization feeds
│   └── (routes)/                 # /about, /services, /work, /contact pages
├── components/
│   ├── forms/                    # ContactForm, NewsletterForm
│   ├── portfolio/                # BeforeAfter slider, CaseStudy, Lightbox, PortfolioGrid
│   ├── sections/                 # Hero, ServicesGrid, ClientFeedback, Process, CtaBanner
│   └── site/                     # Header (morphing pill), Footer, ThemeProvider
├── data/                         # Local mock datasets for projects, services, stats
├── lib/                          # Utility functions (cn, rate limiting, email delivery)
├── public/
│   ├── fonts/                    # Self-hosted Poppins webfonts
│   ├── img/
│   │   ├── brand/                # logo.png (Emerald 'S' Ribbon)
│   │   ├── hero/                 # sabbir-hero.png
│   │   ├── services/             # Service card thumbnails
│   │   └── work/                 # Portfolio showcase assets
│   └── og.jpg                    # OpenGraph banner
└── site.config.ts                # Centralized site configuration & metadata
```

---

## 📝 Changelog & Fix History

### Version 1.3.0 — Morphing Liquid Glass Header & UI Kit Alignment
- **Dynamic Capsule Morphing**:
  - Replaced static/full-width header bar with a floating liquid glass pill container.
  - At page top: The capsule wraps only `Home, About, Services, Portfolio, Contact`.
  - On scroll: The capsule expands and absorbs the Logo, Name (`TARIKUZZAMAN SABBIR`), and `Let's Talk ↗` button into one unified floating island.
  - Added smooth collapse animation for the tagline into the logo on scroll (`-translate-x-6 opacity-0`).
- **Liquid Glass UI Kit Refraction**:
  - Implemented `.liquid-glass-floating-pill` with glossy top white specular highlight, iridescent chromatic rim glow, and deep 3D elevation shadow.
- **Removal of Straight Navbar**:
  - Eliminated full-width `border-b` navbar to guarantee a permanent floating pill aesthetic matching user design kit specifications.

### Version 1.2.0 — 1:1 Hero Section & Services Grid
- **Hero Section Overhaul**:
  - Extracted Sabbir's photo directly from mockup and blended into the background without box borders.
  - Created floating liquid glass badges ("Turning Products Into Best Sellers" and "Based in Khulna, Bangladesh").
  - Added handwritten doodle SVGs ("Ideas Designs Reality" & "Better Visuals Brighter Brands").
  - Embedded 6 trusted brand partner logos.
- **Creative Solutions for Modern Brands**:
  - Built 6 tall liquid glass service cards matching reference mockup with custom line icons and neon badges.

### Version 1.1.0 — Remote Git Setup & Automation
- Initialized git repository, created `main` branch, and connected to remote repository:
  `https://github.com/tarikuzzaman545/Tarikuzzaman-Sabbir-portfulio.git`
- Automated authentication via GitHub Personal Access Token (classic).

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm or pnpm

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/tarikuzzaman545/Tarikuzzaman-Sabbir-portfulio.git
   cd Tarikuzzaman-Sabbir-portfulio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your keys in `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_key
   CONTACT_TO_EMAIL=your_email@domain.com
   CSRF_SECRET=your_random_secret_string
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the live site.

5. **Create Production Build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📜 Step-by-Step Architecture, Bug Fixes & Changelog (Evolution History)

This section serves as the complete technical source of truth for Sabbir and any future AI agent or developer to trace every iteration, why it was implemented, what issues arose, and how they were resolved.

### Step 1: Liquid Glass UI & Visual Architecture Redesign
- **User Request:** Redesign the entire portfolio to match uploaded 3D emerald glass mockups with organic liquid glass materials.
- **Implementation:** Created `.liquid-glass-floating-pill`, `.liquid-glass-card`, `.btn-neon`, and deep emerald obsidian color tokens in `app/globals.css`. Integrated Sabbir's photo seamlessly with ambient glows.

### Step 2: Live Global Clock Widget (`components/site/GlobalClock.tsx`)
- **User Request:** A live UTC watch in the top right corner showing UTC time, visitor's detected country code & local time, and date with organic breathing motion across the whole site.
- **Evolution & Fixes:**
  - *Iteration 1:* Placed inside `Header.tsx` — Rejected by user as it crowded the navbar. Moved to fixed viewport corner (`fixed top-2.5 right-3 sm:top-3.5 sm:right-6 z-50`).
  - *Iteration 2:* Stacked into 2 vertically aligned pills (`Time` on top, `Date` on bottom) with identical dimensions.
  - *Iteration 3 (Current):* User instructed: *"date ta sorai dau valo dekhai na website e"* — The date was completely removed. Now only the ultra-sleek, compact **Live Time Capsule** (`[ • UTC 16:15 | BD 10:15 PM ]`) floats with a pulsing neon dot and gentle organic breathing.

### Step 3: Background Wallpaper & Parallax Depth (`components/site/ParallaxBackground.tsx`)
- **User Request:** When scrolling, the background image was moving 1:1 with the text, losing depth and feeling flat.
- **Problem:** The background was set as `absolute inset-0 w-full h-full`, locking it to the scroll container. Also, a low-res source image (409x1024) caused pixelation on high-DPI displays.
- **Fix:**
  - Replaced with `ParallaxBackground.tsx` using Framer Motion `useScroll` and `useSpring` (`stiffness: 90, damping: 28`).
  - Background moves at a slower rate (-12% travel) with soft lens blur (`blur-[12px] sm:blur-[14px]`), creating clear 3D separation between background emerald waves and foreground cards.

### Step 4: Kinetic Scroll Text Elongation vs. Full-Page Elastic Wrapper
- **User Request:** A rubber-band stress/stretch feel when scrolling ("rabar er moto feel").
- **Initial Attempt & Issue:** A full-page wrapper (`ElasticScrollWrapper`) intercepted wheel events and scaled the entire DOM tree. This caused heavy browser repaints and noticeable scroll lag ("lac lac dicc website").
- **Resolution:**
  - Deleted `ElasticScrollWrapper.tsx` entirely to restore 100% native 120 FPS hardware scrolling.
  - Created `KineticTextScroll.tsx`: Listens via passive `requestAnimationFrame` and sets `--text-stretch-y`.
  - In `globals.css`, only typography (`h1, h2, h3, .kinetic-text`) subtley elongates vertically (`scaleY: 1.04`) during fast scroll and snaps back via GPU CSS with zero layout shift.

### Step 5: Dynamic Morphing Header Optimization (`components/site/Header.tsx`)
- **User Request:** The dynamic morphing navbar is the *"main attraction"* of the site, but was lagging on scroll, and the *"Let's Talk"* button took too long to slide into the pill.
- **Root Causes of Lag:**
  - `transition-all duration-500` was animating CPU layout properties (`max-width: 1040px` ➔ `896px`, `padding`, `gap`, `max-height`) causing continuous layout reflows.
  - `backdrop-filter: blur(30px)` on the pill forced heavy GPU compositing passes.
  - The right CTA had a long travel distance (140px) over 500ms, making it visibly lag behind the capsule border.
### Step 6: Restoring the Signature 3-Island Morphing Navbar (`components/site/Header.tsx`)
- **User Feedback:** In the intermediate attempt, the header was stuck as a unified capsule even at the page top, and had a pause/hiccup in the middle.
- **Visual Design Restored (Original Signature Attraction from commit `0d26479`):**
  - **At Page Top (`!scrolled`):**
    - **Left Island:** 3D Ribbon Logo + `TARIKUZZAMAN SABBIR` + full subtitle tagline `AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER`.
    - **Center Island:** Dedicated floating **Round Liquid Glass Capsule** (`liquid-glass-floating-pill`) enclosing the navigation links.
    - **Right Island:** Standalone floating `Let's Talk ↗` neon button.
    - **Outer Header:** Completely transparent background.
  - **On Scroll (`scrolled`):**
    - Outer container seamlessly morphs into the unified liquid glass capsule (`max-w-4xl`).
    - The tagline cleanly slides left into the logo and collapses.
    - Center nav pill background dissolves seamlessly into the master capsule.
    - "Let's Talk" sits cleanly inside the right edge of the master capsule.
- **Optimization (Zero Pause & Zero Lag):**
  - Replaced the sluggish 500ms transition with a snappy, continuous **300ms ease-out** transition.
  - Promoted the layer to GPU (`transform-gpu`) with `requestAnimationFrame` scroll detection.
### Step 7: Eliminating Transient 4-Corner Box Artifact during Morph (`components/site/Header.tsx`)
- **User Feedback:** *"jokhon sob gula ak sathe round box er vitor duche , age akta littme time er jonno char kona alta box dekha jacce... bug ta fix koro , ar onno kicchu jeno change korba na"*
- **Root Cause:**
  - `rounded-full` (`border-radius: 9999px`) was conditionally applied only when `scrolled === true`.
  - When `scrolled` was false, the outer container had no border radius (`0px` rectangle).
  - During the transition from unscrolled to scrolled, the container was interpolating its border radius from a 4-cornered sharp box (`0px`) to round (`9999px`), causing a faint rectangular box outline to momentarily flash before rounding out.
- **Resolution:**
  - Moved `rounded-full` permanently into the base container class (`w-full rounded-full transform-gpu`).
  - The container is now 100% round (`border-radius: 9999px`) at all times. When the liquid glass background fades in, it is already perfectly round from millisecond zero with zero 4-corner box artifacts!
### Step 8: Fixing Fast-Scroll Detection & Accelerating Morph Speed (`components/site/Header.tsx`)
- **User Feedback:** *"ami jokhon fast scrool korchi ami website er niche chole aschi tau oi gla sob ak sathe hoite parche na"* — When fast-scrolling to the bottom of the page, the header was not morphing or was lagging behind.
- **Root Cause:**
  - The scroll handler had a `requestAnimationFrame` gate (`if (!ticking) { rAF(...) }`). During high-velocity inertial scrolling on Mac trackpads or fast wheels, the browser prioritizes compositor scrolling over `rAF` callbacks, delaying or queuing them. Consequently, by the time the user flicked to the bottom, the `rAF` callback hadn't fired yet!
  - Additionally, a 300ms transition was too slow for a 100ms high-speed flick scroll.
- **Resolution:**
  - Removed `rAF` gating from the threshold check. The scroll listener now directly evaluates `window.scrollY > 15` on immediate scroll events, updating state instantaneously without frame dropping (`setScrolled(prev => prev !== isScrolled ? isScrolled : prev)`).
  - Reduced morph transition duration from 300ms to a razor-sharp **200ms ease-out**.
### Step 9: Living Ambient Wave Motion in Parallax Background (`components/site/ParallaxBackground.tsx`)
- **User Feedback:** *"baground ta piche , hlka hlka norbe mane motion e thakbe emon akta kicu koro"* — The background was static when not scrolling; it should have subtle, continuous living ambient wave motion.
- **Resolution:**
  - Architected a dual-layer motion pipeline in `ParallaxBackground.tsx`:
    1. **Outer Layer:** Handled by Framer Motion `useScroll` + `useSpring`, gliding vertically (-12% travel) with spring inertia during user scroll.
    2. **Inner Layer:** Executes a continuous 14-second organic undulating wave loop (`animate={{ y: [0, -10, 4, -6, 0], x: [0, 7, -5, 4, 0], scale: [1.04, 1.07, 1.05, 1.075, 1.04] }}`) with `repeat: Infinity, ease: 'easeInOut'`.
  - Runs 100% on the GPU with `transform-gpu` and soft lens blur (`blur-[12px] sm:blur-[14px]`).
  - Result: When idle or reading, the background 3D emerald liquid waves gently drift and breathe with living energy; when scrolling, it glides with 3D parallax depth.

---

## 🚢 Deployment to Vercel

1. Push latest changes to the `main` branch on GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Select `Tarikuzzaman-Sabbir-portfulio`.
4. Configure environment variables (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CSRF_SECRET`).
5. Click **Deploy**. Vercel will build and assign an SSL-secured production URL.

---

## 👤 Author

**MD Tarikuzzaman Sabbir**
- **Role**: AI Product Photographer & Creative Designer
- **Location**: Khulna, Bangladesh
- **GitHub**: [@tarikuzzaman545](https://github.com/tarikuzzaman545)
- **Repository**: [Tarikuzzaman-Sabbir-portfulio](https://github.com/tarikuzzaman545/Tarikuzzaman-Sabbir-portfulio)

---

*Crafted with precision for high-converting visual brands.*

