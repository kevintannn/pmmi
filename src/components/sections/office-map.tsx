import { ExternalLink } from 'lucide-react';

/**
 * Interactive Google Map embed — no API key required.
 *
 * Two ways to pin the location:
 *  1. `query` — an address or "lat,lng" (uses the `output=embed` endpoint).
 *     Simple, but an address may resolve to the general area.
 *  2. `embedUrl` — the exact `src` from Google Maps → Share → "Embed a map".
 *     Most precise and reliable; takes priority over `query` when provided.
 */
export function OfficeMap({
  query,
  embedUrl,
  title = 'Office location',
  zoom = 15,
}: {
  query: string;
  embedUrl?: string;
  title?: string;
  zoom?: number;
}) {
  const embedSrc =
    embedUrl ??
    `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
  const linkSrc = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl border shadow-soft">
      <iframe
        title={title}
        src={embedSrc}
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={linkSrc}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-soft backdrop-blur transition-colors hover:bg-background"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open in Google Maps
      </a>
    </div>
  );
}
