// Client-side sort by an optional numeric position field. Documents without the
// field sort to the end, preserving their relative fetch order among themselves
// (stable sort). Never use the field as a Firestore orderBy — documents missing
// it are excluded from Firestore results entirely, not just sorted last.
export function sortByPosition<T extends Record<string, unknown>>(items: T[], field: keyof T): T[] {
	return [...items].sort((a, b) => {
		const aPos = (a[field] as number | undefined) ?? Infinity
		const bPos = (b[field] as number | undefined) ?? Infinity
		if (aPos === Infinity && bPos === Infinity) return 0
		return aPos - bPos
	})
}

// Homepage hero: the artwork flagged `isHero`, otherwise the first featured one (by featuredPosition).
// Shared by the homepage and the /og-default.jpg endpoint so both always show the same artwork.
export function pickHeroArtwork<T extends { isHero: boolean; featured: boolean; featuredPosition?: number }>(artworks: T[]): T | undefined {
	return artworks.find((a) => a.isHero) ?? sortByPosition(artworks.filter((a) => a.featured), 'featuredPosition')[0]
}
