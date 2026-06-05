import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Check, Lock } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { publicRoadmap, type RoadmapStatus } from "@/content/public-roadmap";

export const Route = createFileRoute("/report")({
  head: () =>
    buildPageHead({
      title: "Report an issue or suggest an idea — Erth",
      description:
        "Tell us about a bug, an issue with an existing feature, or a new idea — and see what's already on the public roadmap.",
      path: "/report",
    }),
  component: ReportPage,
});

type ReportType =
  | "bug"
  | "existing-feature"
  | "feature-suggestion"
  | "general-feedback";

const reportTypes: { value: ReportType; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "existing-feature", label: "Existing feature issue" },
  { value: "feature-suggestion", label: "Feature suggestion" },
  { value: "general-feedback", label: "General feedback" },
];

function ReportPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-10 sm:pt-24">
        <Reveal className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Your voice shapes Erth
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Report an issue or suggest an idea
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            We read every submission. Tell us about something that's broken,
            something that could work better, or something new you'd like to
            see — then take a look at what's already on the public roadmap.
          </p>
        </Reveal>
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
        <div className="mx-auto max-w-5xl px-4 py-20">
          <Reveal className="mb-10 max-w-2xl">
            <h2
              id="roadmap-heading"
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Public roadmap
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              A small, curated view of where Erth is going. Only items the team
              has chosen to share publicly appear here.
            </p>
          </Reveal>
          <PublicRoadmap />
        </div>
      </section>
    </>
  );
}

function ReportForm() {
  const { enabled, endpoint } = siteConfig.reporting;
  const interactive = enabled && Boolean(endpoint);

  const [type, setType] = useState<ReportType>("bug");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!interactive || !endpoint) return;

    setStatus("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(endpoint, {
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
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2
            id="report-form-heading"
            className="text-xl font-semibold text-foreground"
          >
            Submit a report
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All fields except contact email are required where shown.
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
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>
            Submissions are temporarily disabled while we connect the report
            form to the Erth backend. The form below is read-only until then —
            we will not silently drop your input.
          </p>
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          className="mb-6 flex gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-sm text-foreground"
        >
          <Check className="mt-0.5 size-4 shrink-0 text-green-500" aria-hidden="true" />
          <p>Thanks — your report has been received.</p>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <p>Submission failed{errorMsg ? `: ${errorMsg}` : "."}. Please try again.</p>
        </div>
      )}

      <fieldset disabled={!interactive || status === "submitting"} className="contents">
        <form onSubmit={onSubmit} className="space-y-5">
          <Field label="Report type" htmlFor="r-type" required>
            <select
              id="r-type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as ReportType)}
              className={inputClass}
              required
            >
              {reportTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Short title" htmlFor="r-title" required>
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

          {(type === "bug" || type === "existing-feature") && (
            <>
              <Field label="Steps to reproduce" htmlFor="r-steps">
                <textarea
                  id="r-steps"
                  name="steps"
                  rows={3}
                  maxLength={2000}
                  className={inputClass + " min-h-24"}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Expected result" htmlFor="r-expected">
                  <textarea
                    id="r-expected"
                    name="expected"
                    rows={2}
                    maxLength={1000}
                    className={inputClass + " min-h-20"}
                  />
                </Field>
                <Field label="Actual result" htmlFor="r-actual">
                  <textarea
                    id="r-actual"
                    name="actual"
                    rows={2}
                    maxLength={1000}
                    className={inputClass + " min-h-20"}
                  />
                </Field>
              </div>
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Platform" htmlFor="r-platform">
              <select id="r-platform" name="platform" className={inputClass}>
                <option value="">Select…</option>
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="web">Web</option>
                <option value="other">Other</option>
              </select>
            </Field>
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
          </div>

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

          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 size-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
            />
            <span>
              I understand my submission and any information I include will be
              reviewed by the Erth team and may be used to improve the app.
            </span>
          </label>

          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting…" : interactive ? "Submit report" : "Submissions disabled"}
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
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-primary" aria-hidden="true">*</span>}
      </label>
      {children}
    </div>
  );
}

function PublicRoadmap() {
  const groups: { status: RoadmapStatus; label: string }[] = [
    { status: "accepted", label: "Accepted" },
    { status: "in-progress", label: "In progress" },
    { status: "completed", label: "Completed" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {groups.map(({ status, label }) => {
        const items = publicRoadmap.filter((i) => i.status === status);
        return (
          <div
            key={status}
            className="flex flex-col rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
              {label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {items.length} item{items.length === 1 ? "" : "s"}
            </p>
            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing public here yet.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border/70 bg-background p-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category}
                      {item.updatedAt ? ` · ${item.updatedAt}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
