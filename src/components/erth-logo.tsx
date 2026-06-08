import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/asset-path";

/**
 * Official supplied transparent logo artwork, optimized for website display.
 * Generated derivatives remove only excess transparent padding.
 */
export function ErthLogo({ className }: { className?: string; showWordmark?: boolean }) {
  return (
    <img
      src={withBasePath("brand/erth-logo.png")}
      alt="Erth"
      width={512}
      height={512}
      decoding="async"
      className={cn("block h-14 w-14 object-contain", className)}
    />
  );
}
