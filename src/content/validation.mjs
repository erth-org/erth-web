// Content-collection validation for the production build gate.
// Plain ESM so it can be imported by scripts/check-site-config.mjs under Node
// without transpilation. Mirrors the runtime types in
// src/lib/public-content-types.ts.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_LIKE = /^\d+\.\d+(?:\.\d+)?(?:[-+][\w.-]+)?$/;
const VALID_PLATFORMS = new Set(["ios", "android", "web"]);
const VALID_FEEDBACK_TYPES = new Set([
  "bug",
  "existing-feature-issue",
  "feature-suggestion",
]);
const VALID_FEEDBACK_STATUS = new Set(["accepted", "in-progress", "fulfilled"]);

// Heuristics for invented/placeholder content. Keep small and high-signal.
const PLACEHOLDER_NEEDLES = [
  "lorem ipsum",
  "todo",
  "tbd",
  "xxx",
  "placeholder",
  "__placeholder__",
  "sample ",
  "example.com",
];

function looksLikePlaceholder(s) {
  if (typeof s !== "string" || s.trim() === "") return true;
  const lower = s.toLowerCase();
  return PLACEHOLDER_NEEDLES.some((n) => lower.includes(n));
}

function nonEmptyString(s) {
  return typeof s === "string" && s.trim().length > 0;
}

function validatePlatforms(platforms, ctx, issues) {
  if (!Array.isArray(platforms) || platforms.length === 0) {
    issues.push(`${ctx}: platforms must be a non-empty array`);
    return;
  }
  for (const p of platforms) {
    if (!VALID_PLATFORMS.has(p)) issues.push(`${ctx}: invalid platform "${p}"`);
  }
}

function validateFeature(f, ctx, issues) {
  if (!nonEmptyString(f.id) || !SLUG.test(f.id))
    issues.push(`${ctx}: id must be kebab-case slug`);
  if (looksLikePlaceholder(f.title)) issues.push(`${ctx}: title looks like placeholder`);
  if (looksLikePlaceholder(f.summary)) issues.push(`${ctx}: summary looks like placeholder`);
  if (looksLikePlaceholder(f.benefit)) issues.push(`${ctx}: benefit looks like placeholder`);
  validatePlatforms(f.platforms, ctx, issues);
  if (typeof f.verified !== "boolean") issues.push(`${ctx}: verified must be boolean`);
  if (f.screenshotSrc !== null) {
    if (!nonEmptyString(f.screenshotSrc))
      issues.push(`${ctx}: screenshotSrc must be a non-empty path or null`);
    if (!nonEmptyString(f.screenshotAlt))
      issues.push(`${ctx}: screenshotAlt is required when screenshotSrc is set`);
  }
}

function validateReleaseChange(c, ctx, issues) {
  if (!nonEmptyString(c.id) || !SLUG.test(c.id))
    issues.push(`${ctx}: change id must be kebab-case slug`);
  if (looksLikePlaceholder(c.title))
    issues.push(`${ctx}: change title looks like placeholder`);
}

function validateRelease(r, ctx, issues) {
  if (!nonEmptyString(r.slug) || !SLUG.test(r.slug))
    issues.push(`${ctx}: slug must be kebab-case`);
  if (!nonEmptyString(r.version) || !SEMVER_LIKE.test(r.version))
    issues.push(`${ctx}: version must be semver-like (e.g. "1.0.0")`);
  if (!ISO_DATE.test(r.releaseDate))
    issues.push(`${ctx}: releaseDate must be ISO date YYYY-MM-DD`);
  if (looksLikePlaceholder(r.title)) issues.push(`${ctx}: title looks like placeholder`);
  if (looksLikePlaceholder(r.summary)) issues.push(`${ctx}: summary looks like placeholder`);
  validatePlatforms(r.platforms, ctx, issues);

  for (const [key, list] of [
    ["newFeatures", r.newFeatures],
    ["improvements", r.improvements],
    ["bugFixes", r.bugFixes],
  ]) {
    if (!Array.isArray(list)) {
      issues.push(`${ctx}: ${key} must be an array`);
      continue;
    }
    list.forEach((c, i) => validateReleaseChange(c, `${ctx}.${key}[${i}]`, issues));
  }
}

function validateFeedback(item, ctx, releaseSlugs, issues) {
  if (!nonEmptyString(item.slug) || !SLUG.test(item.slug))
    issues.push(`${ctx}: slug must be kebab-case`);
  if (!VALID_FEEDBACK_TYPES.has(item.type))
    issues.push(`${ctx}: invalid type "${item.type}"`);
  if (looksLikePlaceholder(item.title)) issues.push(`${ctx}: title looks like placeholder`);
  if (looksLikePlaceholder(item.category))
    issues.push(`${ctx}: category looks like placeholder`);
  if (looksLikePlaceholder(item.publicDescription))
    issues.push(`${ctx}: publicDescription looks like placeholder`);
  if (
    typeof item.voteCount !== "number" ||
    !Number.isInteger(item.voteCount) ||
    item.voteCount < 0
  )
    issues.push(`${ctx}: voteCount must be a non-negative integer`);
  if (!VALID_FEEDBACK_STATUS.has(item.status))
    issues.push(`${ctx}: invalid status "${item.status}"`);
  if (!ISO_DATE.test(item.submissionDate))
    issues.push(`${ctx}: submissionDate must be ISO date YYYY-MM-DD`);

  if (item.status === "fulfilled") {
    if (!nonEmptyString(item.releasedInUpdateSlug)) {
      issues.push(`${ctx}: fulfilled items must set releasedInUpdateSlug`);
    } else if (!releaseSlugs.has(item.releasedInUpdateSlug)) {
      issues.push(
        `${ctx}: releasedInUpdateSlug "${item.releasedInUpdateSlug}" does not match any release`,
      );
    }
  } else if (item.releasedInUpdateSlug) {
    issues.push(
      `${ctx}: only fulfilled items may set releasedInUpdateSlug (status is "${item.status}")`,
    );
  }
}

export async function getInvalidContentEntries() {
  const issues = [];
  const [{ features }, { releases }, { publicFeedback }] = await Promise.all([
    import("../src/content/features.ts"),
    import("../src/content/updates.ts"),
    import("../src/content/public-feedback.ts"),
  ]);

  if (!Array.isArray(features)) issues.push("features.ts: must export an array");
  else features.forEach((f, i) => validateFeature(f, `features[${i}]`, issues));

  if (!Array.isArray(releases)) issues.push("updates.ts: must export an array");
  else {
    const seenSlugs = new Set();
    releases.forEach((r, i) => {
      validateRelease(r, `releases[${i}]`, issues);
      if (r && r.slug) {
        if (seenSlugs.has(r.slug))
          issues.push(`releases[${i}]: duplicate slug "${r.slug}"`);
        seenSlugs.add(r.slug);
      }
    });
  }

  const releaseSlugs = new Set(
    Array.isArray(releases) ? releases.map((r) => r.slug) : [],
  );
  if (!Array.isArray(publicFeedback))
    issues.push("public-feedback.ts: must export an array");
  else {
    const seenSlugs = new Set();
    publicFeedback.forEach((item, i) => {
      validateFeedback(item, `publicFeedback[${i}]`, releaseSlugs, issues);
      if (item && item.slug) {
        if (seenSlugs.has(item.slug))
          issues.push(`publicFeedback[${i}]: duplicate slug "${item.slug}"`);
        seenSlugs.add(item.slug);
      }
    });
  }

  return issues;
}
