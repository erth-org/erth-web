import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { ErthLogo } from "@/components/erth-logo";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "Features", to: "/features" as const },
  { label: "Updates", to: "/updates" as const },
  { label: "About", to: "/about" as const },
  { label: "Report", to: "/report" as const },
];

const secondaryNav = [
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Erth — home"
        >
          <ErthLogo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className: "text-foreground",
                "aria-current": "page",
              }}
              inactiveProps={{ className: "text-muted-foreground" }}
              
              className="rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="download"
            className="ml-2 inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Download
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn("border-t border-border/60 md:hidden", open ? "block" : "hidden")}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
          <Link
            to="/"
            activeProps={{ className: "text-foreground", "aria-current": "page" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            activeOptions={{ exact: true }}
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-3 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Home
          </Link>
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border/60" />
          {secondaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-xs uppercase tracking-wide transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="download"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Download
          </Link>
        </nav>
      </div>
    </header>
  );
}
