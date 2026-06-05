import type { Release } from "@/lib/public-content-types";

/**
 * Real Erth release history. EMPTY until verified releases are published.
 *
 * Do NOT invent versions, dates, summaries, or changes. The /updates page
 * renders an honest empty state when this list is empty.
 *
 * Each Release.slug MUST be stable — public feedback items reference it
 * via PublicFeedbackItem.releasedInUpdateSlug, and content validation
 * fails if a fulfilled feedback item points at a missing slug.
 */
export const releases: Release[] = [];

export function getReleaseBySlug(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}
