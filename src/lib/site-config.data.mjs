// Shared raw config values + validation.
// Plain ESM so it can be imported BOTH by the TypeScript app (src/lib/site-config.ts)
// AND by the production build-gate script (scripts/check-site-config.mjs) running
// under plain Node — no transpilation required.

export const PLACEHOLDER = "__PLACEHOLDER__";

export const siteConfigData = {
  // Switch this single value to "live" when the public application launches.
  // Beta mode intentionally exposes only the tester guide, issue reporting,
  // product purpose, and required legal information.
  siteMode: "beta",

  productionUrl: "https://erth-org.github.io/erth-web/",

  oneLiner: "Erth turns trips, moments, and memories into a living globe of your travel identity.",

  visionStatement: "Your travels are part of who you are. Erth turns them into a living 3D globe.",

  contact: {
    email: "erthteamtesting@gmail.com",
  },

  store: {
    appStoreUrl: null,
    googlePlayUrl: null,
  },

  legal: {
    // Pending review is an intentional, publishable private-beta state. When
    // status changes to approved, the validator requires a date and final copy.
    status: "pending-review",
    lastUpdated: "",
    privacyIsPlaceholder: true,
    termsIsPlaceholder: true,
  },

  // Feedback subsystem. Submission and voting are BOTH gated on a real
  // backend endpoint. Neither is enabled until proper server-side validation,
  // moderation, rate limiting, and spam protection are in place.
  //
  // While disabled:
  //   - The submission form is shown for review but cannot submit.
  //   - Vote counts are shown read-only — no clickable vote control.
  //   - The page NEVER shows a false success state.
  feedback: {
    submissionEnabled: false,
    submissionEndpoint: null,
    votingEnabled: false,
    votingEndpoint: null,
  },

  // Individual profiles are omitted until verified team details are available.
  team: [],
};

export function isPlaceholderTeamMember(m) {
  return (
    m.name === PLACEHOLDER || m.role === PLACEHOLDER || m.bio === PLACEHOLDER || m.photoUrl === null
  );
}

/**
 * Returns a list of unresolved critical config values.
 * Empty array = config-ready. Content validation is separate; see
 * scripts/check-site-config.mjs.
 */
export function getUnresolvedPlaceholders(cfg = siteConfigData) {
  const issues = [];

  if (cfg.siteMode !== "beta" && cfg.siteMode !== "live") {
    issues.push('siteMode must be either "beta" or "live"');
  }
  if (cfg.siteMode === "live" && cfg.legal.status !== "approved") {
    issues.push('siteMode is "live" but legal.status is not "approved"');
  }
  if (cfg.siteMode === "live" && !cfg.store.appStoreUrl && !cfg.store.googlePlayUrl) {
    issues.push('siteMode is "live" but no public store URL is configured');
  }
  if (!cfg.productionUrl) issues.push("productionUrl is not set");
  if (!cfg.contact.email) issues.push("contact.email is not set");
  if (cfg.legal.status === "approved") {
    if (!cfg.legal.lastUpdated) issues.push("legal.lastUpdated date is missing");
    if (cfg.legal.privacyIsPlaceholder)
      issues.push("Privacy Policy is marked approved but still contains pending copy");
    if (cfg.legal.termsIsPlaceholder)
      issues.push("Terms & Conditions are marked approved but still contain pending copy");
  }

  // Defence-in-depth: enabling submission/voting requires a real endpoint.
  if (cfg.feedback.submissionEnabled && !cfg.feedback.submissionEndpoint) {
    issues.push("feedback.submissionEnabled is true but submissionEndpoint is null");
  }
  if (cfg.feedback.votingEnabled && !cfg.feedback.votingEndpoint) {
    issues.push("feedback.votingEnabled is true but votingEndpoint is null");
  }

  cfg.team.forEach((m, i) => {
    if (isPlaceholderTeamMember(m)) {
      issues.push(`team member #${i + 1} has placeholder name/role/bio/photo`);
    }
  });

  return issues;
}
