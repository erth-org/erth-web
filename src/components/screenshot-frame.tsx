import { cn } from "@/lib/utils";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
  /** Hint for native lazy-loading; default "lazy". */
  loading?: "lazy" | "eager";
  /** Aspect ratio for the framed container, e.g. "16/10". */
  aspect?: string;
}

/**
 * Consistent screenshot frame used on Features and Updates.
 * Renders a deliberate dev-only placeholder when `src` is null.
 * Real images get explicit aspect ratio + native lazy loading.
 */
export function ScreenshotFrame({
  src,
  alt,
  className,
  loading = "lazy",
  aspect = "16/10",
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card/40",
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,oklch(var(--background))_0%,oklch(var(--card))_100%)]">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Screenshot pending
            </p>
            <p className="mt-1 max-w-xs px-6 text-xs text-muted-foreground/60">
              {alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
