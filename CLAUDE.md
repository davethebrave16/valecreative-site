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
- **React 19** — used only for interactive islands (forms), via `@astrojs/react`
- **Firebase JS SDK 12** — Firestore (build-time reads + runtime form writes)
- **blurhash** — BlurHash decode for image placeholders (build-time only)
- **TypeScript strict** — all source files

## Project Layout

```
src/
├── layouts/
│   └── BaseLayout.astro      # HTML shell (head, header, main, footer)
├── styles/
│   └── global.css            # Reset + minimal structural styles (no design)
├── lib/
│   ├── firebaseConfig.ts     # Firebase init (guarded against double-init)
│   ├── types.ts              # Firestore schema interfaces — cross-project contract
│   ├── fetchContent.ts       # Build-time Firestore query functions
│   └── blurHashUtils.ts      # blurHashToDataUri() — Node.js Buffer, build-time only
├── pages/
│   ├── index.astro
│   ├── works/index.astro
│   ├── works/[slug].astro
│   ├── series/index.astro
│   ├── series/[slug].astro
│   ├── techniques/index.astro
│   ├── techniques/[slug].astro
│   ├── about.astro
│   ├── commissions.astro
│   └── contact.astro
└── components/
    ├── CommissionRequestForm.jsx   # React island — writes to Firestore at runtime
    ├── ContactForm.jsx             # React island — stub, see TODO inside
    └── BlurHashImage.astro         # Astro component — decodes BlurHash at build time
```

## Critical Split: Build-time vs Runtime Firebase

**Build-time** (Astro frontmatter, `getStaticPaths()`):
- Uses `src/lib/fetchContent.ts` which imports `db` from `firebaseConfig.ts`
- Runs in Node.js during `npm run build`
- Never runs in the browser
- All functions must handle empty collections / bad config without throwing

**Runtime** (React islands with `client:visible`):
- `CommissionRequestForm.jsx` and `ContactForm.jsx` only
- These import `db` directly and run in the browser
- Only `PUBLIC_` prefixed env vars are available in the browser

## Environment Variables

All Firebase config uses the `PUBLIC_FIREBASE_*` prefix (Astro convention for browser-visible vars). See `.env.example`. This differs from the backoffice which uses `VITE_FIREBASE_*`.

The same Firebase project and credentials are used for both the public site and the admin backoffice.

## Types Contract

`src/lib/types.ts` mirrors the backoffice's `src/types/resources.ts` exactly:
- **Do not** change field names or enum values without syncing the backoffice
- camelCase fields, same enum string values (`'for_sale'`, `'not_for_sale'`, `'sold'`, `'personal'`, `'commissioned'`, etc.)
- `ImageObject` interface is shared across Series, Artwork (cover), Content, and GalleryImage

## BlurHash Pattern

`blurHashUtils.ts` → `blurHashToDataUri(hash, w, h)`:
- Decodes BlurHash via `blurhash`'s `decode()` (works in Node.js)
- Creates a BMP binary from the pixel data and returns `data:image/bmp;base64,...`
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

The `commissions` collection allows **unauthenticated creates** (for the public commission form) but restricts reads/updates/deletes to admins. This was changed from the backoffice default (`allow read, write: if isAdmin()`). After changing `firestore.rules` in the backoffice repo, deploy with:

```bash
cd ../valecreative-admin-backoffice && npm run deploy:rules
```
