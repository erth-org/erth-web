import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { ScreenshotFrame } from "@/components/screenshot-frame";
import { PlatformBadges } from "@/components/platform-badges";
import { EmptyState } from "@/components/empty-state";
import { features } from "@/content/features";

export const Route = createFileRoute("/features")({
  head: () =>
    buildPageHead({
      title: "Features — Erth",
      description:
        "Foundational capabilities that make Erth a calm, lasting digital map of the places, moments, and experiences that shape your world.",
      path: "/features",
    }),
  component: FeaturesPage,
});

function FeaturesPage() {
  // Production hides unverified and demo entries; dev shows them with markers.
  const visible = import.meta.env.DEV ? features : features.filter((f) => f.verified && !f.isDemo);

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 text-center sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Foundational capabilities
            </p>
            <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Essential ways to preserve and understand your experiences.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Built around a small set of ideas done well. These are the capabilities the app is
              shaped around, not an exhaustive feature list.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-32">
        {visible.length === 0 ? (
          <EmptyState
            title="Verified feature overview coming soon."
            description="We're publishing this page once the capability summaries have been confirmed against the live application."
          />
        ) : (
          <ol className="space-y-14 sm:space-y-32">
            {visible.map((f, i) => (
              <li
                key={f.id}
                id={f.id}
                className="scroll-mt-24"
                aria-labelledby={`feature-${f.id}-title`}
              >
                <FeatureRow feature={f} index={i} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <p className="text-base text-muted-foreground">
            Ready to see what your map could look like?
          </p>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Link
              to="/"
              hash="download"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="size-4" aria-hidden="true" />
              <span className="sm:hidden">Download</span>
              <span className="hidden sm:inline">Download the app</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              About
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureRow({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const reverse = index % 2 === 1;
  return (
    <Reveal>
      <div
        className={`grid items-center gap-5 md:grid-cols-2 md:gap-16 ${
          reverse ? "md:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div className="space-y-4 sm:space-y-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} · Capability
          </p>
          <h2
            id={`feature-${feature.id}-title`}
            className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            {feature.title}
          </h2>
          <p className="erth-mobile-clamp-2 text-pretty text-sm leading-relaxed text-foreground/85 sm:text-lg">
            {feature.summary}
          </p>
          <div className="hidden rounded-xl border-l-2 border-primary/60 bg-card/40 px-4 py-3 sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              User benefit
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.benefit}</p>
          </div>
          <PlatformBadges platforms={feature.platforms} />
          {feature.isDemo && (
            <p className="inline-flex w-fit rounded-full border border-primary/35 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
              Demo content — not published information
            </p>
          )}
          {!feature.verified && import.meta.env.DEV && (
            <p className="text-xs italic text-primary/80">
              Dev only — content awaiting verification.
            </p>
          )}
        </div>
        <div>
          <ScreenshotFrame
            src={feature.screenshotSrc}
            alt={feature.screenshotAlt}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      </div>
    </Reveal>
  );
}
