import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * App Store / Google Play badges.
 *
 * - When a store URL exists, renders a real, focusable anchor.
 * - When it is null, renders a non-interactive element with a clear
 *   "Coming soon" state (no link, no button, no href="#", no fake roles)
 *   carrying an accessible label.
 */
function Badge({ store, url }: { store: "App Store" | "Google Play"; url: string | null }) {
  const base =
    "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-center transition-colors sm:flex-none sm:justify-start sm:gap-3 sm:px-4 sm:py-3 sm:text-left";

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          base,
          "border-border bg-card hover:border-foreground/30 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <span className="hidden text-xs text-muted-foreground sm:inline">Download on</span>
        <span className="text-sm font-semibold text-foreground">{store}</span>
      </a>
    );
  }

  return (
    <div
      className={cn(base, "border-dashed border-border/70 bg-card/40")}
      aria-label={`${store} — coming soon`}
    >
      <span className="flex flex-col">
        <span className="text-xs text-muted-foreground">{store}</span>
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          Coming soon
        </span>
      </span>
    </div>
  );
}

export function AppStoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3", className)}>
      <Badge store="App Store" url={siteConfig.store.appStoreUrl} />
      <Badge store="Google Play" url={siteConfig.store.googlePlayUrl} />
    </div>
  );
}
