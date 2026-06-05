import { cn } from "@/lib/utils";

/**
 * Erth wordmark. Compact, calm, monochrome by default with a single
 * restrained accent dot. Decorative mark is aria-hidden.
 */
export function ErthLogo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle
          cx="12"
          cy="12"
          r="9.25"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <circle cx="16.2" cy="8" r="1.6" className="fill-primary" />
      </svg>
      {showWordmark && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          Erth
        </span>
      )}
    </span>
  );
}
