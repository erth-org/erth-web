import { GUIDE_MISSIONS } from "@/content/tester-guide-questionnaire";
import type {
  GuideProgress,
  TesterGuideExportPayload,
  TesterGuideState,
} from "@/lib/tester-guide-types";

const STATUS_LABELS = {
  not_started: "Not started",
  completed_without_help: "Completed without help",
  completed_with_help: "Completed with help",
  blocked: "Blocked",
  skipped: "Skipped",
} as const;

export function getGuideProgress(state: TesterGuideState): GuideProgress {
  const totalTasks = GUIDE_MISSIONS.reduce((total, mission) => total + mission.tasks.length, 0);
  const completedTasks = GUIDE_MISSIONS.reduce(
    (total, mission) =>
      total + Object.values(state.missions[mission.id].tasks).filter(Boolean).length,
    0,
  );
  const completedMissions = GUIDE_MISSIONS.filter((mission) => {
    const status = state.missions[mission.id].status;
    return status !== "not_started";
  }).length;

  return {
    completedTasks,
    totalTasks,
    completedMissions,
    totalMissions: GUIDE_MISSIONS.length,
    percent: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
}

export function buildGuideExportPayload(
  state: TesterGuideState,
  generatedAt = new Date().toISOString(),
): TesterGuideExportPayload {
  return {
    schemaVersion: 4,
    guide: "Erth Guided Beta Tester Experience",
    generatedAt,
    tester: {
      ...state.tester,
      device: { ...state.tester.device },
    },
    sharingAcknowledged: state.sharingAcknowledged,
    progress: getGuideProgress(state),
    missions: GUIDE_MISSIONS.map((mission) => {
      const response = state.missions[mission.id];
      return {
        id: mission.id,
        title: mission.title,
        status: response.status,
        rating: response.rating,
        notes: response.notes,
        completedTasks: mission.tasks
          .filter((task) => response.tasks[task.id])
          .map((task) => task.label),
        incompleteTasks: mission.tasks
          .filter((task) => !response.tasks[task.id])
          .map((task) => task.label),
      };
    }),
    experience: { ...state.reflection },
    issueReports: state.issues.map((issue) => ({ ...issue })),
  };
}

function valueOrDash(value: string | number): string {
  return value === "" || value === 0 ? "—" : String(value);
}

export function generateReadableGuideSummary(payload: TesterGuideExportPayload): string {
  const device = payload.tester.device.exactModel
    ? `${payload.tester.device.deviceFamily} — ${payload.tester.device.exactModel}`
    : payload.tester.device.deviceFamily;
  const lines = [
    "ERTH GUIDED BETA FEEDBACK",
    `Generated: ${payload.generatedAt}`,
    "",
    "TESTER CONTEXT",
    `Name: ${valueOrDash(payload.tester.name)}`,
    `Email: ${valueOrDash(payload.tester.email)}`,
    `Erth username: ${valueOrDash(payload.tester.erthUsername)}`,
    `Device: ${valueOrDash(device)}`,
    `OS version: ${valueOrDash(payload.tester.device.osVersion)}`,
    `TestFlight build: ${valueOrDash(payload.tester.testFlightBuild)}`,
    `Travel frequency: ${valueOrDash(payload.tester.travelFrequency)}`,
    `Current memory system: ${valueOrDash(payload.tester.currentMemorySystem)}`,
    "",
    `PROGRESS: ${payload.progress.completedTasks}/${payload.progress.totalTasks} tasks across ${payload.progress.completedMissions}/${payload.progress.totalMissions} missions`,
    "",
    "MISSIONS",
  ];

  payload.missions.forEach((mission) => {
    lines.push(mission.title);
    lines.push(`Outcome: ${STATUS_LABELS[mission.status]}`);
    lines.push(`Rating: ${valueOrDash(mission.rating)}/5`);
    lines.push(
      `Tasks: ${mission.completedTasks.length}/${mission.completedTasks.length + mission.incompleteTasks.length}`,
    );
    lines.push(`Notes: ${valueOrDash(mission.notes)}`);
    if (mission.incompleteTasks.length) {
      lines.push(`Not completed: ${mission.incompleteTasks.join(" | ")}`);
    }
    lines.push("");
  });

  lines.push("OVERALL EXPERIENCE");
  lines.push(`Clarity: ${valueOrDash(payload.experience.clarity)}/5`);
  lines.push(`Reliability: ${valueOrDash(payload.experience.reliability)}/5`);
  lines.push(`Product value: ${valueOrDash(payload.experience.productValue)}/5`);
  lines.push(`Likelihood to return: ${valueOrDash(payload.experience.likelihoodToReturn)}/5`);
  lines.push(`Strongest moment: ${valueOrDash(payload.experience.strongestMoment)}`);
  lines.push(`Biggest confusion: ${valueOrDash(payload.experience.biggestConfusion)}`);
  lines.push(`Priority improvement: ${valueOrDash(payload.experience.priorityImprovement)}`);
  lines.push(`Final thoughts: ${valueOrDash(payload.experience.finalThoughts)}`);
  lines.push("", "ISSUES AND POSITIVE SIGNALS");

  if (!payload.issueReports.length) {
    lines.push("No issue reports added.");
  } else {
    payload.issueReports.forEach((issue, index) => {
      lines.push(`${index + 1}. ${issue.screen} — ${issue.severity.toUpperCase()}`);
      lines.push(`Trying: ${valueOrDash(issue.trying)}`);
      lines.push(`Happened: ${valueOrDash(issue.happened)}`);
      lines.push(`Expected: ${valueOrDash(issue.expected)}`);
      lines.push(`Steps: ${valueOrDash(issue.steps)}`);
      lines.push(`Media note: ${valueOrDash(issue.mediaNote)}`, "");
    });
  }

  return lines.join("\n");
}

export function buildGuideEmailHref(
  payload: TesterGuideExportPayload,
  teamEmail: string,
  maxBodyLength = 6000,
): string {
  const identity = payload.tester.erthUsername || payload.tester.name || "Beta tester";
  const fullSummary = generateReadableGuideSummary(payload);
  const overflowNote =
    "\n\n— This email was shortened for compatibility. Please attach the exported JSON for the complete response. —";
  const body =
    fullSummary.length > maxBodyLength
      ? `${fullSummary.slice(0, Math.max(0, maxBodyLength - overflowNote.length))}${overflowNote}`
      : fullSummary;

  return `mailto:${teamEmail}?subject=${encodeURIComponent(`Erth beta feedback — ${identity}`)}&body=${encodeURIComponent(body)}`;
}

export function getGuideExportFilename(payload: TesterGuideExportPayload): string {
  const identity = payload.tester.erthUsername || payload.tester.name || "tester";
  const slug = identity
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `erth-beta-feedback-${slug || "tester"}.json`;
}
