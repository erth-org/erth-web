import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TesterGuideExperience } from "@/components/testing-guide/tester-guide-experience";
import { TesterGuideProvider } from "@/components/testing-guide/tester-guide-provider";

jest.mock("@/lib/site-config", () => ({
  siteConfig: { contact: { email: "team@example.com" } },
}));

function renderGuide() {
  return render(
    <TesterGuideProvider>
      <TesterGuideExperience />
    </TesterGuideProvider>,
  );
}

describe("TesterGuideExperience", () => {
  beforeEach(() => window.localStorage.clear());

  it("requires the local-sharing acknowledgement before starting", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.click(screen.getByRole("button", { name: /begin testing/i }));

    expect(screen.getByText(/acknowledge how local saving and sharing work/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByLabelText(/i understand this guide saves answers in this browser/i),
      ).toHaveFocus(),
    );
  });

  it("supports keyboard input and prevents unexplained blocked missions from advancing", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.click(
      screen.getByLabelText(/i understand this guide saves answers in this browser/i),
    );
    await user.click(screen.getByRole("button", { name: /begin testing/i }));

    expect(screen.getByRole("heading", { name: /find your way in/i })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: /blocked/i }));
    await user.click(screen.getByRole("button", { name: /save and continue/i }));
    expect(screen.getByText(/tell us where you were blocked/i)).toBeInTheDocument();

    const notes = screen.getByLabelText(/where did you hesitate/i);
    await user.type(notes, "The country picker never completed loading.");
    await user.click(screen.getByRole("button", { name: /save and continue/i }));

    expect(screen.getByRole("heading", { name: /create a moment/i })).toHaveFocus();
  });

  it("validates optional email only when a value is provided", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.type(screen.getByLabelText(/contact email/i), "not-an-email");
    await user.click(
      screen.getByLabelText(/i understand this guide saves answers in this browser/i),
    );
    await user.click(screen.getByRole("button", { name: /begin testing/i }));

    expect(screen.getByText(/enter a complete email address/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /before you start/i })).toBeInTheDocument();
  });

  it("separates personal, device, and habit information into named groups", async () => {
    const user = userEvent.setup();
    renderGuide();
    await user.click(screen.getByLabelText(/^name$/i));

    const personal = screen.getByRole("region", { name: /personal information/i });
    const device = screen.getByRole("region", { name: /device information/i });
    const habits = screen.getByRole("region", { name: /travel and memory habits/i });

    expect(within(personal).getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(within(personal).getByLabelText(/contact email/i)).toBeInTheDocument();
    expect(within(device).getByLabelText(/device family/i)).toBeInTheDocument();
    expect(within(device).getByLabelText(/os version/i)).toBeInTheDocument();
    const travelFrequency = within(habits).getByLabelText(/how many trips do you take per year/i);
    expect(travelFrequency).toBeInTheDocument();
    expect(
      within(travelFrequency).getByRole("option", { name: /12\+ trips per year/i }),
    ).toBeInTheDocument();
    expect(
      within(travelFrequency).getByRole("option", { name: /1–2 trips per year/i }),
    ).toBeInTheDocument();
    expect(within(habits).getByLabelText(/where do your trip memories live/i)).toBeInTheDocument();
  });

  it("filters OS choices by device and supports custom device and version answers", async () => {
    const user = userEvent.setup();
    renderGuide();

    const device = screen.getByLabelText(/^device family$/i);
    const os = screen.getByLabelText(/^os version$/i);

    expect(os).toBeDisabled();
    expect(screen.getByRole("option", { name: /Samsung Galaxy S series/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Samsung Galaxy A series/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Samsung Galaxy Z Fold/i })).toBeInTheDocument();

    await user.selectOptions(device, "iPhone 16 family");
    expect(os).toBeEnabled();
    expect(screen.getByRole("option", { name: /^iOS 27 beta$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^iOS 26$/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /^Android 17 beta$/i })).not.toBeInTheDocument();
    await user.selectOptions(os, "iOS 18");
    expect(os).toHaveValue("iOS 18");
    await user.type(screen.getByLabelText(/exact model/i), "iPhone 16 Pro");

    await user.selectOptions(device, "Samsung Galaxy A series");
    expect(os).toHaveValue("");
    expect(screen.getByLabelText(/exact model/i)).toHaveValue("");
    expect(screen.getByRole("option", { name: /^Android 17 beta$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^Android 16$/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /^iOS 27 beta$/i })).not.toBeInTheDocument();

    await user.selectOptions(device, "");
    expect(os).toBeDisabled();
    expect(screen.queryByLabelText(/exact model/i)).not.toBeInTheDocument();
  });

  it("lets testers clear a selected mission outcome and rating", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.click(
      screen.getByLabelText(/i understand this guide saves answers in this browser/i),
    );
    await user.click(screen.getByRole("button", { name: /begin testing/i }));

    const completed = screen.getByRole("button", { name: /^completed/i });
    await user.click(completed);
    expect(completed).toHaveAttribute("aria-pressed", "true");
    await user.click(completed);
    expect(completed).toHaveAttribute("aria-pressed", "false");

    const rating = screen.getByRole("button", { name: "4" });
    await user.click(rating);
    expect(rating).toHaveAttribute("aria-pressed", "true");
    await user.click(rating);
    expect(rating).toHaveAttribute("aria-pressed", "false");
  });

  it("selects, clears, and reflects partial mission checklist progress", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.click(
      screen.getByLabelText(/i understand this guide saves answers in this browser/i),
    );
    await user.click(screen.getByRole("button", { name: /begin testing/i }));

    const checklist = screen.getByRole("group", { name: /mission checklist/i });
    const selectAll = within(checklist).getByRole("checkbox", {
      name: /select all mission tasks/i,
    });
    const taskCheckboxes = within(checklist).getAllByRole("checkbox").slice(1);
    const taskCount = taskCheckboxes.length;

    await user.click(selectAll);
    expect(within(checklist).getByText(`${taskCount}/${taskCount} complete`)).toBeInTheDocument();
    within(checklist)
      .getAllByRole("checkbox")
      .forEach((checkbox) => expect(checkbox).toBeChecked());

    await user.click(taskCheckboxes[0]);
    expect(selectAll).toHaveAttribute("data-state", "indeterminate");
    expect(
      within(checklist).getByText(`${taskCount - 1}/${taskCount} complete`),
    ).toBeInTheDocument();

    await user.click(selectAll);
    expect(within(checklist).getByText(`${taskCount}/${taskCount} complete`)).toBeInTheDocument();
    await user.click(selectAll);
    expect(within(checklist).getByText(`0/${taskCount} complete`)).toBeInTheDocument();
    taskCheckboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it("keeps the feedback log outside the numbered journey and returns to the active stage", async () => {
    const user = userEvent.setup();
    renderGuide();

    const stepNavigation = screen.getByRole("navigation", { name: /tester guide steps/i });
    expect(
      within(stepNavigation).queryByRole("button", { name: /feedback log/i }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByLabelText(/i understand this guide saves answers in this browser/i),
    );
    await user.click(screen.getByRole("button", { name: /begin testing/i }));
    await user.click(screen.getByRole("button", { name: /^feedback log$/i }));

    expect(screen.getByRole("heading", { name: /^feedback log$/i })).toHaveFocus();
    await user.click(screen.getAllByRole("button", { name: /return to find your way in/i })[0]);
    expect(screen.getByRole("heading", { name: /find your way in/i })).toHaveFocus();
  });

  it("continues from the final mission to reflection without requiring the feedback log", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.click(
      screen.getByLabelText(/i understand this guide saves answers in this browser/i),
    );
    await user.click(screen.getByRole("button", { name: /begin testing/i }));
    await user.click(screen.getByRole("button", { name: /test the safety net/i }));
    await user.click(screen.getByRole("button", { name: /save and continue/i }));

    expect(screen.getByRole("heading", { name: /overall experience/i })).toHaveFocus();
  });

  it("offers one download action and clearly explains how to send the PDF", async () => {
    const user = userEvent.setup();
    renderGuide();

    await user.click(
      screen.getByLabelText(/nothing reaches Erth until I download the PDF and send it/i),
    );
    await user.click(screen.getByRole("button", { name: /download and send/i }));

    expect(screen.getByRole("heading", { name: /download and send/i })).toHaveFocus();
    expect(screen.getByRole("button", { name: /^download PDF$/i })).toBeInTheDocument();
    expect(screen.getByText(/attach it in a DM to Erth or email it/i)).toBeInTheDocument();
    expect(screen.getByText(/your report is not sent automatically/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /share|email|copy/i })).not.toBeInTheDocument();
  });
});
