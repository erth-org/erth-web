import { Link } from "@tanstack/react-router";
import { ErthLogo } from "@/components/erth-logo";
import { AppStoreBadges } from "@/components/app-store-badges";
import { siteConfig } from "@/lib/site-config";

const explore = [
  { label: "Features", to: "/features" as const },
  { label: "Updates", to: "/updates" as const },
  { label: "About", to: "/about" as const },
  { label: "Report", to: "/report" as const },
];

const legal = [
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="space-y-3">
          <ErthLogo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.oneLiner}
          </p>
        </div>

        <nav aria-label="Footer — explore" className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Explore
          </p>
          {explore.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Footer — legal" className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Legal
          </p>
          {legal.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {siteConfig.contact.email ? (
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </a>
          ) : (
            <span className="block text-muted-foreground/60">Contact — soon</span>
          )}
        </nav>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Get the app
          </p>
          <AppStoreBadges className="flex-col" />
        </div>
      </div>

      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground">
          © {year} Erth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
