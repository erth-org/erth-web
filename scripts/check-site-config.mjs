#!/usr/bin/env node
// Production build gate. Fails the build (exit 1) when any critical value in
// the site config remains an unresolved placeholder. Wired into `npm run build`
// (production) only — `build:dev` and the dev server are unaffected.

import { getUnresolvedPlaceholders } from "../src/lib/site-config.data.mjs";

const issues = getUnresolvedPlaceholders();

if (issues.length > 0) {
  console.error(
    "\n\u001b[31m[check-site-config] Production build blocked — unresolved placeholders:\u001b[0m",
  );
  for (const issue of issues) console.error(`  - ${issue}`);
  console.error(
    "\nResolve these in src/lib/site-config.data.mjs before building for production.\n",
  );
  process.exit(1);
}

console.log("[check-site-config] All critical config values resolved.");
