// Cross-project contract with valecreative-admin-backoffice.
// Field names and enum values MUST stay identical to src/types/resources.ts in the backoffice.
// Optional `*En` fields are English translations, flat-suffixed on the Italian field they mirror
// (titleEn, descriptionEn, nameEn, bodyEn, captionEn). fetchContent.ts resolves them via localize()
// and falls back to the Italian value when empty — see src/i18n/utils.ts.

export interface ImageObject {
	original: string
	thumb?: string
	medium?: string
	alt?: string
	width?: number
	height?: number
	blurHash?: string
	uploadedAt?: string | number
}

export type TechniqueCategory = 'painting' | 'engraving' | 'craft' | 'drawing' | 'photography' | 'other'

export interface Technique {
	id: string
	name: string
	nameEn?: string
	slug: string
	description?: string
	descriptionEn?: string
	category: TechniqueCategory
}

export interface Series {
	id: string
	name: string
	slug: string
	description?: string
	coverImage?: ImageObject
	order?: number
	published: boolean
}

export type ArtworkOrigin = 'personal' | 'commissioned'
export type ArtworkAvailability = 'for_sale' | 'sold' | 'not_for_sale'

export interface ArtworkDimensions {
	height?: number
	width?: number
	unit?: string
}

export interface Category {
	id: string
	name: string
	nameEn?: string
	slug: string
}

export interface Artwork {
	id: string
	title: string
	titleEn?: string
	slug: string
	year: number
	techniqueId: string
	seriesId?: string
	categoryIds?: string[]
	coverImage?: ImageObject
	origin: ArtworkOrigin
	availability: ArtworkAvailability
	price?: number
	featured: boolean
	isHero: boolean
	isIntro: boolean
	dimensions?: ArtworkDimensions
	support?: string
	description?: string
	descriptionEn?: string
	galleryPosition?: number
	featuredPosition?: number
}

export interface GalleryImage {
	id: string
	original: string
	thumb?: string
	medium?: string
	alt?: string
	width?: number
	height?: number
	blurHash?: string
	caption?: string
	captionEn?: string
	order?: number
	imagePosition?: number
	uploadedAt?: string | number
}

export interface Content {
	id: string
	slug: string
	title: string
	titleEn?: string
	body: string
	bodyEn?: string
	published: boolean
	image?: ImageObject
}

export type CommissionStatus = 'new' | 'in_progress' | 'completed' | 'declined'

export interface Commission {
	clientName: string
	email: string
	phone?: string
	description: string
	estimatedBudget?: number
	status: CommissionStatus
	requestedAt: unknown
	notes?: string
}
