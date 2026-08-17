import {
  browserGuideHandoffDependencies,
  downloadGuidePdf,
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
    createPdf: jest.fn().mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" })),
    downloadPdf: jest.fn(),
    ...overrides,
  };
}

describe("tester guide handoff thunk", () => {
  it("downloads a standalone PDF and prompts the tester to send it", async () => {
    const harness = createHarness();
    const deps = dependencies();

    const result = await downloadGuidePdf(deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(true);
    expect(deps.downloadPdf).toHaveBeenCalledTimes(1);
    expect(harness.dispatched.at(-1)).toMatchObject({
      type: "GUIDE_HANDOFF_SUCCESS",
      payload: { message: expect.stringMatching(/send it to Erth by DM or email/i) },
    });
  });

  it("reports a PDF generation failure without claiming a download", async () => {
    const harness = createHarness();
    const deps = dependencies({
      createPdf: jest.fn().mockRejectedValue(new Error("Renderer unavailable")),
    });

    const result = await downloadGuidePdf(deps)(
      harness.dispatch as never,
      () => harness.state,
      undefined,
    );

    expect(result).toBe(false);
    expect(deps.downloadPdf).not.toHaveBeenCalled();
    expect(harness.dispatched.at(-1)).toMatchObject({
      type: "GUIDE_HANDOFF_FAILURE",
      payload: { action: "pdf", message: expect.stringMatching(/try downloading it again/i) },
    });
  });
});

describe("browser guide handoff adapter", () => {
  afterEach(() => jest.restoreAllMocks());

  it("downloads through a temporary anchor", () => {
    const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation();
    const createObjectURL = jest.fn().mockReturnValue("blob:report");
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: jest.fn(), configurable: true });

    browserGuideHandoffDependencies.downloadPdf(
      new Blob(["pdf"], { type: "application/pdf" }),
      "report.pdf",
    );

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    expect(document.querySelector('a[download="report.pdf"]')).not.toBeInTheDocument();
  });
});
