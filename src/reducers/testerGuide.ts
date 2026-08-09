import { GUIDE_MISSIONS } from "@/content/tester-guide-questionnaire";
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
import type { TesterGuideAction } from "@/actions/testerGuide";
import type { MissionId, MissionResponse, TesterGuideState } from "@/lib/tester-guide-types";

function createMissionResponses(): Record<MissionId, MissionResponse> {
  return Object.fromEntries(
    GUIDE_MISSIONS.map((mission) => [
      mission.id,
      {
        tasks: Object.fromEntries(mission.tasks.map((task) => [task.id, false])),
        status: "not_started",
        rating: 0,
        notes: "",
      },
    ]),
  ) as Record<MissionId, MissionResponse>;
}

export function createInitialTesterGuideState(): TesterGuideState {
  return {
    schemaVersion: 4,
    currentStage: "welcome",
    tester: {
      name: "",
      email: "",
      erthUsername: "",
      device: {
        platform: "other",
        deviceFamily: "",
        osVersion: "",
        exactModel: "",
      },
      testFlightBuild: "",
      travelFrequency: "",
      currentMemorySystem: "",
    },
    sharingAcknowledged: false,
    missions: createMissionResponses(),
    issues: [],
    reflection: {
      clarity: 0,
      reliability: 0,
      productValue: 0,
      likelihoodToReturn: 0,
      strongestMoment: "",
      biggestConfusion: "",
      priorityImprovement: "",
      finalThoughts: "",
    },
    updatedAt: null,
    handoff: { status: "idle", action: null, message: "" },
  };
}

export const initialTesterGuideState = createInitialTesterGuideState();

function withUpdatedAt(state: TesterGuideState, updatedAt: string): TesterGuideState {
  return { ...state, updatedAt };
}

export function testerGuideReducer(
  state: TesterGuideState = initialTesterGuideState,
  action: TesterGuideAction,
): TesterGuideState {
  switch (action.type) {
    case SET_GUIDE_STAGE:
      return withUpdatedAt({ ...state, currentStage: action.payload }, action.updatedAt);
    case UPDATE_TESTER_DETAILS:
      return withUpdatedAt(
        { ...state, tester: { ...state.tester, ...action.payload } },
        action.updatedAt,
      );
    case SET_SHARING_ACKNOWLEDGEMENT:
      return withUpdatedAt({ ...state, sharingAcknowledged: action.payload }, action.updatedAt);
    case TOGGLE_GUIDE_TASK: {
      const mission = state.missions[action.payload.missionId];
      return withUpdatedAt(
        {
          ...state,
          missions: {
            ...state.missions,
            [action.payload.missionId]: {
              ...mission,
              tasks: { ...mission.tasks, [action.payload.taskId]: action.payload.checked },
            },
          },
        },
        action.updatedAt,
      );
    }
    case SET_ALL_GUIDE_TASKS: {
      const mission = state.missions[action.payload.missionId];
      const tasks = Object.fromEntries(
        Object.keys(mission.tasks).map((taskId) => [taskId, action.payload.checked]),
      );
      return withUpdatedAt(
        {
          ...state,
          missions: {
            ...state.missions,
            [action.payload.missionId]: { ...mission, tasks },
          },
        },
        action.updatedAt,
      );
    }
    case SET_MISSION_STATUS: {
      const mission = state.missions[action.payload.missionId];
      return withUpdatedAt(
        {
          ...state,
          missions: {
            ...state.missions,
            [action.payload.missionId]: { ...mission, status: action.payload.status },
          },
        },
        action.updatedAt,
      );
    }
    case SET_MISSION_RATING: {
      const mission = state.missions[action.payload.missionId];
      return withUpdatedAt(
        {
          ...state,
          missions: {
            ...state.missions,
            [action.payload.missionId]: { ...mission, rating: action.payload.rating },
          },
        },
        action.updatedAt,
      );
    }
    case SET_MISSION_NOTES: {
      const mission = state.missions[action.payload.missionId];
      return withUpdatedAt(
        {
          ...state,
          missions: {
            ...state.missions,
            [action.payload.missionId]: { ...mission, notes: action.payload.notes },
          },
        },
        action.updatedAt,
      );
    }
    case ADD_GUIDE_ISSUE:
      return withUpdatedAt(
        { ...state, issues: [action.payload, ...state.issues] },
        action.updatedAt,
      );
    case UPDATE_GUIDE_ISSUE:
      return withUpdatedAt(
        {
          ...state,
          issues: state.issues.map((issue) =>
            issue.id === action.payload.id ? { ...issue, ...action.payload.updates } : issue,
          ),
        },
        action.updatedAt,
      );
    case REMOVE_GUIDE_ISSUE:
      return withUpdatedAt(
        {
          ...state,
          issues: state.issues.filter((issue) => issue.id !== action.payload),
        },
        action.updatedAt,
      );
    case UPDATE_GUIDE_REFLECTION:
      return withUpdatedAt(
        {
          ...state,
          reflection: { ...state.reflection, ...action.payload },
        },
        action.updatedAt,
      );
    case GUIDE_HANDOFF_REQUEST:
      return {
        ...state,
        handoff: { status: "loading", action: action.payload, message: "" },
      };
    case GUIDE_HANDOFF_SUCCESS:
      return {
        ...state,
        handoff: {
          status: "success",
          action: action.payload.action,
          message: action.payload.message,
        },
      };
    case GUIDE_HANDOFF_FAILURE:
      return {
        ...state,
        handoff: {
          status: "error",
          action: action.payload.action,
          message: action.payload.message,
        },
      };
    case CLEAR_GUIDE_HANDOFF:
      return { ...state, handoff: { status: "idle", action: null, message: "" } };
    case RESET_TESTER_GUIDE:
      return createInitialTesterGuideState();
    default:
      return state;
  }
}
