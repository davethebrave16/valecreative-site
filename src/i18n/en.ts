export const en = {
	// Navigation
	nav: {
		home: 'Home',
		works: 'Works',
		process: 'How I work',
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
			'Dreamlike landscapes woven from Leonardesque glazing and engraved marks, born of the Tuscan countryside between Pisa and Lucca.',
		heroOffer:
			'On commission: portraits, murals, paintings and personalised objects.',
		ctaWorks: 'Explore works',
		ctaCommission: 'Request a commission',
		featuredEyebrow: 'Selection',
		featuredTitle: 'Featured works',
		featuredLink: 'All works →',
		processEyebrow: 'Process',
		processCtaMore: 'See how I work',
		bandEyebrow: 'The studio',
		bandQuote:
			'"Nature is not a backdrop — it is a mirror. The trees I paint are a projection of myself."',
		bandText:
			'Trained at the Istituto d\'Arte «F. Russoli» and the Accademia di Belle Arti di Firenze, I weave classical glazing with engraved marks. I paint, engrave, teach.',
		bandLink: 'Read the story →',
		seriesTitle: 'Thematic series',
		seriesLink: 'All series →',
		seriesCount: (n: number) => `${n} works`,
	},

	// Works / gallery
	works: {
		eyebrow: 'Gallery',
		title: 'Works',
		subtitle: 'Paintings, drawings, prints and personalised objects, original and made to order.',
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

	// Process / how I work
	process: {
		eyebrow: 'How I work',
		title: 'How a bespoke artwork comes to life',
		intro:
			'Every commission is a conversation. From the first story you tell me to the day the piece arrives, I\'ll walk with you step by step, with the time and care that handmade work deserves.',
		stepsLead: 'In these images, ',
		stepsLeadSuffix: ' takes shape',
		quote: (title: string) => `“${title}”`,
		steps: [
			{
				num: '01',
				title: 'Listening',
				text: 'Every piece begins with a conversation. For a portrait, I\'ll ask for a few photographs of the subject, ideally in natural light and from different angles, so we have room to choose. For a mural, I take the measurements and note the character of the wall. For a free theme, I gather your idea. Or, if you\'d rather give me carte blanche, I do my research and find the right path myself.',
				short: 'Tell me your idea and send me photos or measurements.',
			},
			{
				num: '02',
				title: 'Sketch',
				text: 'I turn your request into a preparatory drawing: sketches, choices of style and a colour palette. Together we choose the sketch to start from. For murals, I adapt the proportions to the wall and prepare the transfer using the traditional pouncing technique (spolvero).',
				short: 'Together we choose the preparatory drawing.',
			},
			{
				num: '03',
				title: 'Creation',
				text: 'If the support isn\'t ready yet, I make it myself: I build the stretcher and prime the canvas or panel with a traditional gesso-and-glue ground. Then I work in whichever technique best suits the idea: oil on wood, for its brilliance and longevity; oil or acrylic on canvas; or pyrography on raw wood.',
				short: 'I prepare the support and create the piece in the studio.',
			},
			{
				num: '04',
				title: 'Delivery',
				text: 'The final touches, a protective finish where needed, and the piece is ready to begin its life in your home.',
				short: 'The finished piece arrives in your home.',
			},
		],
		pathsTitle: 'Every commission is different',
		pathsIntro: 'You\'ve just watched the painting come to life above. Here are the other paths a commission can take.',
		paths: {
			portrait: {
				title: 'Portrait',
				text: 'I start from the photos you send me, choose the format with you and paint the portrait in the studio, in oil or acrylic, on canvas or panel. Portraits of your animals, too.',
			},
			mural: {
				title: 'Mural',
				text: 'I adapt the image to the proportions of the wall, transfer it with the pouncing technique and paint it with colours made for walls.',
			},
			pyrography: {
				title: 'Pyrography',
				text: 'I transfer the drawing onto raw wood, which I can also cut to shape, and engrave it with fire. Depth and nuance come from the mark itself, from light and shade, and from lighter or darker wood stains, not from colour. A glossy finish protects the panel.',
			},
			objects: {
				title: 'Personalised objects',
				text: 'A name, a crest, a dedication: I turn everyday objects into one-of-a-kind pieces by embossing copper, engraving glass or pyrographing wood. Boxes, frames, glasses, keyrings and wedding favours: gifts that carry a story with them.',
			},
		},
		seeWork: (title: string) => `See “${title}” →`,
		ctaTitle: 'Have an idea? Tell me about it.',
		ctaWorks: 'See the works',
		pageTitle: 'How I work: commissioned artworks',
		alt: {
			opening: 'Valentina in her studio at a worktable covered in photos and sketches, with a portrait in progress on the easel and “The roots of the future” and pyrographs leaning against the walls.',
			listening: 'Hands sorting photos of an ancient tree, a stone bridge and cliffs beside a notebook of handwritten notes: the references for “The roots of the future”.',
			sketch: 'Pencil sketch of a tree by a river with an arched bridge, beside a watercolour study and swatches of the colour palette.',
			creation: 'The painter working in oils on the tree\'s roots on an easel canvas, with the top of the composition still only drawn.',
			delivery: 'The finished, framed “The roots of the future” resting on a wooden bench in a sunlit room.',
			portrait: 'An oil portrait of Rino Gattuso in progress on the easel, the brush on his dark shirt and the palette in the foreground.',
			mural: 'The painter at work on a waterfall-and-jungle mural along a stairwell, with the pounced outline still visible on the left.',
			pyrography: 'A hand burning “La compagnia dell\'anello”, a landscape with a bridge and village, into a raw wooden panel with a pyrography pen.',
			objects: 'Hands embossing a butterfly into a copper sheet, surrounded by a box with an embossed copper lid, an engraved wine glass, and pyrographed wooden keyrings and a small box.',
		},
	},

	// Commissions form (Contact)
	commissions: {
		eyebrow: 'Contact',
		title: 'Get in touch',
		subtitle:
			'Questions, ideas, or a commissioned piece in mind — I\'d love to hear from you. Tell me what you\'re imagining and I\'ll reply personally within 48 hours with a proposal shaped around you, no strings attached.',
		processLinkLead: 'Curious how I work?',
		processLinkLabel: 'Discover the process →',
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
		recaptchaUnavailable: 'The security check could not be loaded (it may be blocked by an ad blocker). Disable it for this site and try again, or email me directly at studio@valentinadamiano.it.',
	},

	// Footer
	footer: {
		tagline: 'Art · Creation · Personalisation',
		copyright: (year: number) => `© ${year} Valentina Damiano — All rights reserved`,
	},

	// Per-page SEO meta descriptions
	meta: {
		homeDescription: 'Artist and painter based between Pisa and Lucca: oil paintings, commissioned portraits and prints, plus personalised handmade gifts.',
		worksDescription: 'Original and commissioned works: landscapes, portraits, animals, drawings, prints and personalised handmade gifts.',
		seriesDescription: 'Thematic series by Valentina Damiano: collections of paintings united by subject, technique, or creative period. Forests, landscapes, and dreamlike visions.',
		techniquesDescription: 'Oil and watercolour painting, drawing, printmaking, wood pyrography and copper repoussé: techniques for original works and personalised commissions.',
		processDescription: 'How a commissioned artwork by Valentina Damiano comes to life: listening, sketch, painting and delivery. Bespoke portraits, murals and pyrography from Pisa and Lucca, Tuscany.',
		aboutDescription: 'Painter, engraver and art teacher trained at the Istituto Russoli and the Accademia di Belle Arti di Firenze. Discover Valentina Damiano\'s artistic journey in Pisa and Lucca, Tuscany.',
		contactDescription: 'Get in touch with Valentina Damiano for questions, commissioned artworks, personalised objects or tailored art courses. Studio in Pisa and Lucca, Tuscany.',
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
		text: 'With your consent we use Google Analytics, to understand how the site is used, and the Meta Pixel, to measure the results of our activity on Facebook and Instagram. Without consent neither is activated.',
		learnMore: 'Learn more',
		accept: 'Accept',
		reject: 'Reject',
		customize: 'Customize',
		save: 'Save preferences',
		statisticsLabel: 'Statistics (Google Analytics)',
		statisticsDescription: 'Help us understand, in aggregate, how the site is used.',
		marketingLabel: 'Marketing (Meta Pixel)',
		marketingDescription: 'Measure the results of our activity on Facebook and Instagram.',
		preferences: 'Cookie preferences',
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
