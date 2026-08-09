import {
  browserGuideHandoffDependencies,
  copyGuideSummary,
  downloadGuidePdf,
  shareGuidePdf,
  type GuideHandoffDependencies,
  type TesterGuideAction,
} from "@/actions/testerGuide";
import { createInitialTesterGuideState } from "@/reducers/testerGuide";
import type { TesterGuideRootState } from "@/store/testerGuide";

function createHarness() {
  const state = { testerGuide: createInitialTesterGuideState() } as TesterGuideRootState;
  const dispatched: TesterGuideAction[] = [];
  const dispatch = (action: TesterGuideAction) => {
    dispatched.push(action);
    return action;
  };
  return { state, dispatched, dispatch };
}

function dependencies(overrides: Partial<GuideHandoffDependencies> = {}): GuideHandoffDependencies {
  return {
    copyText: jest.fn().mockResolvedValue(undefined),
    createPdf: jest.fn().mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" })),
    downloadPdf: jest.fn(),
    sharePdf: jest.fn().mockResolvedValue(false),
    openEmail: jest.fn(),
    ...overrides,
  };
}

describe("tester guide handoff thunks", () => {
  it("copies a readable summary and dispatches request/success", async () => {
    const harness = createHarness();
    const deps = dependencies();

    const result = await copyGuideSummary(deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(true);
    expect(deps.copyText).toHaveBeenCalledWith(expect.stringContaining("ERTH BETA TEST REPORT"));
    expect(harness.dispatched.map((action) => action.type)).toEqual([
      "GUIDE_HANDOFF_REQUEST",
      "GUIDE_HANDOFF_SUCCESS",
    ]);
  });

  it("reports clipboard failure without pretending feedback was copied", async () => {
    const harness = createHarness();
    const deps = dependencies({ copyText: jest.fn().mockRejectedValue(new Error("Denied")) });

    const result = await copyGuideSummary(deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(false);
    expect(harness.dispatched.at(-1)).toMatchObject({
      type: "GUIDE_HANDOFF_FAILURE",
      payload: { action: "copy" },
    });
  });

  it("uses native file sharing without downloading a duplicate", async () => {
    const harness = createHarness();
    harness.state.testerGuide.tester.name = "Taylor";
    const deps = dependencies({ sharePdf: jest.fn().mockResolvedValue(true) });

    await shareGuidePdf("team@example.com", deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(deps.createPdf).toHaveBeenCalledTimes(1);
    expect(deps.copyText).toHaveBeenCalledWith("team@example.com");
    expect(deps.sharePdf).toHaveBeenCalledWith(
      expect.any(Blob),
      expect.stringMatching(/^erth-beta-report-taylor-\d{4}-\d{2}-\d{2}\.pdf$/),
      expect.stringContaining("Taylor"),
      expect.stringContaining("team@example.com"),
    );
    expect(deps.downloadPdf).not.toHaveBeenCalled();
    expect(deps.openEmail).not.toHaveBeenCalled();
    expect(harness.dispatched.at(-1)).toMatchObject({
      type: "GUIDE_HANDOFF_SUCCESS",
      payload: { message: expect.stringContaining("share sheet opened") },
    });
  });

  it("opens an organized email without saving a file when native sharing is unavailable", async () => {
    const harness = createHarness();
    harness.state.testerGuide.tester.name = "Taylor";
    harness.state.testerGuide.missions.orientation.status = "completed_without_help";
    harness.state.testerGuide.reflection.finalThoughts = "Keep this complete.";
    const deps = dependencies();

    const result = await shareGuidePdf("team@example.com", deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(true);
    expect(deps.downloadPdf).not.toHaveBeenCalled();
    expect(deps.openEmail).toHaveBeenCalledTimes(1);
    const email = decodeURIComponent((deps.openEmail as jest.Mock).mock.calls[0][0]);
    expect(email).toContain("Here is my closed beta tester report.");
    expect(email).toContain("MISSION RESULTS");
    expect(email).toContain("Find your way in");
    expect(email).not.toContain("Test the safety net");
    expect(email).toContain("Keep this complete.");
    expect(harness.dispatched.at(-1)).toMatchObject({
      type: "GUIDE_HANDOFF_SUCCESS",
      payload: { message: expect.stringContaining("organized email report") },
    });
  });

  it("downloads a standalone PDF for browser-based webmail", async () => {
    const harness = createHarness();
    const deps = dependencies();

    const result = await downloadGuidePdf(deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(true);
    expect(deps.downloadPdf).toHaveBeenCalledTimes(1);
    expect(deps.openEmail).not.toHaveBeenCalled();
  });
});

describe("browser guide handoff adapter", () => {
  afterEach(() => jest.restoreAllMocks());

  it("uses the native clipboard when available", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    await browserGuideHandoffDependencies.copyText("feedback");

    expect(writeText).toHaveBeenCalledWith("feedback");
  });

  it("falls back to a temporary textarea when clipboard access is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const execCommand = jest.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });

    await browserGuideHandoffDependencies.copyText("fallback feedback");

    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(document.querySelector("textarea[readonly]")).not.toBeInTheDocument();
  });

  it("opens mailto links through a temporary anchor for browser and OS handlers", () => {
    let clickedHref = "";
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clickedHref = this.href;
    });

    browserGuideHandoffDependencies.openEmail(
      "mailto:team@example.com?subject=Erth%20report&body=Formatted%20feedback",
    );

    expect(click).toHaveBeenCalledTimes(1);
    expect(clickedHref).toContain("mailto:team@example.com");
    expect(document.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
  });

  it("uses the Web Share API only when PDF file sharing is supported", async () => {
    const share = jest.fn().mockResolvedValue(undefined);
    const canShare = jest.fn().mockReturnValue(true);
    Object.defineProperty(navigator, "share", { value: share, configurable: true });
    Object.defineProperty(navigator, "canShare", { value: canShare, configurable: true });

    const shared = await browserGuideHandoffDependencies.sharePdf(
      new Blob(["pdf"], { type: "application/pdf" }),
      "report.pdf",
      "Erth report",
      "Send to the Erth team",
    );

    expect(shared).toBe(true);
    expect(canShare).toHaveBeenCalledWith({ files: [expect.any(File)] });
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({ files: [expect.any(File)], title: "Erth report" }),
    );
  });
});
