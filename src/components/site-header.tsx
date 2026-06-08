import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Download,
  FileText,
  Flag,
  Home,
  Info,
  Mail,
  Menu,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { ErthLogo } from "@/components/erth-logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const primaryNav = [
  { label: "Features", to: "/features" as const, icon: Sparkles },
  { label: "Updates", to: "/updates" as const, icon: Newspaper },
  { label: "About", to: "/about" as const, icon: Info },
  { label: "Report", to: "/report" as const, icon: Flag },
  { label: "Contact", to: "/contact" as const, icon: Mail },
  { label: "Legal", to: "/legal" as const, icon: FileText },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Home"
        >
          <ErthLogo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className: "text-foreground",
                "aria-current": "page",
              }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-2 py-2 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:px-3"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="download"
            className="ml-1 inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Download
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          id="mobile-nav"
          side="right"
          className="flex h-dvh w-[86vw] max-w-sm flex-col overflow-y-auto border-border/70 bg-background/92 px-5 py-5 shadow-2xl supports-[backdrop-filter]:bg-background/82 lg:hidden"
        >
          <SheetHeader className="mb-4 pr-8 text-left">
            <SheetTitle className="sr-only">Site menu</SheetTitle>
            <SheetDescription className="sr-only">
              Primary Erth website navigation links.
            </SheetDescription>
            <ErthLogo />
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-1" aria-label="Mobile">
            <Link
              to="/"
              activeProps={{ className: "text-foreground", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Home className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Home
            </Link>
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "text-foreground", "aria-current": "page" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <item.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            hash="download"
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="size-4" aria-hidden="true" />
            Download
          </Link>
        </SheetContent>
      </Sheet>
    </header>
  );
}
