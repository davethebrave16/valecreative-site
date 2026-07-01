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
- **Firebase JS SDK 12** — Firestore (build-time reads + runtime form writes)
- **blurhash** — BlurHash decode for image placeholders (build-time only)
- **TypeScript strict** — all source files
- **Astro i18n** — `defaultLocale: 'it'`, `prefixDefaultLocale: false`, plus a manual `[locale]` dynamic route tree for non-default locales (see i18n section below)

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
│   └── utils.ts              # useTranslations(locale), getLocalePath(locale, path), locales/nonDefaultLocales
├── lib/
│   ├── firebaseConfig.ts     # Firebase init (guarded against double-init)
│   ├── types.ts              # Firestore schema interfaces — cross-project contract
│   ├── fetchContent.ts       # Build-time Firestore query functions
│   └── blurHashUtils.ts      # blurHashToDataUri() — Node.js Buffer, build-time only
├── components/
│   ├── pages/                 # Shared page bodies — one file per page, `locale` prop, used by both route trees below
│   │   ├── HomePage.astro
│   │   ├── AboutPage.astro
│   │   ├── CommissionsPage.astro
│   │   ├── ContactPage.astro
│   │   ├── WorksIndexPage.astro / WorkDetailPage.astro
│   │   ├── SeriesIndexPage.astro / SeriesDetailPage.astro
│   │   └── TechniquesIndexPage.astro / TechniqueDetailPage.astro
│   ├── WorksGrid.tsx              # React island — filterable masonry artwork grid
│   ├── CommissionRequestForm.jsx  # React island — writes to Firestore at runtime
│   ├── ContactForm.jsx            # React island — stub, see TODO inside
│   ├── BlurHashImage.astro        # Astro component — decodes BlurHash at build time
│   └── ImageLightbox.astro        # Full-size image dialog — click-to-enlarge (see below)
├── pages/
│   ├── index.astro           # / — thin wrapper: <HomePage locale="it" />
│   ├── works/
│   │   ├── index.astro       # /works — thin wrapper: <WorksIndexPage locale="it" />
│   │   └── [slug].astro      # /works/:slug — getStaticPaths (slug only) + <WorkDetailPage locale="it" .../>
│   ├── series/
│   │   ├── index.astro       # /series — thin wrapper
│   │   └── [slug].astro      # /series/:slug — getStaticPaths (slug only) + shared component
│   ├── techniques/
│   │   ├── index.astro       # /techniques — thin wrapper
│   │   └── [slug].astro      # /techniques/:slug — getStaticPaths (slug only) + shared component
│   ├── about.astro            # /about — thin wrapper
│   ├── commissions.astro      # /commissions — thin wrapper
│   ├── contact.astro          # /contact — thin wrapper
│   └── [locale]/               # Non-default locales (currently just `en`) — mirrors the tree above
│       ├── index.astro         # getStaticPaths loops nonDefaultLocales; renders <HomePage locale={locale} />
│       ├── about.astro
│       ├── commissions.astro
│       ├── contact.astro
│       ├── works/{index,[slug]}.astro
│       ├── series/{index,[slug]}.astro
│       └── techniques/{index,[slug]}.astro   # [slug] files cross nonDefaultLocales × content list in getStaticPaths
```

## i18n

Astro's i18n config in `astro.config.mjs` sets the default locale and drives `BaseLayout`'s hreflang computation:

```js
i18n: {
  defaultLocale: 'it',
  locales: ['it', 'en'],
  routing: { prefixDefaultLocale: false },
}
```

Because `prefixDefaultLocale: false` means the default locale has no URL segment, a single dynamic route can't represent both "no segment" and "/en" — so routing is split in two, both rendering the *same* shared component from `src/components/pages/`:

- **Default locale (`it`)**: ordinary unprefixed files under `src/pages/` (`index.astro`, `works/index.astro`, ...) that just do `<XPage locale="it" />`.
- **Non-default locales**: a parallel `src/pages/[locale]/` tree. Each file's `getStaticPaths()` calls `nonDefaultLocales` (from `src/i18n/utils.ts`, derived from the keys of `src/i18n/it.ts`/`en.ts`) to generate one route per locale — currently just `en`, but adding a locale needs no new page files. `[slug]` pages under `[locale]/` additionally cross `nonDefaultLocales` with the content list in `getStaticPaths` (locale × slug).

Page markup itself is **never duplicated** — each shared component in `src/components/pages/` takes a `locale` prop, calls `useTranslations(locale)`, and builds every internal link with `getLocalePath(locale, path)` so the same file works for both `/works` and `/en/works`.

### Adding a new locale

1. Add the locale code to `locales` in `astro.config.mjs`
2. Create `src/i18n/{locale}.ts` with all keys from `src/i18n/it.ts` — it's picked up automatically via `nonDefaultLocales`
3. Nothing else — every `src/pages/[locale]/*` file already loops over `nonDefaultLocales` in its `getStaticPaths()`

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

Use the `getOrientation(dims)` helper defined locally in each Astro page and in `WorksGrid.tsx`.

## Critical Split: Build-time vs Runtime Firebase

**Build-time** (Astro frontmatter, `getStaticPaths()`):
- Uses `src/lib/fetchContent.ts` which imports `db` from `firebaseConfig.ts`
- Runs in Node.js during `npm run build`
- Never runs in the browser
- All functions must handle empty collections / bad config without throwing

**Runtime** (React islands with `client:visible`):
- `CommissionRequestForm.jsx` and `WorksGrid.tsx` only
- Only `PUBLIC_` prefixed env vars are available in the browser

## Environment Variables

All Firebase config uses the `PUBLIC_FIREBASE_*` prefix (Astro convention for browser-visible vars). See `.env.example`. This differs from the backoffice which uses `VITE_FIREBASE_*`.

## Types Contract

`src/lib/types.ts` mirrors the backoffice's `src/types/resources.ts` exactly:
- **Do not** change field names or enum values without syncing the backoffice
- camelCase fields, same enum string values (`'for_sale'`, `'not_for_sale'`, `'sold'`, `'personal'`, `'commissioned'`, etc.)

## Categories & WorksGrid Filtering

The `categories` collection (`src/lib/fetchContent.ts → getCategories()`) stores artwork taxonomy labels. Each `Artwork` document carries `categoryIds: string[]` — an array of plain category document IDs.

`WorksGrid.tsx` (`client:visible` React island) implements a two-level filter:
1. **Origin tabs** — Personal / Commissioned (no "All" tab)
2. **Category chips** — "Tutte/All" chip (resets filter) + one chip per category that has at least one artwork in the active origin tab

`src/components/pages/WorksIndexPage.astro` (shared by both `/works` and `/en/works`) fetches categories at build time and passes them, plus `locale`, as props to `WorksGrid`. `WorksGrid` uses `locale` with `getLocalePath()` to build correctly-prefixed artwork links. Category chip visibility is computed client-side to avoid showing empty filters.

## BlurHash Pattern

`blurHashUtils.ts` → `blurHashToDataUri(hash, w, h)`:
- **Only call from `.astro` files** — uses `Buffer` which is not available in the browser
- `BlurHashImage.astro` uses this to inline a placeholder background before the real image loads

## Image Lightbox

`src/components/ImageLightbox.astro` renders a native `<dialog>`-based click-to-enlarge viewer, currently wired into `WorkDetailPage.astro` for the cover image + gallery.

Usage:
```astro
<ImageLightbox items={lightboxItems} labels={t.lightbox} />
```
where `items` is an ordered `{ src, alt?, caption? }[]` (use `.original`, not `.medium`/`.thumb`, so the dialog shows full resolution) and `labels` is `t.lightbox` (`close`/`next`/`previous`, plus `open` used directly for trigger `aria-label`s).

Any element elsewhere on the page becomes a trigger by adding `data-lightbox-index={n}` matching that item's index in the array — see the `<button class="vd-zoom-trigger" data-lightbox-index="0">` wrapping the cover `<img>` in `WorkDetailPage.astro`. One `<ImageLightbox>` per page is enough; wrap every enlargeable image's triggers into a single shared `items` array (as `WorkDetailPage.astro` does by concatenating cover + gallery) so prev/next paging cycles through all of them.

The interactivity is a plain inline `<script>` (no framework — matches the mobile-nav-burger pattern in `BaseLayout.astro`), using `dialog.showModal()`/`.close()`, `Escape`/backdrop-click/arrow-key handling, and focus restoration to the trigger on close.

**Gotcha**: `<dialog>` is hidden by default via the *user-agent* stylesheet rule `dialog:not([open]) { display: none }`. Any author CSS that sets `display` on the dialog (e.g. `.vd-lightbox { display: flex }`, needed to center its contents while open) permanently overrides that UA rule — author styles always beat UA styles regardless of specificity — so the dialog stays visible (and, being `position: fixed`, blocks clicks on the whole page) even when closed. Always pair a `display` declaration on a `<dialog>` with an explicit `.your-dialog:not([open]) { display: none; }` rule (see `global.css`).

## Slug Pages Pattern

Default-locale `[slug].astro` files follow this pattern:

```ts
export async function getStaticPaths() {
  const items = await getXxx() // always returns [] on empty/error, never throws
  return items.map(i => ({ params: { slug: i.slug }, props: { item: i } }))
}
```

Their `src/pages/[locale]/.../[slug].astro` counterparts cross `nonDefaultLocales` with the same content list:

```ts
export async function getStaticPaths() {
  const items = await getXxx()
  return nonDefaultLocales.flatMap((locale) =>
    items.map((i) => ({ params: { locale, slug: i.slug }, props: { item: i } }))
  )
}
```

Empty collections return `[]` from `getStaticPaths()` — Astro generates zero pages for that route, which is correct and never an error.

## SEO Architecture

All SEO signals are centralised in `src/layouts/BaseLayout.astro`. Key props beyond `title` and `description`:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `ogImage` | `string` (absolute URL) | `https://valentinadamiano.it/og-default.jpg` | Open Graph / Twitter card image |
| `ogType` | `'website' \| 'article'` | `'website'` | OG content type — use `'article'` for artwork detail pages |
| `noAlternate` | `boolean` | `false` | Suppresses hreflang links — only needed for a page that genuinely has no counterpart in the other locale |

**Canonical & hreflang** are computed automatically from `Astro.url.pathname` plus the `site` property in `astro.config.mjs`. No manual URL passing needed for static pages.

**JSON-LD structured data** is injected per-page via the named `head` slot:
```astro
<BaseLayout title="..." description="...">
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(schema)} />
  <!-- page content -->
</BaseLayout>
```
Schema types used: `WebSite`, `Person`, `VisualArtwork`, `CreativeWorkSeries`, `BreadcrumbList`.

**Meta descriptions** live in `src/i18n/it.ts` and `src/i18n/en.ts` under the `meta` key (`meta.homeDescription`, `meta.worksDescription`, etc.). Always add a `meta.*Description` entry in both i18n files when adding a new page, rather than hardcoding the string in the `.astro` file.

**Sitemap** is auto-generated by `@astrojs/sitemap` on every `npm run build` — output at `/sitemap-index.xml`. No manual maintenance needed; new pages appear automatically.

**Analytics** — GA4 measurement ID is read from `VITE_GA_MEASUREMENT_ID` in `.env`. The tracking script is injected in `BaseLayout.astro` only when the variable is set and non-empty.

---

## Firestore Rules Note

The `commissions` collection allows **unauthenticated creates** (for the public commission form) but restricts reads/updates/deletes to admins. After changing `firestore.rules` in the backoffice repo, deploy with:

```bash
cd ../valecreative-admin-backoffice && npm run deploy:rules
```

## CMS Content Blocks (`contents` collection)

Certain page sections are editable via the backoffice `contents` collection without a code change or redeploy. The site fetches them at **build time** using `getContentBySlug(slug)` from `src/lib/fetchContent.ts`. If a document is not found or not published, the page falls back to hardcoded i18n strings — no build failure.

### Slug contract

| Slug | Page(s) | Fields used | Fallback |
|------|---------|-------------|----------|
| `homepage_hero` | `/` and `/en/` | `body` (HTML injected into `<h1>` via `set:html`) | `t.home.heroTitle` |
| `bio` | `/about` and `/en/about` | `body` (HTML prose block), `image` (portrait photo) | Hardcoded IT/EN paragraphs |

### Adding a new content block

1. Decide on a slug (e.g. `commissions_intro`)
2. In the page frontmatter: `const content = await getContentBySlug('commissions_intro')`
3. In the template: render `content?.body` with `set:html` if present, otherwise render the i18n fallback
4. In the backoffice: create a `contents` document with that exact slug and publish it

**Never change an existing slug** without updating both the site code and the backoffice document — a mismatch silently falls back to the hardcoded string.
