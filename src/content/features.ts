import { Map, BookmarkCheck, Users, ShieldCheck, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  /** Optional path to an optimized real screenshot. Omit if not available. */
  screenshotUrl?: string | null;
  /** Flip to true ONLY for verified, production-ready entries. */
  verified: boolean;
}

/**
 * Foundational capabilities of Erth — kept intentionally short.
 * Mark `verified: true` only when the description has been confirmed
 * against the real application.
 */
export const features: Feature[] = [
  {
    title: "A living personal map",
    summary: "Pin the places that matter to you.",
    description:
      "Erth gives every person a private, evolving map of the places they care about — somewhere to keep moments anchored in the world they happened in.",
    icon: Map,
    verified: false,
  },
  {
    title: "Moments tied to place",
    summary: "Capture experiences in context.",
    description:
      "Each entry lives where it happened. Photos, notes, and memories are linked to a real location so they keep their meaning long after the moment passes.",
    icon: BookmarkCheck,
    verified: false,
  },
  {
    title: "You own your story",
    summary: "Quiet by default, sharable on your terms.",
    description:
      "Your map is yours. Erth gives you control over what stays private, what you share with people you trust, and what — if anything — is ever public.",
    icon: ShieldCheck,
    verified: false,
  },
  {
    title: "Built for the long term",
    summary: "A footprint worth revisiting years from now.",
    description:
      "Erth is designed to be a place you return to — not a feed that forgets. Its calm pace and clear structure reward looking back as much as adding new moments.",
    icon: Compass,
    verified: false,
  },
];
