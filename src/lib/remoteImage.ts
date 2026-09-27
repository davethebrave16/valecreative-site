// Build-time only — responsive variants for Firebase Storage images (artworks, series, contents).
// The backoffice only stores `original` (thumb/medium are never populated), so every resize and
// format conversion happens here via astro:assets + sharp. Sharp converts embedded ICC profiles
// (e.g. Display P3 from iPhone photos) to sRGB and strips the profile.

import { getImage } from 'astro:assets'
import type { ImageObject } from './types'

export const REMOTE_WIDTHS = [400, 800, 1200, 1600]

// `sizes` per layout, calibrated on the rendered widths measured in Chrome at 412/600/1000/1440px
// (global.css: .container max 1320px with clamp(18px, 4vw, 52px) gutters → 100vw-36px on phones,
// ~92vw between 560 and 1300px, 1216px content above 1320px).
export const IMAGE_SIZES = {
	// .vd-hero right column (2 columns from 900px): 374 / 550 / 416 / 547px
	homeHero: '(min-width: 1320px) 550px, (min-width: 900px) 42vw, calc(100vw - 36px)',
	// .vd-grid cell: 2 / 3 (560px) / 4 (920px) columns: 181 / 175 / 218 / 289px
	grid: '(min-width: 1320px) 290px, (min-width: 920px) calc(23vw - 11px), (min-width: 560px) calc(31vw - 7px), calc(50vw - 23px)',
	// .vd-grid landscape cell spanning 2 columns: 374 / 363 / 451 / 597px
	gridWide: '(min-width: 1320px) 600px, (min-width: 920px) calc(46vw - 7px), (min-width: 560px) calc(61vw - 3px), calc(100vw - 36px)',
	// .vd-cards: auto-fill minmax(265px, 1fr) → 1 / 2 / 3 / 4 columns
	cards: '(min-width: 1320px) 300px, (min-width: 900px) 30vw, (min-width: 580px) 46vw, calc(100vw - 36px)',
	// .vd-two left column (0.85fr from 820px): 376 / 552 / 374 / 492px
	twoColumn: '(min-width: 1320px) 492px, (min-width: 820px) 37vw, calc(100vw - 36px)',
	// About page portraits grid, minmax(128px, 1fr): 182 / 130 / 161 / 159px
	aboutThumb: '(min-width: 820px) 160px, (min-width: 560px) 23vw, calc(50vw - 24px)',
	// .vd-detailwrap main column (1.7fr from 860px): 376 / 552 / 560 / 738px
	workMain: '(min-width: 1320px) 738px, (min-width: 860px) calc(58vw - 20px), calc(100vw - 36px)',
}

// Width/height ratio of boxes that crop with object-fit: cover. Variants are cropped to this ratio at
// build time (same centre crop the browser applies), so no bytes are spent on pixels that are never shown.
// Grid cells keep a near-constant ratio at every breakpoint (row height scales with the column width).
export const IMAGE_ASPECTS = {
	homeHero: 4 / 5,
	gridSquare: 1.07,     // 1 column × 2 rows
	gridPortrait: 0.7,    // 1 column × 3 rows
	gridLandscape: 2.2,   // 2 columns × 2 rows
	portrait: 3 / 4,      // About portrait and portraits grid
	card: 1.4,            // .vd-cards fixed-height covers (narrowest card ratio, so the width always suffices)
	galleryCard: 4 / 3,
}

// sizes + crop for a masonry grid cell, by orientation (see cellGridStyle in the grid components).
export function gridImageProps(orient: string): { sizes: string; aspect: number } {
	if (orient === 'landscape') return { sizes: IMAGE_SIZES.gridWide, aspect: IMAGE_ASPECTS.gridLandscape }
	if (orient === 'portrait') return { sizes: IMAGE_SIZES.grid, aspect: IMAGE_ASPECTS.gridPortrait }
	return { sizes: IMAGE_SIZES.grid, aspect: IMAGE_ASPECTS.gridSquare }
}

// Shared transform options: <RemoteImage> and the homepage hero preload must pass exactly the same
// values so the generated URLs (hashed from src/width/height/format/fit) match.
// `aspect` crops to that width/height ratio (fit: cover); without it the original ratio is kept.
export function remoteImageOptions(image: ImageObject, aspect?: number) {
	const { original: src, width: origW, height: origH } = image
	if (!origW || !origH) {
		// Legacy documents without dimensions: let Astro fetch them to infer the size (no crop).
		return { src, widths: REMOTE_WIDTHS.slice(0, 3), inferSize: true as const }
	}
	// Never upscale: Astro only filters widths larger than the source for local imports.
	const maxWidth = aspect ? Math.min(origW, Math.floor(origH * aspect)) : origW
	const fitting = REMOTE_WIDTHS.filter((w) => w <= maxWidth)
	const widths = fitting.length > 0 ? fitting : [maxWidth]
	const width = widths[widths.length - 1]
	const height = Math.round(aspect ? width / aspect : (width * origH) / origW)
	return { src, widths, width, height, ...(aspect ? { fit: 'cover' as const } : {}) }
}

export async function getRemoteSrcset(image: ImageObject, format: 'avif' | 'webp', aspect?: number): Promise<string> {
	const result = await getImage({ ...remoteImageOptions(image, aspect), format })
	return result.srcSet.attribute
}

// Two WebP sizes for full-width CSS background heroes (series/category detail pages).
export async function getRemoteBackground(image: ImageObject): Promise<{ small: string; large: string }> {
	const opts = remoteImageOptions(image)
	const make = async (target: number) => {
		const width = opts.width ? Math.min(target, opts.width) : target
		const height = opts.width && opts.height ? Math.round((width * opts.height) / opts.width) : undefined
		const result = await getImage({
			src: opts.src,
			width,
			...(height ? { height } : { inferSize: true }),
			format: 'webp',
		})
		return result.src
	}
	const [small, large] = await Promise.all([make(800), make(1600)])
	return { small, large }
}

// Open Graph / Twitter card image: 1200×630 JPEG (cover crop), absolute URL on the canonical domain.
// sharp never enlarges, so for originals smaller than 1200×630 the largest 1.91:1 crop that fits is used
// and its real size is returned for og:image:width/height. Quality 72 keeps every file under 300 KB.
export interface OgImage {
	url: string
	width: number
	height: number
}

const OG_WIDTH = 1200
const OG_HEIGHT = 630

export async function getOgImage(image: ImageObject | undefined): Promise<OgImage | undefined> {
	if (!image?.original) return undefined
	const { width: origW, height: origH } = image
	let width = OG_WIDTH
	let height = OG_HEIGHT
	if (origW && origH) {
		width = Math.min(OG_WIDTH, origW, Math.floor((origH * OG_WIDTH) / OG_HEIGHT))
		height = Math.round((width * OG_HEIGHT) / OG_WIDTH)
	}
	const result = await getImage({ src: image.original, width, height, fit: 'cover', format: 'jpg', quality: 72 })
	return { url: new URL(result.src, import.meta.env.SITE).href, width, height }
}

// Lightbox (click-to-enlarge): WebP with the long side capped at 2400px, never upscaled.
// Only the URL goes into the lightbox JSON; the file is fetched when the dialog opens.
const LIGHTBOX_LONG_SIDE = 2400

export async function getLightboxSrc(image: ImageObject): Promise<string> {
	const { original: src, width: w, height: h } = image
	if (!w || !h) {
		const result = await getImage({ src, width: LIGHTBOX_LONG_SIDE, inferSize: true, format: 'webp' })
		return result.src
	}
	const scale = Math.min(1, LIGHTBOX_LONG_SIDE / Math.max(w, h))
	const result = await getImage({
		src,
		width: Math.round(w * scale),
		height: Math.round(h * scale),
		format: 'webp',
	})
	return result.src
}
