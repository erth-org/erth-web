import {
  ANDROID_VERSION_OPTIONS,
  DEVICE_OPTION_GROUPS,
  GUIDE_MISSIONS,
  GUIDE_STAGE_ORDER,
  ISSUE_QUESTIONNAIRE,
  IOS_VERSION_OPTIONS,
  MISSION_QUESTIONNAIRE,
  REFLECTION_RATING_QUESTIONS,
  REFLECTION_TEXT_QUESTIONS,
  TRAVEL_FREQUENCY_OPTIONS,
  WELCOME_QUESTIONNAIRE,
} from "@/content/tester-guide-questionnaire";

describe("tester guide questionnaire", () => {
  it("keeps every interactive section in one complete, uniquely keyed definition", () => {
    const deviceAnswers = DEVICE_OPTION_GROUPS.flatMap((group) => group.options);
    const missionIds = GUIDE_MISSIONS.map((mission) => mission.id);
    const reflectionKeys = [
      ...REFLECTION_RATING_QUESTIONS.map((question) => question.key),
      ...REFLECTION_TEXT_QUESTIONS.map((question) => question.key),
    ];

    expect(new Set(deviceAnswers).size).toBe(deviceAnswers.length);
    expect(IOS_VERSION_OPTIONS).toEqual(expect.arrayContaining(["iOS 27 beta", "iOS 26"]));
    expect(ANDROID_VERSION_OPTIONS).toEqual(
      expect.arrayContaining(["Android 17 beta", "Android 16"]),
    );
    expect(new Set(missionIds).size).toBe(7);
    expect(GUIDE_MISSIONS.find((mission) => mission.id === "orientation")?.tasks).toHaveLength(4);
    expect(
      GUIDE_MISSIONS.filter((mission) => mission.id !== "orientation").every(
        (mission) => mission.tasks.length === 3,
      ),
    ).toBe(true);
    expect(GUIDE_STAGE_ORDER).not.toContain("issues");
    expect(MISSION_QUESTIONNAIRE.outcomeOptions).toHaveLength(4);
    expect(ISSUE_QUESTIONNAIRE.severityOptions).toHaveLength(5);
    expect(new Set(reflectionKeys).size).toBe(8);
    expect(TRAVEL_FREQUENCY_OPTIONS).toEqual([
      "12+ trips per year",
      "6–11 trips per year",
      "3–5 trips per year",
      "1–2 trips per year",
      "Less than 1 trip per year",
      "I don’t travel",
    ]);
    expect(WELCOME_QUESTIONNAIRE.groups.personal.fields.email.label).toBe("Contact email");
    expect(WELCOME_QUESTIONNAIRE.acknowledgement.label).toMatch(/nothing reaches Erth/i);
  });
});
