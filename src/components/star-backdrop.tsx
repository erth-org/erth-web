import { cn } from "@/lib/utils";

/**
 * Subtle, lightweight star backdrop.
 *
 * Implementation: a few stacked CSS radial-gradients on a single absolutely
 * positioned div. No canvas, no per-star DOM nodes, no parallax. Fades to
 * transparent in the center via a CSS mask so it never sits behind body copy.
 * Animation is a very slow opacity drift on one layer only; disabled under
 * prefers-reduced-motion via a global rule in styles.css.
 *
 * Use ONLY behind marketing hero areas. Do NOT use on legal or form pages.
 */
export function StarBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="erth-stars-layer erth-stars-layer-static absolute inset-0" />
      <div className="erth-stars-layer erth-stars-layer-twinkle absolute inset-0" />
    </div>
  );
}
