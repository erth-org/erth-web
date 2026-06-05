// Editorial copy for the Erth website.
// No invented metrics, testimonials, partnerships, or usage numbers — only
// vision-led, verifiable product language. Update as the product evolves.

import {
  Compass,
  Map as MapIcon,
  Sparkles,
  Users,
  Building2,
  Briefcase,
  ClipboardCheck,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export interface CoreIdea {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Audience {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const vision = {
  problem:
    "The moments and places that shape a life are scattered across camera rolls, chat threads, and fading memory. There is no calm, lasting home for the experiences that actually matter.",
  why: "Where we go and what we experience is a meaningful part of who we are. Those stories deserve more than an algorithmic feed that disappears the moment you scroll past.",
  future:
    "Erth is building a living, personal map — a quiet place to capture experiences, see them in the context of the world, and revisit them over time.",
  contribution:
    "The app turns scattered moments into a coherent footprint you own: a clear, visual record of the places and experiences that define your world.",
};

export const coreIdeas: CoreIdea[] = [
  {
    icon: MapIcon,
    title: "Place at the center",
    description:
      "Experiences are anchored to where they happened, so your story unfolds across a real map rather than an endless timeline.",
  },
  {
    icon: Sparkles,
    title: "Moments that last",
    description:
      "Erth is built for keeping, not chasing reach. The things you capture are meant to be revisited, not buried.",
  },
  {
    icon: Compass,
    title: "Yours to own",
    description:
      "Your footprint belongs to you — a personal record you shape deliberately, with control over what you keep and share.",
  },
];

export const audiences: Audience[] = [
  {
    icon: Users,
    title: "People",
    description:
      "Anyone who wants a calm, lasting way to capture where they have been and what mattered along the way.",
  },
  {
    icon: Building2,
    title: "Communities",
    description:
      "Groups that want to record shared experiences and the places that bring them together.",
  },
  {
    icon: Briefcase,
    title: "Partners",
    description:
      "Organizations exploring thoughtful, place-based ways to connect with the people they serve.",
  },
  {
    icon: ClipboardCheck,
    title: "Program reviewers",
    description:
      "Reviewers who need a clear, honest picture of what Erth is, the problem it addresses, and where it is headed.",
  },
  {
    icon: LineChart,
    title: "Investors",
    description:
      "Partners who want to understand the vision, the product direction, and the long-term opportunity behind Erth.",
  },
];
