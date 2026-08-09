import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  LockKeyhole,
  MessageSquareWarning,
  Send,
} from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { productTruths } from "@/lib/erth-content";

const TESTER_FLOW = [
  {
    step: "01",
    title: "Follow the guide",
    body: "Work through each mission in the invited beta build and record the outcome while it is fresh.",
    icon: BookOpenCheck,
  },
  {
    step: "02",
    title: "Capture useful evidence",
    body: "Note what worked, where you hesitated, and any feature that blocked or confused you.",
    icon: ClipboardCheck,
  },
  {
    step: "03",
    title: "Review and send",
    body: "Prepare a structured email from the guide, review it, and choose when to send it to the team.",
    icon: Send,
  },
] as const;

export function BetaHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-14 sm:pt-24 sm:pb-20">
          <div className="grid min-w-0 items-center gap-6 md:grid-cols-[1fr_1.05fr] md:gap-12">
            <Reveal className="min-w-0 space-y-5 sm:space-y-6">
              <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-3 text-xs font-semibold text-foreground">
                <LockKeyhole className="size-3.5 text-primary" aria-hidden="true" />
                Closed beta · invited testers only
              </div>
              <div className="space-y-4">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Erth tester workspace
                </p>
                <h1 className="max-w-xl text-balance text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Test the journey. Tell us where it breaks.
                </h1>
                <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Erth turns trips, moments, and memories into a living 3D globe. This website helps
                  the invited tester group evaluate that experience through guided missions.
                </p>
              </div>
              <div className="grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  to="/testing/guide/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none"
                >
                  <BookOpenCheck className="size-4" aria-hidden="true" />
                  Open tester guide
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/report/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background/50 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <MessageSquareWarning className="size-4" aria-hidden="true" />
                  Report an issue
                </Link>
              </div>
              <p className="flex max-w-xl items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                No QR code, download link, waitlist, or access request is offered here. The beta app
                is distributed privately to the existing tester group.
              </p>
            </Reveal>

            <Reveal
              delayMs={100}
              className="relative -mt-2 h-[103vw] min-h-[19rem] overflow-visible text-foreground sm:h-[34rem] md:mt-0"
            >
              <div className="absolute left-1/2 top-0 w-[122vw] -translate-x-1/2 sm:w-[38rem] md:w-full md:max-w-xl">
                <HeroVisual className="w-full max-w-none" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/25">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Your beta workflow
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              One clear path from mission to feedback.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Use the guide for completed missions. Use the issue report when a complaint or feature
              problem needs to be sent immediately.
            </p>
          </Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {TESTER_FLOW.map((item, index) => (
              <Reveal
                key={item.step}
                delayMs={index * 70}
                className="rounded-2xl border border-border bg-card/80 p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What Erth is trying to make possible
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              The beta is testing whether a travel identity can feel spatial, personal, and easy to
              revisit—not whether more people can join.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
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
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.headline}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
