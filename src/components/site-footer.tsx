import { Link } from "@tanstack/react-router";
import { Globe2, LockKeyhole } from "lucide-react";
import { isBetaMode } from "@/lib/site-mode";
import { siteConfig } from "@/lib/site-config";

const BETA_LINKS = [
  { label: "Tester guide", to: "/testing/guide/" as const },
  { label: "Report an issue", to: "/report/" as const },
];

const LIVE_PRODUCT_LINKS = [
  { label: "Features", to: "/features/" as const },
  { label: "Updates", to: "/updates/" as const },
  { label: "Feedback", to: "/report/" as const },
];

const LIVE_COMPANY_LINKS = [
  { label: "About", to: "/about/" as const },
  { label: "Contact", to: "/contact/" as const },
];

export function SiteFooter() {
  return isBetaMode() ? <BetaSiteFooter /> : <LiveSiteFooter />;
}

function BetaSiteFooter() {
  return (
    <FooterFrame mode="beta">
      <nav aria-label="Footer — tester resources" className="space-y-2 text-sm">
        <FooterHeading>Tester resources</FooterHeading>
        {BETA_LINKS.map((link) => (
          <FooterLink key={link.to} {...link} />
        ))}
      </nav>
      <LegalLinks />
      <div className="space-y-3 text-sm">
        <FooterHeading>Closed beta</FooterHeading>
        <div className="flex gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Access is limited to invited testers. This website does not distribute the app or accept
            access requests.
          </p>
        </div>
      </div>
    </FooterFrame>
  );
}

function LiveSiteFooter() {
  const storeLinks = [
    siteConfig.store.appStoreUrl
      ? { label: "Download on the App Store", href: siteConfig.store.appStoreUrl }
      : null,
    siteConfig.store.googlePlayUrl
      ? { label: "Get it on Google Play", href: siteConfig.store.googlePlayUrl }
      : null,
  ].filter((link): link is { label: string; href: string } => Boolean(link));

  return (
    <FooterFrame mode="live">
      <nav aria-label="Footer — product" className="space-y-2 text-sm">
        <FooterHeading>Product</FooterHeading>
        {LIVE_PRODUCT_LINKS.map((link) => (
          <FooterLink key={link.to} {...link} />
        ))}
      </nav>
      <nav aria-label="Footer — company" className="space-y-2 text-sm">
        <FooterHeading>Company</FooterHeading>
        {LIVE_COMPANY_LINKS.map((link) => (
          <FooterLink key={link.to} {...link} />
        ))}
      </nav>
      <LegalLinks />
      <div className="space-y-3 text-sm">
        <FooterHeading>Get Erth</FooterHeading>
        <div className="flex gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
          <Globe2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          {storeLinks.length ? (
            <div className="space-y-2">
              {storeLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-foreground underline underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Public store availability will appear here when release links are configured.
            </p>
          )}
        </div>
      </div>
    </FooterFrame>
  );
}

function FooterFrame({ children, mode }: { children: React.ReactNode; mode: "beta" | "live" }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60">
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 ${
          mode === "beta"
            ? "lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]"
            : "lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]"
        }`}
      >
        <div className="space-y-3">
          <p className="text-base font-semibold tracking-tight text-foreground">Erth</p>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Erth turns trips, moments, and memories into a living globe of your travel identity.
          </p>
        </div>
        {children}
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground">
          © {year} Erth. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{children}</p>
  );
}

function FooterLink({ label, to }: { label: string; to: React.ComponentProps<typeof Link>["to"] }) {
  return (
    <Link to={to} className="block text-muted-foreground transition-colors hover:text-foreground">
      {label}
    </Link>
  );
}

function LegalLinks() {
  return (
    <nav aria-label="Footer — legal" className="space-y-2 text-sm">
      <FooterHeading>Legal</FooterHeading>
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
    </nav>
  );
}
