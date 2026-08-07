import { GUIDE_MISSIONS } from "@/content/tester-guide-questionnaire";
import {
  buildGuideEmailHref,
  buildGuideExportPayload,
  generateReadableGuideSummary,
  getGuideExportFilename,
  getGuideProgress,
} from "@/lib/tester-guide-export";
import { createInitialTesterGuideState } from "@/reducers/testerGuide";

describe("tester guide export", () => {
  it("normalizes checked tasks and mission progress into schema v4", () => {
    const state = createInitialTesterGuideState();
    state.tester.erthUsername = "@Sky Traveler";
    state.missions.orientation.tasks["open-build"] = true;
    state.missions.orientation.status = "completed_with_help";
    state.missions.orientation.rating = 4;

    const progress = getGuideProgress(state);
    const payload = buildGuideExportPayload(state, "2026-08-05T12:00:00.000Z");

    expect(progress).toMatchObject({
      completedTasks: 1,
      totalTasks: GUIDE_MISSIONS.reduce((total, mission) => total + mission.tasks.length, 0),
      completedMissions: 1,
      totalMissions: 7,
    });
    expect(payload.schemaVersion).toBe(4);
    expect(payload.missions[0]).toMatchObject({
      id: "orientation",
      status: "completed_with_help",
      rating: 4,
    });
    expect(payload.missions[0]?.completedTasks).toContain(
      "Install or open the current TestFlight build.",
    );
    expect(getGuideExportFilename(payload)).toBe("erth-beta-feedback-sky-traveler.json");
  });

  it("creates readable output and bounds mailto bodies with an attachment note", () => {
    const state = createInitialTesterGuideState();
    state.tester.name = "Jordan";
    state.reflection.finalThoughts = "A".repeat(900);
    const payload = buildGuideExportPayload(state, "2026-08-05T12:00:00.000Z");

    const summary = generateReadableGuideSummary(payload);
    const href = buildGuideEmailHref(payload, "team@example.com", 500);
    const decoded = decodeURIComponent(href);

    expect(summary).toContain("ERTH GUIDED BETA FEEDBACK");
    expect(summary).toContain("Final thoughts:");
    expect(decoded).toContain("mailto:team@example.com");
    expect(decoded).toContain("Please attach the exported JSON");
    expect(decoded.length).toBeLessThan(800);
  });

  it("uses custom device and OS answers in the readable summary", () => {
    const state = createInitialTesterGuideState();
    state.tester.device = {
      platform: "android",
      deviceFamily: "Other Android phone",
      exactModel: "Fairphone 6",
      osVersion: "Android 17 beta",
    };

    const summary = generateReadableGuideSummary(buildGuideExportPayload(state));

    expect(summary).toContain("Device: Other Android phone — Fairphone 6");
    expect(summary).toContain("OS version: Android 17 beta");
  });
});
