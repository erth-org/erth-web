import { Link } from "@tanstack/react-router";
import { AppStoreBadges } from "@/components/app-store-badges";

const productLinks = [
  { label: "Features", to: "/features" as const },
  { label: "Updates", to: "/updates" as const },
  { label: "Report", to: "/report" as const },
];

const companyLinks = [
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.5fr_0.9fr_0.9fr_1.1fr_1fr]">
        <div className="space-y-3">
          <p className="text-base font-semibold tracking-tight text-foreground">Erth</p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A living digital map of the places, moments, and experiences that shape your world.
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
            to="/legal"
            hash="privacy-policy"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            to="/legal"
            hash="terms-conditions"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/legal"
            hash="other-notices"
            className="block text-muted-foreground transition-colors hover:text-foreground"
          >
            Other Notices
          </Link>
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
