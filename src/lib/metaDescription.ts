// Build-time only. Category/Technique `description` is meant to be read as
// on-page intro copy, so it's intentionally allowed to run longer than a meta
// description should. This derives a <=160-char meta/og/twitter description
// from it without touching the in-page text itself.

function splitSentences(text: string): string[] {
	const matches = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g)
	return matches ? matches.map((s) => s.trim()) : [text]
}

export function truncateMetaDescription(text: string, maxLen = 160): string {
	const trimmed = text.trim()
	if (trimmed.length <= maxLen) return trimmed

	const sentences = splitSentences(trimmed)
	let result = ''
	for (const sentence of sentences) {
		const candidate = result ? `${result} ${sentence}` : sentence
		if (candidate.length > maxLen) break
		result = candidate
	}
	if (result) return result

	// Even the first sentence alone exceeds maxLen: cut at the last word boundary
	// before maxLen - 3 chars (157 for the default 160) and append an ellipsis.
	const cutAt = maxLen - 3
	let cut = trimmed.slice(0, cutAt)
	const lastSpace = cut.lastIndexOf(' ')
	if (lastSpace > 0) cut = cut.slice(0, lastSpace)
	return `${cut}…`
}
