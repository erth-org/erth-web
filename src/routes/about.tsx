import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { siteConfig, getPublishableTeam } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { TeamMemberCard } from "@/components/team-member-card";

export const Route = createFileRoute("/about")({
  head: () =>
    buildPageHead({
      title: "About Erth — Why we are building it",
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
  },
  {
    title: "People own their story",
    body: "Your experiences are yours. We give you control over what you keep and what you share.",
  },
  {
    title: "Built to last",
    body: "We design for the long term — a footprint worth revisiting years from now.",
  },
];

function AboutPage() {
  // In production, only real team members are shown; placeholders are dropped.
  // In development, placeholder cards demonstrate the intended layout.
  const team = import.meta.env.DEV ? siteConfig.team : getPublishableTeam();

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28">
          <Reveal className="space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              About Erth
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              Erth exists because the moments and places that define a life
              deserve a lasting home — not a feed that forgets them the moment you
              scroll past.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {siteConfig.visionStatement}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Our long-term ambition is for Erth to become the place people turn
              to when they want to see the shape of their own experiences across
              the world — and to do it with care, clarity, and respect for the
              people who use it.
            </p>
          </Reveal>
        </div>
      </section>


      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What guides us
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal
                key={p.title}
                delayMs={i * 80}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <Reveal className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              The team
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={i} delayMs={i * 70}>
                <TeamMemberCard
                  member={
                    import.meta.env.DEV
                      ? {
                          ...member,
                          name:
                            member.name === "__PLACEHOLDER__"
                              ? "[Team member name]"
                              : member.name,
                          role:
                            member.role === "__PLACEHOLDER__"
                              ? "[Role]"
                              : member.role,
                          bio:
                            member.bio === "__PLACEHOLDER__"
                              ? "[Short bio — placeholder shown in development only.]"
                              : member.bio,
                        }
                      : member
                  }
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
