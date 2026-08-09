import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  Bug,
  ExternalLink,
  Mail,
  MessageSquareWarning,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { isBetaMode } from "@/lib/site-mode";

export const Route = createFileRoute("/report")({
  head: () =>
    buildPageHead(
      isBetaMode()
        ? {
            title: "Report an Erth beta issue",
            description:
              "Invited Erth beta testers can report bugs, complaints, confusing interactions, and feature issues directly to the team.",
            path: "/report",
          }
        : {
            title: "Feedback - Erth",
            description: "Share product feedback with the Erth team.",
            path: "/report",
          },
    ),
  component: FeedbackPage,
});

const REPORT_TYPES = ["Bug", "Feature issue", "Confusing experience", "Complaint"] as const;
const SEVERITIES = [
  "Crash, data loss, or cannot enter",
  "Core flow blocked",
  "Workaround needed",
  "Visual or minor issue",
] as const;

interface IssueDraft {
  type: (typeof REPORT_TYPES)[number];
  severity: (typeof SEVERITIES)[number];
  feature: string;
  happened: string;
  expected: string;
  steps: string;
  device: string;
  contact: string;
}

const INITIAL_DRAFT: IssueDraft = {
  type: "Bug",
  severity: "Workaround needed",
  feature: "",
  happened: "",
  expected: "",
  steps: "",
  device: "",
  contact: "",
};

function buildIssueEmail(draft: IssueDraft): string {
  const lines = [
    "ERTH FEATURE REPORT",
    "",
    `Type: ${draft.type}`,
    `Impact: ${draft.severity}`,
    `Screen or feature: ${draft.feature.trim()}`,
    "",
    "WHAT HAPPENED",
    draft.happened.trim(),
    "",
    "WHAT I EXPECTED",
    draft.expected.trim() || "Not provided",
    "",
    "STEPS TO REPRODUCE",
    draft.steps.trim() || "Not provided",
    "",
    `Device / app build: ${draft.device.trim() || "Not provided"}`,
    `Contact email: ${draft.contact.trim() || "Not provided"}`,
  ];

  const subject = `Erth ${draft.type.toLowerCase()} — ${draft.feature.trim()}`;
  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

function FeedbackPage() {
  return isBetaMode() ? <BetaIssueReportPage /> : <LiveFeedbackPage />;
}

function BetaIssueReportPage() {
  const [draft, setDraft] = useState<IssueDraft>(INITIAL_DRAFT);
  const [validationError, setValidationError] = useState("");

  const updateDraft = <Key extends keyof IssueDraft>(key: Key, value: IssueDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setValidationError("");
  };

  const prepareEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.feature.trim() || !draft.happened.trim()) {
      setValidationError("Add the screen or feature and explain what happened.");
      requestAnimationFrame(() => {
        document
          .getElementById(!draft.feature.trim() ? "report-feature" : "report-happened")
          ?.focus();
      });
      return;
    }

    window.location.href = buildIssueEmail(draft);
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-4xl px-4 pt-12 pb-12 sm:pt-24 sm:pb-16">
          <Reveal className="space-y-4 text-center sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Closed beta feedback
            </p>
            <h1 className="text-balance text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Report an app issue.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Tell us about a bug, complaint, confusing interaction, or feature that did not work as
              expected. This form prepares a structured email for the Erth team.
            </p>
            <p className="mx-auto flex max-w-xl items-start justify-center gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              Nothing is uploaded here. Your email app opens with the report, and you decide when to
              send it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <Reveal>
          <form
            onSubmit={prepareEmail}
            className="rounded-2xl border border-border bg-card/80 p-5 shadow-2xl shadow-black/10 sm:rounded-3xl sm:p-8"
          >
            <div className="flex items-start gap-3 border-b border-border/70 pb-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Bug className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Issue details</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The screen or feature and what happened are required. Everything else is optional.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report type</Label>
                <select
                  id="report-type"
                  value={draft.type}
                  onChange={(event) =>
                    updateDraft("type", event.target.value as IssueDraft["type"])
                  }
                  className="flex min-h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {REPORT_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-severity">Impact</Label>
                <select
                  id="report-severity"
                  value={draft.severity}
                  onChange={(event) =>
                    updateDraft("severity", event.target.value as IssueDraft["severity"])
                  }
                  className="flex min-h-12 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {SEVERITIES.map((severity) => (
                    <option key={severity}>{severity}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="report-feature">Screen or feature</Label>
                <Input
                  id="report-feature"
                  value={draft.feature}
                  onChange={(event) => updateDraft("feature", event.target.value)}
                  placeholder="Example: Upload, Explore, Profile"
                  aria-invalid={Boolean(validationError && !draft.feature.trim())}
                  className="min-h-12 bg-background"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="report-happened">What happened?</Label>
                <Textarea
                  id="report-happened"
                  value={draft.happened}
                  onChange={(event) => updateDraft("happened", event.target.value)}
                  placeholder="Describe what you saw, including any error message."
                  aria-invalid={Boolean(validationError && !draft.happened.trim())}
                  className="min-h-28 resize-y bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-expected">What did you expect?</Label>
                <Textarea
                  id="report-expected"
                  value={draft.expected}
                  onChange={(event) => updateDraft("expected", event.target.value)}
                  className="min-h-28 resize-y bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-steps">Steps to reproduce</Label>
                <Textarea
                  id="report-steps"
                  value={draft.steps}
                  onChange={(event) => updateDraft("steps", event.target.value)}
                  placeholder={"1. Open…\n2. Tap…\n3. See…"}
                  className="min-h-28 resize-y bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-device">Device and app build</Label>
                <Input
                  id="report-device"
                  value={draft.device}
                  onChange={(event) => updateDraft("device", event.target.value)}
                  placeholder="Example: iPhone 16 Pro, build 412"
                  className="min-h-12 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-contact">Your email</Label>
                <Input
                  id="report-contact"
                  type="email"
                  value={draft.contact}
                  onChange={(event) => updateDraft("contact", event.target.value)}
                  placeholder="Optional, for follow-up"
                  className="min-h-12 bg-background"
                />
              </div>
            </div>

            {validationError ? (
              <p role="alert" className="mt-5 text-sm font-medium text-destructive">
                {validationError}
              </p>
            ) : null}

            <div className="mt-6 border-t border-border/70 pt-6">
              <Button type="submit" className="min-h-12 w-full rounded-xl sm:w-auto">
                Continue to email
                <ExternalLink className="size-4" aria-hidden="true" />
              </Button>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Review the prepared email, attach any relevant screenshot, then press Send in your
                email app. Never include passwords, private addresses, or payment details.
              </p>
            </div>
          </form>
        </Reveal>

        <Reveal delayMs={90} className="space-y-4">
          <aside className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-5">
            <MessageSquareWarning className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-base font-semibold text-foreground">Completing a mission?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use the tester guide instead so your task results, ratings, and notes stay together.
            </p>
            <Link
              to="/testing/guide/"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <BookOpenCheck className="size-4" aria-hidden="true" />
              Open tester guide
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </aside>

          <aside className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="text-base font-semibold text-foreground">What makes a useful report</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>Describe the last action you took before the issue.</li>
              <li>Include the screen name and exact error text.</li>
              <li>Say whether you could continue with a workaround.</li>
            </ul>
          </aside>
        </Reveal>
      </section>
    </>
  );
}

function LiveFeedbackPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-12 pb-12 sm:pt-28 sm:pb-20">
          <Reveal className="space-y-4 text-center sm:space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Product feedback
            </p>
            <h1 className="text-balance text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Help shape what Erth becomes.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Public feedback tracking will live here. Until it is enabled, send product feedback
              directly to the Erth team.
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
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
            title="Public feedback tracking is not enabled yet."
            description="A structured public feedback and roadmap experience can be activated independently of the closed-beta tester workflow."
          />
        </Reveal>
      </section>
    </>
  );
}
