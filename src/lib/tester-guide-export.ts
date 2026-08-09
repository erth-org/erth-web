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

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function formatGeneratedAt(value: string): string {
  const generatedAt = new Date(value);
  if (Number.isNaN(generatedAt.getTime())) return value;

  return `${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(generatedAt)} UTC`;
}

function addSection(lines: string[], title: string): void {
  if (lines.length) lines.push("");
  lines.push(title, "-".repeat(title.length));
}

function addOptionalLine(lines: string[], label: string, value: string): void {
  const normalized = value.trim();
  if (normalized) lines.push(`- ${label}: ${normalized}`);
}

function addIndentedDetail(lines: string[], label: string, value: string): void {
  const normalized = value.trim();
  if (!normalized) return;

  const valueLines = normalized.split(/\r?\n/).map((line) => line.trim());
  if (valueLines.length === 1) {
    lines.push(`   ${label}: ${valueLines[0]}`);
    return;
  }

  lines.push(`   ${label}:`);
  valueLines.forEach((line) => lines.push(`      ${line}`));
}

function missionHasFeedback(mission: TesterGuideExportPayload["missions"][number]): boolean {
  return (
    mission.status !== "not_started" ||
    mission.rating > 0 ||
    hasText(mission.notes) ||
    mission.completedTasks.length > 0
  );
}

function missionOutcome(mission: TesterGuideExportPayload["missions"][number]): string {
  return mission.status === "not_started" && mission.completedTasks.length
    ? "In progress"
    : STATUS_LABELS[mission.status];
}

export function generateReadableGuideSummary(payload: TesterGuideExportPayload): string {
  const device = payload.tester.device.exactModel
    ? `${payload.tester.device.deviceFamily} — ${payload.tester.device.exactModel}`
    : payload.tester.device.deviceFamily;
  const identity = payload.tester.erthUsername || payload.tester.name || "Beta tester";
  const lines = [
    "ERTH BETA TEST REPORT",
    "=====================",
    `Generated: ${formatGeneratedAt(payload.generatedAt)}`,
  ];

  addSection(lines, "AT A GLANCE");
  lines.push(`- Tester: ${identity}`);
  lines.push(
    `- Progress: ${payload.progress.completedMissions} of ${payload.progress.totalMissions} missions; ${payload.progress.completedTasks} of ${payload.progress.totalTasks} tasks`,
  );
  const issueCount = payload.issueReports.filter((report) => report.severity !== "positive").length;
  lines.push(`- Issues: ${issueCount}`);
  lines.push(`- Positive signals: ${payload.issueReports.length - issueCount}`);

  const contextLines: string[] = [];
  if (payload.tester.name.trim() !== identity) {
    addOptionalLine(contextLines, "Name", payload.tester.name);
  }
  addOptionalLine(contextLines, "Email", payload.tester.email);
  if (payload.tester.erthUsername.trim() !== identity) {
    addOptionalLine(contextLines, "Erth username", payload.tester.erthUsername);
  }
  addOptionalLine(contextLines, "Device", device);
  addOptionalLine(contextLines, "OS version", payload.tester.device.osVersion);
  addOptionalLine(contextLines, "TestFlight build", payload.tester.testFlightBuild);
  addOptionalLine(contextLines, "Travel frequency", payload.tester.travelFrequency);
  addOptionalLine(contextLines, "Current memory system", payload.tester.currentMemorySystem);
  if (contextLines.length) {
    addSection(lines, "TESTER CONTEXT");
    lines.push(...contextLines);
  }

  if (payload.issueReports.length) {
    addSection(lines, "ISSUES AND POSITIVE SIGNALS");
    payload.issueReports.forEach((issue, index) => {
      if (index) lines.push("");
      lines.push(
        `${index + 1}. ${issue.screen.trim() || "Unspecified screen"} [${issue.severity.toUpperCase()}]`,
      );
      addIndentedDetail(lines, "Trying to", issue.trying);
      addIndentedDetail(lines, "What happened", issue.happened);
      addIndentedDetail(lines, "Expected", issue.expected);
      addIndentedDetail(lines, "Steps to reproduce", issue.steps);
      addIndentedDetail(lines, "Screenshot or video", issue.mediaNote);
    });
  }

  const attemptedMissions = payload.missions.filter(missionHasFeedback);
  if (attemptedMissions.length) {
    addSection(lines, "MISSION RESULTS");
    attemptedMissions.forEach((mission, index) => {
      if (index) lines.push("");
      const taskTotal = mission.completedTasks.length + mission.incompleteTasks.length;
      lines.push(`${index + 1}. ${mission.title}`);
      lines.push(`   Outcome: ${missionOutcome(mission)}`);
      lines.push(`   Tasks: ${mission.completedTasks.length} of ${taskTotal}`);
      if (mission.rating > 0) lines.push(`   Rating: ${mission.rating}/5`);
      addIndentedDetail(lines, "Notes", mission.notes);
      if (mission.completedTasks.length) {
        lines.push("   Completed tasks:");
        mission.completedTasks.forEach((task) => lines.push(`   - [x] ${task}`));
      }
      if (mission.status !== "skipped" && mission.incompleteTasks.length) {
        lines.push("   Remaining tasks:");
        mission.incompleteTasks.forEach((task) => lines.push(`   - [ ] ${task}`));
      }
    });
  }

  const reflectionRatings = [
    ["Clarity", payload.experience.clarity],
    ["Reliability", payload.experience.reliability],
    ["Product value", payload.experience.productValue],
    ["Likelihood to return", payload.experience.likelihoodToReturn],
  ] as const;
  const reflectionHasFeedback =
    reflectionRatings.some(([, rating]) => rating > 0) ||
    [
      payload.experience.strongestMoment,
      payload.experience.biggestConfusion,
      payload.experience.priorityImprovement,
      payload.experience.finalThoughts,
    ].some(hasText);

  if (reflectionHasFeedback) {
    addSection(lines, "OVERALL EXPERIENCE");
    reflectionRatings.forEach(([label, rating]) => {
      if (rating > 0) lines.push(`- ${label}: ${rating}/5`);
    });
    addOptionalLine(lines, "Strongest moment", payload.experience.strongestMoment);
    addOptionalLine(lines, "Biggest confusion", payload.experience.biggestConfusion);
    addOptionalLine(lines, "Priority improvement", payload.experience.priorityImprovement);
    addOptionalLine(lines, "Final thoughts", payload.experience.finalThoughts);
  }

  lines.push("", "--", "Sent from the Erth closed beta tester guide.");

  return lines.join("\n");
}

export function generateCompleteGuideEmailBody(payload: TesterGuideExportPayload): string {
  return [
    "Hello Erth team,",
    "",
    "Here is my closed beta tester report.",
    "",
    generateReadableGuideSummary(payload),
  ]
    .join("\n")
    .replace(/\n/g, "\r\n");
}

export function buildGuideCompleteEmailHref(
  payload: TesterGuideExportPayload,
  teamEmail: string,
): string {
  const identity = payload.tester.erthUsername || payload.tester.name || "Beta tester";
  const subject = `Erth beta report - ${payload.progress.completedMissions}/${payload.progress.totalMissions} missions - ${identity}`;
  const body = generateCompleteGuideEmailBody(payload);

  return `mailto:${teamEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
