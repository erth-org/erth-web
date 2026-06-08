import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Bug,
  Check,
  Lightbulb,
  MessageSquareWarning,
  Search,
  ThumbsUp,
} from "lucide-react";
import { buildPageHead } from "@/lib/seo";
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
      title: "Report — Erth",
      description:
        "Report a bug, flag an existing-feature issue, or suggest a new idea — and browse what's already on the public Erth roadmap.",
      path: "/report",
    }),
  component: ReportPage,
});

const REPORT_FORM_ID = "report-submission-form";
const LOCAL_FEEDBACK_KEY = "erth-demo-feedback-submissions";
const ROADMAP_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function scrollToReportForm() {
  if (typeof window === "undefined") return;
  const form = document.getElementById(REPORT_FORM_ID);
  if (!form) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  form.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
  window.setTimeout(() => form.focus({ preventScroll: true }), reduce ? 0 : 350);
}

function ReportPage() {
  const [localFeedback, setLocalFeedback] = useState<PublicFeedbackItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLocalFeedback(readLocalFeedback());
    const handleHash = () => {
      if (window.location.hash === `#${REPORT_FORM_ID}`) {
        window.requestAnimationFrame(scrollToReportForm);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const roadmapItems = useMemo(() => [...localFeedback, ...publicFeedback], [localFeedback]);

  function addLocalFeedback(item: PublicFeedbackItem) {
    setLocalFeedback((current) => {
      const next = [item, ...current].slice(0, 12);
      localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-10 sm:pt-28 sm:pb-12">
          <Reveal className="space-y-4 sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Feedback
            </p>
            <h1 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Report an issue or suggest an idea
            </h1>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Tell us about something that's broken, something that could work better, or something
              new you'd like to see. Approved reports and ideas appear on the public roadmap below.
            </p>
            <a
              href={`#${REPORT_FORM_ID}`}
              aria-controls={REPORT_FORM_ID}
              onClick={(event) => {
                event.preventDefault();
                window.history.pushState(null, "", `#${REPORT_FORM_ID}`);
                scrollToReportForm();
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Submit a report or idea
            </a>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="roadmap-heading" className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mb-8 max-w-2xl">
            <h2
              id="roadmap-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Public roadmap
            </h2>
            <p className="mt-3 hidden text-base leading-relaxed text-muted-foreground sm:block">
              Accepted reports and ideas, what's in progress, and what has already shipped. Only
              moderated, approved entries appear here — private submissions are never shown.
            </p>
          </Reveal>
          <PublicRoadmap items={roadmapItems} />
        </div>
      </section>

      <section
        aria-labelledby="report-form-heading"
        className="mx-auto max-w-6xl px-4 py-12 sm:py-20"
      >
        <ReportForm onSubmitted={addLocalFeedback} />
      </section>
    </>
  );
}

function readLocalFeedback(): PublicFeedbackItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_FEEDBACK_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatRoadmapDate(date: string) {
  return ROADMAP_DATE_FORMATTER.format(new Date(`${date}T00:00:00.000Z`));
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

const FEEDBACK_TYPE_STYLES: Record<
  FeedbackType,
  {
    accentText: string;
    iconSelected: string;
    iconIdle: string;
    selectedCard: string;
    idleCard: string;
    formShell: string;
    note: string;
    button: string;
    pill: string;
    roadmapCard: string;
    roadmapResponse: string;
    titleHover: string;
  }
> = {
  bug: {
    accentText: "text-red-300",
    iconSelected: "text-red-300",
    iconIdle: "text-red-300/70",
    selectedCard: "border-red-400/60 bg-red-500/10 shadow-[0_0_0_1px_rgba(248,113,113,0.16)]",
    idleCard: "hover:border-red-400/45",
    formShell:
      "border-red-500/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.09),rgba(18,18,26,0.98)_34%,rgba(18,18,26,1))]",
    note: "border-red-500/25 bg-red-500/5",
    button: "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-300",
    pill: "border-red-400/40 bg-red-500/10 text-red-200",
    roadmapCard: "border-red-500/30 bg-red-500/[0.045] hover:border-red-400/60",
    roadmapResponse: "border-red-400/55 bg-red-500/5",
    titleHover: "group-hover:text-red-200",
  },
  "existing-feature-issue": {
    accentText: "text-sky-300",
    iconSelected: "text-sky-300",
    iconIdle: "text-sky-300/70",
    selectedCard: "border-sky-400/60 bg-sky-500/10 shadow-[0_0_0_1px_rgba(56,189,248,0.16)]",
    idleCard: "hover:border-sky-400/45",
    formShell:
      "border-sky-500/30 bg-[linear-gradient(135deg,rgba(14,165,233,0.09),rgba(18,18,26,0.98)_34%,rgba(18,18,26,1))]",
    note: "border-sky-500/25 bg-sky-500/5",
    button: "bg-sky-500 text-white hover:bg-sky-400 focus-visible:ring-sky-300",
    pill: "border-sky-400/40 bg-sky-500/10 text-sky-200",
    roadmapCard: "border-sky-500/30 bg-sky-500/[0.045] hover:border-sky-400/60",
    roadmapResponse: "border-sky-400/55 bg-sky-500/5",
    titleHover: "group-hover:text-sky-200",
  },
  "feature-suggestion": {
    accentText: "text-fuchsia-300",
    iconSelected: "text-fuchsia-300",
    iconIdle: "text-fuchsia-300/70",
    selectedCard:
      "border-fuchsia-400/60 bg-fuchsia-500/10 shadow-[0_0_0_1px_rgba(217,70,239,0.16)]",
    idleCard: "hover:border-fuchsia-400/45",
    formShell:
      "border-fuchsia-500/30 bg-[linear-gradient(135deg,rgba(217,70,239,0.09),rgba(18,18,26,0.98)_34%,rgba(18,18,26,1))]",
    note: "border-fuchsia-500/25 bg-fuchsia-500/5",
    button: "bg-fuchsia-500 text-white hover:bg-fuchsia-400 focus-visible:ring-fuchsia-300",
    pill: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200",
    roadmapCard: "border-fuchsia-500/30 bg-fuchsia-500/[0.045] hover:border-fuchsia-400/60",
    roadmapResponse: "border-fuchsia-400/55 bg-fuchsia-500/5",
    titleHover: "group-hover:text-fuchsia-200",
  },
};

function ReportForm({ onSubmitted }: { onSubmitted: (item: PublicFeedbackItem) => void }) {
  const [type, setType] = useState<FeedbackType>("bug");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const selectedStyle = FEEDBACK_TYPE_STYLES[type];

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const platform = String(data.get("platform") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();

    const item: PublicFeedbackItem = {
      slug: `local-${Date.now()}`,
      type,
      category,
      title,
      publicDescription: `${description}\n\nPlatform: ${platform}`,
      voteCount: 1,
      status: "accepted",
      submissionDate: new Date().toISOString().slice(0, 10),
      latestOfficialResponse:
        "Demo local submission: saved in this browser and visible on the roadmap for review.",
      isLocal: true,
    };
    onSubmitted(item);
    setStatus("success");
    form.reset();
    setType("bug");
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors sm:rounded-2xl sm:p-8",
        selectedStyle.formShell,
      )}
    >
      <div className="mb-6 max-w-2xl">
        <div>
          <h2 id="report-form-heading" className="text-xl font-semibold text-foreground">
            Submit a report
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This demo submission flow is active. Reports are stored in your browser and added to the
            public roadmap above immediately for review.
          </p>
        </div>
      </div>

      {status === "success" && (
        <div
          role="status"
          className="mb-6 flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-foreground"
        >
          <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
          <p>Thanks — your report has been received.</p>
        </div>
      )}

      <form
        id="report-submission-form"
        tabIndex={-1}
        aria-labelledby="report-form-heading"
        onSubmit={onSubmit}
        className="scroll-mt-24 focus:outline-none"
      >
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p id="report-type-label" className="mb-2 text-sm font-medium text-foreground">
              What are you reporting?
            </p>
            <div
              role="radiogroup"
              aria-labelledby="report-type-label"
              className="grid gap-2 sm:grid-cols-3 sm:gap-3"
            >
              {TYPE_CARDS.map((card) => {
                const checked = type === card.value;
                return (
                  <label
                    key={card.value}
                    onClick={() => setType(card.value)}
                    className={cn(
                      "relative flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors focus-within:ring-2 focus-within:ring-ring sm:min-h-0 sm:flex-col sm:items-start sm:gap-2 sm:p-4",
                      checked
                        ? FEEDBACK_TYPE_STYLES[card.value].selectedCard
                        : cn(
                            "border-border bg-background/80",
                            FEEDBACK_TYPE_STYLES[card.value].idleCard,
                          ),
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
                        checked
                          ? FEEDBACK_TYPE_STYLES[card.value].iconSelected
                          : FEEDBACK_TYPE_STYLES[card.value].iconIdle,
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium text-foreground">{card.title}</span>
                    <span className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
                      {card.description}
                    </span>
                  </label>
                );
              })}
            </div>

            <div
              role="note"
              className={cn(
                "hidden rounded-xl border p-4 text-sm leading-relaxed text-muted-foreground sm:block",
                selectedStyle.note,
              )}
            >
              <AlertCircle
                className={cn("mb-2 size-4", selectedStyle.accentText)}
                aria-hidden="true"
              />
              Keep it concise. Include the outcome you expected, what happened, and the platform.
              Avoid private account data or exact personal locations.
            </div>
          </div>

          <div className="space-y-5">
            <Field label="Short title" htmlFor="r-title" required>
              <input
                id="r-title"
                name="title"
                type="text"
                required
                maxLength={100}
                className={inputClass}
                placeholder="A one-line summary"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <Field label="Category" htmlFor="r-category" required>
                <select id="r-category" name="category" required className={inputClass}>
                  <option value="">Select…</option>
                  <option value="Map">Map</option>
                  <option value="Moments">Moments</option>
                  <option value="Sharing">Sharing</option>
                  <option value="Account">Account</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Platform" htmlFor="r-platform" required>
                <select id="r-platform" name="platform" required className={inputClass}>
                  <option value="">Select…</option>
                  <option value="iOS">iOS</option>
                  <option value="Android">Android</option>
                  <option value="Web">Web</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>

            <Field label="What should we know?" htmlFor="r-desc" required>
              <textarea
                id="r-desc"
                name="description"
                required
                rows={6}
                maxLength={1200}
                className={inputClass + " min-h-36"}
                placeholder="What happened, or what would you like to see?"
              />
            </Field>

            <Field label="Contact email (optional)" htmlFor="r-email">
              <input
                id="r-email"
                name="email"
                type="email"
                maxLength={160}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>

            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="consent"
                required
                className="mt-1 size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
              />
              <span>
                I understand this demo stores my submission in this browser and displays it on the
                roadmap for review.
              </span>
            </label>

            <button
              type="submit"
              className={cn(
                "inline-flex min-h-11 w-full items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 sm:w-auto",
                selectedStyle.button,
              )}
            >
              Submit report
            </button>
          </div>
        </div>
      </form>
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
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
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

function PublicRoadmap({ items }: { items: PublicFeedbackItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "all">("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const categories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => s.add(i.category));
    return Array.from(s).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
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
  }, [items, query, category, typeFilter, sort]);

  const hasAny = items.length > 0;

  const groups: { status: PublicFeedbackStatus; description: string }[] = [
    { status: "accepted", description: "Approved reports and ideas." },
    { status: "in-progress", description: "Currently being developed." },
    { status: "fulfilled", description: "Released fixes and features." },
  ];

  return (
    <div className="space-y-8">
      {hasAny && (
        <div className="grid gap-3 rounded-xl border border-border bg-background p-3 sm:flex sm:flex-row sm:items-center">
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
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring sm:w-auto"
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
              onChange={(e) => setTypeFilter(e.target.value as FeedbackType | "all")}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring sm:w-auto"
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
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring sm:w-auto"
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
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear
            </button>
          )}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3 md:gap-6">
        {groups.map(({ status, description }) => {
          const items = filtered.filter((i) => i.status === status);
          return (
            <section
              key={status}
              aria-labelledby={`roadmap-col-${status}`}
              className="flex flex-col"
            >
              <header className="flex items-center justify-between gap-2">
                <h3
                  id={`roadmap-col-${status}`}
                  className="text-sm font-semibold uppercase tracking-wide text-foreground"
                >
                  {FEEDBACK_STATUS_LABEL[status]}
                </h3>
                <StatusBadge status={status} />
              </header>
              <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{description}</p>
              <div className="mt-4 flex-1 space-y-3">
                {items.length === 0 ? (
                  <EmptyColumn status={status} />
                ) : (
                  items.map((item) => <FeedbackCard key={item.slug} item={item} />)
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
    <p className="rounded-xl border border-dashed border-border bg-background/40 p-3 text-sm text-muted-foreground sm:p-4">
      {copy}
    </p>
  );
}

function FeedbackCard({ item }: { item: PublicFeedbackItem }) {
  const style = FEEDBACK_TYPE_STYLES[item.type];
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:gap-2">
        <span className={cn("rounded-full border px-2 py-0.5", style.pill)}>
          {FEEDBACK_TYPE_LABEL[item.type]}
        </span>
        <span aria-hidden="true">·</span>
        <span>{item.category}</span>
        {(item.isDemo || item.isLocal) && (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.isLocal ? "Local demo" : "Demo"}</span>
          </>
        )}
      </div>
      <h4
        className={cn(
          "erth-mobile-clamp-2 mt-2 text-sm font-medium leading-snug text-foreground",
          style.titleHover,
        )}
      >
        {item.title}
      </h4>
      {item.publicDescription && (
        <p className="mt-2 hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:block">
          {item.publicDescription}
        </p>
      )}
      {item.latestOfficialResponse && (
        <p
          className={cn(
            "mt-2 hidden line-clamp-2 rounded-md border-l-2 px-2 py-1 text-xs italic text-foreground/80 sm:block",
            style.roadmapResponse,
          )}
        >
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
          <span className="sm:hidden">
            {new Date(`${item.submissionDate}T00:00:00.000Z`).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </span>
          <span className="hidden sm:inline">{formatRoadmapDate(item.submissionDate)}</span>
        </time>
      </div>
    </>
  );

  if (item.isLocal) {
    return (
      <article className={cn("rounded-xl border p-3 sm:p-4", style.roadmapCard)}>{content}</article>
    );
  }

  return (
    <Link
      to="/report/$slug"
      params={{ slug: item.slug }}
      className={cn(
        "group block rounded-xl border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4",
        style.roadmapCard,
      )}
    >
      {content}
    </Link>
  );
}
