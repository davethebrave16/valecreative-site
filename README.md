# Vale Creative — Public Site

Public-facing portfolio and contact site for artist Valentina Damiano. Built with Astro (static output) + Firebase. The site is bilingual (Italian default, English at `/en/`) using Astro's i18n config plus a `[locale]` dynamic route tree — see "i18n" below.

## Prerequisites

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- A filled-in `.env` (see Setup below)
- Firebase project credentials (same project as `valecreative-admin-backoffice`)

## Setup

```bash
./setup.sh
```

This installs dependencies and creates `.env` from `.env.example`. Fill in your Firebase credentials:

```
PUBLIC_FIREBASE_API_KEY=...
PUBLIC_FIREBASE_AUTH_DOMAIN=...
PUBLIC_FIREBASE_PROJECT_ID=...
PUBLIC_FIREBASE_STORAGE_BUCKET=...
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
PUBLIC_FIREBASE_APP_ID=...
```

Also update `.firebaserc` with the real Firebase project ID.

## Development

```bash
./rundev.sh
```

Opens at http://localhost:4321. The site fetches content from Firestore at build time — a populated Firebase project is needed to see real content, but all pages render correctly against an empty project.

## Deploy

### Manual

```bash
./deploy.sh
```

Builds the static site, then asks for confirmation before deploying to Firebase Hosting.

### Automated (GitHub Actions)

`.github/workflows/deploy.yml` triggers a full build + Firebase Hosting deploy on:

- **`repository_dispatch`** with type `publish-site` — fired externally (e.g. from the backoffice after a content publish)
- **`workflow_dispatch`** — manual run from the GitHub Actions UI

Required GitHub repository secrets:

| Secret | Where to find it |
|--------|-----------------|
| `PUBLIC_FIREBASE_API_KEY` | Firebase console → Project settings → Web app |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | same |
| `PUBLIC_FIREBASE_PROJECT_ID` | same |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | same |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | same |
| `PUBLIC_FIREBASE_APP_ID` | same |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics → Admin → Data Streams |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase console → Project settings → Service accounts → Generate new private key (JSON) |

## Routes

| Route | Page |
|---|---|
| `/` | Homepage (Italian) |
| `/works` | Gallery — all artworks with filter chips |
| `/works/:slug` | Artwork detail |
| `/series/:slug` | Series detail (accessible via artwork/series links — not in nav) |
| `/techniques` | Techniques list |
| `/techniques/:slug` | Technique detail |
| `/about` | Studio / bio |
| `/commissions` | Commission request form |
| `/en/*` | English versions of all the above (served by `src/pages/[locale]/*`) |

## Design System

The visual design is defined by CSS custom properties (tokens) in `src/styles/global.css` and utility classes prefixed `vd-*`. The reference design lives in Claude Design project `9c818c88-821b-43c4-ad8e-8c0e8b4b0fe5`.

Key tokens: `--ink` (text), `--paper` (background), `--verde` (primary action), `--gold` (ornamental), `--forest` (dark accent). See `CLAUDE.md` for the full token reference.

## i18n

The site is bilingual using a single set of page bodies plus Astro dynamic routing — there is no duplicated page markup per locale:

- Each page's actual content lives once, in a shared component under `src/components/pages/` (e.g. `HomePage.astro`, `WorksIndexPage.astro`), which takes a `locale` prop and builds all internal links via `getLocalePath(locale, path)`.
- Italian (the default locale) is served by ordinary unprefixed files directly under `src/pages/` (`index.astro`, `works/index.astro`, etc.) that just render the shared component with `locale="it"`.
- English (and any future non-default locale) is served by a parallel `src/pages/[locale]/` tree, where each file's `getStaticPaths()` loops over `nonDefaultLocales` (exported from `src/i18n/utils.ts`) to generate `/en/...` and any future locale's routes from the same file.
- UI strings live in `src/i18n/it.ts` and `src/i18n/en.ts`.

### Adding a new language

1. Add the locale code to `locales` in `astro.config.mjs`
2. Create `src/i18n/{locale}.ts` with all keys from `it.ts` — it's automatically picked up by `locales`/`nonDefaultLocales` in `src/i18n/utils.ts`
3. Nothing else to do — every file under `src/pages/[locale]/` already generates a route for it via `getStaticPaths()`

## Logo

Replace `/public/logo.svg` with the actual logo file. The header and footer both reference it at `/logo.svg`. It should be square (42×42 rendered) with a transparent or dark background for the footer.

## Firestore Rules (important)

The commission form writes to the `commissions` collection from the browser (unauthenticated). The Firestore rules in `valecreative-admin-backoffice/firestore.rules` must allow public creates:

```
match /commissions/{docId} {
  allow create: if true;
  allow read, update, delete: if isAdmin();
}
```

Deploy the updated rules from the backoffice repo:

```bash
cd ../valecreative-admin-backoffice && npm run deploy:rules
```

## CMS Content Blocks

Some page sections can be edited in the backoffice without a code change or redeploy. They live in the `contents` Firestore collection. After editing in the backoffice, trigger a new site build/deploy for changes to appear (the site is static — there is no live Firestore listener).

| Slug | Appears on | What it controls |
|------|------------|-----------------|
| `homepage_hero` | `/` and `/en/` | Hero heading text (supports HTML markup via `set:html`) |
| `bio` | `/about` and `/en/about` | Biography prose and portrait photo |

Pages fall back to built-in placeholder text when the document is missing or unpublished.

## SEO & Analytics

### Google Analytics 4

Add your GA4 Measurement ID to `.env`:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
To get a Measurement ID: Google Analytics → Admin → Data Streams → Web stream → copy the `G-...` value. The tracking script is injected only when this variable is set — omitting it disables analytics without affecting the build.

### Google Search Console

After deploying, submit the sitemap in Search Console → Sitemaps:
```
https://valentinadamiano.it/sitemap-index.xml
```
Verify domain ownership via the DNS TXT record method (recommended for Firebase Hosting).

### OG Social Card

Place a `1200×630 px` JPEG at `public/og-default.jpg`. This image is used as the fallback Open Graph image when a page has no specific cover image. Artwork and series detail pages automatically use their own cover image.

---

## Architecture

- All content (artworks, series, techniques, bio) is fetched from Firestore **at build time** — the static HTML is pre-rendered
- Only the commission form runs Firestore code in the browser
- The artwork gallery (`WorksGrid.tsx`) is a React island for client-side category filtering
- Images are stored in Firebase Storage; `thumb` and `medium` variants are auto-generated by the Firebase Resize Images extension
- BlurHash placeholders are decoded at build time and inlined as BMP data URIs
- Schema types in `src/lib/types.ts` mirror `valecreative-admin-backoffice/src/types/resources.ts` exactly — keep in sync
