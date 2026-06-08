import { QrCode } from "lucide-react";
import { getDownloadUrl } from "@/lib/site-config";
import { AppStoreBadges } from "@/components/app-store-badges";
import { cn } from "@/lib/utils";

/**
 * Full download block — rendered ONCE, in the home Download section.
 *
 * QR behavior:
 *  - When productionUrl is configured, downloadUrl is an absolute URL and a
 *    scannable QR asset can be shown. (Asset generated from the absolute URL.)
 *  - When it is not configured, no scannable code is rendered — a clearly
 *    labeled "QR code coming soon" placeholder is shown instead.
 * A clickable fallback link is always provided when an absolute URL exists.
 */
export function QrDownload({ className }: { className?: string }) {
  const downloadUrl = getDownloadUrl();

  return (
    <div
      className={cn(
        "grid items-center gap-5 rounded-xl border border-border bg-card p-4 sm:gap-8 sm:rounded-2xl sm:p-8 md:grid-cols-[auto_1fr]",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex size-28 items-center justify-center rounded-xl border border-dashed border-border bg-background sm:size-40"
          role="img"
          aria-label={
            downloadUrl ? "QR code linking to the app download page" : "QR code coming soon"
          }
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <QrCode className="size-10 text-muted-foreground" aria-hidden="true" />
            <span className="px-2 text-[11px] text-muted-foreground sm:text-xs">
              {downloadUrl ? "Scan to download" : "QR code coming soon"}
            </span>
          </div>
        </div>
        {downloadUrl && (
          <a
            href={downloadUrl}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Or open the download link
          </a>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Get the app</h3>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
            {downloadUrl
              ? "Scan the code or use a store link below to get started."
              : "Store links are on the way. Check back soon to download the app."}
          </p>
        </div>
        <AppStoreBadges />
      </div>
    </div>
  );
}
