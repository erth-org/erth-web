import { createContext, useContext } from "react";

export const TesterGuidePersistenceContext = createContext(false);

export function useTesterGuideRestoredFromStorage(): boolean {
  return useContext(TesterGuidePersistenceContext);
}
