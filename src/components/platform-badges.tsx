import { cn } from "@/lib/utils";
import { PLATFORM_LABEL, type Platform } from "@/lib/public-content-types";

export function PlatformBadges({
  platforms,
  className,
}: {
  platforms: Platform[];
  className?: string;
}) {
  if (!platforms || platforms.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {platforms.map((p) => (
        <li
          key={p}
          className="inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          {PLATFORM_LABEL[p]}
        </li>
      ))}
    </ul>
  );
}
