// Approved product copy shared by the beta-purpose and live marketing surfaces.

import {
  Award,
  Compass,
  Globe2,
  Images,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ProductTruth {
  icon: LucideIcon;
  label: string;
  headline: string;
  body: string;
}

export interface EditorialCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const productTruths: ProductTruth[] = [
  {
    icon: Globe2,
    label: "Your Globe",
    headline: "A world shaped by where you have been.",
    body: "Every place you capture becomes part of a personal globe that grows with your journeys.",
  },
  {
    icon: MapPin,
    label: "Your Memories",
    headline: "The context behind every trip.",
    body: "Keep moments connected to where they happened, who was there, and why they mattered.",
  },
  {
    icon: UserRound,
    label: "Your Travel Identity",
    headline: "More than a profile.",
    body: "Share the world you are building through real experiences, not only polished highlights.",
  },
];

export const coreIdeas: EditorialCard[] = [
  {
    icon: Globe2,
    title: "A living personal globe",
    description:
      "Your profile is a 3D world shaped by the places you have been and the memories you choose to keep.",
  },
  {
    icon: Images,
    title: "Moments with context",
    description:
      "Memories stay connected to location, date, trip, and people, so they are easy to revisit years later.",
  },
  {
    icon: Route,
    title: "Trips as stories",
    description:
      "Group moments into complete adventures instead of leaving them as scattered photos or isolated posts.",
  },
  {
    icon: ShieldCheck,
    title: "Social without the performance",
    description:
      "Share real travel context with friends. You decide what stays private, what you share, and what becomes public.",
  },
  {
    icon: Compass,
    title: "Explore real journeys",
    description:
      "Discover travel inspiration through people's actual trips and memories, not generic lists or anonymous recommendations.",
  },
  {
    icon: Award,
    title: "Progress that feels earned",
    description:
      "Zenith adds badges and milestones that celebrate how your personal world grows over time.",
  },
];

export const audiences: EditorialCard[] = [
  {
    icon: Compass,
    title: "Travelers",
    description: "For people who want every journey to become part of a visible personal world.",
  },
  {
    icon: Images,
    title: "Memory keepers",
    description:
      "For people who care about the real story behind a trip: the place, the people, the timing, and the feeling.",
  },
  {
    icon: Users,
    title: "Friend groups",
    description:
      "For groups who want shared adventures to stay connected instead of disappearing across chats and galleries.",
  },
  {
    icon: Search,
    title: "Future explorers",
    description: "For anyone looking for inspiration through real journeys from real people.",
  },
  {
    icon: Sparkles,
    title: "Private beta testers",
    description: "For early users helping us test the fundamentals before Erth opens more widely.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewers",
    description:
      "For people evaluating the product vision, current beta scope, and long-term direction.",
  },
];
