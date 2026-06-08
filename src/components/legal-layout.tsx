import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

/**
 * Readable long-form layout for legal pages, with anchored headings,
 * a last-updated line, and a development-only "pending legal review" warning.
 */
export function LegalLayout({
  title,
  intro,
  sections,
  isPlaceholder,
}: {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  isPlaceholder: boolean;
}) {
  const showWarning = import.meta.env.DEV && isPlaceholder;
  const lastUpdated = siteConfig.legal.lastUpdated;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lastUpdated ? `Last updated: ${lastUpdated}` : "Last updated: pending"}
        </p>
      </header>

      {showWarning && (
        <div
          role="note"
          className="mb-10 flex gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="text-sm text-foreground">
            <p className="font-semibold">Development only — pending legal review</p>
            <p className="mt-1 text-muted-foreground">
              This content is a structural placeholder and is{" "}
              <strong>not legally reviewed or production-ready</strong>. Final copy must be
              confirmed before launch.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">{intro}</div>

      {sections.length > 0 && (
        <nav
          aria-label="On this page"
          className="my-10 rounded-xl border border-border bg-card p-5"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground">
            On this page
          </p>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-foreground">{s.heading}</h2>
            <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
