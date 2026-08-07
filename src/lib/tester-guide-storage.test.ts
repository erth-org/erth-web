describe("testerGuideStorage", () => {
  beforeEach(() => {
    jest.resetModules();
    window.localStorage.clear();
  });

  it("drops malformed persisted JSON instead of breaking guide hydration", async () => {
    window.localStorage.setItem("persist:erth-beta-guide-v2", "not-json");
    const { testerGuideStorage } = await import("@/lib/tester-guide-storage");

    await expect(testerGuideStorage.getItem("persist:erth-beta-guide-v2")).resolves.toBeNull();
    expect(window.localStorage.getItem("persist:erth-beta-guide-v2")).toBeNull();
  });
});
