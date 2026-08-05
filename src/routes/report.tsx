import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquareText } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { EmptyState } from "@/components/empty-state";

const CONTACT_EMAIL = "erthteamtesting@gmail.com";

export const Route = createFileRoute("/report")({
  head: () =>
    buildPageHead({
      title: "Feedback - Erth",
      description:
        "Public feedback tracking is coming soon. During private beta, testers can contact the Erth team directly.",
      path: "/report",
    }),
  component: FeedbackPage,
});

function FeedbackPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 text-center sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Coming Soon
            </p>
            <h1 className="text-balance text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Public feedback tracking is coming soon.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              During the private beta, testers can send feedback directly to the Erth team. A public
              roadmap and structured report flow will be added later.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Mail className="size-4" aria-hidden="true" />
              Email feedback
            </a>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
        <Reveal>
          <EmptyState
            icon={<MessageSquareText className="size-6 text-primary" aria-hidden="true" />}
            title="Feedback is handled directly during beta."
            description="For now, we are collecting tester feedback by direct contact so we can move quickly, ask follow-up questions, and keep the beta focused. Public issue tracking will come later."
          />
        </Reveal>
      </section>
    </>
  );
}
