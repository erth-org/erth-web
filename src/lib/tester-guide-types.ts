export type MissionId =
  | "orientation"
  | "moment"
  | "trip"
  | "social"
  | "globe"
  | "identity"
  | "trust";

export type GuideStageId = "welcome" | MissionId | "issues" | "reflection" | "review";

export type MissionStatus =
  | "not_started"
  | "completed_without_help"
  | "completed_with_help"
  | "blocked"
  | "skipped";

export type IssueSeverity = "p0" | "p1" | "p2" | "p3" | "positive";

export type HandoffAction = "pdf";

export type DevicePlatform = "ios" | "android" | "other";

export interface BetaTesterDevice {
  platform: DevicePlatform;
  deviceFamily: string;
  osVersion: string;
  exactModel?: string;
}

export interface TesterDetails {
  name: string;
  email: string;
  erthUsername: string;
  device: BetaTesterDevice;
  testFlightBuild: string;
  travelFrequency: string;
  currentMemorySystem: string;
}

export interface MissionResponse {
  tasks: Record<string, boolean>;
  status: MissionStatus;
  rating: number;
  notes: string;
}

export interface FeedbackIssue {
  id: string;
  severity: IssueSeverity;
  screen: string;
  trying: string;
  happened: string;
  expected: string;
  steps: string;
  mediaNote: string;
  createdAt: string;
}

export interface ExperienceReflection {
  clarity: number;
  reliability: number;
  productValue: number;
  likelihoodToReturn: number;
  strongestMoment: string;
  biggestConfusion: string;
  priorityImprovement: string;
  finalThoughts: string;
}

export interface HandoffState {
  status: "idle" | "loading" | "success" | "error";
  action: HandoffAction | null;
  message: string;
}

export interface TesterGuideState {
  schemaVersion: 4;
  currentStage: GuideStageId;
  tester: TesterDetails;
  sharingAcknowledged: boolean;
  missions: Record<MissionId, MissionResponse>;
  issues: FeedbackIssue[];
  reflection: ExperienceReflection;
  updatedAt: string | null;
  handoff: HandoffState;
}

export interface GuideMissionDefinition {
  id: MissionId;
  eyebrow: string;
  title: string;
  description: string;
  ratingPrompt: string;
  ratingLow: string;
  ratingHigh: string;
  notesPrompt: string;
  tasks: ReadonlyArray<{ id: string; label: string }>;
}

export interface GuideProgress {
  completedTasks: number;
  totalTasks: number;
  completedMissions: number;
  totalMissions: number;
  percent: number;
}

export interface TesterGuideExportPayload {
  schemaVersion: 4;
  guide: "Erth Guided Beta Tester Experience";
  generatedAt: string;
  tester: TesterDetails;
  sharingAcknowledged: boolean;
  progress: GuideProgress;
  missions: Array<{
    id: MissionId;
    title: string;
    status: MissionStatus;
    rating: number;
    notes: string;
    completedTasks: string[];
    incompleteTasks: string[];
  }>;
  experience: ExperienceReflection;
  issueReports: FeedbackIssue[];
}
