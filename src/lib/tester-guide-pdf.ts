import type {
  Content,
  ContentTable,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import type { TesterGuideExportPayload } from "@/lib/tester-guide-types";

const COLORS = {
  ink: "#17171C",
  muted: "#676772",
  line: "#DDDDE3",
  panel: "#F7F7F9",
  orange: "#F47F46",
  orangeSoft: "#FFF0E8",
  green: "#2F7D5A",
  red: "#B64545",
} as const;

const STATUS_LABELS: Record<TesterGuideExportPayload["missions"][number]["status"], string> = {
  not_started: "Not started",
  completed_without_help: "Completed without help",
  completed_with_help: "Completed with help",
  blocked: "Blocked",
  skipped: "Skipped",
};

const SEVERITY_LABELS: Record<
  TesterGuideExportPayload["issueReports"][number]["severity"],
  string
> = {
  p0: "P0 - Critical",
  p1: "P1 - Core flow blocked",
  p2: "P2 - Workaround needed",
  p3: "P3 - Minor issue",
  positive: "Positive signal",
};

const PDF_STYLES: StyleDictionary = {
  title: { fontSize: 27, bold: true, color: COLORS.ink, lineHeight: 1.05 },
  subtitle: { fontSize: 10, color: COLORS.muted, lineHeight: 1.35 },
  overline: { fontSize: 8, bold: true, color: COLORS.orange, characterSpacing: 1.3 },
  section: { fontSize: 15, bold: true, color: COLORS.ink },
  cardTitle: { fontSize: 11, bold: true, color: COLORS.ink },
  body: { fontSize: 9.5, color: COLORS.ink, lineHeight: 1.35 },
  small: { fontSize: 8, color: COLORS.muted, lineHeight: 1.3 },
  tableHeader: { fontSize: 8, bold: true, color: "#FFFFFF" },
  tableCell: { fontSize: 8.5, color: COLORS.ink, lineHeight: 1.25 },
};

function normalizePdfText(value: string): string {
  return value
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\r\n/g, "\n")
    .trim();
}

function valueOrNotProvided(value: string): string {
  return normalizePdfText(value) || "Not provided";
}

function formatGeneratedAt(value: string): string {
  const generatedAt = new Date(value);
  if (Number.isNaN(generatedAt.getTime())) return normalizePdfText(value);
  return `${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(generatedAt)} UTC`;
}

function sectionHeading(title: string, eyebrow?: string): Content {
  return {
    stack: [
      ...(eyebrow ? [{ text: eyebrow.toUpperCase(), style: "overline" } satisfies Content] : []),
      { text: title, style: "section", margin: [0, eyebrow ? 3 : 0, 0, 8] },
    ],
    margin: [0, 18, 0, 0],
  };
}

function statCard(value: string, label: string): Content {
  return {
    stack: [
      { text: value, fontSize: 18, bold: true, color: COLORS.ink },
      { text: label, style: "small", margin: [0, 3, 0, 0] },
    ],
    fillColor: COLORS.panel,
    margin: [10, 9, 10, 9],
  };
}

function contextRows(payload: TesterGuideExportPayload): ContentTable["table"]["body"] {
  const device = [payload.tester.device.deviceFamily, payload.tester.device.exactModel]
    .map((value) => normalizePdfText(value ?? ""))
    .filter(Boolean)
    .join(" - ");
  return [
    [
      "Name",
      valueOrNotProvided(payload.tester.name),
      "Erth username",
      valueOrNotProvided(payload.tester.erthUsername),
    ],
    ["Email", valueOrNotProvided(payload.tester.email), "Device", device || "Not provided"],
    [
      "OS version",
      valueOrNotProvided(payload.tester.device.osVersion),
      "TestFlight build",
      valueOrNotProvided(payload.tester.testFlightBuild),
    ],
    [
      "Travel frequency",
      valueOrNotProvided(payload.tester.travelFrequency),
      "Memory system",
      valueOrNotProvided(payload.tester.currentMemorySystem),
    ],
  ].map((row) =>
    row.map((value, index) => ({
      text: value,
      style: index % 2 === 0 ? "small" : "tableCell",
      bold: index % 2 === 0,
      color: index % 2 === 0 ? COLORS.muted : COLORS.ink,
      margin: [0, 5, 0, 5],
    })),
  );
}

function missionOverview(payload: TesterGuideExportPayload): Content {
  const rows: ContentTable["table"]["body"] = [
    ["Mission", "Outcome", "Rating", "Tasks"].map((text) => ({
      text,
      style: "tableHeader",
      fillColor: COLORS.ink,
      margin: [5, 6, 5, 6],
    })),
    ...payload.missions.map((mission) => {
      const totalTasks = mission.completedTasks.length + mission.incompleteTasks.length;
      const outcome =
        mission.status === "not_started" && mission.completedTasks.length
          ? "In progress"
          : STATUS_LABELS[mission.status];
      return [
        normalizePdfText(mission.title),
        outcome,
        mission.rating > 0 ? `${mission.rating}/5` : "-",
        `${mission.completedTasks.length}/${totalTasks}`,
      ].map((text) => ({ text, style: "tableCell", margin: [5, 6, 5, 6] }));
    }),
  ];

  return {
    table: {
      headerRows: 1,
      dontBreakRows: true,
      widths: ["*", 112, 42, 40],
      body: rows,
    },
    layout: {
      hLineWidth: (rowIndex) => (rowIndex <= 1 ? 0 : 0.5),
      vLineWidth: () => 0,
      hLineColor: () => COLORS.line,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0,
      fillColor: (rowIndex) => (rowIndex > 0 && rowIndex % 2 === 0 ? COLORS.panel : null),
    },
  };
}

function labeledText(label: string, value: string): Content | null {
  const normalized = normalizePdfText(value);
  if (!normalized) return null;
  return {
    stack: [
      { text: label.toUpperCase(), style: "small", bold: true, color: COLORS.muted },
      { text: normalized, style: "body", margin: [0, 2, 0, 0] },
    ],
    margin: [0, 0, 0, 8],
  };
}

function missionDetails(payload: TesterGuideExportPayload): Content[] {
  const attempted = payload.missions.filter(
    (mission) =>
      mission.status !== "not_started" ||
      mission.rating > 0 ||
      normalizePdfText(mission.notes) ||
      mission.completedTasks.length,
  );

  if (!attempted.length) {
    return [{ text: "No mission feedback was recorded.", style: "body", color: COLORS.muted }];
  }

  return attempted.map((mission, index) => {
    const totalTasks = mission.completedTasks.length + mission.incompleteTasks.length;
    const details = [
      labeledText("Notes", mission.notes),
      mission.completedTasks.length
        ? ({
            stack: [
              { text: "COMPLETED TASKS", style: "small", bold: true, color: COLORS.green },
              {
                ul: mission.completedTasks.map(normalizePdfText),
                style: "body",
                margin: [0, 3, 0, 0],
              },
            ],
            margin: [0, 0, 0, 8],
          } satisfies Content)
        : null,
      mission.status !== "skipped" && mission.incompleteTasks.length
        ? ({
            stack: [
              { text: "REMAINING TASKS", style: "small", bold: true, color: COLORS.muted },
              {
                ul: mission.incompleteTasks.map(normalizePdfText),
                style: "body",
                margin: [0, 3, 0, 0],
              },
            ],
          } satisfies Content)
        : null,
    ].filter((item): item is Content => item !== null);

    return {
      stack: [
        {
          columns: [
            { text: `${index + 1}. ${normalizePdfText(mission.title)}`, style: "cardTitle" },
            {
              text: `${STATUS_LABELS[mission.status]}  |  ${mission.rating > 0 ? `${mission.rating}/5` : "No rating"}  |  ${mission.completedTasks.length}/${totalTasks} tasks`,
              style: "small",
              alignment: "right",
            },
          ],
          columnGap: 12,
          margin: [0, 0, 0, 8],
        },
        ...details,
      ],
      margin: [0, index ? 10 : 0, 0, 0],
      fillColor: COLORS.panel,
      unbreakable: details.length < 3,
    } satisfies Content;
  });
}

function issueDetails(payload: TesterGuideExportPayload): Content[] {
  if (!payload.issueReports.length) {
    return [
      { text: "No issues or positive signals were logged.", style: "body", color: COLORS.muted },
    ];
  }

  return payload.issueReports.map((issue, index) => {
    const details = [
      labeledText("Trying to", issue.trying),
      labeledText("What happened", issue.happened),
      labeledText("Expected", issue.expected),
      labeledText("Steps to reproduce", issue.steps),
      labeledText("Screenshot or video", issue.mediaNote),
    ].filter((item): item is Content => item !== null);
    return {
      stack: [
        {
          columns: [
            { text: `${index + 1}. ${valueOrNotProvided(issue.screen)}`, style: "cardTitle" },
            {
              text: SEVERITY_LABELS[issue.severity],
              fontSize: 8,
              bold: true,
              color: issue.severity === "positive" ? COLORS.green : COLORS.red,
              alignment: "right",
            },
          ],
          margin: [0, 0, 0, 8],
        },
        ...details,
      ],
      margin: [0, index ? 10 : 0, 0, 0],
      fillColor: issue.severity === "positive" ? "#EFF8F3" : "#FFF6F4",
    } satisfies Content;
  });
}

function reflectionContent(payload: TesterGuideExportPayload): Content[] {
  const ratings = [
    ["Clarity", payload.experience.clarity],
    ["Reliability", payload.experience.reliability],
    ["Product value", payload.experience.productValue],
    ["Likelihood to return", payload.experience.likelihoodToReturn],
  ] as const;
  const written = [
    labeledText("Strongest moment", payload.experience.strongestMoment),
    labeledText("Biggest confusion", payload.experience.biggestConfusion),
    labeledText("Priority improvement", payload.experience.priorityImprovement),
    labeledText("Final thoughts", payload.experience.finalThoughts),
  ].filter((item): item is Content => item !== null);
  const hasRatings = ratings.some(([, rating]) => rating > 0);

  if (!hasRatings && !written.length) {
    return [{ text: "No overall reflection was recorded.", style: "body", color: COLORS.muted }];
  }

  return [
    {
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          ratings.map(([label, rating]) => ({
            stack: [
              { text: rating > 0 ? `${rating}/5` : "-", fontSize: 15, bold: true },
              { text: label, style: "small", margin: [0, 2, 0, 0] },
            ],
            fillColor: COLORS.panel,
            margin: [8, 7, 8, 7],
          })),
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, written.length ? 12 : 0],
    },
    ...written,
  ];
}

export function getGuidePdfFileName(payload: TesterGuideExportPayload): string {
  const identity = payload.tester.erthUsername || payload.tester.name || "beta-tester";
  const slug = identity
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const date = /^\d{4}-\d{2}-\d{2}/.exec(payload.generatedAt)?.[0] ?? "report";
  return `erth-beta-report-${slug || "tester"}-${date}.pdf`;
}

export function buildGuidePdfDefinition(payload: TesterGuideExportPayload): TDocumentDefinitions {
  const identity = payload.tester.erthUsername || payload.tester.name || "Beta tester";
  const content: Content[] = [
    { text: "CLOSED BETA TESTER REPORT", style: "overline" },
    { text: "Erth tester feedback", style: "title", margin: [0, 6, 0, 7] },
    {
      text: `${normalizePdfText(identity)}  |  Generated ${formatGeneratedAt(payload.generatedAt)}`,
      style: "subtitle",
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: 511, y2: 0, lineWidth: 2, lineColor: COLORS.orange },
      ],
      margin: [0, 18, 0, 16],
    },
    {
      table: {
        widths: ["*", "*", "*"],
        body: [
          [
            statCard(
              `${payload.progress.completedTasks}/${payload.progress.totalTasks}`,
              "Tasks completed",
            ),
            statCard(
              `${payload.progress.completedMissions}/${payload.progress.totalMissions}`,
              "Missions reviewed",
            ),
            statCard(String(payload.issueReports.length), "Issues logged"),
          ],
        ],
      },
      layout: "noBorders",
    },
    sectionHeading("Tester context"),
    {
      table: { widths: [72, "*", 82, "*"], body: contextRows(payload) },
      layout: "lightHorizontalLines",
    },
    sectionHeading("Mission overview"),
    missionOverview(payload),
    sectionHeading("Issues and positive signals"),
    ...issueDetails(payload),
    sectionHeading("Mission details"),
    ...missionDetails(payload),
    sectionHeading("Overall experience"),
    ...reflectionContent(payload),
  ];

  return {
    pageSize: "A4",
    pageMargins: [42, 58, 42, 46],
    info: {
      title: `Erth beta tester report - ${normalizePdfText(identity)}`,
      author: normalizePdfText(identity),
      subject: "Erth closed beta guided tester feedback",
      creator: "Erth tester guide",
      creationDate: new Date(payload.generatedAt),
    },
    header: (currentPage) =>
      currentPage === 1
        ? {
            columns: [
              { text: "ERTH", bold: true, color: COLORS.orange, fontSize: 11 },
              { text: "GUIDED TESTER FEEDBACK", alignment: "right", style: "small" },
            ],
            margin: [42, 24, 42, 0],
          }
        : { text: "" },
    footer: (currentPage, pageCount) => ({
      columns: [
        { text: "Generated by the Erth closed beta tester guide", style: "small" },
        { text: `${currentPage} / ${pageCount}`, alignment: "right", style: "small" },
      ],
      margin: [42, 14, 42, 0],
    }),
    content,
    styles: PDF_STYLES,
    defaultStyle: { font: "Roboto", fontSize: 9.5, color: COLORS.ink },
  };
}

interface PdfMakeRuntime {
  createPdf: typeof import("pdfmake/build/pdfmake").createPdf;
}

interface PdfMakeRuntimeModule {
  default?: PdfMakeRuntime;
  createPdf?: PdfMakeRuntime["createPdf"];
}

interface PdfFontModule {
  default?: Record<string, string>;
  vfs?: Record<string, string>;
}

export async function generateGuidePdf(payload: TesterGuideExportPayload): Promise<Blob> {
  const [runtimeModule, fontModule] = (await Promise.all([
    import("pdfmake/build/pdfmake.js"),
    import("pdfmake/build/vfs_fonts.js"),
  ])) as unknown as [PdfMakeRuntimeModule, PdfFontModule];
  const createPdf = runtimeModule.default?.createPdf ?? runtimeModule.createPdf;
  const vfs = fontModule.default ?? fontModule.vfs;
  if (!createPdf || !vfs) throw new Error("The PDF generator could not be loaded.");

  return new Promise<Blob>((resolve, reject) => {
    try {
      createPdf(buildGuidePdfDefinition(payload), undefined, undefined, vfs).getBlob(resolve);
    } catch (error) {
      reject(error);
    }
  });
}
