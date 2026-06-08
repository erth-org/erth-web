import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className,
}: {
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
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
