import { createFileRoute } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/updates")({
  head: () =>
    buildPageHead({
      title: "Updates - Erth",
      description: "Erth product updates will appear here as the private beta progresses.",
      path: "/updates",
    }),
  component: UpdatesPage,
});

function UpdatesPage() {
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
              Product updates will appear here.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              As Erth moves through private beta, we will use this page to share verified releases,
              improvements, and fixes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
        <Reveal>
          <EmptyState
            icon={<Clock3 className="size-6 text-primary" aria-hidden="true" />}
            title="No public updates yet."
            description="Erth is currently in private TestFlight beta. Public release notes will be added once updates are ready to share outside the tester group."
          />
        </Reveal>
      </section>
    </>
  );
}
