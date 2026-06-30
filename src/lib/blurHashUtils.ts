// Build-time only — uses Node.js Buffer. Never import from React components or browser code.

import { decode } from 'blurhash'

export function blurHashToDataUri(hash: string, w = 32, h = 20): string {
	let pixels: Uint8ClampedArray
	try {
		pixels = decode(hash, w, h)
	} catch {
		return ''
	}

	// BMP encoding: BITMAPFILEHEADER (14 bytes) + BITMAPINFOHEADER (40 bytes) + pixel data
	const rowSize = Math.ceil((w * 3) / 4) * 4 // rows must be 4-byte aligned
	const dataSize = rowSize * h
	const fileSize = 54 + dataSize
	const buf = Buffer.alloc(fileSize, 0)

	// BITMAPFILEHEADER
	buf.write('BM', 0, 'ascii')
	buf.writeUInt32LE(fileSize, 2)
	// reserved: bytes 6–9 already 0
	buf.writeUInt32LE(54, 10) // pixel data offset

	// BITMAPINFOHEADER
	buf.writeUInt32LE(40, 14) // header size
	buf.writeInt32LE(w, 18)
	buf.writeInt32LE(-h, 22) // negative height = top-down row order
	buf.writeUInt16LE(1, 26) // color planes
	buf.writeUInt16LE(24, 28) // bits per pixel (24-bit BGR, no alpha)
	// compression, imageSize, etc. already 0
	buf.writeUInt32LE(dataSize, 34)
	buf.writeInt32LE(2835, 38) // ~72 dpi X
	buf.writeInt32LE(2835, 42) // ~72 dpi Y

	// Pixel data: BGR order, padded rows
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const src = (y * w + x) * 4 // RGBA index in pixels array
			const dst = 54 + y * rowSize + x * 3
			buf[dst] = pixels[src + 2] // B
			buf[dst + 1] = pixels[src + 1] // G
			buf[dst + 2] = pixels[src] // R
		}
	}

	return `data:image/bmp;base64,${buf.toString('base64')}`
}
