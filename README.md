# MD Tarikuzzaman Sabbir — Portfolio Website

Production-ready portfolio for **MD Tarikuzzaman Sabbir** — AI Product Photographer, Prompt Engineer, and Co-founder of WEBRING.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Sanity CMS** (with local fallback).

---

## 🚀 Quick Start (Running Locally)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Start:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🎨 Design System & Highlights
- **Palette**: Warm cream (`#FAFAF8`) with gold accent (`#C8A96E`) and deep charcoal dark mode (`#141412`).
- **Typography**: Local self-hosted Lora (display serif) & Poppins (body sans).
- **Dark Mode**: Managed with `next-themes` with deliberate styling (not just CSS invert).
- **Animations**: Subtle, accessible Framer Motion scroll reveals respecting `prefers-reduced-motion`.

---

## 📂 Project Architecture

```
├── app/
│   ├── api/
│   │   ├── contact/route.ts      # Contact form submission with Resend
│   │   ├── csrf/route.ts         # CSRF token generator & verifier
│   │   └── newsletter/route.ts   # Newsletter signup
│   ├── globals.css               # Design tokens, variables & base styles
│   ├── layout.tsx                # Root layout with fonts, SEO & theme provider
│   ├── page.tsx                  # Single-page portfolio with 9 core sections
│   ├── robots.ts & sitemap.ts    # Dynamic SEO crawlers
├── components/
│   ├── forms/                    # Contact & Newsletter forms (with honeypot & validation)
│   ├── portfolio/                # Before/After slider, Lightbox modal, Category filter
│   ├── sections/                 # Hero, About, Services, Work, Process, Testimonials, Stack, Contact
│   ├── site/                     # Header, Footer, ThemeToggle
│   └── ui/                       # Icon, Reveal animations
├── data/                         # Local fallback data (projects, services, process, tools)
├── lib/                          # Content adapter, CSRF, rate-limiting, email, validation
├── public/                       # Local fonts, work case study images, icons, OG image
├── sanity/                       # Sanity v3 schemas, GROQ queries, and client setup
└── site.config.ts                # Single source of truth for bio, links & contact details
```

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import this repository.
4. Add the following Environment Variables in Vercel Settings:
   - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
   - `CSRF_SECRET` = `[generate with: openssl rand -base64 32]`
   - `RESEND_API_KEY` = `re_...` (from Resend.com)
   - `CONTACT_TO_EMAIL` = `your_email@domain.com`
5. Click **Deploy**. Done!
