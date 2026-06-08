// ============================================================================
// Erth — typed site config + derived helpers.
//
// Raw values and the placeholder-detection logic live in the plain ESM module
// `site-config.data.mjs` so the production build gate (scripts/check-site-config.mjs)
// can reuse the exact same logic under Node without transpilation.
//
// Two layers of placeholder protection:
//   1. hasUnresolvedPlaceholders()  -> dev/preview only, drives a visible banner
//   2. scripts/check-site-config.mjs -> runs before `vite build` (production) and
//                                        hard-fails the build. validateSiteConfig()
//                                        below is a secondary runtime safety net.
// ============================================================================

import {
  PLACEHOLDER as RAW_PLACEHOLDER,
  siteConfigData,
  getUnresolvedPlaceholders as rawGetUnresolved,
  isPlaceholderTeamMember as rawIsPlaceholderMember,
  type SiteConfigData,
  type TeamMemberData,
} from "./site-config.data.mjs";

export const PLACEHOLDER = RAW_PLACEHOLDER;

export type TeamMember = TeamMemberData;
export type SiteConfig = SiteConfigData;

export const siteConfig: SiteConfig = siteConfigData;

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

/** Production origin if configured, otherwise null. */
export function getProductionUrl(): string | null {
  return siteConfig.productionUrl ? siteConfig.productionUrl.replace(/\/$/, "") : null;
}

/** Absolute URL for a path, or null when productionUrl is not configured. */
export function absoluteUrl(path: string): string | null {
  const origin = getProductionUrl();
  if (!origin) return null;
  return new URL(path.replace(/^\/+/, ""), origin + "/").toString();
}

/** Absolute download deep-link, or null when productionUrl is not configured. */
export function getDownloadUrl(): string | null {
  const origin = getProductionUrl();
  if (!origin) return null;
  return new URL("#download", origin + "/").toString();
}

export function hasRealStoreLinks(): boolean {
  return Boolean(siteConfig.store.appStoreUrl || siteConfig.store.googlePlayUrl);
}

/** Real, fully-resolved team members only. */
export function getPublishableTeam(): TeamMember[] {
  return siteConfig.team.filter((m) => !rawIsPlaceholderMember(m));
}

// ---------------------------------------------------------------------------
// Placeholder detection (shared logic)
// ---------------------------------------------------------------------------

export function getUnresolvedPlaceholders(): string[] {
  return rawGetUnresolved(siteConfig);
}

export function hasUnresolvedPlaceholders(): boolean {
  return getUnresolvedPlaceholders().length > 0;
}

/**
 * Runtime safety net. The authoritative production gate is
 * scripts/check-site-config.mjs (run before `vite build`).
 */
export function validateSiteConfig(): void {
  const issues = getUnresolvedPlaceholders();
  if (issues.length > 0) {
    throw new Error(
      "[validateSiteConfig] Unresolved placeholders:\n" + issues.map((i) => `  - ${i}`).join("\n"),
    );
  }
}
