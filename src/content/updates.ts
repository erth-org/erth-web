import type { Release } from "@/lib/public-content-types";
import { releaseData } from "./updates.data.mjs";

export const releases = releaseData as Release[];

export function getReleaseBySlug(slug: string): Release | undefined {
  return releases.find((release) => release.slug === slug);
}
