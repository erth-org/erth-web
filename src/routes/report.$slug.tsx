import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ThumbsUp } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { getFeedbackBySlug } from "@/content/public-feedback";
import { getReleaseBySlug } from "@/content/updates";
import { siteConfig } from "@/lib/site-config";
import { FEEDBACK_TYPE_LABEL } from "@/lib/public-content-types";

export const Route = createFileRoute("/report/$slug")({
  loader: ({ params }): import("@/lib/public-content-types").PublicFeedbackItem => {
    const item = getFeedbackBySlug(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) =>
    buildPageHead({
      title: loaderData
        ? `${loaderData.title} · Erth public feedback`
        : "Feedback — Erth",
      description:
        loaderData?.publicDescription ??
        "A public feedback item on the Erth roadmap.",
      path: `/report/${loaderData?.slug ?? ""}`,
    }),
  component: FeedbackDetail,
  errorComponent: ErrorView,
  notFoundComponent: NotFoundView,
});

function FeedbackDetail() {
  const item = Route.useLoaderData();
  const release =
    item.status === "fulfilled" && item.releasedInUpdateSlug
      ? getReleaseBySlug(item.releasedInUpdateSlug)
      : undefined;
  const votingInteractive =
    siteConfig.feedback.votingEnabled &&
    Boolean(siteConfig.feedback.votingEndpoint);

  return (
    <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:pt-24">
      <Link
        to="/report"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to roadmap
      </Link>

      <Reveal className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {FEEDBACK_TYPE_LABEL[item.type]} · {item.category}
          </span>
        </div>
        <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {item.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ThumbsUp className="size-4" aria-hidden="true" />
            <span className="font-medium text-foreground">{item.voteCount}</span>
            <span>votes</span>
            {!votingInteractive && (
              <span className="ml-2 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider">
                Read only
              </span>
            )}
          </span>
          <time dateTime={item.submissionDate}>
            Submitted{" "}
            {new Date(item.submissionDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
      </Reveal>

      {item.publicDescription && (
        <Reveal className="mt-8">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
            {item.publicDescription}
          </p>
        </Reveal>
      )}

      {item.latestOfficialResponse && (
        <Reveal className="mt-8 rounded-2xl border-l-2 border-primary/60 bg-card/40 p-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
            Latest official response
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {item.latestOfficialResponse}
          </p>
        </Reveal>
      )}

      {item.status === "fulfilled" && release && (
        <Reveal className="mt-10">
          <Link
            to="/updates/$slug"
            params={{ slug: release.slug }}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 transition-colors hover:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                Shipped in {release.version}
              </p>
              <p className="mt-1 text-base font-medium text-foreground">
                View the release where this shipped
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{release.title}</p>
            </div>
            <ArrowRight
              className="size-5 shrink-0 text-emerald-300 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      )}

      <div className="mt-16 border-t border-border/60 pt-6">
        <Link
          to="/report"
          className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to public roadmap
        </Link>
      </div>
    </article>
  );
}

function NotFoundView() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Feedback item not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        That entry doesn't exist or isn't public.
      </p>
      <Link
        to="/report"
        className="mt-6 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to roadmap
      </Link>
    </div>
  );
}

function ErrorView({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Something went wrong loading this item.
      </h1>
      <button
        type="button"
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="mt-6 inline-flex min-h-11 items-center rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-accent/10"
      >
        Try again
      </button>
    </div>
  );
}
