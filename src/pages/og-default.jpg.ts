// /og-default.jpg — fallback Open Graph / Twitter image for pages without an image of their own
// (BaseLayout's default). Generated at build time from the homepage hero artwork, so it follows the
// hero chosen in the backoffice: 1200×630 cover crop, JPEG, kept under 300 KB.
import type { APIRoute } from 'astro'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { getArtworks } from '@/lib/fetchContent'
import { pickHeroArtwork } from '@/lib/utils'

const MAX_BYTES = 300 * 1024
// Used only if there is no hero artwork (or its image can't be downloaded).
const FALLBACK = path.join(process.cwd(), 'src/assets/process/processo-apertura.png')

async function loadSource(): Promise<Buffer> {
	const url = pickHeroArtwork(await getArtworks('it'))?.coverImage?.original
	if (url) {
		const res = await fetch(url)
		if (res.ok) return Buffer.from(await res.arrayBuffer())
		console.warn(`[og-default] hero image download failed (${res.status}), using fallback`)
	}
	return readFile(FALLBACK)
}

export const GET: APIRoute = async () => {
	const resized = sharp(await loadSource()).rotate().resize(1200, 630, { fit: 'cover' })
	let jpeg = Buffer.alloc(0)
	for (const quality of [80, 72, 64, 56]) {
		jpeg = await resized.clone().jpeg({ quality, mozjpeg: true }).toBuffer()
		if (jpeg.length <= MAX_BYTES) break
	}
	return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } })
}
