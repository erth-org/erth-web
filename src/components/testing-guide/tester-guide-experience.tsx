import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Flag,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  addGuideIssue,
  clearGuideHandoff,
  downloadGuidePdf,
  removeGuideIssue,
  resetTesterGuide,
  setAllGuideTasks,
  setGuideStage,
  setMissionNotes,
  setMissionRating,
  setMissionStatus,
  setSharingAcknowledgement,
  toggleGuideTask,
  updateGuideIssue,
  updateGuideReflection,
  updateTesterDetails,
} from "@/actions/testerGuide";
import {
  DEVICE_OPTION_GROUPS,
  GUIDE_MISSIONS,
  GUIDE_STAGE_ORDER,
  ISSUE_QUESTIONNAIRE,
  MISSION_QUESTIONNAIRE,
  MISSION_BY_ID,
  OS_OPTIONS_BY_PLATFORM,
  REFLECTION_RATING_QUESTIONS,
  REFLECTION_TEXT_QUESTIONS,
  WELCOME_QUESTIONNAIRE,
  getDevicePlatform,
} from "@/content/tester-guide-questionnaire";
import { useTesterGuideDispatch, useTesterGuideSelector } from "@/hooks/useTesterGuide";
import { getGuideProgress } from "@/lib/tester-guide-export";
import { testerGuideStorageAvailable } from "@/lib/tester-guide-storage";
import type {
  FeedbackIssue,
  GuideStageId,
  IssueSeverity,
  MissionId,
} from "@/lib/tester-guide-types";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useTesterGuideRestoredFromStorage } from "@/hooks/useTesterGuidePersistence";

const EMPTY_ISSUE_DRAFT = {
  severity: ISSUE_QUESTIONNAIRE.defaultSeverity,
  screen: "",
  trying: "",
  happened: "",
  expected: "",
  steps: "",
  mediaNote: "",
};

const STAGE_LABELS: Record<GuideStageId, string> = {
  welcome: "Before you start",
  orientation: "Find your way in",
  moment: "Create a moment",
  trip: "Build a travel story",
  social: "Browse and connect",
  globe: "Explore the globe",
  identity: "Recognize your Erth",
  trust: "Test the safety net",
  issues: "Feedback log",
  reflection: "Overall experience",
  review: "Download and send",
};

type GuidedStageId = (typeof GUIDE_STAGE_ORDER)[number];

const GUIDE_CONTROL_CLASS =
  "min-h-12 border-border/90 bg-background/95 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,background-color,box-shadow] hover:border-primary/45 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/25";
const GUIDE_TEXTAREA_CLASS =
  "border-border/90 bg-background/95 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[border-color,background-color,box-shadow] hover:border-primary/45 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/25";

type NativeSelectOption = string | { value: string; label: string };

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const descriptionId = hint || error ? `${id}-description` : undefined;
  return (
    <div className="space-y-2.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      {children}
      {hint || error ? (
        <p
          id={descriptionId}
          className={cn(
            "text-xs leading-relaxed",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {error || hint}
        </p>
      ) : null}
    </div>
  );
}

function NativeSelect({
  id,
  value,
  onChange,
  placeholder,
  options,
  ariaDescribedBy,
  disabled = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: ReadonlyArray<NativeSelectOption>;
  ariaDescribedBy?: string;
  disabled?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      className={cn(
        "flex w-full rounded-md border py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-55",
        GUIDE_CONTROL_CLASS,
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => {
        const normalized = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <option key={normalized.value} value={normalized.value}>
            {normalized.label}
          </option>
        );
      })}
    </select>
  );
}

function DeviceFamilySelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "flex w-full rounded-md border py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2",
        GUIDE_CONTROL_CLASS,
      )}
    >
      <option value="">{WELCOME_QUESTIONNAIRE.groups.device.fields.family.placeholder}</option>
      {DEVICE_OPTION_GROUPS.map((group) => (
        <optgroup key={group.label} label={group.label}>
          {group.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function RatingScale({
  id,
  value,
  prompt,
  low,
  high,
  onChange,
}: {
  id: string;
  value: number;
  prompt: string;
  low: string;
  high: string;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="border-t border-border/70 pt-6">
      <legend className="text-sm font-semibold text-foreground">{prompt}</legend>
      <div
        className="mt-3 grid grid-cols-5 gap-1 rounded-xl border border-border/80 bg-background/55 p-1"
        role="group"
        aria-label={prompt}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            id={`${id}-${rating}`}
            type="button"
            aria-pressed={value === rating}
            onClick={() => onChange(value === rating ? 0 : rating)}
            className={cn(
              "flex min-h-11 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-[background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value === rating
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
            )}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {MISSION_QUESTIONNAIRE.clearRatingHint}
      </p>
    </fieldset>
  );
}

function ContextGroup({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="border-t border-border/70 py-7 first:border-t-0 first:pt-0 last:pb-0 sm:rounded-xl sm:border sm:border-border/80 sm:bg-card/45 sm:p-5 sm:first:border sm:first:pt-5 sm:last:pb-5"
    >
      <div className="flex gap-3 pb-1 sm:border-b sm:border-border/60 sm:pb-4">
        <span className="mt-1 h-8 w-1 shrink-0 rounded-full bg-primary/80" aria-hidden="true" />
        <div>
          <h4 id={`${id}-heading`} className="text-base font-semibold text-foreground">
            {title}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-5 sm:mt-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function WelcomeStep({ error }: { error: string }) {
  const dispatch = useTesterGuideDispatch();
  const tester = useTesterGuideSelector((state) => state.testerGuide.tester);
  const acknowledged = useTesterGuideSelector((state) => state.testerGuide.sharingAcknowledged);
  const emailInvalid = tester.email.length > 0 && !/^\S+@\S+\.\S+$/.test(tester.email);
  const selectedDevice = tester.device;
  const osOptions = selectedDevice.deviceFamily
    ? OS_OPTIONS_BY_PLATFORM[selectedDevice.platform]
    : [];

  const selectDeviceFamily = (deviceFamily: string) => {
    const platform = getDevicePlatform(deviceFamily);
    const platformChanged = selectedDevice.platform !== platform;
    dispatch(
      updateTesterDetails({
        device: {
          platform,
          deviceFamily,
          osVersion: deviceFamily && !platformChanged ? selectedDevice.osVersion : "",
          exactModel: deviceFamily ? "" : undefined,
        },
      }),
    );
  };

  const selectOsVersion = (osVersion: string) => {
    dispatch(
      updateTesterDetails({
        device: { ...selectedDevice, osVersion },
      }),
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {WELCOME_QUESTIONNAIRE.instructions.map(({ title, body }) => (
          <div key={title} className="rounded-xl border border-border bg-background/55 p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="border-y border-border/70 py-6 sm:rounded-2xl sm:border sm:border-primary/25 sm:bg-background/70 sm:p-7 sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="border-b border-border/70 pb-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            {WELCOME_QUESTIONNAIRE.context.eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">
            {WELCOME_QUESTIONNAIRE.context.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {WELCOME_QUESTIONNAIRE.context.description}
          </p>
        </div>

        <div className="mt-6 sm:space-y-4">
          <ContextGroup
            id="personal-information"
            title={WELCOME_QUESTIONNAIRE.groups.personal.title}
            description={WELCOME_QUESTIONNAIRE.groups.personal.description}
          >
            <Field id="tester-name" label={WELCOME_QUESTIONNAIRE.groups.personal.fields.name.label}>
              <Input
                id="tester-name"
                value={tester.name}
                onChange={(event) => dispatch(updateTesterDetails({ name: event.target.value }))}
                autoComplete="name"
                placeholder={WELCOME_QUESTIONNAIRE.groups.personal.fields.name.placeholder}
                className={GUIDE_CONTROL_CLASS}
              />
            </Field>
            <Field
              id="tester-username"
              label={WELCOME_QUESTIONNAIRE.groups.personal.fields.erthUsername.label}
            >
              <Input
                id="tester-username"
                value={tester.erthUsername}
                onChange={(event) =>
                  dispatch(updateTesterDetails({ erthUsername: event.target.value }))
                }
                placeholder={WELCOME_QUESTIONNAIRE.groups.personal.fields.erthUsername.placeholder}
                className={GUIDE_CONTROL_CLASS}
              />
            </Field>
            <Field
              id="tester-email"
              label={WELCOME_QUESTIONNAIRE.groups.personal.fields.email.label}
              hint={WELCOME_QUESTIONNAIRE.groups.personal.fields.email.hint}
              error={
                emailInvalid
                  ? "Enter a complete email address or leave this field empty."
                  : undefined
              }
            >
              <Input
                id="tester-email"
                type="email"
                value={tester.email}
                onChange={(event) => dispatch(updateTesterDetails({ email: event.target.value }))}
                autoComplete="email"
                placeholder={WELCOME_QUESTIONNAIRE.groups.personal.fields.email.placeholder}
                aria-invalid={emailInvalid}
                aria-describedby="tester-email-description"
                className={GUIDE_CONTROL_CLASS}
              />
            </Field>
          </ContextGroup>

          <ContextGroup
            id="device-information"
            title={WELCOME_QUESTIONNAIRE.groups.device.title}
            description={WELCOME_QUESTIONNAIRE.groups.device.description}
          >
            <Field
              id="tester-device"
              label={WELCOME_QUESTIONNAIRE.groups.device.fields.family.label}
            >
              <DeviceFamilySelect
                id="tester-device"
                value={selectedDevice.deviceFamily}
                onChange={selectDeviceFamily}
              />
            </Field>
            <Field
              id="tester-os"
              label={WELCOME_QUESTIONNAIRE.groups.device.fields.osVersion.label}
              hint={
                !selectedDevice.deviceFamily
                  ? WELCOME_QUESTIONNAIRE.groups.device.fields.osVersion.emptyHint
                  : undefined
              }
            >
              <NativeSelect
                id="tester-os"
                value={selectedDevice.osVersion}
                onChange={selectOsVersion}
                placeholder={
                  selectedDevice.deviceFamily
                    ? WELCOME_QUESTIONNAIRE.groups.device.fields.osVersion.placeholder
                    : WELCOME_QUESTIONNAIRE.groups.device.fields.osVersion.emptyPlaceholder
                }
                options={osOptions}
                disabled={!selectedDevice.deviceFamily}
                ariaDescribedBy={!selectedDevice.deviceFamily ? "tester-os-description" : undefined}
              />
            </Field>
            {selectedDevice.deviceFamily ? (
              <Field
                id="tester-device-exact"
                label={WELCOME_QUESTIONNAIRE.groups.device.fields.exactModel.label}
                hint={WELCOME_QUESTIONNAIRE.groups.device.fields.exactModel.hint}
              >
                <Input
                  id="tester-device-exact"
                  value={selectedDevice.exactModel ?? ""}
                  onChange={(event) =>
                    dispatch(
                      updateTesterDetails({
                        device: { ...selectedDevice, exactModel: event.target.value },
                      }),
                    )
                  }
                  placeholder={WELCOME_QUESTIONNAIRE.groups.device.fields.exactModel.placeholder}
                  className={GUIDE_CONTROL_CLASS}
                />
              </Field>
            ) : null}
            <Field
              id="tester-build"
              label={WELCOME_QUESTIONNAIRE.groups.device.fields.build.label}
              hint={WELCOME_QUESTIONNAIRE.groups.device.fields.build.hint}
            >
              <Input
                id="tester-build"
                value={tester.testFlightBuild}
                onChange={(event) =>
                  dispatch(updateTesterDetails({ testFlightBuild: event.target.value }))
                }
                placeholder={WELCOME_QUESTIONNAIRE.groups.device.fields.build.placeholder}
                className={GUIDE_CONTROL_CLASS}
              />
            </Field>
          </ContextGroup>

          <ContextGroup
            id="habit-information"
            title={WELCOME_QUESTIONNAIRE.groups.habits.title}
            description={WELCOME_QUESTIONNAIRE.groups.habits.description}
          >
            <Field
              id="tester-frequency"
              label={WELCOME_QUESTIONNAIRE.groups.habits.fields.travelFrequency.label}
            >
              <NativeSelect
                id="tester-frequency"
                value={tester.travelFrequency}
                onChange={(travelFrequency) => dispatch(updateTesterDetails({ travelFrequency }))}
                placeholder={WELCOME_QUESTIONNAIRE.groups.habits.fields.travelFrequency.placeholder}
                options={WELCOME_QUESTIONNAIRE.groups.habits.fields.travelFrequency.options}
              />
            </Field>
            <Field
              id="tester-memory-system"
              label={WELCOME_QUESTIONNAIRE.groups.habits.fields.memorySystem.label}
            >
              <NativeSelect
                id="tester-memory-system"
                value={tester.currentMemorySystem}
                onChange={(currentMemorySystem) =>
                  dispatch(updateTesterDetails({ currentMemorySystem }))
                }
                placeholder={WELCOME_QUESTIONNAIRE.groups.habits.fields.memorySystem.placeholder}
                options={WELCOME_QUESTIONNAIRE.groups.habits.fields.memorySystem.options}
              />
            </Field>
          </ContextGroup>
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border p-4 sm:p-5",
          error ? "border-destructive/70 bg-destructive/5" : "border-primary/30 bg-primary/[0.05]",
        )}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            id="sharing-acknowledgement"
            checked={acknowledged}
            onCheckedChange={(checked) => dispatch(setSharingAcknowledgement(checked === true))}
            className="mt-0.5 size-5"
            aria-describedby={error ? "sharing-error" : "sharing-helper"}
          />
          <div>
            <Label
              htmlFor="sharing-acknowledgement"
              className="cursor-pointer text-sm leading-relaxed text-foreground"
            >
              {WELCOME_QUESTIONNAIRE.acknowledgement.label}
            </Label>
            <p
              id={error ? "sharing-error" : "sharing-helper"}
              className={cn("mt-1 text-xs", error ? "text-destructive" : "text-muted-foreground")}
            >
              {error || WELCOME_QUESTIONNAIRE.acknowledgement.helper}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionStep({ missionId, error }: { missionId: MissionId; error: string }) {
  const dispatch = useTesterGuideDispatch();
  const mission = MISSION_BY_ID[missionId];
  const response = useTesterGuideSelector((state) => state.testerGuide.missions[missionId]);
  const completeCount = Object.values(response.tasks).filter(Boolean).length;
  const allTasksComplete = completeCount === mission.tasks.length;
  const someTasksComplete = completeCount > 0 && !allTasksComplete;
  const selectAllState = allTasksComplete ? true : someTasksComplete ? "indeterminate" : false;
  const selectedOutcome = MISSION_QUESTIONNAIRE.outcomeOptions.find(
    (option) => option.value === response.status,
  );

  return (
    <div className="space-y-8">
      <div
        className="rounded-2xl border border-border bg-background/45 p-4 sm:p-6"
        role="group"
        aria-labelledby={`${mission.id}-checklist-label`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            id={`${mission.id}-checklist-label`}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-primary"
          >
            {MISSION_QUESTIONNAIRE.checklistLabel}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              {completeCount}/{mission.tasks.length} complete
            </span>
            <label
              htmlFor={`${mission.id}-select-all`}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary/[0.07] focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
            >
              <Checkbox
                id={`${mission.id}-select-all`}
                checked={selectAllState}
                onCheckedChange={() => dispatch(setAllGuideTasks(mission.id, !allTasksComplete))}
                aria-label={
                  allTasksComplete
                    ? MISSION_QUESTIONNAIRE.clearAllAriaLabel
                    : MISSION_QUESTIONNAIRE.selectAllAriaLabel
                }
                className="size-5"
              />
              <span>
                {allTasksComplete
                  ? MISSION_QUESTIONNAIRE.clearAllLabel
                  : MISSION_QUESTIONNAIRE.selectAllLabel}
              </span>
            </label>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {mission.tasks.map((task) => {
            const checked = response.tasks[task.id] ?? false;
            return (
              <label
                key={task.id}
                htmlFor={`${mission.id}-${task.id}`}
                className={cn(
                  "flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                  checked
                    ? "border-primary/40 bg-primary/[0.06] text-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:border-primary/35 hover:text-foreground",
                )}
              >
                <Checkbox
                  id={`${mission.id}-${task.id}`}
                  checked={checked}
                  onCheckedChange={(next) =>
                    dispatch(toggleGuideTask(mission.id, task.id, next === true))
                  }
                  className="mt-0.5 size-5"
                />
                <span
                  className={cn(
                    "text-sm leading-relaxed",
                    checked && "line-through decoration-primary/60",
                  )}
                >
                  {task.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <fieldset className="border-t border-border/70 pt-6">
        <legend className="text-sm font-semibold text-foreground">
          {MISSION_QUESTIONNAIRE.outcomePrompt}
        </legend>
        <div
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
          role="group"
          aria-label={MISSION_QUESTIONNAIRE.outcomeAriaLabel}
        >
          {MISSION_QUESTIONNAIRE.outcomeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={response.status === option.value}
              onClick={() =>
                dispatch(
                  setMissionStatus(
                    mission.id,
                    response.status === option.value ? "not_started" : option.value,
                  ),
                )
              }
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center text-sm font-semibold transition-[border-color,background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                response.status === option.value
                  ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  : "border-border/90 bg-background/65 text-muted-foreground hover:border-primary/60 hover:bg-primary/[0.06] hover:text-foreground",
              )}
            >
              {response.status === option.value ? <Check className="size-4" /> : null}
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {selectedOutcome ? `${selectedOutcome.helper}. ` : "Choose the closest outcome. "}
          <span className="text-[11px]">{MISSION_QUESTIONNAIRE.clearOutcomeHint}</span>
        </p>
      </fieldset>

      <RatingScale
        id={`${mission.id}-rating`}
        value={response.rating}
        prompt={mission.ratingPrompt}
        low={mission.ratingLow}
        high={mission.ratingHigh}
        onChange={(rating) => dispatch(setMissionRating(mission.id, rating))}
      />

      <Field
        id={`${mission.id}-notes`}
        label={mission.notesPrompt}
        hint={response.status === "blocked" ? undefined : MISSION_QUESTIONNAIRE.notesHint}
        error={error || undefined}
      >
        <Textarea
          id={`${mission.id}-notes`}
          value={response.notes}
          onChange={(event) => dispatch(setMissionNotes(mission.id, event.target.value))}
          placeholder={MISSION_QUESTIONNAIRE.notesPlaceholder}
          className={cn("min-h-32 resize-y", GUIDE_TEXTAREA_CLASS)}
          aria-invalid={Boolean(error)}
          aria-describedby={`${mission.id}-notes-description`}
        />
      </Field>
    </div>
  );
}

function IssuesStep() {
  const dispatch = useTesterGuideDispatch();
  const issues = useTesterGuideSelector((state) => state.testerGuide.issues);
  const [draft, setDraft] = useState(EMPTY_ISSUE_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const updateDraft = (updates: Partial<typeof EMPTY_ISSUE_DRAFT>) => {
    setDraft((current) => ({ ...current, ...updates }));
    setError("");
  };

  const clearDraft = () => {
    setDraft(EMPTY_ISSUE_DRAFT);
    setEditingId(null);
    setError("");
  };

  const saveIssue = () => {
    if (!draft.screen.trim() || !draft.happened.trim()) {
      setError("Add the screen or feature and what happened so the report can be acted on.");
      return;
    }

    if (editingId) {
      dispatch(updateGuideIssue(editingId, draft));
    } else {
      const issue: FeedbackIssue = {
        ...draft,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `issue-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      dispatch(addGuideIssue(issue));
    }
    clearDraft();
  };

  const editIssue = (issue: FeedbackIssue) => {
    setEditingId(issue.id);
    setDraft({
      severity: issue.severity,
      screen: issue.screen,
      trying: issue.trying,
      happened: issue.happened,
      expected: issue.expected,
      steps: issue.steps,
      mediaNote: issue.mediaNote,
    });
    setError("");
    requestAnimationFrame(() => document.getElementById("issue-screen")?.focus());
  };

  return (
    <div className="space-y-8">
      <Alert className="border-primary/25 bg-primary/[0.04]">
        <Flag className="size-4 text-primary" />
        <AlertTitle>One report per important moment</AlertTitle>
        <AlertDescription>
          Bugs matter, but so do confusing states and things that worked unusually well. Screenshots
          are not uploaded here—mention the filename or attach it to your email later.
        </AlertDescription>
      </Alert>

      <div className="rounded-2xl border border-primary/20 bg-background/65 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit feedback report" : "Add a feedback report"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">Only two fields are required.</p>
          </div>
          {editingId ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Editing saved report
            </span>
          ) : null}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field
            id="issue-screen"
            label={ISSUE_QUESTIONNAIRE.fields.screen.label}
            error={error || undefined}
          >
            <Input
              id="issue-screen"
              value={draft.screen}
              onChange={(event) => updateDraft({ screen: event.target.value })}
              placeholder={ISSUE_QUESTIONNAIRE.fields.screen.placeholder}
              className={GUIDE_CONTROL_CLASS}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "issue-screen-description" : undefined}
            />
          </Field>
          <Field id="issue-severity" label={ISSUE_QUESTIONNAIRE.fields.severity.label}>
            <select
              id="issue-severity"
              value={draft.severity}
              onChange={(event) => updateDraft({ severity: event.target.value as IssueSeverity })}
              className={cn(
                "w-full rounded-md border py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2",
                GUIDE_CONTROL_CLASS,
              )}
            >
              {ISSUE_QUESTIONNAIRE.severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field id="issue-trying" label={ISSUE_QUESTIONNAIRE.fields.trying.label}>
              <Textarea
                id="issue-trying"
                value={draft.trying}
                onChange={(event) => updateDraft({ trying: event.target.value })}
                className={cn("min-h-20 resize-y", GUIDE_TEXTAREA_CLASS)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              id="issue-happened"
              label={ISSUE_QUESTIONNAIRE.fields.happened.label}
              error={error || undefined}
            >
              <Textarea
                id="issue-happened"
                value={draft.happened}
                onChange={(event) => updateDraft({ happened: event.target.value })}
                className={cn("min-h-24 resize-y", GUIDE_TEXTAREA_CLASS)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "issue-happened-description" : undefined}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field id="issue-expected" label={ISSUE_QUESTIONNAIRE.fields.expected.label}>
              <Textarea
                id="issue-expected"
                value={draft.expected}
                onChange={(event) => updateDraft({ expected: event.target.value })}
                className={cn("min-h-20 resize-y", GUIDE_TEXTAREA_CLASS)}
              />
            </Field>
          </div>
          <Field id="issue-steps" label={ISSUE_QUESTIONNAIRE.fields.steps.label}>
            <Textarea
              id="issue-steps"
              value={draft.steps}
              onChange={(event) => updateDraft({ steps: event.target.value })}
              placeholder={ISSUE_QUESTIONNAIRE.fields.steps.placeholder}
              className={cn("min-h-28 resize-y", GUIDE_TEXTAREA_CLASS)}
            />
          </Field>
          <Field id="issue-media" label={ISSUE_QUESTIONNAIRE.fields.mediaNote.label}>
            <Textarea
              id="issue-media"
              value={draft.mediaNote}
              onChange={(event) => updateDraft({ mediaNote: event.target.value })}
              placeholder={ISSUE_QUESTIONNAIRE.fields.mediaNote.placeholder}
              className={cn("min-h-28 resize-y", GUIDE_TEXTAREA_CLASS)}
            />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" onClick={saveIssue} className="min-h-11">
            {editingId ? <Save /> : <Plus />}
            {editingId ? "Save changes" : "Add report"}
          </Button>
          {(editingId ||
            Object.values(draft).some(
              (value) => value && value !== ISSUE_QUESTIONNAIRE.defaultSeverity,
            )) && (
            <Button type="button" variant="outline" onClick={clearDraft} className="min-h-11">
              Clear draft
            </Button>
          )}
        </div>
      </div>

      <div aria-live="polite">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Saved reports</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {issues.length} {issues.length === 1 ? "report" : "reports"} included in your
              submission
            </p>
          </div>
        </div>
        {issues.length ? (
          <div className="mt-4 space-y-3">
            {issues.map((issue) => (
              <article key={issue.id} className="rounded-xl border border-border bg-card/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full border border-primary/30 bg-primary/[0.06] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {issue.severity}
                    </span>
                    <h4 className="mt-3 text-base font-semibold text-foreground">{issue.screen}</h4>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {issue.happened}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => editIssue(issue)}
                      aria-label={`Edit report for ${issue.screen}`}
                      className="size-11"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => dispatch(removeGuideIssue(issue.id))}
                      aria-label={`Remove report for ${issue.screen}`}
                      className="size-11 text-destructive hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-border px-5 py-8 text-center">
            <CheckCircle2 className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">No reports added yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              That is okay. You can return here whenever something stands out.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReflectionStep() {
  const dispatch = useTesterGuideDispatch();
  const reflection = useTesterGuideSelector((state) => state.testerGuide.reflection);
  const update = (updates: Partial<typeof reflection>) => dispatch(updateGuideReflection(updates));

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {REFLECTION_RATING_QUESTIONS.map((question) => (
          <RatingScale
            key={question.key}
            id={question.id}
            value={reflection[question.key]}
            prompt={question.prompt}
            low={question.low}
            high={question.high}
            onChange={(value) => update({ [question.key]: value } as Partial<typeof reflection>)}
          />
        ))}
      </div>

      <div className="grid gap-5">
        {REFLECTION_TEXT_QUESTIONS.map((question) => (
          <Field key={question.key} id={question.id} label={question.label}>
            <Textarea
              id={question.id}
              value={reflection[question.key]}
              onChange={(event) =>
                update({ [question.key]: event.target.value } as Partial<typeof reflection>)
              }
              placeholder={question.placeholder}
              className={cn(question.minHeight, "resize-y", GUIDE_TEXTAREA_CLASS)}
            />
          </Field>
        ))}
      </div>
    </div>
  );
}

function ReviewStep() {
  const dispatch = useTesterGuideDispatch();
  const guide = useTesterGuideSelector((state) => state.testerGuide);
  const progress = getGuideProgress(guide);
  const incompleteMissions = GUIDE_MISSIONS.filter(
    (mission) => guide.missions[mission.id].status === "not_started",
  );
  const reflectionRatings = [
    guide.reflection.clarity,
    guide.reflection.reliability,
    guide.reflection.productValue,
    guide.reflection.likelihoodToReturn,
  ];
  const missingReflection = reflectionRatings.some((rating) => rating === 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          [progress.percent + "%", "Task progress"],
          [`${progress.completedMissions}/${progress.totalMissions}`, "Missions reviewed"],
          [
            String(guide.issues.length),
            guide.issues.length === 1 ? "Saved report" : "Saved reports",
          ],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-background/50 p-5 text-center"
          >
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {incompleteMissions.length || missingReflection ? (
        <Alert className="border-amber-500/35 bg-amber-500/[0.06]">
          <AlertCircle className="size-4 text-amber-400" />
          <AlertTitle>Your report can still be downloaded</AlertTitle>
          <AlertDescription>
            {incompleteMissions.length
              ? `${incompleteMissions.length} mission${incompleteMissions.length === 1 ? " has" : "s have"} no outcome selected. `
              : ""}
            {missingReflection ? "Some overall ratings are blank. " : ""}
            Incomplete or blocked testing is valid evidence, so your download is always available.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-emerald-500/35 bg-emerald-500/[0.06]">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <AlertTitle>Your feedback is ready to download</AlertTitle>
          <AlertDescription>
            Your answers are ready to turn into a clear, reviewable PDF report.
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-2xl border border-primary/35 bg-primary/[0.06] p-5 sm:p-7">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            One last thing
          </p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">Get your feedback to Erth</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Two quick steps, then you’re done.
          </p>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          <li className="rounded-xl border border-primary/35 bg-background/70 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                1
              </span>
              <div>
                <h4 className="font-semibold text-foreground">Download your PDF</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Save your completed report to this device.
                </p>
              </div>
            </div>
            <Button
              type="button"
              disabled={guide.handoff.status === "loading"}
              onClick={() => dispatch(downloadGuidePdf())}
              className="mt-4 min-h-12 w-full rounded-xl border border-primary bg-primary text-primary-foreground shadow-sm transition-[background-color,box-shadow,transform] hover:bg-primary/90 hover:shadow-[0_8px_24px_-12px_oklch(0.72_0.18_45)] active:translate-y-px"
            >
              {guide.handoff.status === "success" ? <Check /> : <Download />}
              {guide.handoff.status === "loading"
                ? "Preparing PDF…"
                : guide.handoff.status === "success"
                  ? "PDF downloaded"
                  : "Download PDF"}
            </Button>
          </li>

          <li className="rounded-xl border border-border bg-background/50 p-4">
            <div className="flex items-start gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/45 bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              <div>
                <h4 className="font-semibold text-foreground">Send the PDF to us</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Attach it in a DM to Erth or email it to{" "}
                  <span className="font-medium text-foreground">{siteConfig.contact.email}</span>.
                </p>
              </div>
            </div>
            <p className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-xs font-medium leading-relaxed text-foreground">
              Your report is not sent automatically.
            </p>
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-destructive/25 bg-destructive/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Erase this browser's guide</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Reset removes tester details, mission answers, ratings, and saved reports.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 border-destructive/40 text-destructive hover:text-destructive"
            >
              <RotateCcw /> Reset guide
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md rounded-2xl border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all saved tester feedback?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone unless you already downloaded your feedback.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my progress</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => dispatch(resetTesterGuide())}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Reset everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function isMissionId(stage: GuideStageId): stage is MissionId {
  return stage in MISSION_BY_ID;
}

function isStageComplete(
  stage: GuidedStageId,
  guide: ReturnType<typeof useGuideSnapshot>,
): boolean {
  if (stage === "welcome") return guide.sharingAcknowledged;
  if (isMissionId(stage)) return guide.missions[stage].status !== "not_started";
  if (stage === "reflection") {
    return [
      guide.reflection.clarity,
      guide.reflection.reliability,
      guide.reflection.productValue,
      guide.reflection.likelihoodToReturn,
    ].every((rating) => rating > 0);
  }
  return false;
}

function useGuideSnapshot() {
  return useTesterGuideSelector((state) => state.testerGuide);
}

function GuideNavigation({
  currentStage,
  onNavigate,
}: {
  currentStage: GuideStageId;
  onNavigate: (stage: GuideStageId) => void;
}) {
  const guide = useGuideSnapshot();
  const progress = getGuideProgress(guide);
  const canNavigate = guide.sharingAcknowledged;

  return (
    <aside className="tester-guide-no-print hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card/85 p-4 shadow-xl shadow-black/10 backdrop-blur">
        <div className="px-2 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Mission progress</span>
            <span className="font-semibold text-foreground">{progress.percent}%</span>
          </div>
          <Progress
            value={progress.percent}
            className="mt-2 h-1.5"
            aria-label={`${progress.percent}% of mission tasks complete`}
          />
          <p className="mt-2 text-[11px] text-muted-foreground">
            {progress.completedTasks}/{progress.totalTasks} tasks checked
          </p>
        </div>
        <nav aria-label="Tester guide steps" className="space-y-1">
          {GUIDE_STAGE_ORDER.map((stage, index) => {
            const current = stage === currentStage;
            const complete = isStageComplete(stage, guide);
            const locked = !canNavigate && stage !== "welcome";
            return (
              <button
                key={stage}
                type="button"
                onClick={() => onNavigate(stage)}
                disabled={locked}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
                  current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                    current
                      ? "border-primary-foreground/40"
                      : complete
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border",
                  )}
                >
                  {complete ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="truncate">{STAGE_LABELS[stage]}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-border/70 pt-4">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Available anytime
          </p>
          <button
            type="button"
            onClick={() => onNavigate("issues")}
            disabled={!canNavigate}
            aria-current={currentStage === "issues" ? "page" : undefined}
            className={cn(
              "mt-2 flex min-h-11 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-[border-color,background-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
              currentStage === "issues"
                ? "border-primary/60 bg-primary/[0.12] text-foreground"
                : "border-border/80 bg-background/45 text-muted-foreground hover:border-primary/50 hover:bg-primary/[0.06] hover:text-foreground",
            )}
          >
            <Flag className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate">Feedback log</span>
            {guide.issues.length ? (
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {guide.issues.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function TesterGuideExperience() {
  const dispatch = useTesterGuideDispatch();
  const guide = useGuideSnapshot();
  const restoredFromStorage = useTesterGuideRestoredFromStorage();
  const progress = getGuideProgress(guide);
  const isFeedbackLog = guide.currentStage === "issues";
  const stageIndex =
    guide.currentStage === "issues" ? -1 : GUIDE_STAGE_ORDER.indexOf(guide.currentStage);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const [validationError, setValidationError] = useState("");
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [canPersist, setCanPersist] = useState(true);
  const [feedbackReturnStage, setFeedbackReturnStage] = useState<GuidedStageId>(() =>
    guide.currentStage === "issues" ? "reflection" : guide.currentStage,
  );

  const currentMission = isMissionId(guide.currentStage) ? MISSION_BY_ID[guide.currentStage] : null;

  const pageTitle = currentMission?.title ?? STAGE_LABELS[guide.currentStage];
  const pageEyebrow =
    currentMission?.eyebrow ??
    (guide.currentStage === "welcome"
      ? "Private TestFlight beta"
      : guide.currentStage === "issues"
        ? "Optional feedback tool"
        : "Tester feedback");
  const pageDescription =
    currentMission?.description ??
    (guide.currentStage === "welcome"
      ? "Use Erth naturally, pause when something feels unclear, and tell us the story behind the taps. You can finish in one sitting or return across multiple sessions."
      : guide.currentStage === "issues"
        ? "Capture the exact moments that changed your confidence—broken, confusing, slow, or surprisingly good."
        : guide.currentStage === "reflection"
          ? "Zoom out from individual tasks and tell us whether Erth became understandable, reliable, and worth returning to."
          : "Download your PDF, then send that file to Erth by DM or email. It is not sent automatically.");

  useEffect(() => {
    if (restoredFromStorage) {
      setRestoredNotice(true);
    }
  }, [restoredFromStorage]);

  useEffect(() => {
    setCanPersist(testerGuideStorageAvailable);
  }, []);

  useEffect(() => {
    stageHeadingRef.current?.focus();
    setValidationError("");
  }, [guide.currentStage]);

  useEffect(() => {
    if (guide.handoff.status === "idle") return;
    const timeout = window.setTimeout(() => dispatch(clearGuideHandoff()), 4200);
    return () => window.clearTimeout(timeout);
  }, [dispatch, guide.handoff.status]);

  useEffect(() => {
    if (!restoredNotice) return;
    const timeout = window.setTimeout(() => setRestoredNotice(false), 4200);
    return () => window.clearTimeout(timeout);
  }, [restoredNotice]);

  const navigate = (stage: GuideStageId) => {
    if (!guide.sharingAcknowledged && stage !== "welcome") return;
    if (stage === "issues" && guide.currentStage !== "issues") {
      setFeedbackReturnStage(guide.currentStage);
    }
    dispatch(setGuideStage(stage));
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const validateCurrentStage = (): boolean => {
    if (guide.currentStage === "welcome") {
      if (guide.tester.email && !/^\S+@\S+\.\S+$/.test(guide.tester.email)) {
        setValidationError("Fix the email address or leave it empty before continuing.");
        requestAnimationFrame(() => document.getElementById("tester-email")?.focus());
        return false;
      }
      if (!guide.sharingAcknowledged) {
        setValidationError(
          "Please acknowledge how local saving and sharing work before continuing.",
        );
        requestAnimationFrame(() => document.getElementById("sharing-acknowledgement")?.focus());
        return false;
      }
    }
    if (isMissionId(guide.currentStage)) {
      const response = guide.missions[guide.currentStage];
      if (response.status === "blocked" && !response.notes.trim()) {
        setValidationError("Tell us where you were blocked before moving on.");
        requestAnimationFrame(() =>
          document.getElementById(`${guide.currentStage}-notes`)?.focus(),
        );
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateCurrentStage()) return;
    const next = GUIDE_STAGE_ORDER[stageIndex + 1];
    if (next) navigate(next);
  };

  const goPrevious = () => {
    const previous = GUIDE_STAGE_ORDER[stageIndex - 1];
    if (previous) navigate(previous);
  };

  const liveMessage =
    guide.handoff.message || (restoredNotice ? "Saved progress restored from this browser." : "");
  const liveError = guide.handoff.status === "error";

  return (
    <div className="tester-guide-print relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_50%_0%,oklch(0.72_0.18_45_/_0.12),transparent_58%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:pt-4 lg:pb-16">
        <div className="tester-guide-no-print mb-6 rounded-2xl border border-border bg-card/75 p-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="font-medium text-foreground">
              {isFeedbackLog
                ? "Feedback log"
                : `Step ${stageIndex + 1} of ${GUIDE_STAGE_ORDER.length}`}
            </span>
            <span className="text-muted-foreground">
              {isFeedbackLog ? "Optional tool" : `${progress.percent}% of tasks`}
            </span>
          </div>
          <Progress value={progress.percent} className="mt-2 h-1.5" />
          <Label htmlFor="mobile-guide-stage" className="sr-only">
            Go to guide step
          </Label>
          <select
            id="mobile-guide-stage"
            value={isFeedbackLog ? "" : guide.currentStage}
            onChange={(event) => navigate(event.target.value as GuideStageId)}
            className="mt-3 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isFeedbackLog ? (
              <option value="" disabled>
                Choose a guide step
              </option>
            ) : null}
            {GUIDE_STAGE_ORDER.map((stage, index) => (
              <option
                key={stage}
                value={stage}
                disabled={!guide.sharingAcknowledged && stage !== "welcome"}
              >
                {index + 1}. {STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(isFeedbackLog ? feedbackReturnStage : "issues")}
            disabled={!guide.sharingAcknowledged}
            className="mt-3 min-h-11 w-full rounded-xl border-primary/35 bg-primary/[0.06] text-foreground hover:border-primary/60 hover:bg-primary/[0.12] hover:text-foreground"
          >
            {isFeedbackLog ? <ArrowLeft /> : <Flag />}
            {isFeedbackLog ? `Return to ${STAGE_LABELS[feedbackReturnStage]}` : "Open feedback log"}
            {!isFeedbackLog && guide.issues.length ? (
              <span className="ml-auto grid size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {guide.issues.length}
              </span>
            ) : null}
          </Button>
        </div>

        <div className="grid gap-7 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-10">
          <GuideNavigation currentStage={guide.currentStage} onNavigate={navigate} />

          <main className="min-w-0">
            <section className="rounded-2xl border border-border bg-card/80 shadow-2xl shadow-black/15 backdrop-blur sm:rounded-3xl">
              <header className="border-b border-border px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {pageEyebrow}
                  </p>
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    {canPersist ? "Saved locally" : "Memory only"}
                  </span>
                </div>
                <h1
                  ref={stageHeadingRef}
                  tabIndex={-1}
                  className="mt-4 text-balance text-3xl font-semibold leading-tight text-foreground outline-none sm:text-4xl lg:text-5xl"
                >
                  {pageTitle}
                </h1>
                <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {pageDescription}
                </p>
              </header>

              <div
                key={guide.currentStage}
                className="animate-in fade-in slide-in-from-bottom-2 px-5 py-6 duration-300 motion-reduce:animate-none sm:px-8 sm:py-8 lg:px-10 lg:py-10"
              >
                {!canPersist ? (
                  <Alert className="mb-6 border-amber-500/35 bg-amber-500/[0.06]">
                    <AlertCircle className="size-4 text-amber-400" />
                    <AlertTitle>Progress cannot be saved in this browser</AlertTitle>
                    <AlertDescription>
                      The guide still works, but refreshes will erase answers. Download your PDF
                      before leaving.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {guide.currentStage === "welcome" && <WelcomeStep error={validationError} />}
                {isMissionId(guide.currentStage) && (
                  <MissionStep missionId={guide.currentStage} error={validationError} />
                )}
                {guide.currentStage === "issues" && <IssuesStep />}
                {guide.currentStage === "reflection" && <ReflectionStep />}
                {guide.currentStage === "review" && <ReviewStep />}
              </div>

              <footer className="tester-guide-no-print flex flex-col-reverse gap-3 border-t border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                {isFeedbackLog ? (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate(feedbackReturnStage)}
                      className="min-h-11 justify-center sm:justify-start"
                    >
                      <ArrowLeft /> Return to {STAGE_LABELS[feedbackReturnStage]}
                    </Button>
                    <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Save className="size-3.5" /> Reports are saved locally
                    </p>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={goPrevious}
                      disabled={stageIndex === 0}
                      className="min-h-11 justify-center sm:justify-start"
                    >
                      <ArrowLeft /> Previous
                    </Button>
                    {guide.currentStage !== "review" ? (
                      <Button type="button" onClick={goNext} className="min-h-11 px-5">
                        {guide.currentStage === "welcome" ? "Begin testing" : "Save and continue"}
                        <ArrowRight />
                      </Button>
                    ) : (
                      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Save className="size-3.5" /> Your latest changes are saved locally
                      </p>
                    )}
                  </>
                )}
              </footer>
            </section>

            <p className="tester-guide-no-print mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
              Your answers stay in this browser until you download the report. Need help? Email{" "}
              <a
                className="underline underline-offset-4 hover:text-foreground"
                href={`mailto:${siteConfig.contact.email}`}
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </main>
        </div>
      </div>

      {liveMessage ? (
        <div
          role={liveError ? "alert" : "status"}
          aria-live={liveError ? "assertive" : "polite"}
          className={cn(
            "tester-guide-no-print fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur sm:bottom-6",
            liveError
              ? "border-destructive/50 bg-destructive/95 text-white"
              : "border-primary/40 bg-card/95 text-foreground",
          )}
        >
          {liveError ? (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          ) : (
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          )}
          <span className="leading-relaxed">{liveMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
