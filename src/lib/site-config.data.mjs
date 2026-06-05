// Shared raw config values + validation.
// Plain ESM so it can be imported BOTH by the TypeScript app (src/lib/site-config.ts)
// AND by the production build-gate script (scripts/check-site-config.mjs) running
// under plain Node — no transpilation required.

export const PLACEHOLDER = "__PLACEHOLDER__";

export const siteConfigData = {
  // TODO: set once a domain / project name is assigned.
  productionUrl: "",

  oneLiner:
    "Erth is a living digital map of the places, moments, and experiences that shape your world.",

  visionStatement:
    "Erth helps people capture meaningful experiences and build a lasting digital footprint of where they have been and what mattered along the way.",

  contact: {
    // TODO: confirm a real contact address before launch.
    email: "",
  },

  store: {
    appStoreUrl: null,
    googlePlayUrl: null,
  },

  legal: {
    status: "pending-review", // must be "approved" before a production build passes
    lastUpdated: "", // ISO date, e.g. "2026-06-05"
    privacyIsPlaceholder: true,
    termsIsPlaceholder: true,
  },

  // Placeholder cards demonstrate layout in development only. Production either
  // renders real members or omits the Team grid entirely.
  team: [
    { name: PLACEHOLDER, role: PLACEHOLDER, bio: PLACEHOLDER, photoUrl: null, linkedinUrl: null },
    { name: PLACEHOLDER, role: PLACEHOLDER, bio: PLACEHOLDER, photoUrl: null, linkedinUrl: null },
    { name: PLACEHOLDER, role: PLACEHOLDER, bio: PLACEHOLDER, photoUrl: null, linkedinUrl: null },
  ],
};

export function isPlaceholderTeamMember(m) {
  return (
    m.name === PLACEHOLDER ||
    m.role === PLACEHOLDER ||
    m.bio === PLACEHOLDER ||
    m.photoUrl === null
  );
}

/**
 * Returns a list of unresolved critical values.
 * Empty array = production-ready.
 */
export function getUnresolvedPlaceholders(cfg = siteConfigData) {
  const issues = [];

  if (!cfg.productionUrl) issues.push("productionUrl is not set");
  if (!cfg.contact.email) issues.push("contact.email is not set");
  if (cfg.legal.status !== "approved") issues.push('legal.status is not "approved"');
  if (!cfg.legal.lastUpdated) issues.push("legal.lastUpdated date is missing");
  if (cfg.legal.privacyIsPlaceholder)
    issues.push("Privacy Policy still contains placeholder content");
  if (cfg.legal.termsIsPlaceholder)
    issues.push("Terms of Service still contains placeholder content");

  cfg.team.forEach((m, i) => {
    if (isPlaceholderTeamMember(m)) {
      issues.push(`team member #${i + 1} has placeholder name/role/bio/photo`);
    }
  });

  return issues;
}
