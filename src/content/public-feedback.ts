import type { PublicFeedbackItem } from "@/lib/public-content-types";

/**
 * Publicly visible, moderated feedback items. EMPTY until real moderated
 * entries are approved by the Erth team.
 *
 * Rules enforced by src/content/validation.mjs at build time:
 *  - voteCount must be a non-negative integer.
 *  - status === "fulfilled" REQUIRES a releasedInUpdateSlug that matches a
 *    Release.slug in src/content/updates.ts.
 *  - "accepted" and "in-progress" items must NOT carry release links.
 *  - publicDescription must not contain private submitter information.
 */
export const publicFeedback: PublicFeedbackItem[] = [];

export function getFeedbackBySlug(slug: string): PublicFeedbackItem | undefined {
  return publicFeedback.find((i) => i.slug === slug);
}
