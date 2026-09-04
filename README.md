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
