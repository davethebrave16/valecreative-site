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

## Tech Stack

- **Astro 5** — static site generator (output: 'static'), no server runtime
- **React 19** — used only for interactive islands (forms, works grid), via `@astrojs/react`
- **Firebase JS SDK 12** — Firestore (build-time reads + runtime form writes)
- **blurhash** — BlurHash decode for image placeholders (build-time only)
- **TypeScript strict** — all source files
- **Astro i18n** — built-in routing, `defaultLocale: 'it'`, `prefixDefaultLocale: false`

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
│   └── utils.ts              # useTranslations(locale) + getLocalePath(locale, path)
├── lib/
│   ├── firebaseConfig.ts     # Firebase init (guarded against double-init)
│   ├── types.ts              # Firestore schema interfaces — cross-project contract
│   ├── fetchContent.ts       # Build-time Firestore query functions
│   └── blurHashUtils.ts      # blurHashToDataUri() — Node.js Buffer, build-time only
├── pages/
│   ├── index.astro           # / — homepage (hero, featured, band, series teaser)
│   ├── works/
│   │   ├── index.astro       # /works — gallery with WorksGrid React island
│   │   └── [slug].astro      # /works/:slug — artwork detail (two-column)
│   ├── series/
│   │   ├── index.astro       # /series — series list cards
│   │   └── [slug].astro      # /series/:slug — series detail (hero banner + grid)
│   ├── techniques/
│   │   ├── index.astro       # /techniques — numbered list
│   │   └── [slug].astro      # /techniques/:slug — technique detail + related works
│   ├── about.astro           # /about — Studio/bio two-column layout
│   ├── commissions.astro     # /commissions — commission request form (Contatti)
│   ├── contact.astro         # /contact — contact stub
│   └── en/                   # English locale stubs (mirrors Italian pages)
│       ├── index.astro
│       ├── works/index.astro
│       ├── series/index.astro
│       ├── techniques/index.astro
│       ├── about.astro
│       └── commissions.astro
└── components/
    ├── WorksGrid.tsx              # React island — filterable masonry artwork grid
    ├── CommissionRequestForm.jsx  # React island — writes to Firestore at runtime
    ├── ContactForm.jsx            # React island — stub, see TODO inside
    └── BlurHashImage.astro        # Astro component — decodes BlurHash at build time
```

## i18n

Astro's built-in i18n is configured in `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'it',
  locales: ['it', 'en'],
  routing: { prefixDefaultLocale: false },
}
```

Italian pages live at clean paths (`/`, `/works`, etc.). English pages live under `/en/` (`/en/`, `/en/works`, etc.).

### Adding a new locale

1. Add the locale code to `locales` in `astro.config.mjs`
2. Create `src/i18n/{locale}.ts` with all keys from `src/i18n/it.ts`
3. Copy `src/pages/en/` to `src/pages/{locale}/`, updating all `href` attributes to use the new prefix
4. Pass `lang="{locale}"` to `<BaseLayout>` in each new page

### Using translations in a page

```astro
---
import { useTranslations, getLocalePath } from '@/i18n/utils'
const locale = Astro.currentLocale ?? 'it'
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

Both `/works/index.astro` and `/en/works/index.astro` fetch categories at build time and pass them as the `categories` prop to `WorksGrid`. Category chip visibility is computed client-side to avoid showing empty filters.

## BlurHash Pattern

`blurHashUtils.ts` → `blurHashToDataUri(hash, w, h)`:
- **Only call from `.astro` files** — uses `Buffer` which is not available in the browser
- `BlurHashImage.astro` uses this to inline a placeholder background before the real image loads

## Slug Pages Pattern

All `[slug].astro` files follow this pattern:

```ts
export async function getStaticPaths() {
  const items = await getXxx() // always returns [] on empty/error, never throws
  return items.map(i => ({ params: { slug: i.slug }, props: { item: i } }))
}
```

Empty collections return `[]` from `getStaticPaths()` — Astro generates zero pages for that route, which is correct and never an error.

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
