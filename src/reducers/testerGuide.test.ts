import {
  addGuideIssue,
  removeGuideIssue,
  resetTesterGuide,
  setAllGuideTasks,
  setMissionRating,
  setMissionStatus,
  toggleGuideTask,
  updateGuideIssue,
  updateTesterDetails,
} from "@/actions/testerGuide";
import type { TesterGuideAction } from "@/actions/testerGuide";
import { createInitialTesterGuideState, testerGuideReducer } from "@/reducers/testerGuide";
import type { FeedbackIssue } from "@/lib/tester-guide-types";

const issue: FeedbackIssue = {
  id: "issue-1",
  severity: "p1",
  screen: "Upload",
  trying: "Publish a moment",
  happened: "The progress stopped",
  expected: "The moment to publish",
  steps: "Open Upload, add a photo, publish",
  mediaNote: "IMG_1",
  createdAt: "2026-08-05T00:00:00.000Z",
};

describe("testerGuideReducer", () => {
  it("updates nested mission state without mutating the previous state", () => {
    const initial = createInitialTesterGuideState();
    const previousMission = initial.missions.orientation;
    const previousTasks = previousMission.tasks;

    const withTask = testerGuideReducer(
      initial,
      toggleGuideTask("orientation", "open-build", true),
    );
    const withStatus = testerGuideReducer(
      withTask,
      setMissionStatus("orientation", "completed_without_help"),
    );
    const withRating = testerGuideReducer(withStatus, setMissionRating("orientation", 5));

    expect(initial.missions.orientation.tasks["open-build"]).toBe(false);
    expect(withRating.missions.orientation).toMatchObject({
      status: "completed_without_help",
      rating: 5,
    });
    expect(withRating.missions.orientation.tasks["open-build"]).toBe(true);
    expect(withTask).not.toBe(initial);
    expect(withTask.missions.orientation).not.toBe(previousMission);
    expect(withTask.missions.orientation.tasks).not.toBe(previousTasks);
    expect(withTask.missions.moment).toBe(initial.missions.moment);
  });

  it("selects and clears every task in one mission without changing other missions", () => {
    const initial = createInitialTesterGuideState();
    const selected = testerGuideReducer(initial, setAllGuideTasks("orientation", true));
    const cleared = testerGuideReducer(selected, setAllGuideTasks("orientation", false));

    expect(Object.values(selected.missions.orientation.tasks)).toEqual(
      expect.arrayContaining([true]),
    );
    expect(Object.values(selected.missions.orientation.tasks).every(Boolean)).toBe(true);
    expect(Object.values(cleared.missions.orientation.tasks).every((checked) => !checked)).toBe(
      true,
    );
    expect(initial.missions.orientation.tasks).toEqual(
      expect.objectContaining(
        Object.fromEntries(
          Object.keys(initial.missions.orientation.tasks).map((id) => [id, false]),
        ),
      ),
    );
    expect(selected.missions.moment).toBe(initial.missions.moment);
  });

  it("adds, edits, and removes reports immutably", () => {
    const initial = createInitialTesterGuideState();
    const added = testerGuideReducer(initial, addGuideIssue(issue));
    const edited = testerGuideReducer(
      added,
      updateGuideIssue(issue.id, { screen: "Explore", severity: "p2" }),
    );
    const removed = testerGuideReducer(edited, removeGuideIssue(issue.id));

    expect(initial.issues).toEqual([]);
    expect(added.issues[0]).toEqual(issue);
    expect(edited.issues[0]).toMatchObject({ screen: "Explore", severity: "p2" });
    expect(added.issues[0]?.screen).toBe("Upload");
    expect(removed.issues).toEqual([]);
  });

  it("resets all persisted guide data to a fresh state", () => {
    const changed = testerGuideReducer(
      createInitialTesterGuideState(),
      updateTesterDetails({
        name: "Alex",
        device: {
          platform: "ios",
          deviceFamily: "Other iPhone",
          osVersion: "iOS 26",
          exactModel: "iPhone 11 Pro",
        },
      }),
    );

    const reset = testerGuideReducer(changed, resetTesterGuide());

    expect(reset).toEqual(createInitialTesterGuideState());
    expect(reset).not.toBe(changed);
  });

  it("tracks handoff request, result, failure, and dismissal as transient state", () => {
    const request: TesterGuideAction = { type: "GUIDE_HANDOFF_REQUEST", payload: "copy" };
    const success: TesterGuideAction = {
      type: "GUIDE_HANDOFF_SUCCESS",
      payload: { action: "copy", message: "Copied" },
    };
    const failure: TesterGuideAction = {
      type: "GUIDE_HANDOFF_FAILURE",
      payload: { action: "email", message: "Email unavailable" },
    };

    const loading = testerGuideReducer(createInitialTesterGuideState(), request);
    const succeeded = testerGuideReducer(loading, success);
    const failed = testerGuideReducer(succeeded, failure);
    const cleared = testerGuideReducer(failed, { type: "CLEAR_GUIDE_HANDOFF" });

    expect(loading.handoff).toEqual({ status: "loading", action: "copy", message: "" });
    expect(succeeded.handoff).toEqual({
      status: "success",
      action: "copy",
      message: "Copied",
    });
    expect(failed.handoff).toEqual({
      status: "error",
      action: "email",
      message: "Email unavailable",
    });
    expect(cleared.handoff).toEqual({ status: "idle", action: null, message: "" });
  });
});
