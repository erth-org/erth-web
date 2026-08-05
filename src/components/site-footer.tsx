import { Link } from "@tanstack/react-router";
import { Beaker, Clock3 } from "lucide-react";

const productLinks = [
  { label: "Features", to: "/features/" as const },
  { label: "Testing", to: "/testing/" as const },
  { label: "Updates — Coming Soon", to: "/updates/" as const },
  { label: "Feedback — Coming Soon", to: "/report/" as const },
];

const companyLinks = [
  { label: "About", to: "/about/" as const },
  { label: "Contact", to: "/contact/" as const },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.5fr_0.9fr_0.9fr_1.1fr_1fr]">
        <div className="space-y-3">
          <p className="text-base font-semibold tracking-tight text-foreground">Erth</p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Erth turns trips, moments, and memories into a living globe of your travel identity.
          </p>
        </div>

        <nav aria-label="Footer — product" className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Product</p>
          {productLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Footer — company" className="space-y-2 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Company</p>
          {companyLinks.map((l) => (
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
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Legal</p>
          <Link
            to="/legal/"
            hash="privacy-policy"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            to="/legal/"
            hash="terms-conditions"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/legal/"
            hash="other-notices"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            Other Notices
          </Link>
        </nav>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Private Beta
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Erth is currently being tested through a private TestFlight beta before a wider release.
          </p>
          <div className="grid gap-2">
            <div className="flex min-h-11 items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-foreground">
              <Beaker className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium">TestFlight beta</span>
            </div>
            <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card/40 px-3 py-2 text-muted-foreground">
              <Clock3 className="size-4 shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">Wider release coming later</span>
            </div>
          </div>
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
