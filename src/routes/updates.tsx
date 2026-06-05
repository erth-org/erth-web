import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { PlatformBadges } from "@/components/platform-badges";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { EmptyState } from "@/components/empty-state";
import { releases } from "@/content/updates";
import { type Platform } from "@/lib/public-content-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/updates")({
  head: () =>
    buildPageHead({
      title: "Updates — Erth release notes",
      description:
        "Verified Erth releases, improvements, and bug fixes — straight from the team.",
      path: "/updates",
    }),
  component: UpdatesPage,
});

type PlatformFilter = "all" | Platform;

function UpdatesPage() {
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [query, setQuery] = useState("");

  // Only show platform filters that have data behind them.
  const availablePlatforms = useMemo(() => {
    const s = new Set<Platform>();
    releases.forEach((r) => r.platforms.forEach((p) => s.add(p)));
    return Array.from(s);
  }, []);

  const sorted = useMemo(
    () =>
      [...releases].sort(
        (a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate),
      ),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((r) => {
      if (platform !== "all" && !r.platforms.includes(platform)) return false;
      if (!q) return true;
      const hay = [
        r.title,
        r.summary,
        r.version,
        r.majorFeature?.title,
        r.majorFeature?.description,
        ...r.newFeatures.map((c) => c.title + " " + (c.description ?? "")),
        ...r.improvements.map((c) => c.title + " " + (c.description ?? "")),
        ...r.bugFixes.map((c) => c.title + " " + (c.description ?? "")),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [sorted, platform, query]);

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28">
          <Reveal className="space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Erth · Release notes
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Updates
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A running log of verified Erth releases, improvements, and fixes —
              straight from the team.
            </p>
          </Reveal>
        </div>
      </section>

      {releases.length > 0 && (
        <section
          aria-label="Filter releases"
          className="mx-auto max-w-3xl px-4 pb-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="updates-search" className="sr-only">
                Search release notes
              </label>
              <input
                id="updates-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search releases"
                className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {availablePlatforms.length > 0 && (
              <div
                role="tablist"
                aria-label="Platform"
                className="flex flex-wrap items-center gap-1 rounded-md border border-border bg-card/40 p-1"
              >
                <FilterChip
                  active={platform === "all"}
                  onClick={() => setPlatform("all")}
                  label="All"
                />
                {availablePlatforms.map((p) => (
                  <FilterChip
                    key={p}
                    active={platform === p}
                    onClick={() => setPlatform(p)}
                    label={p === "ios" ? "iOS" : p === "android" ? "Android" : "Web"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 pb-24">
        {releases.length === 0 ? (
          <EmptyState
            title="No releases yet."
            description="Release notes will appear here when the next Erth version is published."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No releases match your filters."
            description="Try clearing your search or switching the platform filter."
          />
        ) : (
          <ol
            className="relative space-y-12 border-l border-border/60 pl-6"
            aria-label="Erth releases, newest first"
          >
            {filtered.map((r) => (
              <li key={r.slug} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[29px] top-2 size-2.5 rounded-full bg-primary ring-4 ring-background"
                />
                <ReleasePreview release={r} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center rounded px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function ReleasePreview({ release: r }: { release: (typeof releases)[number] }) {
  const counts = {
    newFeatures: r.newFeatures.length,
    improvements: r.improvements.length,
    bugFixes: r.bugFixes.length,
  };
  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-sm font-semibold text-foreground">
          {r.version}
        </span>
        <time
          dateTime={r.releaseDate}
          className="font-mono text-xs text-muted-foreground"
        >
          {formatDate(r.releaseDate)}
        </time>
        <PlatformBadges platforms={r.platforms} className="ml-auto" />
      </div>
      <Link
        to="/updates/$slug"
        params={{ slug: r.slug }}
        className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground transition-colors hover:text-primary">
          {r.title}
        </h2>
      </Link>
      <p className="text-base leading-relaxed text-muted-foreground">
        {r.summary}
      </p>
      {r.majorFeature && (
        <div className="rounded-xl border border-border bg-card/40 p-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Major feature
          </p>
          <p className="mt-1 text-base font-medium text-foreground">
            {r.majorFeature.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {r.majorFeature.description}
          </p>
        </div>
      )}
      {r.heroImageSrc && (
        <ScreenshotFrame src={r.heroImageSrc} alt={r.heroImageAlt} />
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {counts.newFeatures > 0 && <span>{counts.newFeatures} new</span>}
        {counts.improvements > 0 && (
          <span>{counts.improvements} improved</span>
        )}
        {counts.bugFixes > 0 && <span>{counts.bugFixes} fixed</span>}
        <Link
          to="/updates/$slug"
          params={{ slug: r.slug }}
          className="ml-auto inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Read release
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
