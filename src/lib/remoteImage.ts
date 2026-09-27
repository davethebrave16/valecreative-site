// Build-time only — responsive variants for Firebase Storage images (artworks, series, contents).
// The backoffice only stores `original` (thumb/medium are never populated), so every resize and
// format conversion happens here via astro:assets + sharp. Sharp converts embedded ICC profiles
// (e.g. Display P3 from iPhone photos) to sRGB and strips the profile.

import { getImage } from 'astro:assets'
import type { ImageObject } from './types'

export const REMOTE_WIDTHS = [400, 800, 1200, 1600]

// `sizes` per layout (see global.css: .container max 1320px, gutters 18–52px).
export const IMAGE_SIZES = {
	// .vd-hero right column (2 columns from 900px)
	homeHero: '(min-width: 1320px) 580px, (min-width: 900px) 45vw, 100vw',
	// .vd-grid cell: 2 / 3 (560px) / 4 (920px) columns
	grid: '(min-width: 1320px) 300px, (min-width: 920px) 25vw, (min-width: 560px) 33vw, 50vw',
	// .vd-grid landscape cell spanning 2 columns
	gridWide: '(min-width: 1320px) 600px, (min-width: 920px) 50vw, (min-width: 560px) 66vw, 100vw',
	// .vd-cards: auto-fill minmax(265px, 1fr)
	cards: '(min-width: 1320px) 400px, (min-width: 600px) 50vw, 100vw',
	// .vd-two left column (0.85fr from 820px)
	twoColumn: '(min-width: 1320px) 520px, (min-width: 820px) 40vw, 100vw',
	// About page portraits grid: minmax(128px, 1fr)
	aboutThumb: '(min-width: 820px) 160px, 33vw',
	// .vd-detailwrap main column (1.7fr from 860px)
	workMain: '(min-width: 1320px) 780px, (min-width: 860px) 62vw, 100vw',
}

// Shared transform options: <RemoteImage> and the homepage hero preload must pass exactly the same
// values so the generated URLs (hashed from src/width/height/format) match.
export function remoteImageOptions(image: ImageObject) {
	const { original: src, width: origW, height: origH } = image
	if (!origW || !origH) {
		// Legacy documents without dimensions: let Astro fetch them to infer the size.
		return { src, widths: REMOTE_WIDTHS.slice(0, 3), inferSize: true as const }
	}
	// Never upscale: Astro only filters widths larger than the source for local imports.
	const fitting = REMOTE_WIDTHS.filter((w) => w <= origW)
	const widths = fitting.length > 0 ? fitting : [origW]
	const width = widths[widths.length - 1]
	const height = Math.round((width * origH) / origW)
	return { src, widths, width, height }
}

export async function getRemoteSrcset(image: ImageObject, format: 'avif' | 'webp'): Promise<string> {
	const result = await getImage({ ...remoteImageOptions(image), format })
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
