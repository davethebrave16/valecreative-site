export const en = {
	// Navigation
	nav: {
		home: 'Home',
		works: 'Works',
		series: 'Series',
		techniques: 'Techniques',
		about: 'Studio',
		contact: 'Contact',
		privacy: 'Privacy & cookies',
	},

	// Home page
	home: {
		eyebrow: 'Artist · Painter · Craftsperson',
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
		filterPersonal: 'Personal',
		filterCommissioned: 'Commissioned',
		countLabel: (n: number) => `${n} works`,
		countSuffix: 'works',
		categoryCount: (n: number) => `${n} works`,
		openCategory: 'Open gallery →',
		noWorksInCategory: 'No artworks in this category yet.',
		legendAvailable: 'Available',
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
			drawing: 'Drawing',
			photography: 'Photography',
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
		title: 'Get in touch',
		subtitle:
			'Questions, ideas, or a commission in mind — I\'d love to hear from you. Tell me what\'s on your mind and I\'ll reply personally.',
		form: {
			name: 'Full name',
			namePlaceholder: 'Your name',
			email: 'Email',
			emailPlaceholder: 'name@email.com',
			requestType: 'Request type',
			requestTypes: ['Commission', 'Art course', 'Information'],
			message: 'Message',
			messagePlaceholder: 'Describe your idea, subject, dimensions, timeline…',
			submit: 'Send request',
			submitting: 'Sending…',
			requiredError: 'This field is required.',
			emailInvalidError: 'Please enter a valid email address.',
		},
		success: {
			title: 'Thank you!',
			message: 'I\'ve received your request and will get back to you soon with details.',
			again: 'Send another request',
		},
		error: 'Something went wrong. Please try again.',
	},

	// Footer
	footer: {
		tagline: 'Art · Creation · Personalisation',
		copyright: (year: number) => `© ${year} Valentina Damiano — All rights reserved`,
	},

	// Per-page SEO meta descriptions
	meta: {
		homeDescription: 'Painter and engraver based in Pisa and Lucca, Tuscany. Dreamlike oil glazing, gold-leaf gilding, and engraving. Art commissions, thematic series, and courses.',
		worksDescription: 'Gallery of original paintings by Valentina Damiano: oil on canvas, mixed media, watercolour and engraving. Available for purchase, commission, and organised in thematic series.',
		seriesDescription: 'Thematic series by Valentina Damiano: collections of paintings united by subject, technique, or creative period. Forests, landscapes, and dreamlike visions.',
		techniquesDescription: 'Artistic techniques by Valentina Damiano: oil glazing, copper engraving, gold-leaf gilding, watercolour, and creative craft.',
		aboutDescription: 'Painter, engraver and art teacher trained at the Istituto Russoli and the Accademia di Belle Arti di Firenze. Discover Valentina Damiano\'s artistic journey in Pisa and Lucca, Tuscany.',
		contactDescription: 'Get in touch with Valentina Damiano for questions, bespoke artwork commissions, gold-leaf gilding, or personalised art courses. Studio in Pisa and Lucca, Tuscany.',
		privacyDescription: 'Privacy and cookie policy for Valentina Damiano\'s website: which data is processed and which analytics cookies are used.',
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

	// Cookie consent banner
	cookieConsent: {
		text: 'We use analytics cookies (Google Analytics) to understand how the site is used. You are free to accept or decline them.',
		learnMore: 'Learn more',
		accept: 'Accept',
		reject: 'Reject',
	},

	// Privacy / cookie policy page
	privacy: {
		eyebrow: 'Legal notice',
		title: 'Privacy & cookies',
		intro: 'This page describes how personal data is handled and which cookies are used while browsing this site.',
		sections: {
			controllerTitle: 'Data controller',
			controllerBody: 'The data controller is Valentina Damiano, an individual artist and craftsperson, who processes the data collected through this site. As no dedicated email address is published, any privacy-related request — including requests to exercise the rights described below — should be sent solely through the',
			controllerLinkLabel: 'contact page',

			purposesTitle: 'Purposes and legal basis for processing',
			purposesIntro: 'Data collected through this site is processed for the purposes and on the legal basis set out below, according to the type of data involved.',
			purposeFormsLabel: 'Data submitted through forms (contact and commission requests)',
			purposeFormsBody: 'Purpose: to respond to your enquiry and, where applicable, to manage the commission you\'ve requested. Legal basis: performance of pre-contractual steps taken at your request (Art. 6.1.b GDPR), triggered by voluntarily submitting the form.',
			purposeAnalyticsLabel: 'Aggregated browsing data (Google Analytics 4)',
			purposeAnalyticsBody: 'Purpose: to understand, in aggregate form, how the site is used, in order to improve it. Legal basis: your consent (Art. 6.1.a GDPR), collected via the cookie banner and revocable at any time without affecting the lawfulness of processing carried out beforehand.',
			purposeRecaptchaLabel: 'Technical data (Google reCAPTCHA v3)',
			purposeRecaptchaBody: 'Purpose: to protect the commission request form from automated submissions, spam, and abuse. Legal basis: the controller\'s legitimate interest in the security of the site and fraud prevention (Art. 6.1.f GDPR).',

			cookiesTitle: 'Cookies used',
			cookiesIntro: 'This site uses the following categories of cookies:',
			cookiesNecessaryLabel: 'Necessary',
			cookiesNecessaryBody: 'Google reCAPTCHA v3, used to protect the contact form from spam. Always active — no consent is required as it is strictly necessary for the form to function.',
			cookiesAnalyticsLabel: 'Analytics (optional)',
			cookiesAnalyticsBody: 'Google Analytics 4, used in aggregated form to understand how visitors use the site. It is only activated after consent is given via the cookie banner.',

			cookieTableTitle: 'Detailed cookie list',
			cookieTableIntro: 'The table below summarises the individual cookies this site sets.',
			cookieTableColName: 'Name',
			cookieTableColProvider: 'Provider',
			cookieTableColPurpose: 'Purpose',
			cookieTableColDuration: 'Duration',
			cookieTableColConsent: 'Consent',
			cookieTableConsentRequired: 'Required',
			cookieTableConsentNotRequired: 'Not required',
			cookieTableGaPurpose: 'Distinguishes users for aggregated statistical analysis',
			cookieTableGaDuration: 'Around 2 years (Google Analytics 4\'s default value)',
			cookieTableRecaptchaName: 'reCAPTCHA cookie (e.g. _GRECAPTCHA)',
			cookieTableRecaptchaPurpose: 'Distinguishes genuine human traffic from automated/bot traffic on the commission form',
			cookieTableRecaptchaDuration: 'No exact duration is published by Google; typically a few months',
			cookieTableNote: 'Alongside the cookies listed above, the site stores two technical values in the browser\'s localStorage (not cookies in the technical sense — they are never sent to the server): your chosen language (\'vd-locale\') and your cookie preference (\'vd-cookie-consent\'). Both stay on your device only, until you clear your browsing data.',

			retentionTitle: 'Data retention periods',
			retentionFormsLabel: 'Form data (contact and commissions)',
			retentionFormsBody: 'Data submitted through the site\'s forms is retained for as long as needed to handle the request and any resulting relationship with the client. There is no automatic deletion deadline: the data is reviewed periodically and deleted upon request, or in any case once it is no longer needed for the purposes it was collected for, unless a longer retention period is required by law.',
			retentionAnalyticsLabel: 'Google Analytics data',
			retentionAnalyticsBody: 'User-level and event-level data collected through Google Analytics 4 is retained for 2 months, Google Analytics 4\'s default retention period (adjustable by the controller up to a maximum of 14 months in Analytics Admin → Data Settings → Data Retention). Aggregated report data is not subject to this limit.',

			transferTitle: 'International data transfers',
			transferBody: 'Google Analytics 4 and Google reCAPTCHA are provided by Google LLC, based in the United States. Any transfer of data to the US relies on the safeguards Google has in place, including its participation in the EU-US Data Privacy Framework and/or the use of Standard Contractual Clauses approved by the European Commission. See Google\'s own privacy policy, linked below, for further detail.',

			rightsTitle: 'Your rights',
			rightsIntro: 'As a data subject, you may request the following at any time, within the limits and conditions set out in Articles 15-21 of the GDPR:',
			rightsList: [
				'Access to your personal data',
				'Rectification of inaccurate or incomplete data',
				'Erasure of your data ("right to be forgotten")',
				'Restriction of processing',
				'Portability of your data in a structured format',
				'Objection to processing',
				'Withdrawal of consent at any time, without affecting the lawfulness of processing carried out before the withdrawal',
			],
			rightsOutro: 'To exercise any of these rights, get in touch via the',
			rightsLinkLabel: 'contact page',

			complaintTitle: 'Right to lodge a complaint',
			complaintBody: 'If you believe the processing of your data breaches applicable law, you have the right to lodge a complaint with the Italian data protection authority (Garante per la protezione dei dati personali), whose website is',
			complaintLinkLabel: 'garanteprivacy.it',

			manageTitle: 'Manage your preferences',
			manageBody: 'You can change your choice at any time and bring back the cookie banner.',
			manageButton: 'Manage cookie preferences',
			externalTitle: 'Third-party notices',
			externalBody: 'For more details on data handled by Google, see the',
			externalLink: 'Google Privacy Policy',

			updatedTitle: 'Changes to this notice',
			updatedBody: 'This notice may be updated from time to time — for example, if the services used by the site change, or if applicable law changes. We recommend checking back periodically.',
			lastUpdatedLabel: 'Last updated',
			lastUpdatedValue: '12 July 2026',
		},
	},
} as const
