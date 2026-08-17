import type { ThunkAction } from "redux-thunk";
import {
  ADD_GUIDE_ISSUE,
  CLEAR_GUIDE_HANDOFF,
  GUIDE_HANDOFF_FAILURE,
  GUIDE_HANDOFF_REQUEST,
  GUIDE_HANDOFF_SUCCESS,
  REMOVE_GUIDE_ISSUE,
  RESET_TESTER_GUIDE,
  SET_ALL_GUIDE_TASKS,
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
import { buildGuideExportPayload } from "@/lib/tester-guide-export";
import { generateGuidePdf, getGuidePdfFileName } from "@/lib/tester-guide-pdf";
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
      type: typeof SET_ALL_GUIDE_TASKS;
      payload: { missionId: MissionId; checked: boolean };
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

export const setAllGuideTasks = (missionId: MissionId, checked: boolean): TesterGuideAction => ({
  type: SET_ALL_GUIDE_TASKS,
  payload: { missionId, checked },
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
  createPdf: typeof generateGuidePdf;
  downloadPdf: (blob: Blob, fileName: string) => void;
}

export const browserGuideHandoffDependencies: GuideHandoffDependencies = {
  createPdf: generateGuidePdf,
  downloadPdf: (blob, fileName) => {
    const objectUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = objectUrl;
    downloadLink.download = fileName;
    downloadLink.hidden = true;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  },
};

function handoffFailureMessage(error: unknown): string {
  const fallback = "Could not prepare the PDF. Please try downloading it again.";
  return error instanceof Error && error.message ? `${fallback} ${error.message}` : fallback;
}

function runHandoff<Result>(
  action: HandoffAction,
  successMessage: string | ((result: Result) => string),
  operation: (state: TesterGuideRootState) => Promise<Result> | Result,
): TesterGuideThunk<Promise<boolean>> {
  return async (dispatch, getState) => {
    dispatch({ type: GUIDE_HANDOFF_REQUEST, payload: action });
    try {
      const result = await operation(getState());
      const message =
        typeof successMessage === "function" ? successMessage(result) : successMessage;
      dispatch({ type: GUIDE_HANDOFF_SUCCESS, payload: { action, message } });
      return true;
    } catch (error) {
      dispatch({
        type: GUIDE_HANDOFF_FAILURE,
        payload: { action, message: handoffFailureMessage(error) },
      });
      return false;
    }
  };
}

export function downloadGuidePdf(
  dependencies = browserGuideHandoffDependencies,
): TesterGuideThunk<Promise<boolean>> {
  return runHandoff("pdf", "PDF downloaded. Now send it to Erth by DM or email.", async (state) => {
    const payload = buildGuideExportPayload(state.testerGuide);
    const pdf = await dependencies.createPdf(payload);
    dependencies.downloadPdf(pdf, getGuidePdfFileName(payload));
  });
}
