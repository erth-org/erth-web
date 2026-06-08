import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { getUnresolvedPlaceholders } from "@/lib/site-config";

/**
 * Visible, dismissible banner listing unresolved placeholders.
 * Rendered in development/preview only — never in production builds.
 */
export function DevPlaceholderBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!import.meta.env.DEV) return null;

  const issues = getUnresolvedPlaceholders();
  if (issues.length === 0 || dismissed) return null;

  return (
    <div
      role="status"
      className="border-b border-primary/40 bg-primary/10 px-4 py-2 text-xs text-foreground"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="flex-1">
          <span className="font-semibold">Development build:</span> {issues.length} unresolved
          placeholder
          {issues.length === 1 ? "" : "s"} ({issues.join("; ")}). Production builds are blocked
          until these are resolved in <code className="font-mono">src/lib/site-config.ts</code>.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss development warning"
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
