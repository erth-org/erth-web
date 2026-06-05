export const PLACEHOLDER: "__PLACEHOLDER__";

export interface TeamMemberData {
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
  linkedinUrl: string | null;
}

export interface FeedbackConfigData {
  submissionEnabled: boolean;
  submissionEndpoint: string | null;
  votingEnabled: boolean;
  votingEndpoint: string | null;
}

export interface SiteConfigData {
  productionUrl: string;
  oneLiner: string;
  visionStatement: string;
  contact: { email: string };
  store: { appStoreUrl: string | null; googlePlayUrl: string | null };
  legal: {
    status: "pending-review" | "approved";
    lastUpdated: string;
    privacyIsPlaceholder: boolean;
    termsIsPlaceholder: boolean;
  };
  feedback: FeedbackConfigData;
  team: TeamMemberData[];
}

export const siteConfigData: SiteConfigData;
export function isPlaceholderTeamMember(m: TeamMemberData): boolean;
export function getUnresolvedPlaceholders(cfg?: SiteConfigData): string[];
