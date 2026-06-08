// Shared, canonical types for Erth's public product surface:
// Features, Updates (releases), and public Feedback / Roadmap.
//
// Every item in src/content/* MUST conform to these types and pass the
// validation in src/content/validation.mjs. The production build gate fails
// if any entry contains placeholder or invented data.

export type Platform = "ios" | "android" | "web";

export interface Feature {
  /** Stable id (kebab-case). Used for keys + linking. */
  id: string;
  title: string;
  /** One-sentence explanation of what this capability does. */
  summary: string;
  /** Why it matters to the user. */
  benefit: string;
  /**
   * Path to an optimized real Erth screenshot (AVIF/WebP preferred).
   * `null` when no real screenshot exists yet — entry is dev-only.
   */
  screenshotSrc: string | null;
  screenshotAlt: string;
  platforms: Platform[];
  /**
   * Flip to true ONLY when copy + screenshot are confirmed against the
   * live application. Production hides unverified entries.
   */
  verified: boolean;
  /**
   * Demo-only content used to review layouts before real published content is
   * available. Production routes hide demo entries and the production build
   * gate blocks while demo entries remain.
   */
  isDemo?: boolean;
}

export interface ReleaseChange {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

export interface Release {
  /** Stable slug used in /updates/$slug. */
  slug: string;
  /** Semantic version string, e.g. "1.2.0". */
  version: string;
  /** ISO 8601 date, e.g. "2026-06-05". */
  releaseDate: string;
  title: string;
  summary: string;
  heroImageSrc: string | null;
  heroImageAlt: string;
  platforms: Platform[];
  majorFeature?: {
    title: string;
    description: string;
  };
  newFeatures: ReleaseChange[];
  improvements: ReleaseChange[];
  bugFixes: ReleaseChange[];
  /**
   * Demo-only content used to review layouts before real published content is
   * available. Production routes hide demo entries and the production build
   * gate blocks while demo entries remain.
   */
  isDemo?: boolean;
}

export type FeedbackType = "bug" | "existing-feature-issue" | "feature-suggestion";

export type PublicFeedbackStatus = "accepted" | "in-progress" | "fulfilled";

export interface PublicFeedbackItem {
  /** Stable slug used in /report/$slug. */
  slug: string;
  type: FeedbackType;
  category: string;
  title: string;
  /** Public-safe description — never include private submitter data. */
  publicDescription: string;
  /** Verified non-negative integer. Read-only until voting endpoint exists. */
  voteCount: number;
  status: PublicFeedbackStatus;
  /** ISO 8601 date. */
  submissionDate: string;
  /** Latest official Erth response. Empty string = none yet. */
  latestOfficialResponse: string;
  /**
   * Required when status === "fulfilled" — must match a Release.slug
   * in src/content/updates.ts. Validation enforces this.
   */
  releasedInUpdateSlug?: string;
  /** Demo-only roadmap content, or a local browser-only submission. */
  isDemo?: boolean;
  isLocal?: boolean;
}

export const FEEDBACK_TYPE_LABEL: Record<FeedbackType, string> = {
  bug: "Bug",
  "existing-feature-issue": "Existing feature issue",
  "feature-suggestion": "Feature suggestion",
};

export const FEEDBACK_STATUS_LABEL: Record<PublicFeedbackStatus, string> = {
  accepted: "Accepted",
  "in-progress": "In Progress",
  fulfilled: "Fulfilled",
};

export const PLATFORM_LABEL: Record<Platform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
};
