import type { WebStorage } from "redux-persist";

const memory = new Map<string, string>();

const memoryStorage: WebStorage = {
  getItem: async (key) => memory.get(key) ?? null,
  setItem: async (key, value) => {
    memory.set(key, value);
  },
  removeItem: async (key) => {
    memory.delete(key);
  },
};

function canUseLocalStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__erth_tester_guide_storage_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export const testerGuideStorageAvailable = canUseLocalStorage();

export const testerGuideStorage: WebStorage = testerGuideStorageAvailable
  ? {
      getItem: async (key) => {
        const raw = window.localStorage.getItem(key);
        if (raw === null) return null;
        try {
          JSON.parse(raw);
          return raw;
        } catch {
          window.localStorage.removeItem(key);
          return null;
        }
      },
      setItem: async (key, value) => {
        window.localStorage.setItem(key, value);
      },
      removeItem: async (key) => {
        window.localStorage.removeItem(key);
      },
    }
  : memoryStorage;
