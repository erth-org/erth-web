# Erth Website Refinement Plan (Final)

Transform the current single-page, animation-heavy Erth demo into a polished, lightweight, vision-led product site with real routes — preserving the dark Erth identity but simplifying it into a calm, credible, investor- and reviewer-friendly experience.

## Direction (confirmed)

- **Theme:** Keep dark Erth identity. Near-black / charcoal surfaces, generous whitespace, clean editorial typography. Orange, fuchsia, blue used only as restrained accents. Remove glow, glassmorphism, gradients, particles, starfield, and the faux-3D globe.
- **One-liner (working copy):** "Erth is a living digital map of the places, moments, and experiences that shape your world."
- **Supporting vision copy:** Erth helps people capture meaningful experiences and build a lasting digital footprint. (Avoid "premium digital home.")
- **No invented data:** No metrics, testimonials, usage numbers, reports, changelogs, partnerships, team names, or impact claims.
- **Motion budget:** 2–3 subtle patterns total — gentle hero entrance, simple section reveal-on-scroll, small hover/press feedback. All respect `prefers-reduced-motion`.

## Site structure (new real routes)

```
src/routes/
  __root.tsx     -> shared shell + header + footer + sitewide head defaults
  index.tsx      -> / Home
  about.tsx      -> /about (About + Team)
  privacy.tsx    -> /privacy (Privacy Policy)
  terms.tsx      -> /terms (Terms of Service)
```

**Header and footer render once in `__root.tsx`** around `<Outlet />` — never duplicated per route.

## Centralized content/config file + production validation

Create `src/lib/site-config.ts` as the single source of truth for all pending content:

```ts
export const siteConfig = {
  productionUrl: "",          // TODO: set once domain configured
  oneLiner: "...",
  contact: { email: "" },     // TODO
  store: { appStoreUrl: null, googlePlayUrl: null },
  legal: { status: "pending-review", lastUpdated: "" }, // status must be "approved" for prod
  team: [ /* placeholder entries */ ],
};
```

Two layers of placeholder protection:

1. **Dev-only visible banner** (`hasUnresolvedPlaceholders()`): in dev/preview, surfaces a banner + console warning listing unresolved items. Not rendered in production.
2. **`validateSiteConfig()` production-build check**: fails the build when any critical value is unresolved, including:
   - empty `productionUrl`
   - empty contact email
   - `legal.status !== "approved"`
   - missing `legal.lastUpdated`
   - unresolved Privacy/Terms placeholders
   - placeholder team members (names/roles/bios/photos)

   Dev and preview may continue displaying placeholders + the warning banner. **Production must never silently publish placeholder legal content or fake team cards.** Wire this check into the production build path so it hard-fails.

## Reusable components (`src/components/`)

- `site-header.tsx` — logo + nav (Home, About, Download, Privacy, Terms) + responsive mobile menu. Rendered once in root.
- `site-footer.tsx` — logo, one-line description, About / Privacy / Terms links, contact, store badges, copyright. Rendered once in root.
- `app-store-badges.tsx` — when store URLs are null, render **visually styled non-interactive elements** with clear text "App Store — Coming soon" / "Google Play — Coming soon". No links, no buttons, no `href="#"`, no unnecessary interactive ARIA roles. Provide an accessible label + visible coming-soon state. When real URLs exist, render real anchors.
- `qr-download.tsx` — reusable QR/download block used **only in the final Download section** (not duplicated).
  - QR target derived as absolute URL: `const downloadUrl = new URL("/#download", siteConfig.productionUrl).toString();` Generate the static QR asset from this absolute URL.
  - When `productionUrl` is **not** configured: do **not** generate/display a scannable QR. Show a clearly labeled "QR code coming soon" placeholder instead.
  - Always accompanied by an accessible clickable fallback link to the same target, plus the coming-soon state.
- `team-member-card.tsx` — placeholder fields driven by `siteConfig.team`.
- `legal-layout.tsx` — readable long-form layout: title, last-updated date, anchored headings, comfortable reading width, prominent **development-only "Pending legal review" warning**.
- `reveal.tsx` — wrapper for the single section-reveal animation (respects reduced motion).

## Navigation behavior

- "Download" nav/footer link works from every page: use **`/#download`** (absolute route + hash) from non-home routes.
- Verify navigating to `/#download` from `/about`, `/privacy`, `/terms`: navigates to homepage, scrolls to Download section after route render, moves keyboard focus appropriately, and works under reduced-motion.

## Home page (`/`)

1. **Hero** — poster-like and focused: Erth logo/wordmark, one-liner headline, short vision statement, primary CTA "Download the app" (→ #download), secondary CTA "Learn about Erth" (→ /about), and a lightweight visual. **Does not render the full qr-download block.** A small QR may optionally appear in the **desktop hero only after real links exist** — never cluttering mobile.
   - **Hero visual: NOT lazy-loaded**, only when it is an actual LCP-relevant image: optimized asset, explicit `width`/`height` (avoid CLS), `fetchPriority="high"` and `loading="eager"` (TSX casing). Do not apply these to decorative images.
2. **Our Vision** — problem, why it matters, the future Erth aims to create, how the app contributes.
3. **Core Ideas** — exactly 3 foundational concepts, each short title + one sentence + simple lucide icon.
4. **Who Erth Is For** — relevance to users, communities, organizations, partners, programs, investors. Grounded.
5. **Download** (`id="download"`) — full QR code (or "coming soon" placeholder), store badges ("Coming soon"), clickable fallback URL. The only place the full `qr-download` block renders.

Below-the-fold images use `loading="lazy"` with explicit dimensions.

## About page (`/about`)

- About Erth: why it exists, vision, guiding principles, long-term ambition.
- Team: responsive grid of `team-member-card`s from `siteConfig.team`. In dev, placeholder cards may demonstrate layout. **In production, either render real team info or omit the Team grid entirely** — never publish `[TEAM MEMBER NAME]`, fake photos, or placeholder bios.

## Legal pages (`/privacy`, `/terms`)

Both use `legal-layout` with title, last-updated date, anchored headings, and the **development-only "Pending legal review" warning**. Placeholder text marked not production-ready; final legal copy supplied (and `legal.status = "approved"`) before launch — enforced by `validateSiteConfig()`.

- **Privacy** structured around Erth's actual posture: information collected, how it's used, data processors/sharing, retention, **account deletion**, user rights, security, children's privacy, **GDPR/EU requirements**, changes, contact.
- **Terms:** acceptance, eligibility, accounts, acceptable use, IP, third-party services, availability, disclaimers, limitation of liability, termination, changes, contact.

## Cleanup / performance

- **Remove** invented-data / heavy files: `globe-3d.tsx`, `starfield.tsx`, `community-reports.tsx`, `updates-momentum.tsx`, `core-surfaces.tsx`, old `hero-section.tsx`, old `navigation.tsx`, `erth-app.tsx`, `snippets/*`. Trim fictional data from `lib/erth-content.ts` and unused `lib/types.ts` entries.
- **Remove** unused heavy CSS in `styles.css`: starfield/twinkle/float/pulse-glow/rotate-slow keyframes, `.glass`, `.glass-card`, `.gradient-border`. Keep refined tokens; add calm spacing/typography utilities.
- **Dependency:** keep `framer-motion` only if used for the 2–3 light patterns; otherwise remove and use CSS transitions + IntersectionObserver. Remove other now-unused heavyweight deps.
- Optimize the hero asset; lazy-load only below-the-fold images.

## SEO / metadata

- `__root.tsx`: sitewide defaults (viewport, charset, og:type website, og:site_name). JSON-LD **Organization rendered only from verified values** — do not invent organization details (omit fields until known). No per-page title/canonical/og:image here.
- Each route: own `title`, `description`, `og:title`, `og:description`, plus Twitter/X tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) and a consistent social-sharing image.
- **Canonical:** always absolute; emit `<link rel="canonical">` (leaf only) **only when `siteConfig.productionUrl` is configured**. Never emit relative canonicals.
- **og:image / twitter:image:** absolute URLs.
- **Sitemap:** update `sitemap[.]xml.ts` to include `/`, `/about`, `/privacy`, `/terms`; generate **only with absolute URLs derived from `productionUrl`**.

## Technical notes

- TanStack Start file-based routing only; no backend/db/server functions. Frontend/presentation only.
- **Direct-route behavior:** Routes use TanStack Start file-based routing. Direct navigation and browser refresh behavior must be verified against the actual production deployment, with the required SSR or fallback configuration applied where necessary.

## Final verification checklist

- Production build completes; **build fails when critical placeholders remain** (`validateSiteConfig()`).
- All canonical, sitemap, QR, Open Graph, and Twitter URLs are absolute.
- No placeholder legal or team content appears in production.
- `/#download` navigation works from every route (scroll + focus + reduced-motion).
- Direct-route refresh behavior verified on the deployed website for `/about`, `/privacy`, `/terms`.
- Mobile / tablet / desktop layouts QA'd on every route.
- Keyboard navigation + visible focus/hover/pressed states.
- `prefers-reduced-motion` honored.
- No invented data remains; placeholders clearly marked and discoverable.

## Open placeholders left for you (centralized in `site-config.ts`)

- Real team names, roles, bios, photos, LinkedIn URLs.
- Final App Store / Google Play links.
- Confirmed Privacy/Terms legal copy (GDPR/EU) + `legal.status = "approved"` + lastUpdated.
- Contact email/address.
- Production site URL.