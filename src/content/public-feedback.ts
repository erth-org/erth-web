import type { PublicFeedbackItem } from "@/lib/public-content-types";
import { publicFeedbackData } from "./public-feedback.data.mjs";

export const publicFeedback = publicFeedbackData as PublicFeedbackItem[];

export function getFeedbackBySlug(slug: string): PublicFeedbackItem | undefined {
  return publicFeedback.find((item) => item.slug === slug);
}
