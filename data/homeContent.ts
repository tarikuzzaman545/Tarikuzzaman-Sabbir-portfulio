/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOMEPAGE CONTENT & ASSET REGISTRY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Edit anything in this file to update the homepage visuals, titles,
 *  images, brand logos, stats, and testimonials without touching UI components!
 */

export interface HomeService {
  id: string;
  title: string;
  description: string;
  image: string;
  tag?: string;
  href: string;
}

export interface HomeProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  href: string;
}

export interface HomeBrand {
  name: string;
  logo: string;
}

export interface HomeStat {
  value: string;
  label: string;
}

export interface HomeProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface HomeFeature {
  title: string;
  description: string;
  icon: string;
}

export interface HomeTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
}

export const homeContent = {
  /* ── Brand Identity & Official Logo ────────────────────────────────────── */
  brand: {
    name: 'TARIKUZZAMAN SABBIR',
    title: 'AI PRODUCT PHOTOGRAPHER & CREATIVE DESIGNER',
    tagline: 'VISUALS THAT SELL',
    logo: '/img/brand/logo.png',
    logoIcon: '/img/brand/logo-icon.png',
    brandGuide: '/img/brand/brand-identity.jpg',
    motto: ['IDEAS', 'DESIGNS', 'REALITY'],
  },

  /* ── 1. Hero ────────────────────────────────────────────────────────────── */
  hero: {
    badge: 'AI Visuals for Modern Brands',
    titleStart: 'Product Photography',
    titleHighlight: 'Reimagined.',
    doodleTop: 'Ideas\nDesigns\nReality',
    description:
      "I'm Tarikuzzaman Sabbir, an AI product photographer and creative designer. I help brands create stunning product visuals, model shoots, ads and marketing content that look premium and drive real results.",
    // Sabbir's photo located in public/img/hero/sabbir.jpg
    image: '/img/hero/sabbir.jpg',
    ctaPrimary: { label: 'Start a Project', href: '/contact' },
    ctaSecondary: { label: 'Watch Showreel', href: '#services' },
    socials: [
      { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
      { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
      { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
      { name: 'X', href: 'https://x.com', icon: 'x' },
      { name: 'Pinterest', href: 'https://pinterest.com', icon: 'pinterest' },
    ],
    connectLabel: 'Let’s Connect Everywhere',
    cardTopRight: {
      title: 'Turning Products Into Best Sellers',
      tag: 'Visuals That Sell',
    },
    cardBottomRight: {
      title: 'Based in Khulna, Bangladesh',
    },
    stats: [
      { value: '150+', label: 'Projects Completed' },
      { value: '80+', label: 'Happy Clients' },
      { value: '3+', label: 'Years Experience' },
      { value: '100%', label: 'Client Satisfaction' },
    ],
    brands: [
      { name: 'Velmora Fashion', logo: '/img/brands/velmora.svg' },
      { name: 'Lunari Beauty', logo: '/img/brands/lunari.svg' },
      { name: 'Kleanic Skincare', logo: '/img/brands/kleanic.svg' },
      { name: 'NEXA Footwear', logo: '/img/brands/nexa.svg' },
      { name: 'Boxigo Packaging', logo: '/img/brands/boxigo.svg' },
      { name: 'Fyndra Lifestyle', logo: '/img/brands/fyndra.svg' },
    ],
    footerTagline: 'CREATE VISUALS THAT SELL',
  },

  /* ── 2. What I Do / Services (8 Grid Cards) ─────────────────────────────── */
  servicesSection: {
    badge: 'WHAT I DO',
    title: 'Creative Solutions for Modern Brands.',
    subtitle:
      'From studio-style product photos to engaging UGC videos, I provide end-to-end visual solutions to help your brand grow in the digital world.',
    cta: { label: 'View All Services', href: '/services' },
    services: [
      {
        id: 'product-photo',
        title: 'AI Product Photography',
        description: 'Studio-quality product images using AI without expensive gear.',
        image: '/img/services/01-ai-product-photography.svg',
        tag: 'Studio Grade',
        href: '/services',
      },
      {
        id: 'model-photo',
        title: 'AI Model Photography',
        description: 'Use your custom model or mine for perfect, consistent brand shots.',
        image: '/img/services/02-ai-model-photography.svg',
        tag: 'Custom Model',
        href: '/services',
      },
      {
        id: 'ugc-ads',
        title: 'UGC & Ads Video',
        description: 'Scroll-stopping UGC videos and high-converting ad creatives.',
        image: '/img/services/03-ugc-ads-video.svg',
        tag: 'Motion Ads',
        href: '/services',
      },
      {
        id: 'poster-design',
        title: 'Poster & Social Media Design',
        description: 'Creative posters for ads, social campaigns and branding.',
        image: '/img/services/04-poster-design.svg',
        tag: 'Campaign Art',
        href: '/services',
      },
      {
        id: 'website-design',
        title: 'Website Design',
        description: 'Modern, responsive, high-converting websites for businesses.',
        image: '/img/services/05-website-design.svg',
        tag: 'Next.js Build',
        href: '/services',
      },
      {
        id: 'prompt-engineering',
        title: 'Prompt Engineering',
        description: 'Custom AI prompts and pipelines for scalable, consistent results.',
        image: '/img/services/06-prompt-engineering.svg',
        tag: 'AI Pipelines',
        href: '/services',
      },
      {
        id: 'brand-content',
        title: 'Brand Content Creation',
        description: 'Visual content that builds brand identity and sells products.',
        image: '/img/services/07-brand-content.svg',
        tag: 'E-commerce',
        href: '/services',
      },
      {
        id: 'consultation',
        title: 'Consultation & Support',
        description: 'Need guidance? Let’s talk about your creative vision and roadmap.',
        image: '/img/services/08-consultation.svg',
        tag: 'Strategy',
        href: '/contact',
      },
    ],
  },

  /* ── 3. Featured Work (Real Products. Real Results.) ────────────────────── */
  featuredWorkSection: {
    badge: 'FEATURED WORK',
    title: 'Real Products. Real Results.',
    subtitle:
      'A selection of my recent work with e-commerce brands, fashion labels, beauty products and more.',
    cta: { label: 'View All Projects', href: '/work' },
    categories: ['All', 'Fashion', 'Shoes', 'Bags', 'Cosmetics', 'UGC Videos', 'Posters', 'Web Design'],
    projects: [
      {
        id: 'fashion-hoodie',
        title: 'Fashion Brand',
        subtitle: 'AI Product + Model Shoot',
        category: 'Fashion',
        image: '/img/featured-work/01-fashion-hoodie.svg',
        href: '/work/kain-dress-catalog',
      },
      {
        id: 'footwear-sneaker',
        title: 'Footwear Brand',
        subtitle: 'Product Photography',
        category: 'Shoes',
        image: '/img/featured-work/02-footwear-sneaker.svg',
        href: '/work/zannza-catalog-sprint',
      },
      {
        id: 'accessories-bag',
        title: 'Accessories Brand',
        subtitle: 'Bags & Lifestyle',
        category: 'Bags',
        image: '/img/featured-work/03-accessories-bag.svg',
        href: '/work/luccha-swimwear',
      },
      {
        id: 'beauty-brand',
        title: 'Beauty Brand',
        subtitle: 'Cosmetic Visuals',
        category: 'Cosmetics',
        image: '/img/featured-work/04-beauty-skincare.svg',
        href: '/work/bulk-image-cleanup',
      },
      {
        id: 'fragrance-brand',
        title: 'Fragrance Brand',
        subtitle: 'Product Photography',
        category: 'Cosmetics',
        image: '/img/featured-work/05-fragrance-perfume.svg',
        href: '/work/kain-dress-catalog',
      },
    ],
  },

  /* ── 4. Why Brands Work With Me ─────────────────────────────────────────── */
  whyChooseMeSection: {
    badge: 'WHY BRANDS WORK WITH ME',
    title: 'More Than Just Images. A Partner in Your Growth.',
    subtitle:
      'I don’t just create visuals, I help you turn your products into stories that sell. Every project is focused on quality, consistency and real results.',
    doodle: "Let's Create\nSomething\nGreat! ✦",
    features: [
      {
        title: 'Tailored for Your Brand',
        description: 'Custom visuals that match your style, lighting, and audience perfectly.',
        icon: 'palette',
      },
      {
        title: 'Fast & Reliable Delivery',
        description: 'On-time delivery without compromising an ounce of visual quality.',
        icon: 'zap',
      },
      {
        title: 'Creative & Strategic',
        description: 'Not just pretty pictures — visuals engineered to convert and sell.',
        icon: 'target',
      },
      {
        title: 'Long-Term Support',
        description: 'I’m with you even after the project is complete for revisions & updates.',
        icon: 'shieldCheck',
      },
    ],
  },

  /* ── 5. My Process ──────────────────────────────────────────────────────── */
  processSection: {
    badge: 'MY PROCESS',
    title: 'Simple. Clear. Effective.',
    subtitle: 'A smooth and transparent process to make sure you get the best results, every time.',
    steps: [
      {
        step: '01',
        title: 'Discuss',
        description: 'Share your ideas, reference photos, and target storefront requirements.',
      },
      {
        step: '02',
        title: 'Plan',
        description: 'I suggest the best approach, locked model, angles, and pipeline for your needs.',
      },
      {
        step: '03',
        title: 'Create',
        description: 'Design and generate high-quality AI visuals, lighting, and ad edits.',
      },
      {
        step: '04',
        title: 'Deliver',
        description: 'On-time delivery with upload-ready naming and fast scoped revisions.',
      },
    ],
  },

  /* ── 6. Client Feedback ─────────────────────────────────────────────────── */
  testimonialsSection: {
    badge: 'CLIENT FEEDBACK',
    title: 'What Clients Say',
    cta: { label: 'Read More Reviews', href: '/about' },
    testimonials: [
      {
        id: 'james',
        quote: 'Amazing work! The product images look so real and premium. Highly recommended for any brand!',
        author: 'James Carter',
        role: 'E-commerce Brand Owner',
        rating: 5,
        avatar: '/img/testimonials/james-carter.svg',
      },
      {
        id: 'sophia',
        quote: 'Sabbir delivered exactly what I needed. The UGC video ad was perfect for my Meta and TikTok campaign.',
        author: 'Sophia Lee',
        role: 'Marketing Manager',
        rating: 5,
        avatar: '/img/testimonials/sophia-lee.svg',
      },
      {
        id: 'daniel',
        quote: 'Professional, creative and super fast. His AI model shoots elevated our storefront completely.',
        author: 'Daniel Kim',
        role: 'Startup Founder',
        rating: 5,
        avatar: '/img/testimonials/daniel-kim.svg',
      },
    ],
  },

  /* ── 7. Ready to Create Something Amazing? (CTA Banner) ─────────────────── */
  ctaBanner: {
    title: 'Ready to Create Something Amazing?',
    subtitle: 'Let’s bring your ideas to life with stunning visuals and creative design.',
    button: { label: 'Start a Project', href: '/contact' },
    doodle: 'Your Vision\nMy Creativity ✦',
    avatars: [
      '/img/cta/james-carter.svg',
      '/img/cta/sophia-lee.svg',
      '/img/cta/daniel-kim.svg',
    ],
  },
} as const;
