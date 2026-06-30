// Cross-project contract with valecreative-admin-backoffice.
// Field names and enum values MUST stay identical to src/types/resources.ts in the backoffice.

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

export type TechniqueCategory = 'painting' | 'engraving' | 'craft' | 'other'

export interface Technique {
	id: string
	name: string
	slug: string
	description?: string
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

export interface Artwork {
	id: string
	title: string
	slug: string
	year: number
	techniqueId: string
	seriesId?: string
	coverImage?: ImageObject
	origin: ArtworkOrigin
	availability: ArtworkAvailability
	price?: number
	featured: boolean
	dimensions?: ArtworkDimensions
	support?: string
	description?: string
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
	order?: number
	uploadedAt?: string | number
}

export interface Content {
	id: string
	slug: string
	title: string
	body: string
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
