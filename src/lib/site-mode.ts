import { siteConfig } from "@/lib/site-config";

export type SiteMode = "beta" | "live";

export const siteMode: SiteMode = siteConfig.siteMode;

export function isBetaMode(mode: SiteMode = siteMode): boolean {
  return mode === "beta";
}

export function isLiveMode(mode: SiteMode = siteMode): boolean {
  return mode === "live";
}

const BETA_SITEMAP_PATHS = ["/", "/testing/guide", "/report", "/legal"] as const;
const LIVE_SITEMAP_PATHS = [
  "/",
  "/features",
  "/about",
  "/updates",
  "/report",
  "/contact",
  "/legal",
] as const;

export function getSitemapPaths(mode: SiteMode = siteMode): ReadonlyArray<string> {
  return mode === "beta" ? BETA_SITEMAP_PATHS : LIVE_SITEMAP_PATHS;
}
