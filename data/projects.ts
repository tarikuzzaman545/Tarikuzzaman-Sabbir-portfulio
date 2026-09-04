/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CASE STUDIES — real client work
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  SWAPPING IN YOUR REAL IMAGES
 *  ────────────────────────────
 *  Every `src` below points at a file in `public/work/`. The repo ships with
 *  generated placeholder frames at the correct aspect ratios so the layout is
 *  never broken and next/image has real rasters to optimise.
 *
 *  To use your real images:
 *    1. Drop them in `public/work/` using the same filenames, OR
 *    2. Change the `src` string here to whatever you named them.
 *
 *  Keep `width`/`height` accurate to the real file — next/image uses them to
 *  reserve space before the image loads. Wrong numbers mean layout shift.
 *
 *  Aspect ratios used:
 *    cover (grid card) ......... 4:5   → 1200 × 1500
 *    gallery (lightbox) ........ 4:5   → 1200 × 1500
 *    comparison (before/after) . 4:5   → 1200 × 1500  (both frames must match)
 *    video poster .............. 16:9  → 1280 ×  720
 *
 *  A NOTE ON NUMBERS
 *  ─────────────────
 *  The metrics below are drawn from the actual contracts. If a number changes,
 *  change it here — nothing else references these values.
 */

import type { Project } from '@/lib/content/types';

export const projects: Project[] = [
  /* ── 1. Kain — the flagship volume contract ──────────────────────────── */
  {
    slug: 'kain-dress-catalog',
    title: 'A six-angle dress catalog, built without a studio',
    client: 'Kain',
    category: 'fashion',
    year: '2026',
    featured: true,
    summary:
      'Six consistent catalog angles per dress, per colorway — across 15+ storefronts and 1,500+ products.',
    cover: {
      src: '/work/kain-cover.jpg',
      alt: 'AI-generated fashion model wearing a draped halter maxi dress, photographed straight-on against a pure white catalog background',
      width: 1200,
      height: 1500,
    },
    gallery: [
      {
        src: '/work/kain-01-front-full.jpg',
        alt: 'Full-body front view of a lemon-yellow halter maxi dress on a model against a white background',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/kain-02-front-cropped.jpg',
        alt: 'Waist-up crop showing the deep-V bodice construction of the same dress',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/kain-03-45-angle.jpg',
        alt: 'Three-quarter turn view of the dress with the model’s hand at her hip, showing how the skirt falls',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/kain-04-side-profile.jpg',
        alt: 'Ninety-degree side profile of the dress showing the silhouette and hem length',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/kain-05-back-view.jpg',
        alt: 'Full back view showing the lace-up tie detail across the open back',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/kain-06-closeup.jpg',
        alt: 'Cropped detail shot of the bodice and waist drape, showing fabric texture',
        width: 1200,
        height: 1500,
      },
    ],
    challenge:
      'Kain runs more than fifteen storefronts with a combined catalog north of fifteen hundred products, and most of them launch with a single supplier photo — often a flat-lay or a phone shot on a hanger. Booking a studio, a model and a stylist for that volume is not a budget problem so much as a calendar problem: at ten products a day it is half a year of shoot days before a single new arrival gets photographed. The requirement was six specific angles per garment, and every colorway needed its own complete set, which meant a two-colour product was twelve frames, not six.',
    approach:
      'I built a fixed six-shot prompt system in Higgsfield — front full, cropped front, forty-five degree turn, side profile, back view and a bodice close-up — where the model, the lighting and the pure white background are locked and only the garment changes. The hard part was never generating one good image; it was generating six that look like the same shoot. Face and body consistency across a rotating pose is where most pipelines fall apart, so the prompt carries an explicit angle instruction alongside a locked reference, and hands and limbs are constrained so nothing gets cropped or invented. Delivery is a flat folder with prefixed filenames — StyleName_Color_NN_ShotName — because per-colour subfolders stop scaling somewhere around the two-hundredth product. Any shot that fails three attempts gets flagged and skipped rather than burning credits on a garment the model refuses to read correctly.',
    outcome:
      'Kain now sends a product link and gets a complete, named, upload-ready set back. The pipeline runs at forty cents a product against a studio day rate, and turnaround is measured in hours instead of shoot slots. It has become the recurring backbone of my client work, and the naming convention has held unchanged across every batch since — which matters more than it sounds, because it means their team can automate the upload side too.',
    metrics: [
      { value: '1,500+', label: 'Products in scope', note: 'Across 15+ storefronts' },
      { value: '6', label: 'Angles per colorway' },
      { value: '$0.40', label: 'Cost per product', note: 'Client funds generation credits' },
      { value: '3', label: 'Max attempts per shot', note: 'Then flagged, not forced' },
    ],
    tools: ['Higgsfield', 'Nano Banana Pro', 'Prompt system design', 'Batch file pipeline'],
    comparison: {
      before: {
        src: '/work/kain-before.jpg',
        alt: 'Original supplier photograph: the dress on a hanger against a cluttered background, uneven lighting',
        width: 1200,
        height: 1500,
      },
      after: {
        src: '/work/kain-after.jpg',
        alt: 'Final catalog frame: the same dress on a model, evenly lit against a pure white background',
        width: 1200,
        height: 1500,
      },
      caption: 'Supplier hanger shot in, catalog-ready model frame out — same garment, same construction.',
    },
  },

  /* ── 2. Luccha — the hard-mode structural work ───────────────────────── */
  {
    slug: 'luccha-swimwear',
    title: 'Swimwear, where the garment has nowhere to hide',
    client: 'Luccha',
    category: 'fashion',
    year: '2026',
    featured: true,
    summary:
      'A six-shot swimwear system with back-view hair overrides and skin-tone locking, because straps are unforgiving.',
    cover: {
      src: '/work/luccha-cover.jpg',
      alt: 'AI-generated model in a one-piece swimsuit, front hero view against a light grey background',
      width: 1200,
      height: 1500,
    },
    gallery: [
      {
        src: '/work/luccha-01-hero-front.jpg',
        alt: 'Hero front view of a one-piece swimsuit showing the neckline and strap placement',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/luccha-02-back-view.jpg',
        alt: 'Full back view with the model’s hair swept forward so the back strap construction stays visible',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/luccha-03-front-45.jpg',
        alt: 'Forty-five degree front angle showing the side cutout of the swimsuit',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/luccha-04-side-90.jpg',
        alt: 'Ninety-degree side profile showing the leg line and side seam',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/luccha-05-back-135.jpg',
        alt: 'One-hundred-thirty-five degree rear angle showing how the back strap meets the hip',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/luccha-06-closeup.jpg',
        alt: 'Close detail of the swimsuit fabric texture and strap hardware',
        width: 1200,
        height: 1500,
      },
    ],
    challenge:
      'Swimwear exposes both more body and more garment structure than a dress does, and that combination is where generated imagery gets caught out. Straps get hallucinated. Cutouts close themselves. Hair drapes over exactly the back construction the customer is trying to look at before buying. And because a set moves through five body angles, skin tone drifts frame to frame in a way that reads immediately as fake once the images sit next to each other on a product page.',
    approach:
      'This client runs a completely separate six-shot convention from my dress work — hero front, back view, front forty-five, side ninety, back one-thirty-five, and a detail close-up — on a light grey background rather than white, so the two pipelines never get blended by accident. Three prompt-level fixes carry the set. Hair placement is explicitly overridden on the back views so it is swept forward and cannot occlude the strap construction. Skin tone is locked with unification language applied identically across all six frames. And the garment itself is described structurally rather than descriptively, so the model replicates the actual strap and cutout geometry instead of improvising something that merely looks like swimwear.',
    outcome:
      'Rejections dropped to the point where the set is usually approved as delivered. The structural language turned out to be the load-bearing piece — once the garment is described as construction rather than as a look, the model stops inventing hardware. That approach has since fed back into how I write prompts for every apparel client.',
    metrics: [
      { value: '6', label: 'Shots per product' },
      { value: '#F2F2F2', label: 'Locked background', note: 'Consistent across every set' },
      { value: '3', label: 'Prompt-level fixes', note: 'Hair, skin tone, structure' },
    ],
    tools: ['Higgsfield', 'Prompt engineering', 'Reference locking', 'Colour management'],
    comparison: {
      before: {
        src: '/work/luccha-before.jpg',
        alt: 'Early generation attempt where the model’s hair covers the swimsuit’s back strap detail',
        width: 1200,
        height: 1500,
      },
      after: {
        src: '/work/luccha-after.jpg',
        alt: 'Corrected frame with hair swept forward, back strap construction fully visible',
        width: 1200,
        height: 1500,
      },
      caption: 'Same prompt, plus a hair-placement override. The back construction is the whole point of the shot.',
    },
  },

  /* ── 3. Zannza — the Upwork delivery-at-deadline contract ─────────────── */
  {
    slug: 'zannza-catalog-sprint',
    title: '300 images, 100 products, two weeks',
    client: 'Zannza',
    category: 'product',
    year: '2026',
    featured: true,
    summary:
      'An Upwork contract delivered on a fixed deadline with a client approval gate before anything went live.',
    cover: {
      src: '/work/zannza-cover.jpg',
      alt: 'Grid of AI-generated fashion product images arranged as a catalog contact sheet',
      width: 1200,
      height: 1500,
    },
    gallery: [
      {
        src: '/work/zannza-01.jpg',
        alt: 'Product image one of four for a single Zannza catalog item, front view on model',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/zannza-02.jpg',
        alt: 'Product image two of four, angled view of the same garment',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/zannza-03.jpg',
        alt: 'Product image three of four, alternate pose of the same garment',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/zannza-04-detail.jpg',
        alt: 'Cropped detail shot showing fabric and trim, the fourth upload for the product folder',
        width: 1200,
        height: 1500,
      },
    ],
    challenge:
      'A hundred product folders, three generated images plus one cropped detail shot in each, three hundred files total, at a fixed 1100 by 900 pixel output — inside a two-week window. The constraint that shaped the whole job was the approval gate: nothing could be uploaded until the client had signed off, so a batch-then-review workflow would have stacked all the risk at the end, with no time left to fix anything the client did not like.',
    approach:
      'I front-loaded the approval instead. A small representative sample went out first to settle the model, the framing and the crop convention, so the remaining ninety-odd products ran against a spec the client had already agreed to. From there it was folder-by-folder batch generation with the output size fixed at the target dimensions rather than resized afterward, which kept the crop consistent and avoided a second pass over three hundred files. Every folder was checked against the same four-upload structure before it was marked done, so the deliverable was auditable rather than something I had to trust myself on.',
    outcome:
      'Delivered inside the two-week window with the approval gate respected throughout. The useful lesson was structural: on a fixed-deadline contract, spend the first day buying certainty about the spec. It costs a day and it removes the failure mode where you discover on day twelve that the client wanted tighter crops.',
    metrics: [
      { value: '300', label: 'Images delivered' },
      { value: '100', label: 'Product folders' },
      { value: '1100×900', label: 'Fixed output size' },
      { value: '2 weeks', label: 'Deadline', note: 'Met, with approval gate' },
    ],
    tools: ['Higgsfield', 'Batch pipeline', 'Contact-sheet QA', 'Upwork delivery'],
  },

  /* ── 4. Ad video ─────────────────────────────────────────────────────── */
  {
    slug: 'webring-ad-creative',
    title: 'Ad creative that never needed a shoot day',
    client: 'WEBRING',
    category: 'video',
    year: '2026',
    featured: false,
    summary:
      'Short-form product video and UGC-style ad creative generated end-to-end for e-commerce clients.',
    cover: {
      src: '/work/video-cover.jpg',
      alt: 'Still frame from a generated short-form product advertisement showing a product on a lit surface',
      width: 1200,
      height: 1500,
    },
    gallery: [
      {
        src: '/work/video-frame-01.jpg',
        alt: 'Opening frame of the ad: product centred with a slow push-in camera move',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/video-frame-02.jpg',
        alt: 'Mid-sequence frame showing the product in a lifestyle context',
        width: 1200,
        height: 1500,
      },
    ],
    challenge:
      'Small e-commerce brands need motion creative for paid social, but a video shoot is an order of magnitude more expensive than stills and the assets burn out in a fortnight of ad rotation. The economics only work if you can produce variants cheaply enough to keep testing.',
    approach:
      'Generated short-form video built from the same locked-reference discipline as the stills work, so the product reads identically frame to frame instead of morphing mid-shot. Camera moves are kept deliberately simple — a push-in, a slow orbit — because ambitious motion is where generated video reveals itself. Multiple hooks are cut from one generation run, which is what makes creative testing affordable.',
    outcome:
      'Brands get a set of motion variants for roughly what a single still shoot would cost, which changes ad testing from a budget decision into a routine one.',
    metrics: [
      { value: '9:16', label: 'Native aspect', note: 'Built for paid social' },
      { value: 'Multi-hook', label: 'Variants per run' },
    ],
    tools: ['Higgsfield', 'Video prompt design', 'Reference locking', 'Edit + sound'],
    video: {
      provider: 'youtube',
      // Replace with your real video id. Until then the poster renders and the
      // play button links out rather than embedding a wrong video.
      id: 'FILL_ME',
      title: 'WEBRING product ad — generated creative reel',
      poster: {
        src: '/work/video-poster.jpg',
        alt: 'Video poster frame for the generated product advertisement reel',
        width: 1280,
        height: 720,
      },
    },
  },

  /* ── 5. Web build ────────────────────────────────────────────────────── */
  {
    slug: 'sageroots-website',
    title: 'A consultancy site, shipped fast without looking rushed',
    client: 'Sageroots',
    category: 'web',
    year: '2026',
    featured: false,
    summary:
      'A UK education consultancy website built on Next.js with a full CMS schema so the team edits content themselves.',
    cover: {
      src: '/work/sageroots-cover.jpg',
      alt: 'Desktop and mobile mockup of the Sageroots education consultancy website in a deep green palette',
      width: 1200,
      height: 1500,
    },
    gallery: [
      {
        src: '/work/sageroots-01.jpg',
        alt: 'Homepage hero section of the Sageroots site with headline and enquiry call to action',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/sageroots-02.jpg',
        alt: 'Services listing page showing the consultancy’s programme cards',
        width: 1200,
        height: 1500,
      },
    ],
    challenge:
      'An education consultancy needed a credible web presence quickly, and — more importantly — needed to keep it current afterwards without paying a developer every time a programme or an intake date changed.',
    approach:
      'Next.js front end on a deliberately restrained deep-green palette, with a complete CMS schema behind it covering services, programmes, testimonials and pages. The build decision that mattered was modelling the content properly up front rather than hardcoding copy into components — that is the difference between a site the client owns and a site they have to call someone about.',
    outcome:
      'The team publishes their own updates. No developer in the loop for routine content changes, which is the only version of a handoff that actually holds.',
    metrics: [
      { value: 'Next.js', label: 'Framework' },
      { value: 'Full CMS', label: 'Content model', note: 'Client-editable end to end' },
    ],
    tools: ['Next.js', 'Sanity', 'Tailwind CSS', 'Vercel'],
  },

  /* ── 6. Volume retouch ───────────────────────────────────────────────── */
  {
    slug: 'bulk-image-cleanup',
    title: 'Three thousand images, one consistent standard',
    client: 'Kaylas Collectives',
    category: 'product',
    year: '2026',
    featured: false,
    summary:
      'High-volume image correction and standardisation across a trading group’s product catalog.',
    cover: {
      src: '/work/bulk-cover.jpg',
      alt: 'Before and after comparison grid of product images corrected for background, exposure and crop',
      width: 1200,
      height: 1500,
    },
    gallery: [
      {
        src: '/work/bulk-01.jpg',
        alt: 'Product image after background replacement and exposure correction',
        width: 1200,
        height: 1500,
      },
      {
        src: '/work/bulk-02.jpg',
        alt: 'Product image after crop standardisation to a uniform catalog frame',
        width: 1200,
        height: 1500,
      },
    ],
    challenge:
      'A catalog assembled from dozens of sources looks like it — mismatched backgrounds, inconsistent exposure, crops that vary product to product. At three thousand images, fixing it by hand one file at a time is not a plan.',
    approach:
      'Established one target standard first — background, exposure, crop frame — then worked in batches against it with a visual check pass at the end of each batch rather than at the end of the job. Errors caught inside a batch cost minutes; errors caught at the end cost the whole run.',
    outcome:
      'A catalog that reads as one coherent set, and a documented standard the client can hand to whoever handles the next three thousand.',
    metrics: [
      { value: '3,000+', label: 'Images processed' },
      { value: '1', label: 'Standard applied', note: 'Documented and handed over' },
    ],
    tools: ['Batch processing', 'AI upscaling', 'Colour correction', 'QA contact sheets'],
    comparison: {
      before: {
        src: '/work/bulk-before.jpg',
        alt: 'Original catalog image with an uneven background and a dark, flat exposure',
        width: 1200,
        height: 1500,
      },
      after: {
        src: '/work/bulk-after.jpg',
        alt: 'Corrected image with a clean uniform background and balanced exposure',
        width: 1200,
        height: 1500,
      },
      caption: 'Same source file, brought onto the catalog standard.',
    },
  },
];
