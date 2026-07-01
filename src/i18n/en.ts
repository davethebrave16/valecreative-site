export const en = {
	// Navigation
	nav: {
		home: 'Home',
		works: 'Works',
		series: 'Series',
		techniques: 'Techniques',
		about: 'Studio',
		commissions: 'Commissions',
	},

	// Home page
	home: {
		eyebrow: 'Painter · Craftsperson · Teacher',
		heroTitle: 'The forest as mirror of the soul',
		heroSubtitle:
			'Dreamlike landscapes woven from Leonardesque glazing, engraved marks, and gold leaf. A painterly inquiry rooted in the Tuscan landscape, between Pisa and Lucca.',
		ctaWorks: 'Explore works',
		ctaCommission: 'Request a commission',
		featuredEyebrow: 'Selection',
		featuredTitle: 'Featured works',
		featuredLink: 'All works →',
		bandEyebrow: 'The studio',
		bandQuote:
			'"Nature is not a backdrop — it is a mirror. The trees I paint are a projection of myself."',
		bandText:
			'Trained at the Istituto d\'Arte «F. Russoli» and the Accademia di Belle Arti di Firenze, I weave classical glazing with engraved marks and gold-leaf gilding. I paint, engrave, teach.',
		bandLink: 'Read the story →',
		seriesTitle: 'Thematic series',
		seriesLink: 'All series →',
		seriesCount: (n: number) => `${n} works`,
	},

	// Works / gallery
	works: {
		eyebrow: 'Gallery',
		title: 'Works',
		subtitle: 'Paintings on canvas and board, various formats and orientations.',
		filterAll: 'All',
		filterPersonal: 'Personal',
		filterCommissioned: 'Commissioned',
		countLabel: (n: number) => `${n} works`,
		countSuffix: 'works',
		legendAvailable: 'Available',
		legendRequest: 'On request',
		legendSold: 'Sold / unavailable',
		empty: 'No works published yet.',
		backLink: '← All works',
		requestInfo: 'Request information',
		prevWork: '← Previous',
		nextWork: 'Next →',
		availability: {
			for_sale: 'Available',
			sold: 'Sold',
			not_for_sale: 'Unavailable',
		} as Record<string, string>,
		orientation: {
			portrait: '[ portrait ]',
			landscape: '[ landscape ]',
			square: '[ square ]',
		} as Record<string, string>,
	},

	// Series
	series: {
		eyebrow: 'Collections',
		title: 'Thematic series',
		empty: 'No series published yet.',
		openLink: 'Open series →',
		worksCount: (n: number) => `${n} works`,
		backLink: '← All series',
		seriesWorks: 'Works in this series',
		noWorks: 'No works in this series yet.',
	},

	// Techniques
	techniques: {
		eyebrow: 'Craft',
		title: 'Techniques',
		subtitle:
			'A practice spanning painting, engraving, and craft — from canvas to copper, from glass to wood.',
		empty: 'No techniques listed yet.',
		backLink: '← All techniques',
		relatedWorks: 'Works using this technique',
		noWorks: 'No works using this technique yet.',
		category: {
			painting: 'Painting',
			engraving: 'Engraving',
			craft: 'Craft',
			other: 'Other',
		} as Record<string, string>,
	},

	// About / Studio
	about: {
		eyebrow: 'About',
		titleLine1: 'I paint, engrave,',
		titleLine2: 'teach',
		chips: ['Painter', 'Craftsperson', 'Art teacher'],
		quote: '"Nature is not a backdrop — it is a mirror."',
		cta: 'Get in touch →',
		statsLabels: {
			born: 'Born',
			location: 'Base',
			education: 'Education',
		},
		statsValues: {
			born: 'Pisa, 1989',
			location: 'Pisa · Lucca',
			education: 'Ist. Russoli · Accademia Firenze',
		},
		placeholder: '[ portrait · valentina ]',
	},

	// Commissions form (Contact)
	commissions: {
		eyebrow: 'Contact',
		title: 'Request a commission',
		subtitle:
			'For bespoke artworks, gilding, engravings, or art courses. Tell me your idea — I\'ll reply personally.',
		contactLabels: {
			email: 'Email',
			atelier: 'Atelier',
			instagram: 'Instagram',
		},
		contactValues: {
			email: 'studio@valentinadamiano.it',
			atelier: 'Pisa · Lucca, Tuscany',
			instagram: '@valentinadamiano.creazioni',
		},
		form: {
			name: 'Full name',
			namePlaceholder: 'Your name',
			email: 'Email',
			emailPlaceholder: 'name@email.com',
			requestType: 'Request type',
			requestTypes: ['Commission', 'Gilding', 'Art course', 'Information'],
			message: 'Message',
			messagePlaceholder: 'Describe your idea, subject, dimensions, timeline…',
			submit: 'Send request',
			submitting: 'Sending…',
		},
		success: {
			title: 'Thank you!',
			message: 'I\'ve received your request and will get back to you soon with details.',
			again: 'Send another request',
		},
		error: 'Something went wrong. Please try again.',
	},

	// Contact
	contact: {
		title: 'Contact',
		intro: 'Have a question or just want to say hello? Use the form below.',
	},

	// Footer
	footer: {
		tagline: 'Creations · Pisa · Lucca',
		copyright: (year: number) => `© ${year} Valentina Damiano — All rights reserved`,
	},

	// Per-page SEO meta descriptions
	meta: {
		homeDescription: 'Painter and engraver based in Pisa and Lucca, Tuscany. Dreamlike oil glazing, gold-leaf gilding, and engraving. Art commissions, thematic series, and courses.',
		worksDescription: 'Gallery of original paintings by Valentina Damiano: oil on canvas, mixed media, watercolour and engraving. Available for purchase, commission, and organised in thematic series.',
		seriesDescription: 'Thematic series by Valentina Damiano: collections of paintings united by subject, technique, or creative period. Forests, landscapes, and dreamlike visions.',
		techniquesDescription: 'Artistic techniques by Valentina Damiano: oil glazing, copper engraving, gold-leaf gilding, watercolour, and creative craft.',
		aboutDescription: 'Painter, engraver and art teacher trained at the Istituto Russoli and the Accademia di Belle Arti di Firenze. Discover Valentina Damiano\'s artistic journey in Pisa and Lucca, Tuscany.',
		commissionsDescription: 'Commission a bespoke artwork by Valentina Damiano: portraits, landscapes, gold-leaf gilding, personalised art courses. Studio in Pisa and Lucca, Tuscany.',
	},

	// Artwork detail meta labels
	artworkMeta: {
		technique: 'Technique',
		dimensions: 'Dimensions',
		categories: 'Categories',
		series: 'Series',
		availability: 'Availability',
		support: 'Support',
		year: 'Year',
	},

	// Image lightbox controls
	lightbox: {
		close: 'Close',
		next: 'Next image',
		previous: 'Previous image',
		open: 'Enlarge image',
	},
} as const
