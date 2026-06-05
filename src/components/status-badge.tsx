import { cn } from "@/lib/utils";
import {
  FEEDBACK_STATUS_LABEL,
  type PublicFeedbackStatus,
} from "@/lib/public-content-types";

const STYLES: Record<PublicFeedbackStatus, string> = {
  accepted:
    "border-sky-500/30 bg-sky-500/10 text-sky-300",
  "in-progress":
    "border-amber-500/30 bg-amber-500/10 text-amber-300",
  fulfilled:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

const DOT: Record<PublicFeedbackStatus, string> = {
  accepted: "bg-sky-400",
  "in-progress": "bg-amber-400",
  fulfilled: "bg-emerald-400",
};

export function StatusBadge({
  status,
  className,
}: {
  status: PublicFeedbackStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STYLES[status],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", DOT[status])}
      />
      {FEEDBACK_STATUS_LABEL[status]}
    </span>
  );
}
