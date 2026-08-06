import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { features } from "@/content/features";

export const Route = createFileRoute("/features")({
  head: () =>
    buildPageHead({
      title: "Features - Erth",
      description:
        "Explore Erth's core private beta features: a living personal globe, spatial memories, trips, social travel context, discovery, and light progress through Zenith.",
      path: "/features",
    }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 text-center sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Core Beta Features
            </p>
            <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              The foundations of your travel identity.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Erth is built around a simple idea: your memories should live where they happened. The
              private beta focuses on the core flows that make that possible.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal
              key={feature.id}
              delayMs={index * 60}
              className={`rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6 ${
                feature.id === "zenith" ? "lg:col-start-2" : ""
              }`}
            >
              <article
                id={feature.id}
                tabIndex={-1}
                aria-labelledby={`feature-${feature.id}-title`}
                className="scroll-mt-24 focus:outline-none"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Sparkles className="size-4 text-primary/70" aria-hidden="true" />
                </div>
                <h2
                  id={`feature-${feature.id}-title`}
                  className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                >
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {feature.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Currently in private TestFlight beta.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The first version of Erth is being tested with early users. The focus is reliability,
              navigation, content creation, globe exploration, and meaningful feedback.
            </p>
            <Link
              to="/testing/"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Learn about testing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
