// Local (non-Firebase) illustrative images for the process page and the homepage process
// section. Imported through Astro's asset pipeline so <Picture>/getImage() can generate
// responsive AVIF/WebP variants at build time. Alt texts live in i18n (`process.alt.*`).
import opening from '@/assets/process/processo-apertura.png'
import listening from '@/assets/process/ascolto.png'
import sketch from '@/assets/process/bozzetto.png'
import creation from '@/assets/process/realizzazione.png'
import delivery from '@/assets/process/consegna.png'
import portrait from '@/assets/process/ritratto.png'
import mural from '@/assets/process/murale.png'
import pyrography from '@/assets/process/pirografia.png'
import objects from '@/assets/process/oggettiartigianali.png'

export const processImages = {
	opening,
	listening,
	sketch,
	creation,
	delivery,
	portrait,
	mural,
	pyrography,
	objects,
}

// Index-aligned with `process.steps` in src/i18n/{it,en}.ts
export const stepImageKeys = ['listening', 'sketch', 'creation', 'delivery'] as const

// Slugs of the real artworks the illustrations are based on. Links are only rendered when the
// artwork is actually found at build time, so a renamed/deleted slug never produces a dead link.
export const PROCESS_ARTWORK_SLUGS = {
	steps: 'le-radici-del-futuro',
	portrait: 'ritratto-di-rino-gattuso',
	mural: 'cascata-su-vano-scale',
	pyrography: 'la-compagnia-dellanello',
} as const

// The objects card links to a whole category page rather than a single artwork.
export const PROCESS_CATEGORY_SLUGS = {
	objects: 'oggetti-artigianali',
} as const
