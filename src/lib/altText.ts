// Build-time only. Detects alt text that is really a leftover camera/app filename
// (e.g. "IMG_0760", "WhatsApp Image 2026-09-12 at 13.37.43") and provides a
// descriptive fallback built from data already available on the page — never
// from the filename itself. Mirrors the subset of
// valecreative-firebase-set-scripts/normalizer/alt_rules.py's looks_like_filename()
// that doesn't need a separate `file_name` argument.

const CAMERA_PREFIX = /^\d*[-_ ]?(img|dsc|dscn|dcim|pxl|whatsapp|screenshot|image|photo|foto)([-_ .]|\d|$)/i
const ONLY_NUMBERS = /^[\d_\-\s().n]+$/i
const HAS_EXTENSION = /\.(jpe?g|png|gif|webp|avif|heic|tiff?|bmp)\b/i
const FILE_TOKENS = /(^|[-_ ])(jpe?g|png|tiff?)([-_ ]|$)/i
const SNAKE_CASE = /^\S*_\S*$/

export function looksLikeFilename(alt: string | undefined | null): boolean {
	const a = (alt ?? '').trim()
	if (!a) return true
	return (
		CAMERA_PREFIX.test(a) ||
		ONLY_NUMBERS.test(a) ||
		HAS_EXTENSION.test(a) ||
		FILE_TOKENS.test(a) ||
		SNAKE_CASE.test(a)
	)
}

export function buildAltFallback(title: string, techniqueName?: string): string {
	return techniqueName ? `${title} — ${techniqueName}` : title
}

export function resolveAlt(alt: string | undefined | null, title: string, techniqueName?: string): string {
	return looksLikeFilename(alt) ? buildAltFallback(title, techniqueName) : (alt as string)
}
