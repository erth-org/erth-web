import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Mail, MessageSquareWarning } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { isBetaMode } from "@/lib/site-mode";

const CONTACT_EMAIL = "erthteamtesting@gmail.com";

export const Route = createFileRoute("/contact")({
  beforeLoad: () => {
    if (isBetaMode()) throw redirect({ to: "/" });
  },
  head: () =>
    buildPageHead({
      title: "Contact - Erth",
      description:
        "Contact the Erth team with general questions, partnerships, or product feedback.",
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
    title: "App feedback",
    body: "Use the structured issue report for bugs, complaints, confusing interactions, and feature problems.",
    icon: MessageSquareWarning,
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
              General product or partnership questions can be sent directly to the team. Product
              feedback belongs in the dedicated report flow.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
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
            For general questions, email the team. If your message is about the app experience, use
            the issue report so the details arrive in a consistent format.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mail className="size-4" aria-hidden="true" />
            Contact the team
          </a>
          <Link
            to="/report/"
            className="ml-0 mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:ml-2 sm:mt-6"
          >
            <MessageSquareWarning className="size-4" aria-hidden="true" />
            Report an app issue
          </Link>
        </Reveal>
      </section>
    </>
  );
}
