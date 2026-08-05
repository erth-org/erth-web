import { createFileRoute } from "@tanstack/react-router";
import { Beaker, Mail, MessageSquareText } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";

const CONTACT_EMAIL = "erthteamtesting@gmail.com";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildPageHead({
      title: "Contact - Erth",
      description:
        "Contact the Erth team about the private beta, product feedback, partnerships, or reviewer questions.",
      path: "/contact",
    }),
  component: ContactPage,
});

const contactCards = [
  {
    title: "Email",
    body: CONTACT_EMAIL,
    icon: Mail,
  },
  {
    title: "Private beta",
    body: "Erth is currently being tested through TestFlight with a small group of early users.",
    icon: Beaker,
  },
  {
    title: "What to send",
    body: "Tell us who you are, what you are interested in, and whether your message is about testing, feedback, review, partnership, or general product questions.",
    icon: MessageSquareText,
  },
];

function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Contact
            </p>
            <h1 className="text-balance text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Talk to the Erth team.
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Questions about the private beta, product feedback, partnerships, or reviewer access
              can be sent directly to the team.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-3 sm:gap-6 md:grid-cols-3">
          {contactCards.map((card, index) => (
            <Reveal
              key={card.title}
              delayMs={index * 70}
              className="rounded-xl border border-border bg-card p-5 sm:rounded-2xl sm:p-6"
            >
              <card.icon className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-foreground">{card.title}</h2>
              {card.title === "Email" ? (
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-2 block break-all text-sm leading-relaxed text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {card.body}
                </a>
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 text-center sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Send the Erth team a message.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Questions about the private beta, product feedback, partnerships, or reviewer access can
            be sent directly to the team.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mail className="size-4" aria-hidden="true" />
            Contact the team
          </a>
        </Reveal>
      </section>
    </>
  );
}
