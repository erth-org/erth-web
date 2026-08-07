import { useMemo, type ReactNode } from "react";
import { Provider } from "react-redux";
import { createTesterGuideStore } from "@/store/testerGuide";
import { TesterGuidePersistenceContext } from "@/hooks/useTesterGuidePersistence";

export function TesterGuideProvider({ children }: { children: ReactNode }) {
  const guideStore = useMemo(() => createTesterGuideStore(), []);
  return (
    <TesterGuidePersistenceContext.Provider value={guideStore.restoredFromStorage}>
      <Provider store={guideStore.store}>{children}</Provider>
    </TesterGuidePersistenceContext.Provider>
  );
}
