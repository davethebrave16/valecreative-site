# Vale Creative — Public Site

Public-facing portfolio and contact site for artist Valentina Damiano. Built with Astro (static output) + Firebase. The site is bilingual (`/it/` and `/en/`, both first-class) using Astro's i18n config plus a `[locale]` dynamic route tree — see "i18n" below.

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
| `PUBLIC_META_PIXEL_ID` | Meta Business Manager → Events Manager → Data Sources → your Pixel |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase console → Project settings → Service accounts → Generate new private key (JSON) |

## Routes

| Route | Page |
|---|---|
| `/` | Language gateway — no content, redirects to `/it` or `/en` (browser language, or a remembered choice) |
| `/it`, `/en` | Homepage |
| `/it\|en/works` | Categories grid — one card per artwork category |
| `/it\|en/works/category/:slug` | Category gallery — that category's artworks, Personal/Commissioned tabs |
| `/it\|en/works/:slug` | Artwork detail |
| `/it\|en/series/:slug` | Series detail (accessible via artwork/series links — not in nav) |
| `/it\|en/techniques` | Techniques list |
| `/it\|en/techniques/:slug` | Technique detail |
| `/it\|en/about` | Studio / bio |
| `/it\|en/contact` | Contact / commission request form |
| `/it\|en/privacy` | Privacy & cookie policy |

The artwork detail page links into `/contact` with `?type=` and `?ref=` query params to pre-fill the request type and description — see `CLAUDE.md` → "Artwork Detail CTA".

All content routes are served by `src/pages/[locale]/*` for both locales — see "i18n" below. Visiting any of the above paths without the `/it`/`/en` prefix (e.g. `/works`, `/works/:slug`) also works — it redirects to the correct locale via the gateway pages described below, rather than 404ing.

## Design System

The visual design is defined by CSS custom properties (tokens) in `src/styles/global.css` and utility classes prefixed `vd-*`. The reference design lives in Claude Design project `9c818c88-821b-43c4-ad8e-8c0e8b4b0fe5`.

Key tokens: `--ink` (text), `--paper` (background), `--verde` (primary action), `--gold` (ornamental), `--forest` (dark accent). See `CLAUDE.md` for the full token reference.

## i18n

The site is bilingual using a single set of page bodies plus Astro dynamic routing — there is no duplicated page markup per locale, and both locales are equally first-class (`/it/*` and `/en/*`, both prefixed):

- Each page's actual content lives once, in a shared component under `src/components/pages/` (e.g. `HomePage.astro`, `WorksIndexPage.astro`), which takes a `locale` prop and builds all internal links via `getLocalePath(locale, path)` (always `/${locale}${path}`).
- Both locales are served by the single `src/pages/[locale]/` tree, where each file's `getStaticPaths()` loops over `locales` (exported from `src/i18n/utils.ts`) to generate `/it/...` and `/en/...` (and any future locale's) routes from the same file.
- UI strings live in `src/i18n/it.ts` and `src/i18n/en.ts`.
- `src/pages/index.astro` (bare `/`) is not content — it's a language gateway that redirects to `/it` or `/en`, see below.

### Adding a new language

1. Add the locale code to `locales` in `astro.config.mjs`
2. Create `src/i18n/{locale}.ts` with all keys from `it.ts` — it's automatically picked up by `locales` in `src/i18n/utils.ts`
3. Nothing else to do — every file under `src/pages/[locale]/` already generates a route for it via `getStaticPaths()`

### Language detection & switching

- **Language gateway pages**: `src/pages/index.astro` (`/`) and `src/pages/[...path].astro` (any other unprefixed legacy path, e.g. `/works`, `/works/some-slug`) have no content of their own — a client-side script checks `localStorage['vd-locale']`, else the browser's language, and redirects once to the `/it` or `/en` equivalent, remembering the decision. The site is fully static, so this is JS-based rather than a server redirect (a `<meta http-equiv="refresh">` to `/it{path}` covers no-JS clients/crawlers) — see `CLAUDE.md` for details.
- **Manual switcher**: an IT/EN toggle in the header (desktop nav + mobile menu) lets visitors switch locale on any page — since routing is symmetric, it just swaps the `/it`/`/en` prefix on the current path. A manual switch is remembered the same way, so it's respected if the visitor later lands back on the root gateway.

## Logo

Replace `/public/logo.svg` with the actual logo file. The header and footer both reference it at `/logo.svg`. It should be square (42×42 rendered) with a transparent or dark background for the footer.

## Social Links

Il footer mostra i link ai profili social di Valentina (Instagram, Facebook, Pinterest), definiti come SVG inline in `src/layouts/BaseLayout.astro` (riga ~237). Per aggiornare un URL, modificare direttamente l'`href` del link corrispondente in quel file — non c'è configurazione centralizzata.

## Commission form — submitCommission Cloud Function

The commission form no longer writes to Firestore directly. It calls the `submitCommission` callable Cloud Function (deployed from `valecreative-admin-backoffice`, region `europe-west1`), which verifies a reCAPTCHA v3 token server-side before writing to the `commissions` collection. Direct client writes are blocked in `firestore.rules`:

```
match /commissions/{docId} {
  allow create: if false;
  allow read, update, delete: if isAdmin();
}
```

Requires `PUBLIC_RECAPTCHA_SITE_KEY` in `.env` (see `.env.example`) — the site key from [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin). Without it, the reCAPTCHA script is not injected and submissions are rejected server-side with a "security verification failed" message. The corresponding `RECAPTCHA_SECRET_KEY` secret and `submitCommission` function itself live in the backoffice repo — see its `CLAUDE.md` for deployment.

## CMS Content Blocks

Some page sections can be edited in the backoffice without a code change or redeploy. They live in the `contents` Firestore collection. After editing in the backoffice, trigger a new site build/deploy for changes to appear (the site is static — there is no live Firestore listener).

| Slug | Appears on | What it controls |
|------|------------|-----------------|
| `homepage_hero` | `/` and `/en/` | Hero heading text (supports HTML markup via `set:html`) |
| `bio` | `/about` and `/en/about` | Biography prose and portrait photo |

Pages fall back to built-in placeholder text when the document is missing or unpublished.

Editorial text on the site (artwork titles/descriptions, technique names/descriptions, category names, `contents` title/body, gallery captions) supports an optional English translation, entered in the backoffice as a sibling field (e.g. `titleEn` next to `title`). The English page silently falls back to the Italian text if no translation has been entered yet — see "Bilingual content fields" in `CLAUDE.md`.

## SEO & Analytics

### Google Analytics 4

Add your GA4 Measurement ID to `.env`:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
To get a Measurement ID: Google Analytics → Admin → Data Streams → Web stream → copy the `G-...` value. The tracking script is injected only when this variable is set — omitting it disables analytics without affecting the build.

### Custom events

Five custom GA4 events are fired from the site, all defined in `src/lib/analytics.ts` (`trackEvent` wraps `window.gtag('event', ...)` and no-ops if `gtag` isn't loaded, e.g. consent not yet given). This is the complete list — nothing else in the codebase calls `trackEvent`.

| Event | Params | Triggered by |
|-------|--------|--------------|
| `view_artwork_gallery` | `artwork_slug`, `artwork_title` | Visitor opens an artwork's image lightbox (`src/components/ImageLightbox.astro`) — clicking any thumbnail with `data-lightbox-index` calls `openAt()`, which fires the event every time the lightbox dialog opens, including re-opens on the same page. |
| `artwork_cta_click` | `artwork_slug`, `artwork_title`, `cta_type` (`for_sale` \| `commissioned` \| `sold` \| `not_for_sale` \| `fallback`) | Visitor clicks the call-to-action link/button on an artwork detail page (`src/components/ArtworkCTA.astro`), which routes them to `/contact` with `type`/`ref` query params. `cta_type` mirrors which CTA variant was shown, derived from the artwork's `origin` and `availability` fields (see `CLAUDE.md` → "Artworks — origin & availability fields"). |
| `commission_form_submit` | `status` (`success` \| `error`), `request_type` (`commission` \| `course` \| `info`), `error_reason` (`recaptcha` \| `validation` \| `generic`, only present when `status === 'error'`) | Visitor submits the commission/contact form on `/contact` (`src/components/CommissionRequestForm.jsx`) and the `submitCommission` Cloud Function call resolves or rejects. Only fires on an actual server round-trip — client-side validation failures caught before the request is sent are not tracked. |
| `category_tab_toggle` | `category_slug`, `origin` (`personal` \| `commissioned`) | Visitor switches the Personal/Commissioned tab on a category page (`/works/category/[slug]`, `src/components/pages/CategoryDetailPage.astro`) — only rendered when a category has artworks in both origins. |
| `language_switch` | `target_locale` | Visitor clicks the IT/EN language switcher in the header or mobile menu (`src/layouts/BaseLayout.astro`). |

Both events are subject to the same consent gating as pageviews — see "Cookie consent" below.

### Meta Pixel

Add your Pixel ID to `.env`:
```
PUBLIC_META_PIXEL_ID=1234567890123456
```
To get a Pixel ID: Meta Business Manager → Events Manager → Data Sources → your Pixel → Settings. The `fbq` loader script is injected only when this variable is set — omitting it disables the Pixel without affecting the build. Follows the exact same consent-gating mechanism as GA4 (see "Cookie consent" below): `fbq('init', ...)` + `fbq('track', 'PageView')` only run after the visitor accepts cookies.

A single custom event is fired beyond the automatic `PageView`: the standard `Lead` event, via `trackFbEvent('Lead')` in `src/lib/analytics.ts`, called from `src/components/CommissionRequestForm.jsx` right after the `submitCommission` Cloud Function call succeeds. `trackFbEvent` no-ops if `fbq` isn't loaded or consent hasn't been accepted.

### Cookie consent

GA4 and the Meta Pixel both require visitor opt-in before they collect any data — required for EU/Italian visitors under GDPR/ePrivacy. A single cookie consent banner (`src/components/CookieConsentBanner.astro`) shows on first visit when `VITE_GA_MEASUREMENT_ID` and/or `PUBLIC_META_PIXEL_ID` is set; there is only one accept/reject toggle covering both providers (no separate analytics/marketing categories). GA stays disabled (via Google's `ga-disable-<id>` flag) and the Pixel's `fbq('init', ...)` is simply never called until the visitor clicks Accept. Their choice is remembered in `localStorage` and can be changed later from the `/privacy` page. reCAPTCHA v3 is not gated — it's treated as strictly necessary for spam protection on the commission form, not analytics. See `CLAUDE.md` → "Cookie Consent" for the full implementation.

**Before launch**: the `/privacy` page's copy is a reasonable starting point but has not been reviewed by a lawyer — have it reviewed before the site goes live.

### Google Search Console

After deploying, submit the sitemap in Search Console → Sitemaps:
```
https://valentinadamiano.it/sitemap-index.xml
```
Verify domain ownership via the DNS TXT record method (recommended for Firebase Hosting).

### OG Social Card

Place a `1200×630 px` JPEG at `public/og-default.jpg`. This image is used as the fallback Open Graph image when a page has no specific cover image. Artwork and series detail pages automatically use their own cover image.

### robots.txt

`public/robots.txt` allows crawling of the real content routes (`/it/*`, `/en/*`) and references the sitemap. The non-locale redirect stubs (`/works`, `/about`, `/contact`, `/privacy`, `/series`, `/techniques` — see "Language detection & switching" above) are explicitly disallowed since they only redirect into the locale versions and add no unique content.

---

## Architecture

- All content (artworks, series, techniques, bio) is fetched from Firestore **at build time** — the static HTML is pre-rendered
- The commission form runs in the browser but does not touch Firestore directly — it calls the `submitCommission` Cloud Function, which verifies reCAPTCHA v3 and writes server-side
- The Works section is a static two-level drill-down, no client-side React filtering: `/works` shows a grid of category cards (each with a representative cover image chosen in the backoffice), and clicking one navigates to `/works/category/:slug`, a real static page showing that category's artworks with a Personal/Commissioned toggle (plain vanilla JS, not a React island)
- Detail pages (artwork, category, series, technique) have a "smart" back link — it calls the browser's `history.back()` when there's somewhere to go back to (so it returns to the actual page you came from, e.g. a category gallery, not always a fixed parent URL), falling back to a real `href` for direct links, new tabs, and crawlers
- Images are stored in Firebase Storage; `thumb` and `medium` variants are auto-generated by the Firebase Resize Images extension
- BlurHash placeholders are decoded at build time and inlined as BMP data URIs
- The artwork detail page's cover image and gallery thumbnails open in a full-size click-to-enlarge dialog (`src/components/ImageLightbox.astro`), showing the original-resolution image with prev/next paging, keyboard/backdrop close, scroll/pinch zoom with click-drag panning, double-click/double-tap zoom toggle, and no external dependency
- Schema types in `src/lib/types.ts` mirror `valecreative-admin-backoffice/src/types/resources.ts` exactly — keep in sync
- Manual drag-and-drop ordering set in the backoffice (works gallery, homepage featured section, per-artwork gallery images) is respected automatically on the next build via optional `galleryPosition`/`featuredPosition`/`imagePosition` fields, applied as a client-side sort after fetch (never as a Firestore `orderBy`, since Firestore drops documents missing an `orderBy` field entirely). See "Manual Position Ordering" in `CLAUDE.md`.
