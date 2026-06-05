export type RoadmapStatus = "accepted" | "in-progress" | "completed";

export interface RoadmapItem {
  id: string;
  title: string;
  /** Short public description — never include private user data. */
  description: string;
  category: string;
  status: RoadmapStatus;
  /** ISO date of last status change. Optional. */
  updatedAt?: string;
}

/**
 * Curated, publicly shareable roadmap entries.
 * Only items that have been explicitly moderated and approved for public
 * display belong here. Never include unmoderated user submissions.
 */
export const publicRoadmap: RoadmapItem[] = [];
