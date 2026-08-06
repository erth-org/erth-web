import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Beaker, Mail } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { productTruths, coreIdeas, audiences } from "@/lib/erth-content";
import { Reveal } from "@/components/reveal";
import { HeroVisual } from "@/components/hero-visual";
import { StarBackdrop } from "@/components/star-backdrop";

const CONTACT_EMAIL = "erthteamtesting@gmail.com";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Erth",
      description:
        "Erth is a private beta travel social app where trips, moments, and memories become a living 3D globe of your travel identity.",
      path: "/",
    }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-14 sm:pt-28 sm:pb-24">
          <div className="grid min-w-0 items-center gap-3 sm:gap-8 md:grid-cols-[1fr_1.05fr] md:gap-12">
            <Reveal className="min-w-0 space-y-5 sm:space-y-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Private TestFlight Beta
              </p>
              <h1 className="max-w-full text-balance text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Travel is part of who you are.
              </h1>
              <p className="max-w-full text-pretty text-[0.95rem] leading-relaxed text-muted-foreground sm:max-w-xl sm:text-lg">
                Erth turns your trips, moments, and memories into a living 3D globe, giving the
                places that shaped you a home beyond Instagram and your camera roll.
              </p>
              <p className="max-w-xl border-l-2 border-primary/60 pl-4 text-sm leading-relaxed text-foreground/85">
                Erth is currently in private TestFlight beta. We are testing the first version with
                a small group of early users before a wider release.
              </p>
              <div className="grid max-w-full gap-3 pt-1 sm:flex sm:flex-wrap sm:items-center sm:pt-2">
                <Link
                  to="/"
                  hash="vision"
                  className="inline-flex min-h-11 w-full max-w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  Explore the vision
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact/"
                  className="inline-flex min-h-11 w-full max-w-full items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  Contact the team
                </Link>
              </div>
            </Reveal>

            <Reveal
              delayMs={120}
              className="relative -mt-1 h-[118vw] min-h-[20rem] overflow-visible text-foreground sm:mt-0 sm:flex sm:h-auto sm:min-h-0 sm:justify-center"
            >
              <div className="absolute left-1/2 top-0 w-[137.5vw] -translate-x-1/2 sm:static sm:w-full sm:max-w-xl sm:translate-x-0 lg:max-w-[34rem]">
                <HeroVisual className="w-full max-w-none" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/20">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-10 sm:gap-4 sm:py-14 md:grid-cols-3">
          {productTruths.map((item, index) => (
            <Reveal
              key={item.label}
              delayMs={index * 70}
              className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-5 text-primary" aria-hidden="true" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                  {item.label}
                </p>
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {item.headline}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Reveal className="space-y-4 sm:space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              The missing home for travel memories.
            </h2>
            <p className="text-base leading-relaxed text-foreground/90">
              Years after a trip, where does the story live?
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Maybe it is buried in your camera roll, mixed with duplicates, screenshots, and
              forgotten videos. Maybe it became an Instagram post, filtered and compressed into
              something made for likes. Or maybe it was never shared at all.
            </p>
            <p className="text-lg font-medium leading-relaxed text-foreground">
              Instagram gives you the highlight. Your camera roll gives you the mess. Erth gives you
              the map.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth is the missing middle: a spatial home for the moments that shaped you.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="vision"
        tabIndex={-1}
        className="scroll-mt-24 border-t border-border/60 focus:outline-none"
      >
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Reveal className="space-y-4 sm:space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Your world should be visible.
            </h2>
            <p className="text-lg font-medium leading-relaxed text-foreground">
              We believe travel is not just content. It is identity.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              The places you visit, the people you go with, the memories you keep, and the stories
              you bring back all become part of your world.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth makes that world visible through a personal globe that grows with every journey.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What it is built on
            </h2>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {coreIdeas.map((idea, index) => (
              <Reveal
                key={idea.title}
                delayMs={index * 70}
                className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
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

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              For people who collect places, not just photos.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Erth is for travelers, memory keepers, friend groups, and explorers who want their
              experiences to live somewhere more meaningful than a feed or a folder.
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {audiences.map((audience, index) => (
              <Reveal
                key={audience.title}
                delayMs={index * 70}
                className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
              >
                <audience.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-foreground">{audience.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {audience.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Reveal className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Beaker className="size-6 text-primary" aria-hidden="true" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Private TestFlight Beta
              </p>
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Built carefully. Tested honestly.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth is currently in private TestFlight beta. Our focus is simple: make sure people
              can sign up, create memories, build trips, explore the globe, connect with friends,
              and shape a travel identity that feels real.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Feedback from early testers directly informs what we improve before opening Erth to
              more people.
            </p>
            <Link
              to="/contact/"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact the team
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Reveal className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Erth is in private beta.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We are testing the first version with a small group of early users through TestFlight.
              For beta access, reviewer questions, partnerships, or product feedback, contact the
              Erth team.
            </p>
            <Link
              to="/contact/"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="size-4" aria-hidden="true" />
              Contact the team
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
