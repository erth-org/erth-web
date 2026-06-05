#!/usr/bin/env node
// Production build gate.
//  1. Config: blocks the build when any critical site-config value is a placeholder.
//  2. Content: blocks the build when any features / releases / public-feedback
//     entry contains invented or invalid data, OR when a fulfilled feedback
//     item points at a release that doesn't exist.
//
// Wired into `npm run build` (production) only — `build:dev` and the dev
// server are unaffected. Missing CONTENT (empty arrays) is allowed —
// only INVALID content fails the build.

import { getUnresolvedPlaceholders } from "../src/lib/site-config.data.mjs";

let issues = getUnresolvedPlaceholders();

try {
  const { getInvalidContentEntries } = await import("../src/content/validation.mjs");
  const contentIssues = await getInvalidContentEntries();
  issues = issues.concat(contentIssues);
} catch (err) {
  console.error("[check-site-config] content validation failed to run:", err);
  process.exit(1);
}

if (issues.length > 0) {
  console.error(
    "\n\u001b[31m[check-site-config] Production build blocked — unresolved issues:\u001b[0m",
  );
  for (const issue of issues) console.error(`  - ${issue}`);
  console.error(
    "\nResolve these in src/lib/site-config.data.mjs and src/content/* before building for production.\n",
  );
  process.exit(1);
}

console.log("[check-site-config] All critical config + content values resolved.");
