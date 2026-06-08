import type { PublicFeedbackItem } from "@/lib/public-content-types";

/**
 * Publicly visible, moderated feedback items.
 *
 * DEMO CONTENT POLICY:
 * - Entries marked `isDemo: true` are mock data for roadmap layout review.
 * - Replace with real moderated entries before production.
 *
 * Rules enforced by src/content/validation.mjs at build time:
 *  - voteCount must be a non-negative integer.
 *  - status === "fulfilled" REQUIRES a releasedInUpdateSlug that matches a
 *    Release.slug in src/content/updates.ts.
 *  - "accepted" and "in-progress" items must NOT carry release links.
 *  - publicDescription must not contain private submitter information.
 */
export const publicFeedback: PublicFeedbackItem[] = [
  {
    slug: "demo-offline-map-save",
    type: "feature-suggestion",
    category: "Map",
    title: "[Demo] Save a place while offline",
    publicDescription:
      "Mock roadmap item for reviewing how accepted ideas appear when a user wants to save a meaningful place without network coverage.",
    voteCount: 42,
    status: "accepted",
    submissionDate: "2026-05-26",
    latestOfficialResponse:
      "Demo response: this is being evaluated with offline cache and sync requirements.",
    isDemo: true,
  },
  {
    slug: "demo-share-preview-controls",
    type: "existing-feature-issue",
    category: "Sharing",
    title: "[Demo] Preview a shared collection before sending",
    publicDescription:
      "Mock roadmap item for checking copy length and status treatment in the in-progress column.",
    voteCount: 31,
    status: "in-progress",
    submissionDate: "2026-05-14",
    latestOfficialResponse:
      "Demo response: preview controls are being shaped for the sharing flow.",
    isDemo: true,
  },
  {
    slug: "demo-marker-selection-consistency",
    type: "bug",
    category: "Map",
    title: "[Demo] Marker selection feels inconsistent",
    publicDescription:
      "Mock fulfilled report connected to a demo release so the shipped state and detail link can be reviewed.",
    voteCount: 18,
    status: "fulfilled",
    submissionDate: "2026-04-30",
    latestOfficialResponse: "Demo response: fixed in the mock quiet map polish release.",
    releasedInUpdateSlug: "demo-quiet-map-polish",
    isDemo: true,
  },
];

export function getFeedbackBySlug(slug: string): PublicFeedbackItem | undefined {
  return publicFeedback.find((i) => i.slug === slug);
}
