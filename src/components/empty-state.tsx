import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-xl rounded-xl border border-dashed border-border bg-card/40 p-6 text-center sm:rounded-2xl sm:p-10",
        className,
      )}
    >
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
