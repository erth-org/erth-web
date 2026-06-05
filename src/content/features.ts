import type { Feature } from "@/lib/public-content-types";

/**
 * Foundational Erth capabilities.
 *
 * Mark `verified: true` ONLY after the copy AND screenshot have been
 * confirmed against the live Erth application. Production hides any
 * entry where `verified === false`, so the page renders an honest empty
 * state until verified entries exist.
 *
 * Aim for ~6 entries when complete. Do NOT invent claims.
 */
export const features: Feature[] = [
  {
    id: "living-personal-map",
    title: "A living personal map",
    summary: "Pin the places that matter to you.",
    benefit:
      "Erth gives every person a private, evolving map of the places they care about — somewhere to keep moments anchored in the world they happened in.",
    screenshotSrc: null,
    screenshotAlt: "Erth personal map view",
    platforms: ["ios", "android"],
    verified: false,
  },
  {
    id: "moments-tied-to-place",
    title: "Moments tied to place",
    summary: "Capture experiences in the context they happened.",
    benefit:
      "Each entry lives where it happened. Photos, notes, and memories are linked to a real location so they keep their meaning long after the moment passes.",
    screenshotSrc: null,
    screenshotAlt: "An Erth moment pinned to a location",
    platforms: ["ios", "android"],
    verified: false,
  },
  {
    id: "you-own-your-story",
    title: "You own your story",
    summary: "Quiet by default, sharable on your terms.",
    benefit:
      "Your map is yours. Erth gives you control over what stays private, what you share with people you trust, and what — if anything — is ever public.",
    screenshotSrc: null,
    screenshotAlt: "Erth privacy and sharing controls",
    platforms: ["ios", "android"],
    verified: false,
  },
  {
    id: "built-for-the-long-term",
    title: "Built for the long term",
    summary: "A footprint worth revisiting years from now.",
    benefit:
      "Erth is designed to be a place you return to — not a feed that forgets. Its calm pace and clear structure reward looking back as much as adding new moments.",
    screenshotSrc: null,
    screenshotAlt: "Erth long-form timeline view",
    platforms: ["ios", "android"],
    verified: false,
  },
];
