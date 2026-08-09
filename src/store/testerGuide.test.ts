import { migrateTesterDetails } from "@/store/testerGuide";

describe("tester guide persistence migrations", () => {
  it("normalizes a precise legacy Android model into the new device matrix", () => {
    const tester = migrateTesterDetails({
      name: "Morgan",
      device: "Samsung Galaxy",
      deviceOther: "Galaxy A55",
      osVersion: "Other Android version",
      osVersionOther: "Android 17 beta",
      testFlightBuild: "412",
    });

    expect(tester).toMatchObject({ name: "Morgan", testFlightBuild: "412" });
    expect(tester.device).toEqual({
      platform: "android",
      deviceFamily: "Samsung Galaxy A series",
      osVersion: "Android 17 beta",
      exactModel: "Galaxy A55",
    });
  });

  it("preserves broad legacy Apple answers without inventing an exact model", () => {
    const tester = migrateTesterDetails({
      device: "iPhone 16 series",
      osVersion: "iOS 26 or newer",
    });

    expect(tester.device).toEqual({
      platform: "ios",
      deviceFamily: "iPhone 16 family",
      osVersion: "iOS 26",
      exactModel: "",
    });
  });

  it("removes a duplicated family label from a migrated exact-model field", () => {
    const tester = migrateTesterDetails({
      device: "Other Android phone",
      deviceOther: "Other Android phone",
      osVersion: "Android 16",
    });

    expect(tester.device).toMatchObject({
      deviceFamily: "Other Android phone",
      exactModel: "",
    });
  });

  it("migrates subjective travel frequency answers to numeric ranges", () => {
    expect(migrateTesterDetails({ travelFrequency: "A few times a year" }).travelFrequency).toBe(
      "3–5 trips per year",
    );
    expect(migrateTesterDetails({ travelFrequency: "Every few years" }).travelFrequency).toBe(
      "Less than 1 trip per year",
    );
  });

  it("recovers safely from malformed tester data", () => {
    expect(migrateTesterDetails("corrupt").device).toMatchObject({
      platform: "other",
      deviceFamily: "",
      osVersion: "",
    });
  });
});
