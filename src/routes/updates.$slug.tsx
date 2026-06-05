import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { PlatformBadges } from "@/components/platform-badges";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { getReleaseBySlug } from "@/content/updates";
import type { ReleaseChange } from "@/lib/public-content-types";

export const Route = createFileRoute("/updates/$slug")({
  loader: ({ params }) => {
    const release = getReleaseBySlug(params.slug);
    if (!release) throw notFound();
    return release;
  },
  head: ({ loaderData }) =>
    buildPageHead({
      title: loaderData
        ? `${loaderData.version} — ${loaderData.title} · Erth updates`
        : "Release — Erth updates",
      description: loaderData?.summary ?? "Erth release notes.",
      path: `/updates/${loaderData?.slug ?? ""}`,
    }),
  component: ReleaseDetailPage,
  errorComponent: ReleaseError,
  notFoundComponent: ReleaseNotFound,
});

function ReleaseDetailPage() {
  const r = Route.useLoaderData();
  return (
    <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:pt-24">
      <Link
        to="/updates"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        All updates
      </Link>

      <Reveal className="mt-6 space-y-4">
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
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          {r.title}
        </h1>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          {r.summary}
        </p>
      </Reveal>

      {r.majorFeature && (
        <Reveal className="mt-10 rounded-2xl border border-border bg-card/40 p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Major feature
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {r.majorFeature.title}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {r.majorFeature.description}
          </p>
          {r.heroImageSrc && (
            <div className="mt-5">
              <ScreenshotFrame
                src={r.heroImageSrc}
                alt={r.heroImageAlt}
                loading="eager"
              />
            </div>
          )}
        </Reveal>
      )}

      <div className="mt-12 space-y-10">
        <ChangeSection title="New Features" changes={r.newFeatures} />
        <ChangeSection title="Improvements" changes={r.improvements} />
        <ChangeSection title="Bug Fixes" changes={r.bugFixes} />
      </div>

      <div className="mt-16 border-t border-border/60 pt-6">
        <Link
          to="/updates"
          className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to all updates
        </Link>
      </div>
    </article>
  );
}

function ChangeSection({
  title,
  changes,
}: {
  title: string;
  changes: ReleaseChange[];
}) {
  if (!changes || changes.length === 0) return null;
  return (
    <section>
      <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
        {title}
      </h2>
      <ul className="mt-4 space-y-4">
        {changes.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-border/70 bg-card/30 p-4"
          >
            <p className="text-base font-medium text-foreground">{c.title}</p>
            {c.description && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {c.description}
              </p>
            )}
            {c.category && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {c.category}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReleaseNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Release not found</h1>
      <p className="mt-2 text-muted-foreground">
        That update doesn't exist or hasn't been published.
      </p>
      <Link
        to="/updates"
        className="mt-6 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to all updates
      </Link>
    </div>
  );
}

function ReleaseError({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Something went wrong loading this release.
      </h1>
      <button
        type="button"
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-accent/10"
      >
        Try again
      </button>
    </div>
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
