export const it = {
	// Navigation
	nav: {
		home: 'Home',
		works: 'Opere',
		series: 'Serie',
		techniques: 'Tecniche',
		about: 'Studio',
		commissions: 'Commissioni',
	},

	// Home page
	home: {
		eyebrow: 'Pittrice · Artigiana · Insegnante',
		heroTitle: 'Il bosco come specchio dell\'anima',
		heroSubtitle:
			'Paesaggi onirici tra velature leonardesche, segno inciso e foglia oro. Una ricerca pittorica radicata nella natura toscana, tra Pisa e Lucca.',
		ctaWorks: 'Esplora le opere',
		ctaCommission: 'Richiedi una commissione',
		featuredEyebrow: 'Selezione',
		featuredTitle: 'Opere in evidenza',
		featuredLink: 'Tutte le opere →',
		bandEyebrow: 'Lo studio',
		bandQuote:
			'«La natura non è uno sfondo: è uno specchio. Gli alberi che dipingo sono una proiezione di me stessa.»',
		bandText:
			'Formata all\'Istituto d\'Arte «F. Russoli» e all\'Accademia di Belle Arti di Firenze, intreccio la pittura classica a velature con il segno inciso e la doratura a foglia oro. Dipingo, incido, insegno.',
		bandLink: 'Conosci la storia →',
		seriesTitle: 'Serie tematiche',
		seriesLink: 'Tutte le serie →',
		seriesCount: (n: number) => `${n} opere`,
	},

	// Works / gallery
	works: {
		eyebrow: 'Galleria',
		title: 'Opere',
		subtitle:
			'Dipinti su tela e tavola di formati e orientamenti diversi.',
		filterAll: 'Tutte',
		filterPersonal: 'Personali',
		filterCommissioned: 'Commissionate',
		countLabel: (n: number) => `${n} opere`,
		countSuffix: 'opere',
		legendAvailable: 'Disponibile',
		legendRequest: 'Su richiesta',
		legendSold: 'Venduto / non disp.',
		empty: 'Nessuna opera pubblicata ancora.',
		backLink: '← Tutte le opere',
		requestInfo: 'Richiedi informazioni',
		prevWork: '← Precedente',
		nextWork: 'Successiva →',
		availability: {
			for_sale: 'Disponibile',
			sold: 'Venduto',
			not_for_sale: 'Non disponibile',
		} as Record<string, string>,
		orientation: {
			portrait: '[ ritratto ]',
			landscape: '[ paesaggio ]',
			square: '[ quadrato ]',
		} as Record<string, string>,
	},

	// Series
	series: {
		eyebrow: 'Raccolte',
		title: 'Serie tematiche',
		empty: 'Nessuna serie pubblicata ancora.',
		openLink: 'Apri la serie →',
		worksCount: (n: number) => `${n} opere`,
		backLink: '← Tutte le serie',
		seriesWorks: 'Opere della serie',
		noWorks: 'Nessuna opera in questa serie ancora.',
	},

	// Techniques
	techniques: {
		eyebrow: 'Mestiere',
		title: 'Tecniche',
		subtitle:
			'Una pratica che attraversa pittura, incisione e artigianato — dalla tela al rame, dal vetro al legno.',
		empty: 'Nessuna tecnica elencata ancora.',
		backLink: '← Tutte le tecniche',
		relatedWorks: 'Opere con questa tecnica',
		noWorks: 'Nessuna opera con questa tecnica ancora.',
		category: {
			painting: 'Pittura',
			engraving: 'Incisione',
			craft: 'Artigianato',
			other: 'Altro',
		} as Record<string, string>,
	},

	// About / Studio
	about: {
		eyebrow: 'Chi sono',
		titleLine1: 'Dipingo, incido,',
		titleLine2: 'insegno',
		chips: ['Pittrice', 'Artigiana', 'Insegnante d\'arte'],
		quote: '«La natura non è uno sfondo: è uno specchio.»',
		cta: 'Mettiti in contatto →',
		statsLabels: {
			born: 'Nata',
			location: 'Sede',
			education: 'Formazione',
		},
		statsValues: {
			born: 'Pisa, 1989',
			location: 'Pisa · Lucca',
			education: 'Ist. Russoli · Accademia Firenze',
		},
		placeholder: '[ ritratto · valentina ]',
	},

	// Commissions form (Contatti)
	commissions: {
		eyebrow: 'Contatti',
		title: 'Richiedi una commissione',
		subtitle:
			'Per opere su misura, doratura, incisioni o corsi d\'arte. Raccontami la tua idea: ti risponderò personalmente.',
		form: {
			name: 'Nome e cognome',
			namePlaceholder: 'Il tuo nome',
			email: 'Email',
			emailPlaceholder: 'nome@email.it',
			requestType: 'Tipo di richiesta',
			requestTypes: ['Commissione', 'Doratura', 'Corso d\'arte', 'Informazioni'],
			message: 'Messaggio',
			messagePlaceholder: 'Descrivi la tua idea, soggetto, dimensioni, tempi…',
			submit: 'Invia la richiesta',
			submitting: 'Invio…',
		},
		success: {
			title: 'Grazie!',
			message: 'Ho ricevuto la tua richiesta. Ti risponderò al più presto con i dettagli.',
			again: 'Invia un\'altra richiesta',
		},
		error: 'Qualcosa è andato storto. Riprova.',
	},

	// Contact
	contact: {
		title: 'Contatti',
		intro: 'Hai una domanda o vuoi semplicemente salutare? Usa il modulo qui sotto.',
	},

	// Footer
	footer: {
		tagline: 'Creazioni · Pisa · Lucca',
		copyright: (year: number) => `© ${year} Valentina Damiano — Tutti i diritti riservati`,
	},

	// Per-page SEO meta descriptions
	meta: {
		homeDescription: 'Pittrice e incisore a Pisa e Lucca. Paesaggi onirici con velature a olio, foglia oro e incisione. Commissioni, serie tematiche e corsi d\'arte in Toscana.',
		worksDescription: 'Galleria di dipinti originali di Valentina Damiano: olio su tela, tecnica mista, acquerello e incisione. Opere disponibili all\'acquisto, su commissione e in serie tematiche.',
		seriesDescription: 'Le serie tematiche di Valentina Damiano: raccolte di dipinti unite da soggetto, tecnica o periodo creativo. Boschi, paesaggi e visioni oniriche.',
		techniquesDescription: 'Le tecniche artistiche di Valentina Damiano: pittura a olio con velature, incisione su rame, doratura a foglia oro, acquerello e artigianato creativo.',
		aboutDescription: 'Pittrice, incisore e insegnante d\'arte formata all\'Istituto Russoli e all\'Accademia di Belle Arti di Firenze. Scopri il percorso artistico di Valentina Damiano a Pisa e Lucca.',
		commissionsDescription: 'Richiedi una commissione pittorica a Valentina Damiano: ritratti, paesaggi, doratura a foglia oro, corsi d\'arte personalizzati. Studio a Pisa e Lucca.',
	},

	// Artwork detail meta labels
	artworkMeta: {
		technique: 'Tecnica',
		dimensions: 'Dimensioni',
		categories: 'Categorie',
		series: 'Serie',
		availability: 'Disponibilità',
		support: 'Supporto',
		year: 'Anno',
	},

	// Image lightbox controls
	lightbox: {
		close: 'Chiudi',
		next: 'Immagine successiva',
		previous: 'Immagine precedente',
		open: 'Ingrandisci immagine',
	},
} as const
