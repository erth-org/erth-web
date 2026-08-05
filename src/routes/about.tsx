import { createFileRoute } from "@tanstack/react-router";
import { Beaker, Compass, Eye, History, ShieldCheck, UserRound } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About - Erth",
      description:
        "Erth is built by four friends creating a more meaningful home for travel memories, beyond Instagram highlights and camera roll chaos.",
      path: "/about",
    }),
  component: AboutPage,
});

const principles = [
  {
    title: "Identity first",
    body: "Travel is not just something people do. It becomes part of who they are. Erth is built to make that visible.",
    icon: UserRound,
  },
  {
    title: "Context over performance",
    body: "We care less about polished highlights and more about the real context of a journey: place, time, people, and memory.",
    icon: Compass,
  },
  {
    title: "Built to be revisited",
    body: "The best travel memories should not disappear after a scroll. Erth is designed as a place people can return to years later.",
    icon: History,
  },
  {
    title: "User control",
    body: "People should decide what remains private, what is shared with friends, and what becomes part of the wider Erth world.",
    icon: ShieldCheck,
  },
  {
    title: "Honest beta learning",
    body: "We are testing with real users before wider release so the product is shaped by actual behavior, not assumptions.",
    icon: Beaker,
  },
  {
    title: "Wonder with clarity",
    body: "Erth should feel beautiful and alive, but always simple enough to understand and use.",
    icon: Eye,
  },
];

const currentState = [
  {
    label: "Private beta",
    title: "Testing the first complete experience",
    body: "Erth is currently available to a small group of testers through TestFlight.",
  },
  {
    label: "Core flows",
    title: "Focused on the fundamentals",
    body: "The beta tests sign up, profile creation, moments, trips, globe exploration, social follow flows, and navigation.",
  },
  {
    label: "Next step",
    title: "Learning before wider release",
    body: "Feedback from testers helps us improve reliability, clarity, and the feeling of building a travel identity.",
  },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 sm:space-y-5">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              About Erth
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth is being built by four friends who shared the same frustration: travel can shape
              who you are, but the places and memories that define you rarely have a proper home.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Some memories end up buried in a camera roll. Some become Instagram highlights. Most
              lose their context over time.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              We wanted to build something different: a living globe where moments, memories, trips,
              and people stay connected to the places where they happened.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth is still early, and that is intentional. We are testing the first version
              carefully with a small private beta before opening it more widely.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What guides us
            </h2>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal
                key={principle.title}
                delayMs={index * 70}
                className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
              >
                <principle.icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Where Erth is now
            </h2>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-3 md:gap-6">
            {currentState.map((item, index) => (
              <Reveal
                key={item.label}
                delayMs={index * 70}
                className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                  {item.label}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
