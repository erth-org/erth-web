import { Link } from "@tanstack/react-router";
import { ErthLogo } from "@/components/erth-logo";
import { AppStoreBadges } from "@/components/app-store-badges";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <ErthLogo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig.oneLiner}
          </p>
        </div>

        <nav aria-label="Footer" className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Explore
          </p>
          <Link to="/" className="block text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link to="/about" className="block text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link to="/privacy" className="block text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="block text-muted-foreground hover:text-foreground">
            Terms
          </Link>
        </nav>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Get the app
          </p>
          <AppStoreBadges className="flex-col" />
          {siteConfig.contact.email && (
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="block text-muted-foreground hover:text-foreground"
            >
              {siteConfig.contact.email}
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          © {year} Erth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
