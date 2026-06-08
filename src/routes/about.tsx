import { createFileRoute } from "@tanstack/react-router";
import { Archive, Feather, ShieldCheck } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { siteConfig, type TeamMember } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { TeamMemberCard } from "@/components/team-member-card";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About — Erth",
      description:
        "Erth is building a calm, lasting home for the places and moments that shape your world. Learn about the vision and the team behind it.",
      path: "/about",
    }),
  component: AboutPage,
});

const principles = [
  {
    title: "Calm by design",
    body: "We build for reflection, not for endless engagement. Erth should feel quiet and considered.",
    icon: Feather,
  },
  {
    title: "People own their story",
    body: "Your experiences are yours. We give you control over what you keep and what you share.",
    icon: ShieldCheck,
  },
  {
    title: "Built to last",
    body: "We design for the long term — a footprint worth revisiting years from now.",
    icon: Archive,
  },
];

const mockTeam: TeamMember[] = [
  {
    name: "[Demo] Ava Marin",
    role: "Product & Story",
    bio: "Mock profile for reviewing how founder and product narrative cards appear on the About page.",
    photoUrl: "mock/demo-team-ava.svg",
    linkedinUrl: null,
  },
  {
    name: "[Demo] Milo Chen",
    role: "Mobile Engineering",
    bio: "Mock profile for reviewing technical leadership content and portrait rendering.",
    photoUrl: "mock/demo-team-milo.svg",
    linkedinUrl: null,
  },
  {
    name: "[Demo] Rhea Sol",
    role: "Design Systems",
    bio: "Mock profile for reviewing visual-design and UX content density across breakpoints.",
    photoUrl: "mock/demo-team-rhea.svg",
    linkedinUrl: null,
  },
];

const mockMilestones = [
  {
    label: "[Demo] Product thesis",
    detail: "Defined the map-first memory model and privacy-first sharing principles.",
  },
  {
    label: "[Demo] Prototype review",
    detail:
      "Validated navigation, saved-place cards, and moment detail hierarchy with mock screens.",
  },
  {
    label: "[Demo] Early roadmap",
    detail: "Prioritized offline capture, selective sharing, and long-term revisiting flows.",
  },
];

function AboutPage() {
  const team = import.meta.env.DEV ? mockTeam : [];

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-10 sm:pt-28 sm:pb-12">
          <Reveal className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              About
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Erth exists because the moments and places that define a life deserve a lasting home —
              not a feed that forgets them the moment you scroll past.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {siteConfig.visionStatement}
            </p>
            <p className="hidden text-base leading-relaxed text-muted-foreground sm:block">
              Our long-term ambition is for Erth to become the place people turn to when they want
              to see the shape of their own experiences across the world — and to do it with care,
              clarity, and respect for the people who use it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Reveal className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What guides us
            </h2>
          </Reveal>
          <div className="grid gap-3 md:grid-cols-3 md:gap-6">
            {principles.map((p, i) => (
              <Reveal
                key={p.title}
                delayMs={i * 80}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 sm:block sm:rounded-2xl sm:p-6"
              >
                <p.icon className="size-5 shrink-0 text-primary sm:mb-4" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">{p.title}</h3>
                  <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <Reveal className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Demo milestones
          </h2>
          <p className="mt-3 hidden text-sm leading-relaxed text-muted-foreground sm:block">
            Mock content for reviewing roadmap-style About page density. Replace before production.
          </p>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {mockMilestones.map((item, i) => (
            <Reveal
              key={item.label}
              delayMs={i * 70}
              className="rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground sm:mt-3">{item.label}</h3>
              <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                {item.detail}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Reveal className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              The team
            </h2>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={i} delayMs={i * 70}>
                <TeamMemberCard member={member} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
