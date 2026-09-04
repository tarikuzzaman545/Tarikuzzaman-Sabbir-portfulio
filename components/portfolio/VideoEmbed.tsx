'use client';

/**
 * Click-to-load video embed.
 *
 * WHY THE IFRAME DOES NOT MOUNT ON PAGE LOAD
 * ──────────────────────────────────────────
 * A YouTube iframe costs roughly 500KB–1MB of JavaScript and a dozen requests to
 * third-party origins, all before anyone has decided to press play. On a mobile
 * connection that is the difference between a 90+ Lighthouse score and a 60.
 *
 * So the default state is a poster image with a play button — a static Next.js
 * image, already optimised — and the iframe is only created when the user
 * actually activates it. This is the "facade" pattern, and it is the single
 * largest performance win available on any page with an embed.
 *
 * WHY THE URL IS BUILT BY A HELPER
 * ────────────────────────────────
 * `videoEmbedUrl()` in lib/utils.ts character-filters the id and rejects
 * anything but youtube/vimeo, because the id may arrive from Sanity. It also
 * matches the CSP `frame-src` allowlist in next.config.mjs — adding a provider
 * in one place without the other produces a blocked frame, which is why the
 * allowlist and the builder live next to each other in the comments.
 *
 * A null return means the id is missing or malformed (including the FILL_ME
 * placeholder), in which case the poster renders on its own with no play
 * affordance rather than a button that leads nowhere.
 */

import { Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import type { ProjectVideo } from '@/lib/content/types';
import { cn, videoEmbedUrl } from '@/lib/utils';

export function VideoEmbed({
  video,
  className,
  sizes = '(max-width: 768px) 100vw, 800px',
}: {
  video: ProjectVideo;
  className?: string;
  sizes?: string;
}) {
  const [active, setActive] = useState(false);
  const embedUrl = videoEmbedUrl(video.provider, video.id);
  const poster = video.poster;

  const frame = cn(
    'relative overflow-hidden rounded-card border border-line bg-ink/5',
    className,
  );

  /* ── No usable id: poster only ────────────────────────────────────────── */
  if (!embedUrl) {
    if (!poster) return null;
    return (
      <div className={frame} style={{ aspectRatio: `${poster.width} / ${poster.height}` }}>
        <Image src={poster.src} alt={poster.alt} fill sizes={sizes} className="object-cover" />
        <p className="absolute inset-x-0 bottom-0 bg-ink/70 px-4 py-2.5 text-xs text-canvas backdrop-blur-sm">
          Video coming soon — add the embed id in your content source to play it here.
        </p>
      </div>
    );
  }

  /* ── Playing ──────────────────────────────────────────────────────────── */
  if (active) {
    return (
      <div className={frame} style={{ aspectRatio: '16 / 9' }}>
        <iframe
          src={`${embedUrl}&autoplay=1`}
          title={video.title}
          className="absolute inset-0 h-full w-full"
          // Only the permissions the player actually needs. Notably absent:
          // camera, microphone, geolocation.
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          // Defence in depth alongside the CSP frame-src: even an allowed origin
          // cannot navigate the top-level page or run same-origin script here.
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          allowFullScreen
        />
      </div>
    );
  }

  /* ── Facade ───────────────────────────────────────────────────────────── */
  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className={cn(frame, 'group block w-full cursor-pointer')}
      style={{ aspectRatio: poster ? `${poster.width} / ${poster.height}` : '16 / 9' }}
      aria-label={`Play video: ${video.title}`}
    >
      {poster ? (
        <Image
          src={poster.src}
          // Empty alt: the button's aria-label already names the video, so
          // describing the poster too would announce the same thing twice.
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          {...(poster.blurDataURL
            ? { placeholder: 'blur' as const, blurDataURL: poster.blurDataURL }
            : {})}
        />
      ) : (
        <span className="absolute inset-0 bg-gradient-to-br from-ink/10 to-gold/20" />
      )}

      {/* Scrim, so the play button holds contrast over any poster. */}
      <span className="absolute inset-0 bg-ink/20 transition-colors duration-300 group-hover:bg-ink/30" />

      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/95 shadow-lift transition-transform duration-300 group-hover:scale-110">
        {/* Nudged right by 1px — a triangle's optical centre is left of its
            bounding box centre, so a centred play glyph looks off-centre. */}
        <Play className="ml-0.5 h-6 w-6 fill-ink text-ink" aria-hidden="true" />
      </span>

      <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3.5 pt-10 text-left text-sm font-medium text-canvas">
        {video.title}
      </span>
    </button>
  );
}
