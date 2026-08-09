import { applyMiddleware, combineReducers, createStore, type Reducer } from "redux";
import { thunk } from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import {
  ANDROID_DEVICE_OPTIONS,
  APPLE_DEVICE_OPTIONS,
  getDevicePlatform,
  OS_OPTIONS_BY_PLATFORM,
} from "@/content/tester-guide-questionnaire";
import { createInitialTesterGuideState, testerGuideReducer } from "@/reducers/testerGuide";
import { testerGuideStorage, testerGuideStorageAvailable } from "@/lib/tester-guide-storage";
import type {
  BetaTesterDevice,
  DevicePlatform,
  TesterDetails,
  TesterGuideState,
} from "@/lib/tester-guide-types";

type LegacyTesterDetails = Partial<Omit<TesterDetails, "device">> & {
  device?: string | Partial<BetaTesterDevice>;
  deviceOther?: string;
  osVersion?: string;
  osVersionOther?: string;
};

const LEGACY_DEVICE_FAMILY_OPTIONS: ReadonlyArray<string> = [
  "iPhone 17 series",
  "iPhone 16 series",
  "iPhone 15 series",
  "iPhone 14 series",
  "iPhone 13 or earlier",
  "Other Apple device",
  "Samsung Galaxy",
  "Google Pixel",
  "Other Android phone",
  "Other device",
];

const ALL_DEVICE_FAMILY_OPTIONS: ReadonlyArray<string> = [
  ...APPLE_DEVICE_OPTIONS,
  ...ANDROID_DEVICE_OPTIONS,
  "Other device",
  ...LEGACY_DEVICE_FAMILY_OPTIONS,
];

const LEGACY_TRAVEL_FREQUENCY_MAP: Readonly<Record<string, string>> = {
  "Very often": "12+ trips per year",
  "A few times a year": "3–5 trips per year",
  "Once a year": "1–2 trips per year",
  "Every few years": "Less than 1 trip per year",
  "I rarely travel": "Less than 1 trip per year",
};

function sanitizeExactModel(exactModel: string, deviceFamily: string): string {
  return exactModel === deviceFamily || ALL_DEVICE_FAMILY_OPTIONS.includes(exactModel)
    ? ""
    : exactModel;
}

function inferLegacyDeviceFamily(
  device: string,
  exactModel: string,
): {
  deviceFamily: string;
  exactModel: string;
  platform: DevicePlatform;
} {
  const normalized = `${device} ${exactModel}`.toLowerCase();
  const sanitizedExactModel = sanitizeExactModel(exactModel, device);
  const customModel =
    sanitizedExactModel || (ALL_DEVICE_FAMILY_OPTIONS.includes(device) ? "" : device);

  if (normalized.includes("ipad"))
    return { deviceFamily: "iPad", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone air") || normalized.includes("iphone 17"))
    return {
      deviceFamily: "iPhone 17 family / iPhone Air",
      exactModel: customModel,
      platform: "ios",
    };
  if (normalized.includes("iphone 16"))
    return { deviceFamily: "iPhone 16 family", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone 15"))
    return { deviceFamily: "iPhone 15 family", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone 14"))
    return { deviceFamily: "iPhone 14 family", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone 13"))
    return { deviceFamily: "iPhone 13 family", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone 12") || normalized.includes("iphone 11"))
    return { deviceFamily: "iPhone 12 or iPhone 11", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone se"))
    return { deviceFamily: "iPhone SE", exactModel: customModel, platform: "ios" };
  if (normalized.includes("iphone") || normalized.includes("apple"))
    return { deviceFamily: "Other iPhone", exactModel: customModel, platform: "ios" };
  if (normalized.includes("fold") || normalized.includes("flip") || normalized.includes("galaxy z"))
    return {
      deviceFamily: "Samsung Galaxy Z Fold / Flip series",
      exactModel: customModel,
      platform: "android",
    };
  if (normalized.includes("galaxy a"))
    return {
      deviceFamily: "Samsung Galaxy A series",
      exactModel: customModel,
      platform: "android",
    };
  if (normalized.includes("galaxy s"))
    return {
      deviceFamily: "Samsung Galaxy S series",
      exactModel: customModel,
      platform: "android",
    };
  if (normalized.includes("pixel"))
    return { deviceFamily: "Google Pixel series", exactModel: customModel, platform: "android" };
  if (normalized.includes("xiaomi") || normalized.includes("redmi") || normalized.includes("poco"))
    return { deviceFamily: "Xiaomi / Redmi / POCO", exactModel: customModel, platform: "android" };
  if (normalized.includes("oneplus"))
    return { deviceFamily: "OnePlus", exactModel: customModel, platform: "android" };
  if (normalized.includes("oppo") || normalized.includes("realme") || normalized.includes("vivo"))
    return { deviceFamily: "OPPO / realme / vivo", exactModel: customModel, platform: "android" };
  if (normalized.includes("motorola") || normalized.includes("moto"))
    return { deviceFamily: "Motorola", exactModel: customModel, platform: "android" };
  if (normalized.includes("tablet") && normalized.includes("android"))
    return { deviceFamily: "Android tablet", exactModel: customModel, platform: "android" };
  if (normalized.includes("android") || normalized.includes("samsung"))
    return {
      deviceFamily: "Other Android phone",
      exactModel: customModel,
      platform: "android",
    };
  return { deviceFamily: "Other device", exactModel: customModel, platform: "other" };
}

function normalizeOsVersion(
  osVersion: string,
  legacyExactVersion: string,
  platform: DevicePlatform,
): string {
  const options = OS_OPTIONS_BY_PLATFORM[platform];
  if (options.includes(osVersion)) return osVersion;

  const normalized = `${legacyExactVersion || osVersion}`.toLowerCase();
  if (!normalized.trim()) return "";
  if (platform === "ios") {
    if (normalized.includes("27")) return "iOS 27 beta";
    if (normalized.includes("26") || normalized.includes("or newer")) return "iOS 26";
    if (normalized.includes("18")) return "iOS 18";
    if (/ios\s*(1[0-7]|[0-9])\b/.test(normalized)) return "iOS 17 or earlier";
  }
  if (platform === "android") {
    if (normalized.includes("17")) return "Android 17 beta";
    if (normalized.includes("16") || normalized.includes("or newer")) return "Android 16";
    if (normalized.includes("15")) return "Android 15";
    if (normalized.includes("14")) return "Android 14";
    if (/android\s*(1[0-3]|[0-9])\b/.test(normalized)) return "Android 13 or earlier";
  }
  return "I’m not sure";
}

export function migrateTesterDetails(tester: unknown): TesterDetails {
  const initial = createInitialTesterGuideState().tester;
  if (!tester || typeof tester !== "object" || Array.isArray(tester)) return initial;
  const legacyTester = tester as LegacyTesterDetails;
  const {
    device: storedDevice,
    deviceOther = "",
    osVersion = "",
    osVersionOther = "",
    ...testerFields
  } = legacyTester;
  const currentDevice = storedDevice && typeof storedDevice === "object" ? storedDevice : undefined;
  const migratedDevice = currentDevice
    ? {
        platform:
          currentDevice.deviceFamily && getDevicePlatform(currentDevice.deviceFamily) !== "other"
            ? getDevicePlatform(currentDevice.deviceFamily)
            : currentDevice.platform || "other",
        deviceFamily: currentDevice.deviceFamily || "",
        osVersion: currentDevice.osVersion || "",
        exactModel: sanitizeExactModel(
          currentDevice.exactModel || "",
          currentDevice.deviceFamily || "",
        ),
      }
    : inferLegacyDeviceFamily(typeof storedDevice === "string" ? storedDevice : "", deviceOther);

  return {
    ...initial,
    ...testerFields,
    travelFrequency:
      LEGACY_TRAVEL_FREQUENCY_MAP[testerFields.travelFrequency || ""] ||
      testerFields.travelFrequency ||
      "",
    device: {
      ...migratedDevice,
      osVersion: normalizeOsVersion(
        currentDevice?.osVersion || osVersion,
        osVersionOther,
        migratedDevice.platform,
      ),
    },
  };
}

const persistedTesterGuideReducer = persistReducer<TesterGuideState>(
  {
    key: "erth-beta-guide-v2",
    version: 4,
    storage: testerGuideStorage,
    migrate: async (state) => {
      if (!state) return state;
      const persisted = state as unknown as Partial<TesterGuideState> & {
        tester?: LegacyTesterDetails;
      };
      return {
        ...persisted,
        schemaVersion: 4,
        tester: migrateTesterDetails(persisted.tester),
      } as unknown as typeof state;
    },
    whitelist: [
      "schemaVersion",
      "currentStage",
      "tester",
      "sharingAcknowledged",
      "missions",
      "issues",
      "reflection",
      "updatedAt",
    ],
  },
  testerGuideReducer as Reducer<TesterGuideState>,
);

const rootReducer = combineReducers({ testerGuide: persistedTesterGuideReducer });

export type TesterGuideRootState = ReturnType<typeof rootReducer>;
export type TesterGuideStore = ReturnType<typeof createTesterGuideStore>["store"];
export type TesterGuideDispatch = TesterGuideStore["dispatch"];

function hasPersistedGuideProgress(): boolean {
  if (!testerGuideStorageAvailable || typeof window === "undefined") return false;
  const raw = window.localStorage.getItem("persist:erth-beta-guide-v2");
  if (!raw) return false;
  try {
    const envelope = JSON.parse(raw) as { updatedAt?: string };
    return envelope.updatedAt ? JSON.parse(envelope.updatedAt) !== null : false;
  } catch {
    return false;
  }
}

export function createTesterGuideStore() {
  const restoredFromStorage = hasPersistedGuideProgress();
  const store = createStore(rootReducer, applyMiddleware(thunk));
  const persistor = persistStore(store);
  return { store, persistor, restoredFromStorage };
}
