import type { Feature } from "@/lib/public-content-types";

/**
 * Foundational capabilities.
 *
 * DEMO CONTENT POLICY:
 * - Entries marked `isDemo: true` are mock data for layout review only.
 * - Production routes hide demo entries.
 * - The production build gate blocks while demo entries remain.
 *
 * Replace demo entries with verified real content before launch. Mark
 * `verified: true` ONLY after the copy and screenshot have been confirmed
 * against the live application.
 */
export const features: Feature[] = [
  {
    id: "living-personal-map",
    title: "[Demo] A living personal map",
    summary:
      "A calm map surface for saving meaningful places, memories, and context without turning them into a public feed.",
    benefit:
      "Gives each person a private, evolving view of the places they care about, with enough structure to revisit moments months or years later.",
    screenshotSrc: "mock/demo-map-screen.svg",
    screenshotAlt: "Demo personal map view layout",
    platforms: ["ios", "android"],
    verified: false,
    isDemo: true,
  },
  {
    id: "moments-tied-to-place",
    title: "[Demo] Moments tied to place",
    summary:
      "Capture notes, photos, and memory details in the location context where they happened.",
    benefit:
      "Keeps the meaning around a memory intact by connecting it to the real-world setting, not just a timestamp.",
    screenshotSrc: "mock/demo-moment-screen.svg",
    screenshotAlt: "Demo place-based moment detail layout",
    platforms: ["ios", "android"],
    verified: false,
    isDemo: true,
  },
  {
    id: "you-own-your-story",
    title: "[Demo] Private by default",
    summary: "Keep personal entries quiet, then choose what to share only when sharing adds value.",
    benefit:
      "Supports a reflective experience where ownership and consent are clear before anything becomes visible to someone else.",
    screenshotSrc: "mock/demo-sharing-screen.svg",
    screenshotAlt: "Demo privacy and sharing controls layout",
    platforms: ["ios", "android"],
    verified: false,
    isDemo: true,
  },
  {
    id: "built-for-the-long-term",
    title: "[Demo] Built for the long term",
    summary:
      "A lasting archive that rewards returning to past places instead of chasing constant posting.",
    benefit:
      "Creates a digital footprint that stays useful as it grows, with a calmer pace and clearer structure than a disposable timeline.",
    screenshotSrc: "mock/demo-map-screen.svg",
    screenshotAlt: "Demo long-term memory archive layout",
    platforms: ["ios", "android"],
    verified: false,
    isDemo: true,
  },
  {
    id: "review-ready-sharing",
    title: "[Demo] Thoughtful sharing controls",
    summary:
      "Share selected places or collections with trusted people while keeping the broader map private.",
    benefit:
      "Makes collaboration and discovery possible without forcing every memory into a public broadcast model.",
    screenshotSrc: "mock/demo-sharing-screen.svg",
    screenshotAlt: "Demo selective sharing layout",
    platforms: ["ios", "android", "web"],
    verified: false,
    isDemo: true,
  },
  {
    id: "context-rich-revisiting",
    title: "[Demo] Context-rich revisiting",
    summary:
      "Surface older moments through place, time, and personal meaning so returning to the map feels useful.",
    benefit:
      "Helps people rediscover patterns in where they have been and what mattered without needing to remember exact dates.",
    screenshotSrc: "mock/demo-moment-screen.svg",
    screenshotAlt: "Demo memory revisiting layout",
    platforms: ["ios", "android"],
    verified: false,
    isDemo: true,
  },
];
