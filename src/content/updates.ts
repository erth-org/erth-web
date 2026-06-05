export interface UpdateEntry {
  version: string;
  releaseDate: string; // ISO date
  summary: string;
  added?: string[];
  improved?: string[];
  fixed?: string[];
  platforms?: ("iOS" | "Android" | "Web")[];
  link?: string;
}

/**
 * Real Erth release notes. Empty until a real release is published.
 * Do NOT invent versions, dates, or changes — the page renders an honest
 * empty state when this list is empty.
 */
export const updates: UpdateEntry[] = [];
