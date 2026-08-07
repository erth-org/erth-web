import type { ThunkAction } from "redux-thunk";
import {
  ADD_GUIDE_ISSUE,
  CLEAR_GUIDE_HANDOFF,
  GUIDE_HANDOFF_FAILURE,
  GUIDE_HANDOFF_REQUEST,
  GUIDE_HANDOFF_SUCCESS,
  REMOVE_GUIDE_ISSUE,
  RESET_TESTER_GUIDE,
  SET_GUIDE_STAGE,
  SET_MISSION_NOTES,
  SET_MISSION_RATING,
  SET_MISSION_STATUS,
  SET_SHARING_ACKNOWLEDGEMENT,
  TOGGLE_GUIDE_TASK,
  UPDATE_GUIDE_ISSUE,
  UPDATE_GUIDE_REFLECTION,
  UPDATE_TESTER_DETAILS,
} from "@/actions/types";
import {
  buildGuideEmailHref,
  buildGuideExportPayload,
  generateReadableGuideSummary,
  getGuideExportFilename,
} from "@/lib/tester-guide-export";
import type {
  ExperienceReflection,
  FeedbackIssue,
  GuideStageId,
  HandoffAction,
  MissionId,
  MissionStatus,
  TesterDetails,
} from "@/lib/tester-guide-types";
import type { TesterGuideRootState } from "@/store/testerGuide";

type UpdatedAction<Action extends { type: string }> = Action & { updatedAt: string };

export type TesterGuideAction =
  | UpdatedAction<{ type: typeof SET_GUIDE_STAGE; payload: GuideStageId }>
  | UpdatedAction<{ type: typeof UPDATE_TESTER_DETAILS; payload: Partial<TesterDetails> }>
  | UpdatedAction<{ type: typeof SET_SHARING_ACKNOWLEDGEMENT; payload: boolean }>
  | UpdatedAction<{
      type: typeof TOGGLE_GUIDE_TASK;
      payload: { missionId: MissionId; taskId: string; checked: boolean };
    }>
  | UpdatedAction<{
      type: typeof SET_MISSION_STATUS;
      payload: { missionId: MissionId; status: MissionStatus };
    }>
  | UpdatedAction<{
      type: typeof SET_MISSION_RATING;
      payload: { missionId: MissionId; rating: number };
    }>
  | UpdatedAction<{
      type: typeof SET_MISSION_NOTES;
      payload: { missionId: MissionId; notes: string };
    }>
  | UpdatedAction<{ type: typeof ADD_GUIDE_ISSUE; payload: FeedbackIssue }>
  | UpdatedAction<{
      type: typeof UPDATE_GUIDE_ISSUE;
      payload: { id: string; updates: Partial<Omit<FeedbackIssue, "id" | "createdAt">> };
    }>
  | UpdatedAction<{ type: typeof REMOVE_GUIDE_ISSUE; payload: string }>
  | UpdatedAction<{
      type: typeof UPDATE_GUIDE_REFLECTION;
      payload: Partial<ExperienceReflection>;
    }>
  | { type: typeof RESET_TESTER_GUIDE }
  | { type: typeof GUIDE_HANDOFF_REQUEST; payload: HandoffAction }
  | {
      type: typeof GUIDE_HANDOFF_SUCCESS;
      payload: { action: HandoffAction; message: string };
    }
  | {
      type: typeof GUIDE_HANDOFF_FAILURE;
      payload: { action: HandoffAction; message: string };
    }
  | { type: typeof CLEAR_GUIDE_HANDOFF };

export type TesterGuideThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  TesterGuideRootState,
  unknown,
  TesterGuideAction
>;

function updatedAt(): string {
  return new Date().toISOString();
}

export const setGuideStage = (stage: GuideStageId): TesterGuideAction => ({
  type: SET_GUIDE_STAGE,
  payload: stage,
  updatedAt: updatedAt(),
});

export const updateTesterDetails = (updates: Partial<TesterDetails>): TesterGuideAction => ({
  type: UPDATE_TESTER_DETAILS,
  payload: updates,
  updatedAt: updatedAt(),
});

export const setSharingAcknowledgement = (acknowledged: boolean): TesterGuideAction => ({
  type: SET_SHARING_ACKNOWLEDGEMENT,
  payload: acknowledged,
  updatedAt: updatedAt(),
});

export const toggleGuideTask = (
  missionId: MissionId,
  taskId: string,
  checked: boolean,
): TesterGuideAction => ({
  type: TOGGLE_GUIDE_TASK,
  payload: { missionId, taskId, checked },
  updatedAt: updatedAt(),
});

export const setMissionStatus = (
  missionId: MissionId,
  status: MissionStatus,
): TesterGuideAction => ({
  type: SET_MISSION_STATUS,
  payload: { missionId, status },
  updatedAt: updatedAt(),
});

export const setMissionRating = (missionId: MissionId, rating: number): TesterGuideAction => ({
  type: SET_MISSION_RATING,
  payload: { missionId, rating },
  updatedAt: updatedAt(),
});

export const setMissionNotes = (missionId: MissionId, notes: string): TesterGuideAction => ({
  type: SET_MISSION_NOTES,
  payload: { missionId, notes },
  updatedAt: updatedAt(),
});

export const addGuideIssue = (issue: FeedbackIssue): TesterGuideAction => ({
  type: ADD_GUIDE_ISSUE,
  payload: issue,
  updatedAt: updatedAt(),
});

export const updateGuideIssue = (
  id: string,
  updates: Partial<Omit<FeedbackIssue, "id" | "createdAt">>,
): TesterGuideAction => ({
  type: UPDATE_GUIDE_ISSUE,
  payload: { id, updates },
  updatedAt: updatedAt(),
});

export const removeGuideIssue = (id: string): TesterGuideAction => ({
  type: REMOVE_GUIDE_ISSUE,
  payload: id,
  updatedAt: updatedAt(),
});

export const updateGuideReflection = (
  updates: Partial<ExperienceReflection>,
): TesterGuideAction => ({
  type: UPDATE_GUIDE_REFLECTION,
  payload: updates,
  updatedAt: updatedAt(),
});

export const resetTesterGuide = (): TesterGuideAction => ({ type: RESET_TESTER_GUIDE });

export const clearGuideHandoff = (): TesterGuideAction => ({ type: CLEAR_GUIDE_HANDOFF });

export interface GuideHandoffDependencies {
  copyText: (text: string) => Promise<void>;
  downloadJson: (json: string, filename: string) => void;
  openEmail: (href: string) => void;
  printPage: () => void;
}

async function defaultCopyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const scratch = document.createElement("textarea");
  scratch.value = text;
  scratch.setAttribute("readonly", "");
  scratch.style.position = "fixed";
  scratch.style.opacity = "0";
  document.body.appendChild(scratch);
  scratch.select();
  const copied = document.execCommand("copy");
  scratch.remove();
  if (!copied) throw new Error("Clipboard access is unavailable.");
}

export const browserGuideHandoffDependencies: GuideHandoffDependencies = {
  copyText: defaultCopyText,
  downloadJson: (json, filename) => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
  openEmail: (href) => {
    window.location.href = href;
  },
  printPage: () => window.print(),
};

function handoffFailureMessage(action: HandoffAction, error: unknown): string {
  const fallback =
    action === "copy"
      ? "Could not copy the summary. Download the JSON instead."
      : action === "download"
        ? "Could not create the download. Try copying the summary."
        : action === "email"
          ? "Could not open your email app. Copy the summary instead."
          : "Could not open the print dialog.";
  return error instanceof Error && error.message ? `${fallback} ${error.message}` : fallback;
}

function runHandoff(
  action: HandoffAction,
  successMessage: string,
  operation: (state: TesterGuideRootState) => Promise<void> | void,
): TesterGuideThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    dispatch({ type: GUIDE_HANDOFF_REQUEST, payload: action });
    try {
      await operation(getState());
      dispatch({ type: GUIDE_HANDOFF_SUCCESS, payload: { action, message: successMessage } });
      return true;
    } catch (error) {
      dispatch({
        type: GUIDE_HANDOFF_FAILURE,
        payload: { action, message: handoffFailureMessage(action, error) },
      });
      return false;
    }
  };
}

export function copyGuideSummary(
  dependencies = browserGuideHandoffDependencies,
): TesterGuideThunk<Promise<boolean>> {
  return runHandoff("copy", "Readable feedback summary copied.", async (state) => {
    const payload = buildGuideExportPayload(state.testerGuide);
    await dependencies.copyText(generateReadableGuideSummary(payload));
  });
}

export function downloadGuideJson(
  dependencies = browserGuideHandoffDependencies,
): TesterGuideThunk<Promise<boolean>> {
  return runHandoff("download", "Complete feedback JSON downloaded.", (state) => {
    const payload = buildGuideExportPayload(state.testerGuide);
    dependencies.downloadJson(JSON.stringify(payload, null, 2), getGuideExportFilename(payload));
  });
}

export function openGuideEmail(
  teamEmail: string,
  dependencies = browserGuideHandoffDependencies,
): TesterGuideThunk<Promise<boolean>> {
  return runHandoff(
    "email",
    "Email draft opened. Attach the JSON for the complete response.",
    (state) => {
      const payload = buildGuideExportPayload(state.testerGuide);
      dependencies.openEmail(buildGuideEmailHref(payload, teamEmail));
    },
  );
}

export function printGuide(
  dependencies = browserGuideHandoffDependencies,
): TesterGuideThunk<Promise<boolean>> {
  return runHandoff("print", "Print dialog opened.", () => dependencies.printPage());
}
