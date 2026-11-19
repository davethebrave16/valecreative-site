// Build-time only — called from Astro page frontmatter and getStaticPaths().
// Never import this from React components (those run in the browser).

import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
} from 'firebase/firestore'
import type { DocumentData, Query } from 'firebase/firestore'
import { db } from './firebaseConfig'
import type { Artwork, Category, GalleryImage, Series, Technique, Content } from './types'
import { localize, type Locale } from '../i18n/utils'
import { sortByPosition } from './utils'

// Build-time memoization. Every page (and BaseLayout, for the nav) asks for the same collections, so each
// collection / gallery is read from Firestore ONCE per build (module level, shared by all pages and locales)
// and re-localized per call — cheap, and callers get fresh arrays they may sort. Reads per build therefore
// scale with the number of documents, not pages. In `astro dev` entries expire after 60 s (and always on
// restart), so edits made in the backoffice show up without a read per request. A failed load is not cached.
const memo = new Map<string, { at: number; pending: Promise<unknown> }>()
const DEV_TTL_MS = 60_000
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
	const hit = memo.get(key)
	if (hit && (!import.meta.env.DEV || Date.now() - hit.at < DEV_TTL_MS)) return hit.pending as Promise<T>
	const pending = load().catch((err) => {
		memo.delete(key)
		throw err
	})
	memo.set(key, { at: Date.now(), pending })
	return pending
}

interface RawDoc {
	id: string
	data: () => Record<string, unknown>
}
const toRaw = (d: { id: string; data: () => Record<string, unknown> }): RawDoc => {
	const data = d.data()
	return { id: d.id, data: () => data }
}

// The only Firestore reads of the site build: one per collection (+ one per artwork gallery).
const loadDocs = async (q: Query<DocumentData>): Promise<RawDoc[]> => (await getDocs(q)).docs.map(toRaw)
const rawArtworks = () => cached('artworks', () => loadDocs(query(collection(db, 'artworks'), orderBy('createdAt', 'desc'))))
const rawTechniques = () => cached('techniques', () => loadDocs(query(collection(db, 'techniques'), orderBy('name', 'asc'))))
const rawCategories = () => cached('categories', () => loadDocs(query(collection(db, 'categories'), orderBy('name', 'asc'))))
const rawContents = () => cached('contents', () => loadDocs(query(collection(db, 'contents'), where('published', '==', true))))
const rawGallery = (artworkId: string) =>
	cached(`gallery:${artworkId}`, () => loadDocs(query(collection(db, `artworks/${artworkId}/gallery`), orderBy('uploadedAt', 'asc'))))

// Slugs build the public URLs (/works/{slug}, /series/{slug}, …) and the site's lookups. Two documents
// with the same slug would silently produce a single page, so the build fails instead. Deliberately
// called OUTSIDE the try/catch of the getters below, which otherwise swallow errors and return [].
export function assertUniqueSlugs(collection: string, items: { id: string; slug: string }[]): void {
	const bySlug = new Map<string, string[]>()
	for (const { id, slug } of items) bySlug.set(slug, [...(bySlug.get(slug) ?? []), id])
	const duplicates = [...bySlug].filter(([, ids]) => ids.length > 1)
	if (duplicates.length > 0) {
		const detail = duplicates.map(([slug, ids]) => `  ${collection}: slug "${slug}" used by ${ids.join(', ')}`).join('\n')
		throw new Error(`[fetchContent] Duplicate slugs — fix them in the backoffice (each slug must be unique):\n${detail}`)
	}
}

function docToArtwork(d: { id: string; data: () => Record<string, unknown> }, locale: Locale): Artwork {
	const data = d.data()
	const description = data.description
		? localize(String(data.description), data.descriptionEn as string | undefined, locale)
		: undefined
	return {
		id: d.id,
		title: localize(String(data.title ?? ''), data.titleEn as string | undefined, locale),
		slug: String(data.slug ?? ''),
		year: Number(data.year ?? 0),
		techniqueId: String((data.techniqueId as { id?: string } | null)?.id ?? data.techniqueId ?? ''),
		seriesId: data.seriesId
			? String((data.seriesId as { id?: string } | null)?.id ?? data.seriesId)
			: undefined,
		categoryIds: Array.isArray(data.categoryIds)
			? (data.categoryIds as unknown[]).map(String)
			: undefined,
		coverImage: data.coverImage as Artwork['coverImage'],
		origin: (data.origin as Artwork['origin']) ?? 'personal',
		availability: (data.availability as Artwork['availability']) ?? 'not_for_sale',
		price: data.price != null ? Number(data.price) : undefined,
		featured: Boolean(data.featured),
		isHero: Boolean(data.isHero),
		isIntro: Boolean(data.isIntro),
		showOnAboutPage: Boolean(data.showOnAboutPage),
		dimensions: data.dimensions as Artwork['dimensions'],
		support: data.support ? String(data.support) : undefined,
		description,
		galleryPosition: data.galleryPosition != null ? Number(data.galleryPosition) : undefined,
		featuredPosition: data.featuredPosition != null ? Number(data.featuredPosition) : undefined,
	}
}

export async function getArtworks(locale: Locale = 'it'): Promise<Artwork[]> {
	let artworks: Artwork[]
	try {
		artworks = (await rawArtworks()).map((d) => docToArtwork(d, locale))
	} catch (err) {
		console.error('[fetchContent] getArtworks failed:', err)
		return []
	}
	assertUniqueSlugs('artworks', artworks)
	return artworks
}

export async function getArtworkBySlug(slug: string, locale: Locale = 'it'): Promise<Artwork | null> {
	try {
		const d = (await rawArtworks()).find((x) => x.data().slug === slug)
		return d ? docToArtwork(d, locale) : null
	} catch (err) {
		console.error('[fetchContent] getArtworkBySlug failed:', err)
		return null
	}
}

export async function getArtworkGallery(artworkId: string, locale: Locale = 'it'): Promise<GalleryImage[]> {
	try {
		const images = (await rawGallery(artworkId)).map((d) => {
			const data = d.data()
			return {
				id: d.id,
				original: String(data.original ?? ''),
				thumb: data.thumb ? String(data.thumb) : undefined,
				medium: data.medium ? String(data.medium) : undefined,
				alt: data.alt ? String(data.alt) : undefined,
				width: data.width ? Number(data.width) : undefined,
				height: data.height ? Number(data.height) : undefined,
				blurHash: data.blurHash ? String(data.blurHash) : undefined,
				caption: data.caption
					? localize(String(data.caption), data.captionEn as string | undefined, locale)
					: undefined,
				order: data.order != null ? Number(data.order) : undefined,
				imagePosition: data.imagePosition != null ? Number(data.imagePosition) : undefined,
			} satisfies GalleryImage
		})
		return sortByPosition(images, 'imagePosition')
	} catch (err) {
		console.error('[fetchContent] getArtworkGallery failed:', err)
		return []
	}
}

// Local-only verification override: SERIES_PREVIEW_ALL=1 treats unpublished series as published so they can
// be built and inspected before release. Ignored whenever CI is set (GitHub Actions sets CI and
// GITHUB_ACTIONS), so the scheduled/dispatched production build can never publish draft series.
const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS)
const SERIES_PREVIEW_ALL = process.env.SERIES_PREVIEW_ALL === '1' && !isCI
if (process.env.SERIES_PREVIEW_ALL === '1' && isCI) {
	console.warn('[fetchContent] SERIES_PREVIEW_ALL is ignored in CI')
}

// English is complete when every English field whose Italian counterpart exists is filled in.
// (A series with no Italian intro doesn't need introEn.)
function isEnglishComplete(data: Record<string, unknown>): boolean {
	const filled = (v: unknown) => typeof v === 'string' && v.trim() !== ''
	const pairs: [string, string][] = [['name', 'nameEn'], ['description', 'descriptionEn'], ['intro', 'introEn']]
	return pairs.every(([it, en]) => !filled(data[it]) || filled(data[en]))
}

function docToSeries(d: RawDoc, locale: Locale): Series {
	const data = d.data()
	const text = (it: unknown, en: unknown) =>
		it ? localize(String(it), en as string | undefined, locale) : undefined
	return {
		hasEnglish: isEnglishComplete(data),
		id: d.id,
		name: localize(String(data.name ?? ''), data.nameEn as string | undefined, locale),
		slug: String(data.slug ?? ''),
		description: text(data.description, data.descriptionEn),
		intro: text(data.intro, data.introEn),
		featuredArtworkId: data.featuredArtworkId ? String(data.featuredArtworkId) : undefined,
		order: data.order != null ? Number(data.order) : undefined,
		published: Boolean(data.published),
	}
}

// Never orderBy('order'): Firestore drops documents that lack the field. Sort client-side instead.
function sortSeries(items: Series[], locale: Locale): Series[] {
	return [...items].sort(
		(a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name, locale),
	)
}

export async function getPublishedSeries(locale: Locale = 'it'): Promise<Series[]> {
	let items: Series[]
	try {
		const raw = await cached('series', () =>
			loadDocs(SERIES_PREVIEW_ALL ? collection(db, 'series') : query(collection(db, 'series'), where('published', '==', true))),
		)
		items = raw.map((d) => docToSeries(d, locale))
	} catch (err) {
		console.error('[fetchContent] getPublishedSeries failed:', err)
		return []
	}
	assertUniqueSlugs('series', items)
	return sortSeries(items, locale)
}

export async function getSeriesBySlug(slug: string, locale: Locale = 'it'): Promise<Series | null> {
	const items = await getPublishedSeries(locale)
	return items.find((s) => s.slug === slug) ?? null
}

// A series' artworks in chronological order (year ascending; no year last), tie-broken by title
// (locale-aware) then slug so the order is stable between builds.
export function getSeriesArtworks(series: Series, allArtworks: Artwork[], locale: Locale = 'it'): Artwork[] {
	return allArtworks
		.filter((a) => a.seriesId === series.id)
		.sort(
			(a, b) =>
				(a.year || Infinity) - (b.year || Infinity) ||
				a.title.localeCompare(b.title, locale) ||
				a.slug.localeCompare(b.slug),
		)
}

// featuredArtworkId if that artwork is still in the series, otherwise the first one chronologically.
export function pickFeaturedArtwork(series: Series, sortedArtworks: Artwork[]): Artwork | undefined {
	return sortedArtworks.find((a) => a.id === series.featuredArtworkId) ?? sortedArtworks[0]
}

export interface SeriesWithArtworks {
	series: Series
	artworks: Artwork[]
	featured: Artwork | undefined
}

// Published series joined with their artworks. `listable` = at least one artwork: only those appear in
// lists, the sitemap and links; a published series with no artworks still gets a (noindex) page.
export async function getSeriesWithArtworks(locale: Locale = 'it'): Promise<SeriesWithArtworks[]> {
	const [series, allArtworks] = await Promise.all([getPublishedSeries(locale), getArtworks(locale)])
	return series.map((s) => {
		const artworks = getSeriesArtworks(s, allArtworks, locale)
		return { series: s, artworks, featured: pickFeaturedArtwork(s, artworks) }
	})
}

export async function getListableSeries(locale: Locale = 'it'): Promise<SeriesWithArtworks[]> {
	return (await getSeriesWithArtworks(locale)).filter((x) => x.artworks.length > 0)
}

// Same rule as getListableSeries (published AND ≥ 1 artwork), as one memoized boolean for BaseLayout,
// which renders on every page: drives the "Serie"/"Series" nav item.
export function hasListableSeries(): Promise<boolean> {
	return cached('hasListableSeries', async () => (await getListableSeries('it')).length > 0)
}

export async function getTechniques(locale: Locale = 'it'): Promise<Technique[]> {
	let items: Technique[]
	try {
		items = (await rawTechniques()).map((d) => {
			const data = d.data()
			return {
				id: d.id,
				name: localize(String(data.name ?? ''), data.nameEn as string | undefined, locale),
				slug: String(data.slug ?? ''),
				description: data.description
					? localize(String(data.description), data.descriptionEn as string | undefined, locale)
					: undefined,
				category: (data.category as Technique['category']) ?? 'other',
			} satisfies Technique
		})
	} catch (err) {
		console.error('[fetchContent] getTechniques failed:', err)
		return []
	}
	assertUniqueSlugs('techniques', items)
	return items
}

export async function getTechniqueBySlug(slug: string, locale: Locale = 'it'): Promise<Technique | null> {
	try {
		const d = (await rawTechniques()).find((x) => x.data().slug === slug)
		if (!d) return null
		const data = d.data()
		return {
			id: d.id,
			name: localize(String(data.name ?? ''), data.nameEn as string | undefined, locale),
			slug: String(data.slug ?? ''),
			description: data.description
				? localize(String(data.description), data.descriptionEn as string | undefined, locale)
				: undefined,
			category: (data.category as Technique['category']) ?? 'other',
		}
	} catch (err) {
		console.error('[fetchContent] getTechniqueBySlug failed:', err)
		return null
	}
}

export async function getPublishedContents(locale: Locale = 'it'): Promise<Content[]> {
	let items: Content[]
	try {
		items = (await rawContents()).map((d) => {
			const data = d.data()
			return {
				id: d.id,
				slug: String(data.slug ?? ''),
				title: localize(String(data.title ?? ''), data.titleEn as string | undefined, locale),
				body: localize(String(data.body ?? ''), data.bodyEn as string | undefined, locale),
				published: Boolean(data.published),
				image: data.image as Content['image'],
			} satisfies Content
		})
	} catch (err) {
		console.error('[fetchContent] getPublishedContents failed:', err)
		return []
	}
	assertUniqueSlugs('contents', items)
	return items
}

export async function getCategories(locale: Locale = 'it'): Promise<Category[]> {
	let items: Category[]
	try {
		items = (await rawCategories()).map((d) => {
			const data = d.data()
			return {
				id: d.id,
				name: localize(String(data.name ?? ''), data.nameEn as string | undefined, locale),
				slug: String(data.slug ?? ''),
				description: data.description
					? localize(String(data.description), data.descriptionEn as string | undefined, locale)
					: undefined,
				featuredArtworkId: data.featuredArtworkId ? String(data.featuredArtworkId) : undefined,
			} satisfies Category
		})
	} catch (err) {
		console.error('[fetchContent] getCategories failed:', err)
		return []
	}
	assertUniqueSlugs('categories', items)
	return items
}

export async function getContentBySlug(slug: string, locale: Locale = 'it'): Promise<Content | null> {
	try {
		const d = (await rawContents()).find((x) => x.data().slug === slug)
		if (!d) return null
		const data = d.data()
		return {
			id: d.id,
			slug: String(data.slug ?? ''),
			title: localize(String(data.title ?? ''), data.titleEn as string | undefined, locale),
			body: localize(String(data.body ?? ''), data.bodyEn as string | undefined, locale),
			published: Boolean(data.published),
			image: data.image as Content['image'],
		}
	} catch (err) {
		console.error('[fetchContent] getContentBySlug failed:', err)
		return null
	}
}
