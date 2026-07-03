import { ExternalLink } from 'lucide-react';

/**
 * Interactive Google Map embed — no API key required (uses the `output=embed`
 * endpoint). Pass a `query` (address or "lat,lng"); to pin an exact spot, use
 * coordinates, e.g. query="-6.1075,106.7389".
 */
export function OfficeMap({
  query,
  title = 'Office location',
  zoom = 15,
}: {
  query: string;
  title?: string;
  zoom?: number;
}) {
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
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
