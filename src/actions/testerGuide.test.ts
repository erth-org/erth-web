import {
  browserGuideHandoffDependencies,
  copyGuideSummary,
  downloadGuideJson,
  openGuideEmail,
  printGuide,
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
    downloadJson: jest.fn(),
    openEmail: jest.fn(),
    printPage: jest.fn(),
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
    expect(deps.copyText).toHaveBeenCalledWith(
      expect.stringContaining("ERTH GUIDED BETA FEEDBACK"),
    );
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

  it("downloads full JSON and opens a bounded email draft", async () => {
    const harness = createHarness();
    harness.state.testerGuide.tester.name = "Taylor";
    const deps = dependencies();

    await downloadGuideJson(deps)(harness.dispatch as never, () => harness.state, undefined);
    await openGuideEmail("team@example.com", deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(deps.downloadJson).toHaveBeenCalledWith(
      expect.stringContaining('"schemaVersion": 4'),
      "erth-beta-feedback-taylor.json",
    );
    expect(deps.openEmail).toHaveBeenCalledWith(expect.stringContaining("mailto:team@example.com"));
  });

  it("opens the print dialog through the same explicit handoff flow", async () => {
    const harness = createHarness();
    const deps = dependencies();

    const result = await printGuide(deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(true);
    expect(deps.printPage).toHaveBeenCalledTimes(1);
    expect(harness.dispatched.map((action) => action.type)).toEqual([
      "GUIDE_HANDOFF_REQUEST",
      "GUIDE_HANDOFF_SUCCESS",
    ]);
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

  it("creates and revokes a JSON download URL and delegates printing", () => {
    const createObjectURL = jest.fn().mockReturnValue("blob:feedback");
    const revokeObjectURL = jest.fn();
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: revokeObjectURL, configurable: true });
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    browserGuideHandoffDependencies.downloadJson('{"schemaVersion":2}', "feedback.json");
    browserGuideHandoffDependencies.printPage();

    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:feedback");
    expect(window.print).toHaveBeenCalled();
  });
});
