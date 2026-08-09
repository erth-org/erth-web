import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Globe2 } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { coreIdeas, productTruths } from "@/lib/erth-content";

export function LiveHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-14 sm:pt-28 sm:pb-24">
          <div className="grid min-w-0 items-center gap-6 md:grid-cols-[1fr_1.05fr] md:gap-12">
            <Reveal className="min-w-0 space-y-5 sm:space-y-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Your world, made visible
              </p>
              <h1 className="max-w-xl text-balance text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Travel is part of who you are.
              </h1>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Erth turns your trips, moments, and memories into a living 3D globe, giving the
                places that shaped you a home beyond a feed or camera roll.
              </p>
              <div className="grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  to="/features/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Globe2 className="size-4" aria-hidden="true" />
                  Explore features
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Compass className="size-4" aria-hidden="true" />
                  Why Erth exists
                </Link>
              </div>
            </Reveal>

            <Reveal
              delayMs={110}
              className="relative -mt-2 h-[103vw] min-h-[19rem] overflow-visible text-foreground sm:h-[34rem] md:mt-0"
            >
              <div className="absolute left-1/2 top-0 w-[122vw] -translate-x-1/2 sm:w-[38rem] md:w-full md:max-w-xl">
                <HeroVisual className="w-full max-w-none" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/20">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3 sm:py-16">
          {productTruths.map((item, index) => (
            <Reveal
              key={item.label}
              delayMs={index * 70}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-primary">
                {item.label}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">{item.headline}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              The missing home for travel memories.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Instagram gives you the highlight. Your camera roll gives you the mess. Erth gives you
              the map—a spatial home for the moments that shaped you.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreIdeas.map((idea, index) => (
              <Reveal
                key={idea.title}
                delayMs={index * 60}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <idea.icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{idea.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {idea.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
