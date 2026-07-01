// Build-time only — called from Astro page frontmatter and getStaticPaths().
// Never import this from React components (those run in the browser).

import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
} from 'firebase/firestore'
import { db } from './firebaseConfig'
import type { Artwork, Category, GalleryImage, Series, Technique, Content } from './types'

function docToArtwork(d: { id: string; data: () => Record<string, unknown> }): Artwork {
	const data = d.data()
	return {
		id: d.id,
		title: String(data.title ?? ''),
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
		dimensions: data.dimensions as Artwork['dimensions'],
		support: data.support ? String(data.support) : undefined,
		description: data.description ? String(data.description) : undefined,
	}
}

export async function getArtworks(): Promise<Artwork[]> {
	try {
		const snap = await getDocs(query(collection(db, 'artworks'), orderBy('createdAt', 'desc')))
		return snap.docs.map(docToArtwork)
	} catch (err) {
		console.error('[fetchContent] getArtworks failed:', err)
		return []
	}
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
	try {
		const snap = await getDocs(query(collection(db, 'artworks'), where('slug', '==', slug)))
		if (snap.empty) return null
		const d = snap.docs[0]
		return docToArtwork(d)
	} catch (err) {
		console.error('[fetchContent] getArtworkBySlug failed:', err)
		return null
	}
}

export async function getArtworkGallery(artworkId: string): Promise<GalleryImage[]> {
	try {
		const snap = await getDocs(
			query(collection(db, `artworks/${artworkId}/gallery`), orderBy('uploadedAt', 'asc')),
		)
		return snap.docs.map((d) => {
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
				caption: data.caption ? String(data.caption) : undefined,
				order: data.order != null ? Number(data.order) : undefined,
			} satisfies GalleryImage
		})
	} catch (err) {
		console.error('[fetchContent] getArtworkGallery failed:', err)
		return []
	}
}

export async function getPublishedSeries(): Promise<Series[]> {
	try {
		const snap = await getDocs(
			query(
				collection(db, 'series'),
				where('published', '==', true),
				orderBy('order', 'asc'),
			),
		)
		return snap.docs.map((d) => {
			const data = d.data()
			return {
				id: d.id,
				name: String(data.name ?? ''),
				slug: String(data.slug ?? ''),
				description: data.description ? String(data.description) : undefined,
				coverImage: data.coverImage as Series['coverImage'],
				order: data.order != null ? Number(data.order) : undefined,
				published: Boolean(data.published),
			} satisfies Series
		})
	} catch (err) {
		console.error('[fetchContent] getPublishedSeries failed:', err)
		return []
	}
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
	try {
		const snap = await getDocs(query(collection(db, 'series'), where('slug', '==', slug)))
		if (snap.empty) return null
		const d = snap.docs[0]
		const data = d.data()
		return {
			id: d.id,
			name: String(data.name ?? ''),
			slug: String(data.slug ?? ''),
			description: data.description ? String(data.description) : undefined,
			coverImage: data.coverImage as Series['coverImage'],
			order: data.order != null ? Number(data.order) : undefined,
			published: Boolean(data.published),
		}
	} catch (err) {
		console.error('[fetchContent] getSeriesBySlug failed:', err)
		return null
	}
}

export async function getTechniques(): Promise<Technique[]> {
	try {
		const snap = await getDocs(query(collection(db, 'techniques'), orderBy('name', 'asc')))
		return snap.docs.map((d) => {
			const data = d.data()
			return {
				id: d.id,
				name: String(data.name ?? ''),
				slug: String(data.slug ?? ''),
				description: data.description ? String(data.description) : undefined,
				category: (data.category as Technique['category']) ?? 'other',
			} satisfies Technique
		})
	} catch (err) {
		console.error('[fetchContent] getTechniques failed:', err)
		return []
	}
}

export async function getTechniqueBySlug(slug: string): Promise<Technique | null> {
	try {
		const snap = await getDocs(query(collection(db, 'techniques'), where('slug', '==', slug)))
		if (snap.empty) return null
		const d = snap.docs[0]
		const data = d.data()
		return {
			id: d.id,
			name: String(data.name ?? ''),
			slug: String(data.slug ?? ''),
			description: data.description ? String(data.description) : undefined,
			category: (data.category as Technique['category']) ?? 'other',
		}
	} catch (err) {
		console.error('[fetchContent] getTechniqueBySlug failed:', err)
		return null
	}
}

export async function getPublishedContents(): Promise<Content[]> {
	try {
		const snap = await getDocs(
			query(collection(db, 'contents'), where('published', '==', true)),
		)
		return snap.docs.map((d) => {
			const data = d.data()
			return {
				id: d.id,
				slug: String(data.slug ?? ''),
				title: String(data.title ?? ''),
				body: String(data.body ?? ''),
				published: Boolean(data.published),
				image: data.image as Content['image'],
			} satisfies Content
		})
	} catch (err) {
		console.error('[fetchContent] getPublishedContents failed:', err)
		return []
	}
}

export async function getCategories(): Promise<Category[]> {
	try {
		const snap = await getDocs(query(collection(db, 'categories'), orderBy('name', 'asc')))
		return snap.docs.map((d) => {
			const data = d.data()
			return {
				id: d.id,
				name: String(data.name ?? ''),
				slug: String(data.slug ?? ''),
			} satisfies Category
		})
	} catch (err) {
		console.error('[fetchContent] getCategories failed:', err)
		return []
	}
}

export async function getContentBySlug(slug: string): Promise<Content | null> {
	try {
		const snap = await getDocs(
			query(collection(db, 'contents'), where('slug', '==', slug), where('published', '==', true)),
		)
		if (snap.empty) return null
		const d = snap.docs[0]
		const data = d.data()
		return {
			id: d.id,
			slug: String(data.slug ?? ''),
			title: String(data.title ?? ''),
			body: String(data.body ?? ''),
			published: Boolean(data.published),
			image: data.image as Content['image'],
		}
	} catch (err) {
		console.error('[fetchContent] getContentBySlug failed:', err)
		return null
	}
}
