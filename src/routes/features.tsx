import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { features } from "@/content/features";

export const Route = createFileRoute("/features")({
  head: () =>
    buildPageHead({
      title: "Features — Erth",
      description:
        "The foundational capabilities that make Erth a calm, lasting digital map of your world.",
      path: "/features",
    }),
  component: FeaturesPage,
});

function FeaturesPage() {
  // In production, only show verified entries.
  const visible = import.meta.env.DEV ? features : features.filter((f) => f.verified);

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-4xl px-4 pt-20 pb-16 sm:pt-28">
          <Reveal className="space-y-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              What Erth does
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Foundational capabilities, kept intentionally simple.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
              Erth is built around a small set of ideas done well. These are the
              capabilities the app is being shaped around — not an exhaustive
              feature list.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        {visible.length === 0 ? (
          <EmptyFeatures />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {visible.map((f, i) => (
              <Reveal
                key={f.title}
                delayMs={i * 70}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-7"
              >
                <f.icon className="size-7 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-foreground">
                  {f.title}
                </h2>
                <p className="text-sm font-medium text-foreground/80">
                  {f.summary}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
                {!f.verified && import.meta.env.DEV && (
                  <p className="mt-2 text-xs italic text-primary/80">
                    Dev only — content awaiting verification.
                  </p>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-muted-foreground">
            Ready to see what your map could look like?
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              hash="download"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="size-4" aria-hidden="true" />
              Download Erth
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              About Erth
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyFeatures() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <p className="text-base font-medium text-foreground">
        Verified feature overview coming soon.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        We're publishing this page once the capability summaries have been
        confirmed against the live application.
      </p>
    </div>
  );
}
