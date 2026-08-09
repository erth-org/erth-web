import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpenCheck,
  FileText,
  Home,
  Info,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquareWarning,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ErthLogo } from "@/components/erth-logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { isBetaMode } from "@/lib/site-mode";

interface NavigationItem {
  label: string;
  to: "/features/" | "/updates/" | "/about/" | "/contact/" | "/report/" | "/legal/";
  icon: LucideIcon;
}

const BETA_NAVIGATION: ReadonlyArray<NavigationItem> = [
  { label: "Report an issue", to: "/report/", icon: MessageSquareWarning },
];

const LIVE_NAVIGATION: ReadonlyArray<NavigationItem> = [
  { label: "Features", to: "/features/", icon: Sparkles },
  { label: "Updates", to: "/updates/", icon: Newspaper },
  { label: "About", to: "/about/", icon: Info },
  { label: "Contact", to: "/contact/", icon: Mail },
  { label: "Legal", to: "/legal/", icon: FileText },
];

export function SiteHeader() {
  return isBetaMode() ? <BetaSiteHeader /> : <LiveSiteHeader />;
}

function BetaSiteHeader() {
  return (
    <SiteHeaderLayout
      navigation={BETA_NAVIGATION}
      menuDescription="Closed beta tester resources."
      status={
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-3 text-xs font-medium text-foreground">
          <LockKeyhole className="size-3.5 text-primary" aria-hidden="true" />
          Closed beta · invited testers
        </span>
      }
      action={{
        label: "Open tester guide",
        to: "/testing/guide/",
        icon: BookOpenCheck,
      }}
    />
  );
}

function LiveSiteHeader() {
  return (
    <SiteHeaderLayout
      navigation={LIVE_NAVIGATION}
      menuDescription="Erth product and company navigation."
      action={{ label: "Explore features", to: "/features/", icon: Sparkles }}
    />
  );
}

interface HeaderLayoutProps {
  navigation: ReadonlyArray<NavigationItem>;
  menuDescription: string;
  status?: React.ReactNode;
  action: {
    label: string;
    to: "/testing/guide/" | "/features/";
    icon: LucideIcon;
  };
}

function SiteHeaderLayout({ navigation, menuDescription, status, action }: HeaderLayoutProps) {
  const [open, setOpen] = useState(false);
  const ActionIcon = action.icon;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Erth home"
        >
          <ErthLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {status}
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground", "aria-current": "page" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={action.to}
            className="ml-1 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ActionIcon className="size-4" aria-hidden="true" />
            {action.label}
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
          <Menu className="size-5" aria-hidden="true" />
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
            <SheetDescription className="sr-only">{menuDescription}</SheetDescription>
            <ErthLogo />
          </SheetHeader>

          {status ? <div className="mb-4 flex">{status}</div> : null}

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
            {navigation.map((item) => (
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
            to={action.to}
            onClick={() => setOpen(false)}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ActionIcon className="size-4" aria-hidden="true" />
            {action.label}
          </Link>
        </SheetContent>
      </Sheet>
    </header>
  );
}
