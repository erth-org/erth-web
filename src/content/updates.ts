import type { Release } from "@/lib/public-content-types";

/**
 * Release history.
 *
 * DEMO CONTENT POLICY:
 * - Entries marked `isDemo: true` are mock data for layout review only.
 * - Production routes hide demo entries.
 * - The production build gate blocks while demo entries remain.
 *
 * Replace demo entries with real verified releases before launch. Each
 * Release.slug MUST be stable once published because public feedback items can
 * reference it via PublicFeedbackItem.releasedInUpdateSlug.
 */
export const releases: Release[] = [
  {
    slug: "demo-quiet-map-polish",
    version: "0.0.0-demo.3",
    releaseDate: "2026-05-20",
    title: "[Demo] Quiet map polish",
    summary:
      "Mock release notes showing how a map-focused update would read once verified release history is available.",
    heroImageSrc: "mock/demo-release-screen.svg",
    heroImageAlt: "Demo quiet map polish release visual",
    platforms: ["ios", "android"],
    majorFeature: {
      title: "[Demo] Cleaner place clusters",
      description:
        "Mock copy for a calmer cluster treatment that would make dense personal maps easier to scan without hiding important saved places.",
    },
    newFeatures: [
      {
        id: "demo-place-cluster-previews",
        title: "[Demo] Place cluster previews",
        description:
          "Mock content for previewing several saved places from a dense map area before opening the full list.",
        category: "Map",
      },
      {
        id: "demo-memory-type-filter",
        title: "[Demo] Memory type filter",
        description:
          "Mock content for reviewing how release-note bullets wrap when filters and categories are present.",
        category: "Discovery",
      },
    ],
    improvements: [
      {
        id: "demo-faster-map-return",
        title: "[Demo] Faster return to map",
        description:
          "Mock content describing a smoother return transition after closing a place detail screen.",
        category: "Performance",
      },
      {
        id: "demo-better-empty-map-state",
        title: "[Demo] Better first-place guidance",
        description:
          "Mock content for a clearer empty state that helps reviewers inspect spacing, hierarchy, and line length.",
        category: "Onboarding",
      },
    ],
    bugFixes: [
      {
        id: "demo-marker-selection-fix",
        title: "[Demo] Marker selection consistency",
        description:
          "Mock content for a small fix entry, included only to exercise the bug-fix section layout.",
        category: "Map",
      },
    ],
    isDemo: true,
  },
  {
    slug: "demo-sharing-foundations",
    version: "0.0.0-demo.2",
    releaseDate: "2026-04-18",
    title: "[Demo] Sharing foundations",
    summary:
      "Mock release notes for selective sharing flows, written only so the updates page can be reviewed with realistic density.",
    heroImageSrc: "mock/demo-sharing-screen.svg",
    heroImageAlt: "Demo sharing foundations release visual",
    platforms: ["ios", "android", "web"],
    majorFeature: {
      title: "[Demo] Trusted share links",
      description:
        "Mock copy for sharing a focused collection of places with someone you trust while keeping the rest private.",
    },
    newFeatures: [
      {
        id: "demo-private-collection-links",
        title: "[Demo] Private collection links",
        description:
          "Mock content showing a full-width feature entry with a concise user-facing explanation.",
        category: "Sharing",
      },
      {
        id: "demo-recipient-preview",
        title: "[Demo] Recipient preview",
        description:
          "Mock content for previewing how another person would see a shared place set before sending it.",
        category: "Sharing",
      },
    ],
    improvements: [
      {
        id: "demo-clearer-consent-copy",
        title: "[Demo] Clearer consent copy",
        description:
          "Mock content for reviewing shorter explanatory text near privacy-sensitive controls.",
        category: "Controls",
      },
    ],
    bugFixes: [
      {
        id: "demo-copy-link-feedback",
        title: "[Demo] Copy-link feedback",
        description: "Mock content for a small confirmation-state fix after copying a share link.",
        category: "Sharing",
      },
    ],
    isDemo: true,
  },
  {
    slug: "demo-memory-detail-refresh",
    version: "0.0.0-demo.1",
    releaseDate: "2026-03-12",
    title: "[Demo] Memory detail refresh",
    summary:
      "Mock release notes for a detail-screen refresh, included to test the timeline rhythm with multiple entries.",
    heroImageSrc: "mock/demo-moment-screen.svg",
    heroImageAlt: "Demo memory detail refresh release visual",
    platforms: ["ios"],
    majorFeature: {
      title: "[Demo] More readable moment details",
      description:
        "Mock copy for a refined detail view that gives photos, notes, and place context a clearer reading order.",
    },
    newFeatures: [
      {
        id: "demo-note-highlights",
        title: "[Demo] Note highlights",
        description: "Mock content for highlighting meaningful snippets in longer saved memories.",
        category: "Moments",
      },
    ],
    improvements: [
      {
        id: "demo-photo-loading-state",
        title: "[Demo] Photo loading state",
        description:
          "Mock content for checking how a media-heavy improvement entry fits inside the release detail view.",
        category: "Media",
      },
      {
        id: "demo-place-context-layout",
        title: "[Demo] Place context layout",
        description:
          "Mock content describing a cleaner hierarchy for address, time, and personal notes.",
        category: "Moments",
      },
    ],
    bugFixes: [
      {
        id: "demo-keyboard-scroll-fix",
        title: "[Demo] Keyboard scroll position",
        description:
          "Mock content for a form-related fix entry shown in a realistic release-note cadence.",
        category: "Forms",
      },
    ],
    isDemo: true,
  },
];

export function getReleaseBySlug(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}
