# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Commands

```bash
npm run dev        # Astro dev server → http://localhost:4321
npm run build      # Static build to dist/
npm run preview    # Preview the production build locally

./setup.sh         # Install deps + create .env from template
./rundev.sh        # Validate .env, then start dev server
./deploy.sh        # Build + confirm + deploy to Firebase Hosting
```

## CI/CD

`.github/workflows/deploy.yml` builds and deploys to Firebase Hosting on:
- `repository_dispatch` with type `publish-site` (triggered externally, e.g. from the backoffice)
- `workflow_dispatch` (manual trigger from GitHub UI)

Required GitHub secrets: `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_STORAGE_BUCKET`, `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `PUBLIC_FIREBASE_APP_ID`, `VITE_GA_MEASUREMENT_ID`, `FIREBASE_SERVICE_ACCOUNT`.

## Tech Stack

- **Astro 5** — static site generator (output: 'static'), no server runtime
- **React 19** — used only for interactive islands (forms, works grid), via `@astrojs/react`
- **Firebase JS SDK 12** — Firestore (build-time reads) + Cloud Functions (runtime commission-form submission via `submitCommission` callable)
- **blurhash** — BlurHash decode for image placeholders (build-time only)
- **TypeScript strict** — all source files
- **Astro i18n** — `defaultLocale: 'it'`, `prefixDefaultLocale: true`, both locales served by one `[locale]` dynamic route tree (see i18n section below)

## Design System

Reference design: Claude Design project `9c818c88-821b-43c4-ad8e-8c0e8b4b0fe5` (`Valentina Damiano.dc.html`).

### CSS custom properties (tokens)

Defined in `src/styles/global.css`:

```css
--ink: #1f2a22       /* primary text */
--forest: #2e403a    /* dark green, intro band bg */
--bark: #6b4f37      /* warm brown, eyebrow labels */
--paper: #efe7d6     /* page background */
--parchment: #fbf6ec /* card / form background */
--gold: #b68a3c      /* ornamental gold */
--gold-soft: #d8b96a /* lighter gold, footer labels */
--verde: #2c7466     /* primary action color (links, buttons) */
--verde-deep: #205c52/* hover state for verde */
--line: rgba(31,42,34,.14) /* border / divider color */
--muted: #7c7567     /* secondary text */
```

### Typography

- **Cormorant Garamond** — headings (`h1`, `h2`, `h3`), serif display
- **Hanken Grotesk** — body text, UI labels, nav
- **Spline Sans Mono** — eyebrow labels, metadata, monospaced accents

Google Fonts loaded in `BaseLayout.astro` `<head>`.

### Utility classes (`vd-*`)

All layout and animation utilities are prefixed `vd-`:

| Class | Purpose |
|---|---|
| `.vd-rise` | Fade+slide-in entrance animation |
| `.vd-hero` | Two-column hero grid (stacks on mobile) |
| `.vd-two` | Two-column content layout |
| `.vd-detailwrap` | Artwork detail two-column (image + meta) |
| `.vd-grid` | Masonry artwork grid (dense, 2→3→4 cols) |
| `.vd-cards` | Auto-fill card grid (series, techniques) |
| `.vd-cell` | Masonry cell (relative, overflow hidden) |
| `.vd-img` | Image fill inside `.vd-cell` (hover scale) |
| `.vd-cap` | Hover caption overlay inside `.vd-cell` |
| `.vd-navlink` | Nav link with animated underline |
| `.vd-chip` | Filter chip button |
| `.vd-field` | Form input/textarea |
| `.vd-divider` | Ornamental gold-diamond horizontal rule |
| `.vd-meta` / `.vd-meta-row` | Metadata definition list |
| `.vd-eyebrow` | Small-caps label above headings |
| `.vd-btn-primary` | Verde pill CTA button |
| `.vd-btn-outline` | Outline pill button |
| `.vd-desk` / `.vd-burger` | Desktop nav / mobile burger (responsive toggle) |
| `.vd-zoom-trigger` / `.vd-zoom-icon` | Click-to-enlarge affordance on an image (hover-fade icon) |
| `.vd-lightbox` | Full-size image dialog (see Image Lightbox below) |

## Project Layout

```
src/
├── layouts/
│   └── BaseLayout.astro      # HTML shell — fonts, header (sticky + burger), footer
├── styles/
│   └── global.css            # Design tokens + utility classes (vd-*)
├── i18n/
│   ├── it.ts                 # Italian UI strings (default locale)
│   ├── en.ts                 # English UI strings
│   └── utils.ts              # useTranslations(locale), getLocalePath(locale, path), locales
├── lib/
│   ├── firebaseConfig.ts     # Firebase init (guarded against double-init)
│   ├── types.ts              # Firestore schema interfaces — cross-project contract
│   ├── fetchContent.ts       # Build-time Firestore query functions
│   ├── utils.ts              # sortByPosition() — shared stable sort for manual ordering fields
│   └── blurHashUtils.ts      # blurHashToDataUri() — Node.js Buffer, build-time only
├── components/
│   ├── pages/                 # Shared page bodies — one file per page, `locale` prop, used by both route trees below
│   │   ├── HomePage.astro
│   │   ├── AboutPage.astro
│   │   ├── CommissionsPage.astro
│   │   ├── ContactPage.astro
│   │   ├── WorksIndexPage.astro / WorkDetailPage.astro   # WorksIndexPage now renders a categories grid, not artworks — see "Categories" below
│   │   ├── CategoryDetailPage.astro                      # one category's artworks, Personal/Commissioned tabs
│   │   ├── SeriesIndexPage.astro / SeriesDetailPage.astro
│   │   └── TechniquesIndexPage.astro / TechniqueDetailPage.astro
│   ├── CategoryArtworkGrid.astro  # Astro component — `.vd-grid` of artwork cells for one origin, used (up to twice) by CategoryDetailPage
│   ├── ArtworkCTA.astro           # Astro component — availability/origin-driven CTA on the artwork detail page
│   ├── CommissionRequestForm.jsx  # React island — calls the submitCommission Cloud Function at runtime (reCAPTCHA v3 verified)
│   ├── ContactForm.jsx            # React island — stub, see TODO inside
│   ├── BlurHashImage.astro        # Astro component — decodes BlurHash at build time
│   ├── ImageLightbox.astro        # Full-size image dialog — click-to-enlarge (see below)
│   └── LocaleGateway.astro        # Shared redirect-only markup for the gateway pages below
├── pages/
│   ├── index.astro            # / — language gateway only, no real content (see i18n section)
│   ├── [...path].astro         # legacy unprefixed paths (/works, /about, ...) — gateway, not content
│   └── [locale]/               # The only content tree — getStaticPaths loops `locales` (both `it` and `en`)
│       ├── index.astro         # renders <HomePage locale={locale} />
│       ├── about.astro
│       ├── contact.astro
│       ├── works/{index,[slug]}.astro
│       ├── works/category/[slug].astro   # per-category artwork gallery — see "Categories" below
│       ├── series/{index,[slug]}.astro
│       └── techniques/{index,[slug]}.astro   # [slug] files cross `locales` × content list in getStaticPaths
```

## Footer Social Links

The footer (`src/layouts/BaseLayout.astro`, in the bottom flex row alongside the copyright `<span>`, ~line 237) renders three hard-coded social links (Instagram, Facebook, Pinterest) as inline `<a>` elements with `target="_blank" rel="noopener noreferrer"` and a fixed `aria-label` (platform names are proper nouns, identical in IT/EN, so they are not routed through `t.footer.*` like the rest of the footer text). Each icon is a hand-written inline `<svg fill="currentColor">` using the brand's official glyph path (Simple Icons) — no icon library is installed in this project (`package.json` has none), so this is the lightest option consistent with the repo's minimal-dependency style. Icon color inherits from the link's `color` via `currentColor`, so the existing `onmouseover`/`onmouseout` hover pattern (used everywhere else in the footer instead of CSS `:hover`) recolors the icon too.

To change a URL, edit the `href` on the corresponding `<a>` directly in `BaseLayout.astro` — there is no CMS field or config file involved. To add another social network, follow the same pattern: inline SVG (`viewBox="0 0 24 24"`, `fill="currentColor"`, `aria-hidden="true"`) wrapped in an `<a>` with `aria-label` set to the platform name.

Note: the Instagram handle here (`vale_creat1ve`) must stay in sync with the `sameAs` JSON-LD entries in `AboutPage.astro` and `HomePage.astro` (SEO structured data) — both were aligned to the same handle when this feature shipped.

## i18n

Astro's i18n config in `astro.config.mjs` sets the default locale and drives `BaseLayout`'s hreflang computation:

```js
i18n: {
  defaultLocale: 'it',
  locales: ['it', 'en'],
  routing: {
    prefixDefaultLocale: true,
    redirectToDefaultLocale: false, // see "Root language gateway" below — we replace Astro's own "/" redirect
  },
}
```

Both locales are fully symmetric — `/it/*` and `/en/*` are both real, prefixed, first-class routes served by the single `src/pages/[locale]/` tree. Each file's `getStaticPaths()` loops `locales` (from `src/i18n/utils.ts`, derived from the keys of `src/i18n/it.ts`/`en.ts`) to generate one route per locale. `[slug]` pages under `[locale]/` additionally cross `locales` with the content list in `getStaticPaths` (locale × slug).

Page markup itself is **never duplicated** — each shared component in `src/components/pages/` takes a `locale` prop, calls `useTranslations(locale)`, and builds every internal link with `getLocalePath(locale, path)` (always `/${locale}${path}`) so the same file works for both `/it/works` and `/en/works`.

There is no unprefixed content route — `src/pages/index.astro` and `src/pages/[...path].astro` are gateway pages (below), not content, and there is nothing else directly under `src/pages/` besides the `[locale]/` tree.

### Adding a new locale

1. Add the locale code to `locales` in `astro.config.mjs`
2. Create `src/i18n/{locale}.ts` with all keys from `src/i18n/it.ts` — it's picked up automatically via `locales`
3. Nothing else — every `src/pages/[locale]/*` file already loops over `locales` in its `getStaticPaths()`

### Language gateway pages

Two routes outside `[locale]/` exist purely to redirect, never to render real content — both built on the shared `src/components/LocaleGateway.astro` (takes an optional `path` prop, e.g. `undefined`, `'works'`, `'works/some-slug'`):

- `src/pages/index.astro` — the bare domain (`/`). `<LocaleGateway />` (no `path`).
- `src/pages/[...path].astro` — catches every other legacy unprefixed path (`/works`, `/about`, `/contact`, `/series`, `/techniques`, and their slug pages) so a visitor who omits the locale prefix still lands somewhere instead of hitting a 404. Since `output: 'static'` requires concrete paths, its `getStaticPaths()` enumerates the known top-level routes plus slugs from the same fetchers the real content pages use (`getArtworks`, `getPublishedSeries`, `getTechniques` from `src/lib/fetchContent.ts`). No routing conflict with `/it/*`/`/en/*` — this is static output, so `/works` and `/it/works` are simply distinct pre-rendered files, not a runtime dispatch decision.

`LocaleGateway.astro` itself:
- `<meta http-equiv="refresh" content="0;url=/it{path}">` is the no-JS/crawler fallback (defaults to Italian).
- An inline script checks `localStorage['vd-locale']` first; if unset, it checks `navigator.language` (starts with `it` → `it`, else `en`). Either way it stores the decision and `location.replace()`s to `/it{path}` or `/en{path}`.

This has to be a client-side script — `output: 'static'` means there's no server/middleware available to inspect the `Accept-Language` header. Astro's built-in i18n routing would otherwise auto-generate its own unconditional `/` → `/it/` redirect when `prefixDefaultLocale: true` (via `redirectToDefaultLocale`, default `true`) — that's disabled in `astro.config.mjs` specifically so the custom root gateway is used instead.

Both gateway routes are excluded from the sitemap via the `filter` option passed to `sitemap()` in `astro.config.mjs` (only `/it/*` and `/en/*` URLs are indexable content).

### Language switcher

`BaseLayout.astro` renders a `.vd-langswitch` IT/EN toggle in both the desktop nav and the mobile menu. Since routing is symmetric, the counterpart URL is just a prefix swap: `pathname.replace(/^\/(it|en)/, '/' + otherLocale)`. A small inline script (alongside the burger-menu script, bottom of `BaseLayout.astro`) writes `localStorage['vd-locale']` on click, so a manual switch is remembered — it only matters if the visitor later lands on the root gateway again (real `/it/*`/`/en/*` pages never auto-redirect away from themselves).

### Using translations in a shared page component

```astro
---
// src/components/pages/SomePage.astro
import { useTranslations, getLocalePath } from '@/i18n/utils'
interface Props { locale: string }
const { locale } = Astro.props
const t = useTranslations(locale)
const p = (path: string) => getLocalePath(locale, path)
---
<h1>{t.works.title}</h1>
<a href={p('/works')}>{t.nav.works}</a>
```

## Masonry Grid Cell Spanning

The `.vd-grid` uses `grid-auto-flow: dense` with variable row/column spans based on artwork orientation, derived from `artwork.dimensions.width / artwork.dimensions.height`:

| Ratio | Orientation | Span |
|---|---|---|
| < 0.85 | portrait | `grid-row: span 3` |
| > 1.2 | landscape | `grid-row: span 2; grid-column: span 2` |
| else | square | `grid-row: span 2` |

Use the `getOrientation(dims)` helper — defined locally (duplicated intentionally, not shared via a util, consistent with this codebase's preference for small local helpers over cross-file utils for ~10-line snippets) in each of `WorkDetailPage.astro`, `SeriesDetailPage.astro`, `TechniqueDetailPage.astro`, and `CategoryArtworkGrid.astro`.

## Critical Split: Build-time vs Runtime Firebase

**Build-time** (Astro frontmatter, `getStaticPaths()`):
- Uses `src/lib/fetchContent.ts` which imports `db` from `firebaseConfig.ts`
- Runs in Node.js during `npm run build`
- Never runs in the browser
- All functions must handle empty collections / bad config without throwing

**Runtime** (React islands with `client:visible`):
- `CommissionRequestForm.jsx` only (rendered from `ContactPage.astro`)
- Only `PUBLIC_` prefixed env vars are available in the browser
- The Works section has **no** client-side React island anymore — category selection is a real page navigation (`/works` → `/works/category/:slug`), and the Personal/Commissioned toggle on a category page is a small inline `<script>` (same pattern as the mobile-nav burger in `BaseLayout.astro`), not a component. `WorksGrid.tsx` (the previous `client:visible` in-page category-chip filter) was deleted — see "Categories" below.

## Environment Variables

All Firebase config uses the `PUBLIC_FIREBASE_*` prefix (Astro convention for browser-visible vars). See `.env.example`. This differs from the backoffice which uses `VITE_FIREBASE_*`.

## Types Contract

`src/lib/types.ts` mirrors the backoffice's `src/types/resources.ts` exactly:
- **Do not** change field names or enum values without syncing the backoffice
- camelCase fields, same enum string values (`'for_sale'`, `'not_for_sale'`, `'sold'`, `'personal'`, `'commissioned'`, etc.)
- This includes the optional `*En` bilingual fields — see [Bilingual content fields](#bilingual-content-fields) below.
- This also includes the optional manual-ordering fields (`galleryPosition`, `featuredPosition`, `imagePosition`) — see [Manual Position Ordering](#manual-position-ordering-galleryposition--featuredposition--imageposition) below.
- `TechniqueCategory`'s enum values (`painting`, `engraving`, `craft`, `drawing`, `photography`, `other`) are fixed, not admin-editable text, so they're translated via per-locale dictionaries (`src/i18n/it.ts` / `src/i18n/en.ts`, `techniques.category`) rather than the `localize()`/`*En`-field pattern used for free text below. A new category must be added in three places: the backoffice's `TECHNIQUE_CATEGORY_LABELS`, this file's `TechniqueCategory` type, and both locale dictionaries here.

## Manual Position Ordering (`galleryPosition` / `featuredPosition` / `imagePosition`)

The backoffice lets admins manually drag-reorder artworks and gallery images (see its `CLAUDE.md` → "Artwork Ordering" / "Gallery Image Ordering"), writing three optional numeric fields to Firestore:

- `Artwork.galleryPosition` — order within `/works`, scoped by `origin` (personal vs. commissioned share the field name but are numbered independently per the backoffice's Sort modal tabs)
- `Artwork.featuredPosition` — order within the homepage featured section
- `GalleryImage.imagePosition` — order within a single artwork's `gallery` subcollection

All three are optional and absent on every document that hasn't been manually reordered yet.

**Critical Firestore constraint**: `orderBy(field)` silently excludes any document that doesn't have that field set — not "sorts it last," *dropped from the result set entirely*. For this reason none of these fields are ever used as a Firestore `orderBy` clause here. Firestore queries keep ordering by a field guaranteed to exist on every document (`createdAt` for artworks, `uploadedAt` for gallery images); the position fields are applied as a **client-side sort after the fetch**, via the shared helper:

```ts
// src/lib/utils.ts
export function sortByPosition<T extends Record<string, unknown>>(items: T[], field: keyof T): T[] {
	return [...items].sort((a, b) => {
		const aPos = (a[field] as number | undefined) ?? Infinity
		const bPos = (b[field] as number | undefined) ?? Infinity
		if (aPos === Infinity && bPos === Infinity) return 0
		return aPos - bPos
	})
}
```

Documents without the field sort to the end and, among themselves, keep whatever order the Firestore `orderBy` produced (stable sort) — so when no positions are set at all, output is unchanged from before this feature existed.

Applied at three call sites:
- `getArtworkGallery()` (`src/lib/fetchContent.ts`) — sorts by `imagePosition` after the `orderBy('uploadedAt', 'asc')` fetch, before returning.
- `CategoryDetailPage.astro` — sorts that category's filtered artworks by `galleryPosition` before splitting into Personal/Commissioned panels, so both tabs on a category page respect the same manual order as the rest of the site.
- `HomePage.astro` — sorts `allArtworks.filter(a => a.featured)` by `featuredPosition` before rendering. There is no cap on the number of featured artworks shown (an earlier `.slice(0, 5)` was removed) — every artwork marked `featured` renders on the homepage, in `featuredPosition` order.

## Bilingual content fields

`artworks`, `techniques`, `categories`, `contents`, and `artworks/{id}/gallery` documents carry optional English sibling fields alongside their Italian text (flat-suffixed with `En`: `titleEn`, `descriptionEn`, `nameEn`, `bodyEn`, `captionEn` — added in the backoffice, see its `CLAUDE.md` → "Bilingual (IT/EN) content fields"). `series` is not part of this — it stays Italian-only.

- `src/i18n/utils.ts` exports `localize(it, en, locale)`, which returns `en` when `locale === 'en'` and `en` is non-empty, otherwise falls back to `it`.
- Every fetcher in `src/lib/fetchContent.ts` that returns localizable text (`getArtworks`, `getArtworkBySlug`, `getArtworkGallery`, `getTechniques`, `getTechniqueBySlug`, `getPublishedContents`, `getContentBySlug`, `getCategories`) takes a `locale: Locale = 'it'` parameter and resolves the correct-language string via `localize()` inside the doc mapper — callers always get back plain, already-localized strings (e.g. `artwork.title`), never the raw `*En` field.
- Every call site passes `locale as Locale` (the `locale` prop threaded down from `Astro.params.locale` in each `src/pages/[locale]/**` route). If you add a new fetch call, pass locale through the same way — grep `fetchContent` imports in `src/components/pages/*.astro` for the pattern.
- `[slug]` pages (`works/[slug].astro`, `techniques/[slug].astro`) fetch the full list **once per locale** inside `getStaticPaths()` (`locales.map(async (locale) => getXxx(locale))`, then `.flat()`) rather than fetching once and reusing across both locale routes — otherwise the `props.item` passed to the detail page would always be the Italian-only data even on `/en/*`.
- `getPublishedSeries`/`getSeriesBySlug` are unchanged (no `locale` param) since `series` is out of scope for this feature.

## Categories — index grid + dedicated gallery pages

The `categories` collection (`src/lib/fetchContent.ts → getCategories()`) stores artwork taxonomy labels, plus an optional `featuredArtworkId` (set in the backoffice via `FeaturedArtworkPicker.tsx` — see the backoffice's `CLAUDE.md` → "Categories — featured artwork") pointing at one representative `artworks` document. Each `Artwork` document carries `categoryIds: string[]` — an array of plain category document IDs.

This used to be a single-page, client-side filterable gallery (`WorksGrid.tsx`, a `client:visible` React island with category chips + a scroll-into-view hack for mobile). After user feedback that in-page filtering wasn't mobile-friendly even with that workaround, it was replaced with a plain two-level static drill-down — no client-side filtering, no React island, just page navigation:

1. **`/works` (`WorksIndexPage.astro`)** — a `.vd-cards` grid of category cards (same card style/size as the Series index page — deliberately bigger than the old filter chips so cover images read clearly). Only categories with **at least one** linked artwork are shown (`countById` tally over `getArtworks()`, mirroring `SeriesIndexPage.astro`'s pattern). Each card's image is the category's `featuredArtworkId` resolved to that artwork's `coverImage` (falls back to one of 4 rotating gradients, same `GRADS` array as `SeriesIndexPage.astro`, if unset or the artwork/image is missing). Clicking a card is a real navigation to `/works/category/{slug}`.

2. **`/works/category/[slug]` (`src/pages/[locale]/works/category/[slug].astro` → `CategoryDetailPage.astro`)** — the `getStaticPaths` route follows the exact same locale × content-list shape as `techniques/[slug].astro` (see "Slug Pages Pattern" below), fetching `getCategories(locale)` per locale and passing the matched `category` as a prop.
   - `CategoryDetailPage.astro` fetches all artworks, filters to `a.categoryIds?.includes(category.id)`, sorts via `sortByPosition(..., 'galleryPosition')`.
   - **Hero banner** reuses the same `featuredArtworkId` end-to-end: it resolves to that artwork's `coverImage` and uses it as the hero background (same treatment/fallback gradient as `SeriesDetailPage.astro`'s `series.coverImage` hero) — no extra fetch needed, since the artwork is already in the filtered list.
   - **Personal/Commissioned split**: if *both* origins have ≥1 artwork in this category, renders a two-tab toggle + two panels (`CategoryArtworkGrid` instances, one hidden via inline `style`) switched by a small vanilla `<script>` (`getElementById`/`addEventListener`, the same lightweight pattern as the mobile burger menu in `BaseLayout.astro` — not a React island). If only **one** origin has artworks, that grid renders directly with no dead/empty tab.
   - `src/components/CategoryArtworkGrid.astro` is the extracted `.vd-grid` artwork-cell renderer (cover image, availability dot, title, year) — a small reusable sub-component so the same ~40 lines of cell markup isn't tripled across the two tab panels + the no-tabs case.

Both `WorksIndexPage.astro` and `CategoryDetailPage.astro` use `locale`/`getLocalePath()` the same way every other shared page component does — see "Using translations in a shared page component" above.

## Techniques Index — Grouped Accordion

`TechniquesIndexPage.astro` (`/it|en/techniques`) groups techniques by `category` instead of rendering one flat list:

- Frontmatter builds `groupedByCategory` by filtering `techniques` (already fetched alphabetically via `getTechniques()`, `orderBy('name', 'asc')`) against a fixed `CATEGORY_ORDER` array (`['painting', 'engraving', 'craft', 'drawing', 'photography', 'other']` — mirrors the backoffice enum order, see "Types Contract" above). Categories with zero techniques are filtered out entirely, same "skip empty groups" rule `WorksIndexPage.astro` applies to the artwork-category grid (only categories with ≥1 linked artwork get a card).
- Techniques stay in their existing alphabetical order within each group — no additional client-side sort.
- Rendered with native `<details>/<summary>` per category (no JS, no React island) — each category expands/collapses independently; opening one does not close another. This is the one page on the site with a scoped `<style>` block (for the `[open]` chevron rotation and hiding the default marker), since `[open]` state can't be expressed via inline `style=""` like the rest of the page.

## Availability Indicator (dot)

Artwork thumbnails in `CategoryArtworkGrid.astro` (top-right corner of each grid cell, 15×15px) and the adjacent-labeled dot on `WorkDetailPage.astro` both color-code `artwork.availability` into just **two** visual states, not three:
- `for_sale` → `var(--verde)` (green)
- `sold` and `not_for_sale` → `var(--rose)` (both map to the same red/rose — the site never visually distinguishes "sold" from "not for sale" by color, only through the tooltip/label text)

`--rose` (`src/styles/global.css`) is the same token used for form validation errors elsewhere (`CommissionRequestForm.jsx`) — reused here rather than introducing a new red.

The grid dot also carries a native `title="..."` tooltip sourced from `availabilityLabels` (the localized `{for_sale, sold, not_for_sale}` dictionary, passed into `CategoryArtworkGrid` from `CategoryDetailPage.astro` as `t.works.availability`), so the exact status is still recoverable per-artwork even though the color itself is binary.

The legend (rendered in `CategoryDetailPage.astro`, above the origin tabs/grid) has exactly two entries (`legendAvailable`, `legendSold`) matching the two colors above — there is no third "on request" legend entry (a stale `legendRequest` key existed briefly and was removed; it described a state the color logic never actually produced).

**Not shared code** — `CategoryArtworkGrid.astro`'s `availabilityColor()` and `WorkDetailPage.astro`'s inline `availColor` ternary independently implement the same mapping. If the color scheme or the set of availability values changes, both must be updated together. The homepage's featured-artworks section (`HomePage.astro`) intentionally shows no availability indicator at all.

## BlurHash Pattern

`blurHashUtils.ts` → `blurHashToDataUri(hash, w, h)`:
- **Only call from `.astro` files** — uses `Buffer` which is not available in the browser
- `BlurHashImage.astro` uses this to inline a placeholder background before the real image loads

## Image Lightbox

`src/components/ImageLightbox.astro` renders a native `<dialog>`-based click-to-enlarge viewer with zoom/pan, currently wired into `WorkDetailPage.astro` for the cover image + gallery.

Usage:
```astro
<ImageLightbox items={lightboxItems} labels={t.lightbox} />
```
where `items` is an ordered `{ src, alt?, caption? }[]` (use `.original`, not `.medium`/`.thumb`, so the dialog shows full resolution) and `labels` is `t.lightbox` (`close`/`next`/`previous`, plus `open` used directly for trigger `aria-label`s).

Any element elsewhere on the page becomes a trigger by adding `data-lightbox-index={n}` matching that item's index in the array — see the `<button class="vd-zoom-trigger" data-lightbox-index="0">` wrapping the cover `<img>` in `WorkDetailPage.astro`. One `<ImageLightbox>` per page is enough; wrap every enlargeable image's triggers into a single shared `items` array (as `WorkDetailPage.astro` does by concatenating cover + gallery) so prev/next paging cycles through all of them.

The interactivity is a plain inline `<script>` (no framework — matches the mobile-nav-burger pattern in `BaseLayout.astro`), using `dialog.showModal()`/`.close()`, `Escape`/backdrop-click/arrow-key handling, and focus restoration to the trigger on close.

**Zoom/pan** — also implemented in that same inline `<script>`, no new dependency: scroll-wheel zoom centered on the cursor, click-drag panning once zoomed in, double-click/double-tap toggling between fit-to-screen and ~2.2x zoom (anchored at the click/tap point), and touch pinch-to-zoom + single-finger pan via the Pointer Events API (one set of handlers serves mouse-drag, touch-pan, and pinch). Zoom is clamped to 1x–4x and pan is clamped so the image can't be dragged fully off-screen, both measured against the image's fitted (unscaled) rendered box captured in `show()`.

**Gotcha (zoom state)**: zoom/pan state (`scale`/`tx`/`ty`) must only ever be reset via `resetZoom()`, and `resetZoom()` must only be called from the two funnel points that are guaranteed to run on every navigation/close path: the top of `show(index)` (covers prev/next, arrow keys, and initial open) and the dialog's `close` listener (covers Escape, backdrop click, and the close button). Resetting anywhere else risks missing a path and leaking zoom state into the next image or the next time the dialog opens.

**Gotcha**: `<dialog>` is hidden by default via the *user-agent* stylesheet rule `dialog:not([open]) { display: none }`. Any author CSS that sets `display` on the dialog (e.g. `.vd-lightbox { display: flex }`, needed to center its contents while open) permanently overrides that UA rule — author styles always beat UA styles regardless of specificity — so the dialog stays visible (and, being `position: fixed`, blocks clicks on the whole page) even when closed. Always pair a `display` declaration on a `<dialog>` with an explicit `.your-dialog:not([open]) { display: none; }` rule (see `global.css`).

## Slug Pages Pattern

`src/pages/[locale]/.../[slug].astro` files cross `locales` (both `it` and `en`) with the content list:

```ts
export async function getStaticPaths() {
  const paths = await Promise.all(
    locales.map(async (locale) => {
      const items = await getXxx(locale) // always returns [] on empty/error, never throws
      return items.map((i) => ({ params: { locale, slug: i.slug }, props: { item: i } }))
    })
  )
  return paths.flat()
}
```

Fetching **per locale** (rather than once and reusing the same list across both locale routes) is what makes `props.item.title`/`.description` correctly resolve to the English text on `/en/*` — see [Bilingual content fields](#bilingual-content-fields).

Empty collections return `[]` from `getStaticPaths()` — Astro generates zero pages for that route, which is correct and never an error.

## SEO Architecture

All SEO signals are centralised in `src/layouts/BaseLayout.astro`. Key props beyond `title` and `description`:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `ogImage` | `string` (absolute URL) | `https://valentinadamiano.it/og-default.jpg` | Open Graph / Twitter card image |
| `ogType` | `'website' \| 'article'` | `'website'` | OG content type — use `'article'` for artwork detail pages |

**Canonical & hreflang** are computed automatically from `Astro.url.pathname` plus the `site` property in `astro.config.mjs`. No manual URL passing needed for static pages.

**JSON-LD structured data** is injected per-page via the named `head` slot:
```astro
<BaseLayout title="..." description="...">
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(schema)} />
  <!-- page content -->
</BaseLayout>
```
Schema types used: `WebSite`, `Person`, `VisualArtwork`, `CreativeWorkSeries`, `CollectionPage` + `ItemList`, `BreadcrumbList`.

`CategoryDetailPage.astro` is the `CollectionPage`/`ItemList` example: its JSON-LD `@graph` has a `CollectionPage` node (`name`/`description`/`url`/`image` for the category itself) whose `mainEntity` is an `ItemList` enumerating every artwork in that category (`position`, `url`, `name`), plus a `BreadcrumbList` node. Its meta `description` is generated per-category (not a static template) — `"{name} — {count} opere/artworks di/by Valentina Damiano."`, `count` being the real number of artworks currently in that category — so every category page has a genuinely unique description rather than the same boilerplate with only the name swapped in.

**Meta descriptions** live in `src/i18n/it.ts` and `src/i18n/en.ts` under the `meta` key (`meta.homeDescription`, `meta.worksDescription`, etc.). Always add a `meta.*Description` entry in both i18n files when adding a new page, rather than hardcoding the string in the `.astro` file. (Per-category/per-artwork descriptions are the exception — those are generated per-record, not translated static copy, since they need to embed record-specific data.)

**Sitemap** is auto-generated by `@astrojs/sitemap` on every `npm run build` — output at `/sitemap-index.xml`. No manual maintenance needed; new pages (including every `/works/category/:slug`) appear automatically.

**Analytics** — GA4 measurement ID is read from `VITE_GA_MEASUREMENT_ID` in `.env`. The tracking script is injected in `BaseLayout.astro` only when the variable is set and non-empty, and is consent-gated — see "Cookie Consent" below. `src/lib/analytics.ts` (`trackEvent`/`trackGalleryOpen`/`trackCtaClick`, called from `ImageLightbox.astro` and `ArtworkCTA.astro`) fires `window.gtag('event', ...)` calls that are automatically suppressed by the same consent gate, since they all go through the same `gaId`.

**`public/robots.txt`** allows crawling of the real content routes (`/it/*`, `/en/*`) and points crawlers at the sitemap (`Sitemap: https://valentinadamiano.it/sitemap-index.xml`). It explicitly `Disallow`s the non-locale redirect stubs (`/works`, `/about`, `/contact`, `/privacy`, `/series`, `/techniques` — see "Language gateway pages" above) so crawlers don't spend budget on pages that only 30x-redirect into the locale versions.

## Cookie Consent

GA4 loads on every page (see "SEO Architecture" → Analytics) but is **disabled by default** and only activated after the visitor opts in — required since the site targets EU/Italian visitors under GDPR/ePrivacy. reCAPTCHA v3 is intentionally **not** gated: it's treated as strictly necessary for spam/fraud protection on the commission form, not analytics.

- **`src/components/CookieConsentBanner.astro`** — a self-contained component (markup + its own inline `<script>`, following the same own-script pattern as `ImageLightbox.astro`) rendered from `BaseLayout.astro` right before `</body>`, only when `gaId` is set. On load it reads `localStorage['vd-cookie-consent']` (`'accepted'` / `'rejected'` / unset):
  - unset → sets `window['ga-disable-<gaId>'] = true` and shows the banner
  - `'accepted'` → clears the disable flag and calls `gtag('config', gaId)`
  - `'rejected'` → keeps the disable flag set, banner stays hidden
  - Accept/Reject button clicks persist the choice to `localStorage` and apply it immediately (no page reload).
- **`BaseLayout.astro`**'s GA4 head script (`<!-- Google Analytics 4 -->`) sets `window['ga-disable-<gaId>'] = true` before `gtag.js` loads and no longer calls `gtag('config', gaId)` directly — that call only happens once `CookieConsentBanner` confirms consent. This is Google's standard [opt-out mechanism](https://developers.google.com/analytics/devguides/collection/gtagjs/user-opt-out) — it also transparently suppresses the `trackEvent`/`trackGalleryOpen`/`trackCtaClick` calls in `src/lib/analytics.ts`, since those just call the same `window.gtag`.
- **`src/components/pages/PrivacyPage.astro`** (routed at `src/pages/[locale]/privacy.astro`, `/it/privacy` and `/en/privacy`) is the privacy/cookie policy page linked from the banner and the footer. It lists the two cookie categories (necessary reCAPTCHA, optional GA4) and has a "manage cookie preferences" button (`data-manage-cookie-consent` attribute, handled by `CookieConsentBanner`'s script) that clears the stored choice and re-shows the banner without a reload.
  - **Placeholder legal content** — the current copy (data controller, cookie descriptions) is a reasonable starting point but has not been reviewed by a lawyer. Review before the site goes live.
- Copy lives in `src/i18n/{it,en}.ts` under `cookieConsent.*` (banner) and `privacy.*` (policy page), following the same locale-dictionary pattern as every other page.

## Back Navigation (`data-back-link`)

The "← back" breadcrumb link at the top of every detail page (`WorkDetailPage.astro`, `CategoryDetailPage.astro`, `SeriesDetailPage.astro`, `TechniqueDetailPage.astro`) is a real `<a href="...">` pointing at that section's index (`/works`, `/series`, `/techniques`) **and** carries a `data-back-link` attribute. A single site-wide script in `BaseLayout.astro` (alongside the burger-menu script) intercepts clicks on any `[data-back-link]` element and calls `window.history.back()` instead when `window.history.length > 1`:

```js
document.querySelectorAll('[data-back-link]').forEach((link) => {
	link.addEventListener('click', (e) => {
		if (window.history.length > 1) {
			e.preventDefault()
			window.history.back()
		}
	})
})
```

This makes the link behave like a real "back" button — e.g. `/works` → a category page → an artwork page → click back lands on that *category* page (with its scroll position, via the browser's normal bfcache), not always back at the fixed `/works` index. The static `href` is kept as the fallback for direct loads, new tabs, and no-JS/crawler contexts (`window.history.length === 1` in those cases, so the default navigation proceeds normally) — this also means the link stays fully crawlable for SEO purposes (see "SEO Architecture" above). Add `data-back-link` to any future "back" breadcrumb the same way rather than inventing a new pattern.

---

## Artwork Detail CTA (ArtworkCTA.astro)

`WorkDetailPage.astro` renders `<ArtworkCTA availability origin slug locale />` instead of a single hardcoded CTA. `origin === 'commissioned'` takes precedence over `availability` (commissioned works are portfolio examples, not sale items):

| Condition | CTA | Links to |
|---|---|---|
| `origin === 'commissioned'` | Button: "Richiedi un'opera simile" | `/contact?type=commission&ref={slug}` |
| `availability === 'for_sale'` | Button: "È tua, scrivimi" + muted line below | `/contact?type=info&ref={slug}` |
| `availability === 'sold'` | Chip "Opera venduta" + secondary link | `/contact?type=commission` |
| `availability === 'not_for_sale'` | Chip "Opera non in vendita" + secondary link | `/contact?type=commission` |
| unexpected/undefined `availability` | Fallback button (`t.works.requestInfo`) | `/contact?type=info` |

`CommissionRequestForm.jsx` reads `type`/`ref` from `window.location.search` via a lazy `useState` initializer (SSR-safe, no post-mount flash) to pre-select the matching request-type chip and pre-fill the description textarea; both remain freely editable. There is no `/commissions` route — the spec's "commission page" is this repo's existing `/contact` route.

## Commission Form — submitCommission Cloud Function

`CommissionRequestForm.jsx` no longer writes to Firestore directly. It calls the `submitCommission` callable Cloud Function (`functions/src/submitCommission.ts` in `valecreative-admin-backoffice`, region `europe-west1`) via `httpsCallable`, passing a reCAPTCHA v3 token (`window.grecaptcha.execute(siteKey, { action: 'submit_commission' })`) alongside the form fields. The function verifies the token server-side, validates/sanitizes input, and writes to the `commissions` collection using the Admin SDK. The form also accepts `?type=` and `?ref=` query params (set by `ArtworkCTA.astro` on the artwork detail page) to pre-select a request type and pre-fill the description on load — see "Artwork Detail CTA" above.

- **reCAPTCHA site key**: read from `import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY` in `BaseLayout.astro`, which conditionally injects the `recaptcha/api.js` script and exposes the key to the React island via a `data-recaptcha-key` attribute on `<body>` (the form reads it via `document.body.dataset.recaptchaKey` rather than `import.meta.env` directly, for consistency with the layout-owns-injected-config pattern already used for GA).
- **Request type mapping**: the form's 3 request-type chips (`Commissione`/`Corso d'arte`/`Informazioni`, from `src/i18n/{it,en}.ts` → `commissions.form.requestTypes`, a positional array with no canonical keys) map onto the Cloud Function's 3-value `type` enum (`commission | course | info`) via a fixed local array `REQUEST_TYPE_CANONICAL` in `CommissionRequestForm.jsx` — index-aligned with `requestTypes`, not label-text matched.
- **Error handling**: `httpsCallable` rejections carry `.code` prefixed `functions/` (e.g. `functions/permission-denied`, `functions/invalid-argument`), mapped to Italian-language user-facing messages in the submit handler.
- **`firestore.rules`** in the backoffice repo blocks direct client creates on `commissions` (`allow create: if false`) — only the Cloud Function's Admin SDK can write. After changing `firestore.rules`, deploy from the backoffice repo:

```bash
cd ../valecreative-admin-backoffice && npm run deploy:rules
```

## CMS Content Blocks (`contents` collection)

Certain page sections are editable via the backoffice `contents` collection without a code change or redeploy. The site fetches them at **build time** using `getContentBySlug(slug)` from `src/lib/fetchContent.ts`. If a document is not found or not published, the page falls back to hardcoded i18n strings — no build failure.

### Slug contract

| Slug | Page(s) | Fields used | Fallback |
|------|---------|-------------|----------|
| `homepage_hero` | `/` and `/en/` | `body`/`bodyEn` (HTML injected into `<h1>` via `set:html`) | `t.home.heroTitle` |
| `bio` | `/about` and `/en/about` | `body`/`bodyEn` (HTML prose block), `image` (portrait photo) | Hardcoded IT/EN paragraphs |

`getContentBySlug(slug, locale)` already resolves `body`/`bodyEn` and `title`/`titleEn` down to a single localized string via `localize()` — see [Bilingual content fields](#bilingual-content-fields). If `bodyEn` is empty on the `/en/*` page, the site silently shows the Italian `body` (fallback), not the hardcoded i18n string — the i18n fallback only kicks in when the Firestore document itself is missing or unpublished.

### Adding a new content block

1. Decide on a slug (e.g. `commissions_intro`)
2. In the page frontmatter: `const content = await getContentBySlug('commissions_intro', locale as Locale)`
3. In the template: render `content?.body` with `set:html` if present, otherwise render the i18n fallback
4. In the backoffice: create a `contents` document with that exact slug and publish it

**Never change an existing slug** without updating both the site code and the backoffice document — a mismatch silently falls back to the hardcoded string.
