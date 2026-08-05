import { createFileRoute } from "@tanstack/react-router";
import {
  Beaker,
  Globe2,
  Images,
  Mail,
  MessageSquareText,
  Route as RouteIcon,
  UserPlus,
  Users,
} from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";

const CONTACT_EMAIL = "erthteamtesting@gmail.com";

export const Route = createFileRoute("/testing")({
  head: () =>
    buildPageHead({
      title: "Testing - Erth",
      description:
        "Learn how Erth is being tested in private TestFlight beta with early users before a wider release.",
      path: "/testing",
    }),
  component: TestingPage,
});

const testingFocus = [
  {
    title: "Sign up and onboarding",
    body: "Can new users create an account, complete profile setup, and understand where they are in the app?",
    icon: UserPlus,
  },
  {
    title: "Moments and memories",
    body: "Can testers create travel memories with photos, descriptions, and location context?",
    icon: Images,
  },
  {
    title: "Trips",
    body: "Can testers build, edit, and revisit trips as complete travel stories?",
    icon: RouteIcon,
  },
  {
    title: "Globe exploration",
    body: "Can testers use the globe, open clusters, browse memories, and navigate into posts and profiles?",
    icon: Globe2,
  },
  {
    title: "Social flows",
    body: "Can testers find each other, send follow requests, accept or reject them, and view other travel profiles?",
    icon: Users,
  },
  {
    title: "Feedback quality",
    body: "Can testers explain what confused them, what felt meaningful, and what should be improved before wider release?",
    icon: MessageSquareText,
  },
];

function TestingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 text-center sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Private Beta
            </p>
            <h1 className="text-balance text-[2.15rem] font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Testing Erth with real travelers.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Erth is currently in private TestFlight beta. We are testing the core experience with
              a small group of early users before opening the app more widely.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <Reveal className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What the beta is focused on
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The private beta is not about chasing growth. It is about learning whether the core
            structure works: whether people can create a profile, capture memories, build trips,
            explore the globe, connect with friends, and understand the value of their travel
            identity.
          </p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {testingFocus.map((item, index) => (
            <Reveal
              key={item.title}
              delayMs={index * 70}
              className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
            >
              <item.icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:py-20 lg:grid-cols-2">
          <Reveal className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 sm:p-8">
            <Beaker className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              For current testers
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              If you are testing Erth, focus on using the app naturally. We want to know where the
              experience feels clear, where you get stuck, and whether the idea of building a
              personal travel globe feels meaningful after using it.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="size-4" aria-hidden="true" />
              Send feedback
            </a>
          </Reveal>

          <Reveal delayMs={90} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <Users className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              For reviewers
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth is being validated around a clear product thesis: travel identity should be
              spatial, personal, and social without becoming performative. The private beta is
              designed to test the app's basic structure before wider release.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
