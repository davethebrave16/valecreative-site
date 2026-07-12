export const it = {
	// Navigation
	nav: {
		home: 'Home',
		works: 'Opere',
		series: 'Serie',
		techniques: 'Tecniche',
		about: 'Chi sono',
		contact: 'Contattami',
		privacy: 'Privacy e cookie',
	},

	// Home page
	home: {
		eyebrow: 'Artista · Pittrice · Artigiana',
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
		filterPersonal: 'Personali',
		filterCommissioned: 'Commissionate',
		countLabel: (n: number) => `${n} opere`,
		countSuffix: 'opere',
		categoryCount: (n: number) => `${n} opere`,
		openCategory: 'Apri la galleria →',
		noWorksInCategory: 'Nessuna opera in questa categoria ancora.',
		legendAvailable: 'Disponibile',
		legendSold: 'Venduto / non disponibile',
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
			drawing: 'Disegno',
			photography: 'Fotografia',
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

	// Commissions form (Contattami)
	commissions: {
		eyebrow: 'Contattami',
		title: 'Mettiti in contatto',
		subtitle:
			'Domande, idee o una commissione in mente: scrivimi pure. Raccontami cosa hai in mente, ti risponderò personalmente.',
		form: {
			name: 'Nome e cognome',
			namePlaceholder: 'Il tuo nome',
			email: 'Email',
			emailPlaceholder: 'nome@email.it',
			requestType: 'Tipo di richiesta',
			requestTypes: ['Commissione', 'Corso d\'arte', 'Informazioni'],
			message: 'Messaggio',
			messagePlaceholder: 'Descrivi la tua idea, soggetto, dimensioni, tempi…',
			submit: 'Invia la richiesta',
			submitting: 'Invio…',
			requiredError: 'Questo campo è obbligatorio.',
			emailInvalidError: 'Inserisci un indirizzo email valido.',
		},
		success: {
			title: 'Grazie!',
			message: 'Ho ricevuto la tua richiesta. Ti risponderò al più presto con i dettagli.',
			again: 'Invia un\'altra richiesta',
		},
		error: 'Qualcosa è andato storto. Riprova.',
	},

	// Footer
	footer: {
		tagline: 'Arte · Creazione · Personalizzazione',
		copyright: (year: number) => `© ${year} Valentina Damiano — Tutti i diritti riservati`,
	},

	// Per-page SEO meta descriptions
	meta: {
		homeDescription: 'Pittrice e incisore a Pisa e Lucca. Paesaggi onirici con velature a olio, foglia oro e incisione. Commissioni, serie tematiche e corsi d\'arte in Toscana.',
		worksDescription: 'Galleria di dipinti originali di Valentina Damiano: olio su tela, tecnica mista, acquerello e incisione. Opere disponibili all\'acquisto, su commissione e in serie tematiche.',
		seriesDescription: 'Le serie tematiche di Valentina Damiano: raccolte di dipinti unite da soggetto, tecnica o periodo creativo. Boschi, paesaggi e visioni oniriche.',
		techniquesDescription: 'Le tecniche artistiche di Valentina Damiano: pittura a olio con velature, incisione su rame, doratura a foglia oro, acquerello e artigianato creativo.',
		aboutDescription: 'Pittrice, incisore e insegnante d\'arte formata all\'Istituto Russoli e all\'Accademia di Belle Arti di Firenze. Scopri il percorso artistico di Valentina Damiano a Pisa e Lucca.',
		contactDescription: 'Mettiti in contatto con Valentina Damiano per domande, commissioni pittoriche su misura, doratura a foglia oro o corsi d\'arte personalizzati. Studio a Pisa e Lucca.',
		privacyDescription: 'Informativa privacy e cookie del sito di Valentina Damiano: quali dati vengono trattati e quali cookie di analisi vengono utilizzati.',
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

	// Cookie consent banner
	cookieConsent: {
		text: 'Utilizziamo cookie di analisi (Google Analytics) per capire come viene usato il sito. Puoi accettarli o rifiutarli liberamente.',
		learnMore: 'Scopri di più',
		accept: 'Accetta',
		reject: 'Rifiuta',
	},

	// Privacy / cookie policy page
	privacy: {
		eyebrow: 'Informativa',
		title: 'Privacy e cookie',
		intro: 'Questa pagina descrive come vengono trattati i dati personali e quali cookie sono utilizzati durante la navigazione su questo sito.',
		sections: {
			controllerTitle: 'Titolare del trattamento',
			controllerBody: 'Valentina Damiano è titolare del trattamento dei dati raccolti tramite questo sito. Per qualsiasi richiesta relativa alla privacy è possibile scrivere tramite la pagina di contatto.',
			cookiesTitle: 'Cookie utilizzati',
			cookiesIntro: 'Questo sito utilizza le seguenti categorie di cookie:',
			cookiesNecessaryLabel: 'Necessari',
			cookiesNecessaryBody: 'Google reCAPTCHA v3, usato per proteggere il modulo di contatto dallo spam. Sempre attivo: non richiede consenso in quanto strettamente necessario al funzionamento del modulo.',
			cookiesAnalyticsLabel: 'Analitici (facoltativi)',
			cookiesAnalyticsBody: 'Google Analytics 4, usato in forma aggregata per capire come i visitatori usano il sito. Viene attivato solo dopo aver espresso il consenso tramite il banner cookie.',
			manageTitle: 'Gestisci le tue preferenze',
			manageBody: 'Puoi modificare la tua scelta in qualsiasi momento e far ricomparire il banner dei cookie.',
			manageButton: 'Gestisci preferenze cookie',
			externalTitle: 'Informative di terze parti',
			externalBody: 'Per maggiori dettagli sui dati trattati da Google, consulta la',
			externalLink: 'Informativa privacy di Google',
		},
	},
} as const
