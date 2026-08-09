import type {
  DevicePlatform,
  ExperienceReflection,
  GuideMissionDefinition,
  GuideStageId,
  IssueSeverity,
  MissionId,
  MissionStatus,
} from "@/lib/tester-guide-types";

export const APPLE_DEVICE_OPTIONS = [
  "iPhone 17 family / iPhone Air",
  "iPhone 16 family",
  "iPhone 15 family",
  "iPhone 14 family",
  "iPhone 13 family",
  "iPhone 12 or iPhone 11",
  "iPhone SE",
  "Other iPhone",
  "iPad",
] as const;

export const ANDROID_DEVICE_OPTIONS = [
  "Samsung Galaxy S series",
  "Samsung Galaxy A series",
  "Samsung Galaxy Z Fold / Flip series",
  "Google Pixel series",
  "Xiaomi / Redmi / POCO",
  "OnePlus",
  "OPPO / realme / vivo",
  "Motorola",
  "Other Android phone",
  "Android tablet",
] as const;

export const OTHER_DEVICE_OPTIONS = ["Other device"] as const;

export const DEVICE_OPTION_GROUPS = [
  { label: "Apple", options: APPLE_DEVICE_OPTIONS },
  { label: "Android", options: ANDROID_DEVICE_OPTIONS },
  { label: "Other", options: OTHER_DEVICE_OPTIONS },
] as const;

export const IOS_VERSION_OPTIONS = [
  "iOS 27 beta",
  "iOS 26",
  "iOS 18",
  "iOS 17 or earlier",
  "I’m not sure",
] as const;

export const ANDROID_VERSION_OPTIONS = [
  "Android 17 beta",
  "Android 16",
  "Android 15",
  "Android 14",
  "Android 13 or earlier",
  "I’m not sure",
] as const;

export const OTHER_OS_VERSION_OPTIONS = ["Other operating system", "I’m not sure"] as const;

export const OS_OPTIONS_BY_PLATFORM: Record<DevicePlatform, ReadonlyArray<string>> = {
  ios: IOS_VERSION_OPTIONS,
  android: ANDROID_VERSION_OPTIONS,
  other: OTHER_OS_VERSION_OPTIONS,
};

export function getDevicePlatform(deviceFamily: string): DevicePlatform {
  if ((APPLE_DEVICE_OPTIONS as ReadonlyArray<string>).includes(deviceFamily)) return "ios";
  if ((ANDROID_DEVICE_OPTIONS as ReadonlyArray<string>).includes(deviceFamily)) return "android";
  return "other";
}

export const TRAVEL_FREQUENCY_OPTIONS = [
  "12+ trips per year",
  "6–11 trips per year",
  "3–5 trips per year",
  "1–2 trips per year",
  "Less than 1 trip per year",
  "I don’t travel",
] as const;

export const MEMORY_SYSTEM_OPTIONS = [
  "Mostly my camera roll",
  "Instagram or another social app",
  "Group chats",
  "Cloud albums",
  "Notes or journals",
  "Nowhere organized",
] as const;

export const WELCOME_QUESTIONNAIRE = {
  instructions: [
    {
      title: "Use your instinct",
      body: "Try what feels natural before looking for a workaround.",
    },
    {
      title: "Pause at friction",
      body: "A dead end, slow state, or unclear label is valuable evidence.",
    },
    {
      title: "Share safely",
      body: "Never add passwords, private addresses, or sensitive details.",
    },
  ],
  context: {
    eyebrow: "Optional tester context",
    title: "A little context helps us learn",
    description:
      "These are answer fields, not instructions. Add only what you are comfortable sharing; it helps us connect feedback to a build and device without collecting demographic data.",
  },
  groups: {
    personal: {
      title: "Personal information",
      description: "Optional details that identify the feedback only when you choose to share it.",
      fields: {
        name: { label: "Name", placeholder: "Your name" },
        erthUsername: { label: "Erth username", placeholder: "@username" },
        email: {
          label: "Contact email",
          placeholder: "name@example.com",
          hint: "Only included in the file or email you choose to share.",
        },
      },
    },
    device: {
      title: "Device information",
      description:
        "Helps us connect compatibility, layout, and performance feedback to the right hardware.",
      fields: {
        family: { label: "Device family", placeholder: "Choose a device family" },
        osVersion: {
          label: "OS version",
          placeholder: "Choose an OS version",
          emptyPlaceholder: "Choose a device first",
          emptyHint: "Choose a device first so we can show the matching versions.",
        },
        exactModel: {
          label: "Exact model, if known",
          placeholder: "Example: Galaxy A55",
          hint: "Examples: Galaxy A55, iPhone 15 Pro, Pixel 9.",
        },
        build: {
          label: "TestFlight build",
          placeholder: "Build number, if visible",
          hint: "This web guide cannot read the native app build. In-app reports should attach app version and build automatically.",
        },
      },
    },
    habits: {
      title: "Travel and memory habits",
      description:
        "General context about how often you travel and how you currently keep trip memories.",
      fields: {
        travelFrequency: {
          label: "About how many trips do you take per year?",
          placeholder: "No answer selected",
          options: TRAVEL_FREQUENCY_OPTIONS,
        },
        memorySystem: {
          label: "Where do your trip memories live now?",
          placeholder: "No answer selected",
          options: MEMORY_SYSTEM_OPTIONS,
        },
      },
    },
  },
  acknowledgement: {
    label:
      "I understand this guide saves answers in this browser, and nothing reaches Erth until I explicitly share, email, or upload the generated report.",
    helper: "You can reset the guide and erase its saved progress at any time.",
  },
} as const;

export const MISSION_QUESTIONNAIRE = {
  checklistLabel: "Mission checklist",
  selectAllLabel: "Select all",
  clearAllLabel: "Clear all",
  selectAllAriaLabel: "Select all mission tasks",
  clearAllAriaLabel: "Clear all mission tasks",
  outcomePrompt: "How did this mission end?",
  outcomeAriaLabel: "Mission outcome",
  outcomeOptions: [
    { value: "completed_without_help", label: "Completed", helper: "I finished without help" },
    { value: "completed_with_help", label: "Needed help", helper: "I finished with guidance" },
    { value: "blocked", label: "Blocked", helper: "I could not finish" },
    { value: "skipped", label: "Skipped", helper: "Not relevant or unavailable" },
  ] satisfies ReadonlyArray<{ value: MissionStatus; label: string; helper: string }>,
  clearOutcomeHint: "Select the active outcome again to clear it.",
  clearRatingHint: "Select an active number again to clear it.",
  notesPlaceholder: "Tell us what you tried, expected, and noticed…",
  notesHint: "Optional, but specific moments are the most useful.",
} as const;

export const ISSUE_QUESTIONNAIRE = {
  defaultSeverity: "p2" as IssueSeverity,
  severityOptions: [
    { value: "p2", label: "P2 · Confusing or workaround needed" },
    { value: "p0", label: "P0 · Crash, data loss, or cannot enter" },
    { value: "p1", label: "P1 · Core flow blocked" },
    { value: "p3", label: "P3 · Visual polish or minor confusion" },
    { value: "positive", label: "Positive · Worked especially well" },
  ] satisfies ReadonlyArray<{ value: IssueSeverity; label: string }>,
  fields: {
    screen: {
      label: "Screen or feature",
      placeholder: "Example: Upload, Explore, Profile",
    },
    severity: { label: "Severity or signal" },
    trying: { label: "What were you trying to do?" },
    happened: { label: "What happened?" },
    expected: { label: "What did you expect?" },
    steps: {
      label: "Steps to reproduce",
      placeholder: "1. Open…\n2. Tap…\n3. See…",
    },
    mediaNote: {
      label: "Screenshot or video note",
      placeholder: "Example: IMG_4021, attached to email",
    },
  },
} as const;

type ReflectionRatingKey = keyof Pick<
  ExperienceReflection,
  "clarity" | "reliability" | "productValue" | "likelihoodToReturn"
>;

type ReflectionTextKey = keyof Pick<
  ExperienceReflection,
  "strongestMoment" | "biggestConfusion" | "priorityImprovement" | "finalThoughts"
>;

export const REFLECTION_RATING_QUESTIONS: ReadonlyArray<{
  key: ReflectionRatingKey;
  id: string;
  prompt: string;
  low: string;
  high: string;
}> = [
  {
    key: "clarity",
    id: "reflection-clarity",
    prompt: "The app was easy to understand",
    low: "Disagree",
    high: "Agree",
  },
  {
    key: "reliability",
    id: "reflection-reliability",
    prompt: "The experience felt reliable",
    low: "Fragile",
    high: "Solid",
  },
  {
    key: "productValue",
    id: "reflection-value",
    prompt: "I understand Erth's value",
    low: "Not yet",
    high: "Clearly",
  },
  {
    key: "likelihoodToReturn",
    id: "reflection-return",
    prompt: "I would return to Erth",
    low: "Unlikely",
    high: "Definitely",
  },
];

export const REFLECTION_TEXT_QUESTIONS: ReadonlyArray<{
  key: ReflectionTextKey;
  id: string;
  label: string;
  placeholder?: string;
  minHeight: "min-h-24" | "min-h-28";
}> = [
  {
    key: "strongestMoment",
    id: "reflection-strongest",
    label: "When did Erth feel most meaningful or alive?",
    placeholder: "A feature, a feeling, or a specific moment…",
    minHeight: "min-h-24",
  },
  {
    key: "biggestConfusion",
    id: "reflection-confusion",
    label: "What was the biggest source of confusion?",
    placeholder: "Where did the app fail to explain itself?",
    minHeight: "min-h-24",
  },
  {
    key: "priorityImprovement",
    id: "reflection-priority",
    label: "If we improved one thing first, what should it be?",
    minHeight: "min-h-24",
  },
  {
    key: "finalThoughts",
    id: "reflection-final",
    label: "Anything else you want the team to understand?",
    minHeight: "min-h-28",
  },
];

export const GUIDE_MISSIONS: ReadonlyArray<GuideMissionDefinition> = [
  {
    id: "orientation",
    eyebrow: "Mission 01",
    title: "Find your way in",
    description:
      "Start from the TestFlight build and see whether Erth explains itself before anyone explains it for us.",
    ratingPrompt: "I knew what to do next",
    ratingLow: "Lost",
    ratingHigh: "Clear",
    notesPrompt: "Where did you hesitate, wait, or need help? What felt immediately clear?",
    tasks: [
      { id: "open-build", label: "Install or open the current TestFlight build." },
      { id: "account", label: "Create an account or sign in." },
      { id: "profile-setup", label: "If you are new, create your profile." },
      { id: "main-app", label: "Reach the main app and find the primary navigation." },
    ],
  },
  {
    id: "moment",
    eyebrow: "Mission 02",
    title: "Create a moment",
    description:
      "Capture something real—a past trip photo, a walk, or a small memory—and follow it through to your profile.",
    ratingPrompt: "Creating a moment felt understandable",
    ratingLow: "Confusing",
    ratingHigh: "Natural",
    notesPrompt: "Did media, location, privacy, preview, or publishing create friction?",
    tasks: [
      { id: "choose-flow", label: "Open Upload and start a new moment." },
      { id: "add-media", label: "Add a photo, location, and short description." },
      { id: "publish-find", label: "Publish the moment and find it on your Profile." },
    ],
  },
  {
    id: "trip",
    eyebrow: "Mission 03",
    title: "Build a travel story",
    description:
      "Create a trip, revisit it, and add enough context to understand whether trips feel different from individual moments.",
    ratingPrompt: "The idea of a trip made sense",
    ratingLow: "Unclear",
    ratingHigh: "Obvious",
    notesPrompt: "What was confusing or useful about creating and managing a trip?",
    tasks: [
      { id: "create-trip", label: "Open Upload and start a new trip." },
      { id: "trip-details", label: "Add the trip's essential details and save it." },
      { id: "save-find", label: "Find the saved trip from your Profile." },
    ],
  },
  {
    id: "social",
    eyebrow: "Mission 04",
    title: "Browse and connect",
    description:
      "Use Erth like a normal social product and notice whether every action has a trustworthy, predictable state.",
    ratingPrompt: "Social actions felt trustworthy",
    ratingLow: "Uncertain",
    ratingHigh: "Confident",
    notesPrompt: "Did counts, reactions, bookmarks, follow states, or navigation surprise you?",
    tasks: [
      { id: "browse-feed", label: "Open a moment from the Feed." },
      { id: "react", label: "Try a like, comment, or bookmark and confirm it updates." },
      { id: "find-team", label: "Find another tester or @ErthTeam and follow them." },
    ],
  },
  {
    id: "globe",
    eyebrow: "Mission 05",
    title: "Explore the globe",
    description:
      "Test the visual heart of Erth: moving from the world view into the people and memories behind each place.",
    ratingPrompt: "The globe felt responsive and legible",
    ratingLow: "Difficult",
    ratingHigh: "Fluid",
    notesPrompt: "Did markers, clusters, the carousel, or bookmark mode behave as you expected?",
    tasks: [
      { id: "load-globe", label: "Open Explore and wait for the globe to load." },
      { id: "move-globe", label: "Wander through the globe and tap an item that interests you." },
      { id: "carousel-detail", label: "Open a moment or profile from the selected place." },
    ],
  },
  {
    id: "identity",
    eyebrow: "Mission 06",
    title: "Recognize your Erth",
    description:
      "Use Profile and Zenith to decide whether your activity adds up to a travel identity that feels personal and meaningful.",
    ratingPrompt: "This felt like my travel identity",
    ratingLow: "Not yet",
    ratingHigh: "Absolutely",
    notesPrompt: "What made Profile or Zenith feel personal—or disconnected from what you did?",
    tasks: [
      {
        id: "profile-overview",
        label: "Review your Profile, moments, trips, and globe.",
      },
      { id: "edit-profile", label: "Edit one safe profile detail and confirm it persists." },
      { id: "open-zenith", label: "Open Zenith and compare its progress with your activity." },
    ],
  },
  {
    id: "trust",
    eyebrow: "Mission 07",
    title: "Test the safety net",
    description:
      "Check whether settings, permissions, and account recovery make the beta feel safe enough to trust.",
    ratingPrompt: "Account controls felt safe",
    ratingLow: "Risky",
    ratingHigh: "Reassuring",
    notesPrompt: "Did anything feel unfinished, risky, hard to understand, or difficult to leave?",
    tasks: [
      { id: "settings", label: "Open Settings and review the available account controls." },
      { id: "persist-setting", label: "Change one safe setting and confirm it saves." },
      {
        id: "logout-login",
        label: "Log out and sign back in; start password recovery if needed.",
      },
    ],
  },
] as const;

export const GUIDE_STAGE_ORDER: ReadonlyArray<Exclude<GuideStageId, "issues">> = [
  "welcome",
  ...GUIDE_MISSIONS.map((mission) => mission.id),
  "reflection",
  "review",
];

export const MISSION_BY_ID = Object.fromEntries(
  GUIDE_MISSIONS.map((mission) => [mission.id, mission]),
) as Record<MissionId, GuideMissionDefinition>;
