import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Bug,
  Check,
  Lightbulb,
  Lock,
  MessageSquareWarning,
  Search,
  ThumbsUp,
} from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { publicFeedback } from "@/content/public-feedback";
import {
  FEEDBACK_STATUS_LABEL,
  FEEDBACK_TYPE_LABEL,
  type FeedbackType,
  type PublicFeedbackItem,
  type PublicFeedbackStatus,
} from "@/lib/public-content-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () =>
    buildPageHead({
      title: "Report an issue or suggest an idea — Erth",
      description:
        "Report a bug, flag an existing-feature issue, or suggest a new idea — and browse what's already on the public Erth roadmap.",
      path: "/report",
    }),
  component: ReportPage,
});

function ReportPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28">
          <Reveal className="space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Erth · Feedback
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Report an issue or suggest an idea
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tell us about something that's broken, something that could work
              better, or something new you'd like to see. Approved reports and
              ideas appear on the public roadmap below.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="report-form-heading"
        className="mx-auto max-w-3xl px-4 pb-16"
      >
        <ReportForm />
      </section>

      <section
        aria-labelledby="roadmap-heading"
        className="border-t border-border/60 bg-card/30"
      >
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mb-8 max-w-2xl">
            <h2
              id="roadmap-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Public roadmap
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Accepted reports and ideas, what's in progress, and what has
              already shipped. Only moderated, approved entries appear here —
              private submissions are never shown.
            </p>
          </Reveal>
          <PublicRoadmap />
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Submission form
// ---------------------------------------------------------------------------

const TYPE_CARDS: {
  value: FeedbackType;
  title: string;
  description: string;
  icon: typeof Bug;
}[] = [
  {
    value: "bug",
    title: "Report a bug",
    description: "Something is broken or behaving unexpectedly.",
    icon: Bug,
  },
  {
    value: "existing-feature-issue",
    title: "Existing-feature issue",
    description: "A current feature is difficult to use or could work better.",
    icon: MessageSquareWarning,
  },
  {
    value: "feature-suggestion",
    title: "Suggest a feature",
    description: "Propose a new capability or improvement.",
    icon: Lightbulb,
  },
];

function ReportForm() {
  const { submissionEnabled, submissionEndpoint } = siteConfig.feedback;
  const interactive = submissionEnabled && Boolean(submissionEndpoint);

  const [type, setType] = useState<FeedbackType>("bug");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!interactive || !submissionEndpoint) return;
    setStatus("submitting");
    setErrorMsg(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch(submissionEndpoint, {
        method: "POST",
        body: data,
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setStatus("success");
      form.reset();
      setType("bug");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="report-form-heading"
            className="text-xl font-semibold text-foreground"
          >
            Submit a report
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reports are reviewed by the Erth team. Nothing you send appears on
            the public roadmap until it has been approved.
          </p>
        </div>
        {!interactive && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="size-3" aria-hidden="true" />
            Coming soon
          </span>
        )}
      </div>

      {!interactive && (
        <div
          role="note"
          className="mb-6 flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <p>
            Feedback submissions are coming soon. The form below is shown for
            review only — we won't silently accept input or pretend a
            submission succeeded.
          </p>
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          className="mb-6 flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-foreground"
        >
          <Check
            className="mt-0.5 size-4 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <p>Thanks — your report has been received.</p>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground"
        >
          <AlertCircle
            className="mt-0.5 size-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p>
            Submission failed{errorMsg ? `: ${errorMsg}` : "."}. Please try again.
          </p>
        </div>
      )}

      <fieldset
        disabled={!interactive || status === "submitting"}
        className="contents"
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <p
              id="report-type-label"
              className="mb-2 text-sm font-medium text-foreground"
            >
              What are you reporting?
            </p>
            <div
              role="radiogroup"
              aria-labelledby="report-type-label"
              className="grid gap-3 sm:grid-cols-3"
            >
              {TYPE_CARDS.map((card) => {
                const checked = type === card.value;
                return (
                  <label
                    key={card.value}
                    className={cn(
                      "relative flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-ring",
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-border/80",
                    )}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={card.value}
                      checked={checked}
                      onChange={() => setType(card.value)}
                      className="sr-only"
                    />
                    <card.icon
                      className={cn(
                        "size-5",
                        checked ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {card.title}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {card.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <Field label="Short descriptive title" htmlFor="r-title" required>
            <input
              id="r-title"
              name="title"
              type="text"
              required
              maxLength={120}
              className={inputClass}
              placeholder="A one-line summary"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category" htmlFor="r-category" required>
              <input
                id="r-category"
                name="category"
                type="text"
                required
                maxLength={60}
                className={inputClass}
                placeholder="e.g. Map, Sharing, Sync"
              />
            </Field>
            <Field label="Platform" htmlFor="r-platform" required>
              <select id="r-platform" name="platform" required className={inputClass}>
                <option value="">Select…</option>
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="web">Web</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="Detailed description" htmlFor="r-desc" required>
            <textarea
              id="r-desc"
              name="description"
              required
              rows={5}
              maxLength={4000}
              className={inputClass + " min-h-32"}
              placeholder="What happened, or what would you like to see?"
            />
          </Field>

          {type === "bug" && (
            <>
              <Field label="Steps to reproduce" htmlFor="r-steps" required>
                <textarea
                  id="r-steps"
                  name="steps"
                  required
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Expected result" htmlFor="r-expected" required>
                  <textarea
                    id="r-expected"
                    name="expected"
                    required
                    rows={2}
                    maxLength={1000}
                    className={inputClass + " min-h-20"}
                  />
                </Field>
                <Field label="Actual result" htmlFor="r-actual" required>
                  <textarea
                    id="r-actual"
                    name="actual"
                    required
                    rows={2}
                    maxLength={1000}
                    className={inputClass + " min-h-20"}
                  />
                </Field>
              </div>
            </>
          )}

          {type === "existing-feature-issue" && (
            <>
              <Field label="Affected feature" htmlFor="r-affected" required>
                <input
                  id="r-affected"
                  name="affectedFeature"
                  required
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
              <Field label="Current difficulty" htmlFor="r-difficulty" required>
                <textarea
                  id="r-difficulty"
                  name="difficulty"
                  required
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
              <Field label="Desired improvement" htmlFor="r-improvement" required>
                <textarea
                  id="r-improvement"
                  name="improvement"
                  required
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
            </>
          )}

          {type === "feature-suggestion" && (
            <>
              <Field label="Problem or need" htmlFor="r-problem" required>
                <textarea
                  id="r-problem"
                  name="problem"
                  required
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
              <Field label="Suggested solution" htmlFor="r-solution" required>
                <textarea
                  id="r-solution"
                  name="solution"
                  required
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
              <Field
                label="Why would this be useful?"
                htmlFor="r-why"
                required
              >
                <textarea
                  id="r-why"
                  name="why"
                  required
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="App version" htmlFor="r-version">
              <input
                id="r-version"
                name="appVersion"
                type="text"
                maxLength={40}
                className={inputClass}
                placeholder="e.g. 1.0.0"
              />
            </Field>
            <Field label="Contact email (optional)" htmlFor="r-email">
              <input
                id="r-email"
                name="email"
                type="email"
                maxLength={255}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
            />
            <span>
              I understand my submission and any information I include will be
              reviewed by the Erth team. Nothing is published publicly until
              the team approves it.
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting"
              ? "Submitting…"
              : interactive
                ? "Submit report"
                : "Submissions disabled"}
          </button>
        </form>
      </fieldset>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="ml-1 text-primary" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public roadmap browser
// ---------------------------------------------------------------------------

type SortKey = "recent" | "votes";

function PublicRoadmap() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const categories = useMemo(() => {
    const s = new Set<string>();
    publicFeedback.forEach((i) => s.add(i.category));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = publicFeedback.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.publicDescription.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
    list = [...list].sort((a, b) =>
      sort === "votes"
        ? b.voteCount - a.voteCount
        : +new Date(b.submissionDate) - +new Date(a.submissionDate),
    );
    return list;
  }, [query, category, typeFilter, sort]);

  const hasAny = publicFeedback.length > 0;

  const groups: { status: PublicFeedbackStatus; description: string }[] = [
    { status: "accepted", description: "Approved reports and ideas." },
    { status: "in-progress", description: "Currently being developed." },
    { status: "fulfilled", description: "Released fixes and features." },
  ];

  return (
    <div className="space-y-8">
      {hasAny && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="feedback-search" className="sr-only">
              Search public feedback
            </label>
            <input
              id="feedback-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search public feedback"
              className="h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {categories.length > 0 && (
            <div>
              <label htmlFor="feedback-category" className="sr-only">
                Category
              </label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="feedback-type" className="sr-only">
              Type
            </label>
            <select
              id="feedback-type"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as FeedbackType | "all")
              }
              className="h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All types</option>
              {(Object.keys(FEEDBACK_TYPE_LABEL) as FeedbackType[]).map((t) => (
                <option key={t} value={t}>
                  {FEEDBACK_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="feedback-sort" className="sr-only">
              Sort
            </label>
            <select
              id="feedback-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 rounded-md border border-border bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="recent">Most recent</option>
              <option value="votes">Most voted</option>
            </select>
          </div>
          {(query || category !== "all" || typeFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setTypeFilter("all");
              }}
              className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {groups.map(({ status, description }) => {
          const items = filtered.filter((i) => i.status === status);
          return (
            <section
              key={status}
              aria-labelledby={`roadmap-col-${status}`}
              className="flex flex-col"
            >
              <header className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  id={`roadmap-col-${status}`}
                  className="text-sm font-semibold uppercase tracking-wide text-foreground"
                >
                  {FEEDBACK_STATUS_LABEL[status]}
                </h3>
                <StatusBadge status={status} />
              </header>
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
              <div className="mt-4 flex-1 space-y-3">
                {items.length === 0 ? (
                  <EmptyColumn status={status} />
                ) : (
                  items.map((item) => (
                    <FeedbackCard key={item.slug} item={item} />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function EmptyColumn({ status }: { status: PublicFeedbackStatus }) {
  const copy =
    status === "accepted"
      ? "No approved public reports or ideas yet."
      : status === "in-progress"
        ? "No publicly announced work is currently in progress."
        : "Released fixes and features will appear here.";
  return (
    <p className="rounded-xl border border-dashed border-border bg-background/40 p-4 text-sm text-muted-foreground">
      {copy}
    </p>
  );
}

function FeedbackCard({ item }: { item: PublicFeedbackItem }) {
  return (
    <Link
      to="/report/$slug"
      params={{ slug: item.slug }}
      className="group block rounded-xl border border-border bg-background p-4 transition-colors hover:border-border/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>{FEEDBACK_TYPE_LABEL[item.type]}</span>
        <span aria-hidden="true">·</span>
        <span>{item.category}</span>
      </div>
      <h4 className="mt-2 text-sm font-medium leading-snug text-foreground group-hover:text-primary">
        {item.title}
      </h4>
      {item.publicDescription && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.publicDescription}
        </p>
      )}
      {item.latestOfficialResponse && (
        <p className="mt-2 line-clamp-2 rounded-md border-l-2 border-primary/50 bg-card/50 px-2 py-1 text-xs italic text-foreground/80">
          “{item.latestOfficialResponse}”
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <ThumbsUp className="size-3" aria-hidden="true" />
          {item.voteCount}
          <span className="sr-only">votes</span>
        </span>
        <time dateTime={item.submissionDate}>
          {new Date(item.submissionDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </Link>
  );
}
