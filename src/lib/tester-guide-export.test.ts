import { GUIDE_MISSIONS } from "@/content/tester-guide-questionnaire";
import {
  buildGuideCompleteEmailHref,
  buildGuideExportPayload,
  generateReadableGuideSummary,
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
  });

  it("creates a concise text backup and a complete structured email", () => {
    const state = createInitialTesterGuideState();
    state.tester.name = "Jordan";
    state.tester.email = "jordan@example.com";
    state.tester.erthUsername = "@jordan";
    state.tester.device = {
      platform: "ios",
      deviceFamily: "iPhone 16 family",
      exactModel: "iPhone 16 Pro",
      osVersion: "iOS 26",
    };
    state.tester.testFlightBuild = "412";
    state.tester.travelFrequency = "3–5 trips per year";
    state.tester.currentMemorySystem = "Mostly my camera roll";
    state.sharingAcknowledged = true;
    state.missions.orientation.status = "completed_with_help";
    state.missions.orientation.rating = 4;
    state.missions.orientation.tasks["open-build"] = true;
    state.missions.orientation.notes = "The first screen was clear.";
    state.missions.moment.status = "skipped";
    state.reflection.finalThoughts = "A".repeat(900);
    state.issues.push({
      id: "issue-1",
      severity: "p1",
      screen: "Upload",
      trying: "Publish a moment",
      happened: "The save button stayed disabled.",
      expected: "The moment to publish.",
      steps: "1. Open Upload\n2. Add a photo\n3. Tap Save",
      mediaNote: "upload-disabled.png",
      createdAt: "2026-08-05T11:45:00.000Z",
    });
    const payload = buildGuideExportPayload(state, "2026-08-05T12:00:00.000Z");

    const summary = generateReadableGuideSummary(payload);
    const href = buildGuideCompleteEmailHref(payload, "team@example.com");
    const decoded = decodeURIComponent(href);

    expect(summary).toContain("ERTH BETA TEST REPORT\n=====================");
    expect(summary).toContain("Generated: 5 Aug 2026, 12:00 UTC");
    expect(summary).toContain("1. Find your way in");
    expect(summary).toContain("   Outcome: Completed with help");
    expect(summary).toContain("   - [ ] Create an account or sign in.");
    expect(summary).not.toContain("Create a moment\n   Outcome: Not started");
    expect(decoded).toContain("mailto:team@example.com");
    expect(decoded).toContain("Here is my closed beta tester report.");
    expect(decoded).toContain("AT A GLANCE");
    expect(decoded).toContain("TESTER CONTEXT");
    expect(decoded).toContain("- Email: jordan@example.com");
    expect(decoded).toContain("- Device: iPhone 16 family — iPhone 16 Pro");
    expect(decoded).toContain("MISSION RESULTS");
    expect(decoded).toContain("1. Find your way in");
    expect(decoded).toContain("[x] Install or open the current TestFlight build.");
    expect(decoded).toContain("[ ] Create an account or sign in.");
    expect(decoded).toContain("The first screen was clear.");
    expect(decoded).toContain("The save button stayed disabled.");
    expect(decoded).toContain("OVERALL EXPERIENCE");
    expect(decoded).toContain("A".repeat(900));
    expect(decoded).not.toContain("Test the safety net");
    expect(decoded).not.toContain("Sharing acknowledgement");
    expect(decoded).not.toContain("Not provided");
    expect(decoded).not.toContain("...");
    expect(href).toContain("%0D%0A");
  });

  it("omits empty report sections", () => {
    const state = createInitialTesterGuideState();
    const summary = generateReadableGuideSummary(
      buildGuideExportPayload(state, "2026-08-08T11:25:05.227Z"),
    );

    expect(summary).toContain("- Issues: 0");
    expect(summary).not.toContain("TESTER CONTEXT");
    expect(summary).not.toContain("ISSUES AND POSITIVE SIGNALS");
    expect(summary).not.toContain("MISSION RESULTS");
    expect(summary).not.toContain("OVERALL EXPERIENCE");
    expect(summary).not.toContain("Outcome: Not started");
    expect(summary).not.toContain("Not completed:");
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
