import { buildGuideExportPayload } from "@/lib/tester-guide-export";
import {
  buildGuidePdfDefinition,
  generateGuidePdf,
  getGuidePdfFileName,
} from "@/lib/tester-guide-pdf";
import { createInitialTesterGuideState } from "@/reducers/testerGuide";

describe("tester guide PDF", () => {
  function createPayload() {
    const state = createInitialTesterGuideState();
    state.tester.name = "Αλέξανδρος Tester";
    state.tester.erthUsername = "@Sky Traveler";
    state.tester.device.exactModel = "iPhone 17 Pro";
    state.missions.orientation.status = "completed_with_help";
    state.missions.orientation.rating = 4;
    state.missions.orientation.tasks["open-build"] = true;
    state.missions.orientation.notes = "Navigation was clear after a brief pause.";
    state.reflection.clarity = 4;
    state.reflection.finalThoughts = "The guided flow made the beta scope easy to understand.";
    state.issues.push({
      id: "issue-1",
      createdAt: "2026-08-08T11:20:00.000Z",
      severity: "p2",
      screen: "Upload",
      trying: "Create a moment",
      happened: "The location picker was slow to open.",
      expected: "The picker should appear immediately.",
      steps: "Open Upload, add a photo, then choose a location.",
      mediaNote: "Screen recording available on request.",
    });
    return buildGuideExportPayload(state, "2026-08-08T11:25:05.227Z");
  }

  it("builds an A4 report with document metadata and a safe filename", () => {
    const payload = createPayload();
    const definition = buildGuidePdfDefinition(payload);

    expect(definition.pageSize).toBe("A4");
    expect(definition.info).toMatchObject({
      title: expect.stringContaining("@Sky Traveler"),
      subject: expect.stringContaining("closed beta"),
    });
    expect(getGuidePdfFileName(payload)).toBe("erth-beta-report-sky-traveler-2026-08-08.pdf");
  });

  it("generates a real PDF blob with embedded fonts", async () => {
    const pdf = await generateGuidePdf(createPayload());

    expect(pdf.type).toBe("application/pdf");
    expect(pdf.size).toBeGreaterThan(10_000);
  });
});
