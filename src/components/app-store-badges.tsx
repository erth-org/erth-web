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
function Badge({
  store,
  url,
}: {
  store: "App Store" | "Google Play";
  url: string | null;
}) {
  const base =
    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors";

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
        <span className="text-xs text-muted-foreground">Download on</span>
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
        <span className="text-sm font-medium text-muted-foreground">
          Coming soon
        </span>
      </span>
    </div>
  );
}

export function AppStoreBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Badge store="App Store" url={siteConfig.store.appStoreUrl} />
      <Badge store="Google Play" url={siteConfig.store.googlePlayUrl} />
    </div>
  );
}
