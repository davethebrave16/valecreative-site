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
			controllerBody: 'Il Titolare del trattamento è Valentina Damiano, persona fisica, pittrice e artigiana, che tratta i dati raccolti tramite questo sito. Non essendo disponibile un indirizzo email dedicato, ogni richiesta relativa alla privacy — comprese quelle per esercitare i diritti descritti più sotto — va inviata esclusivamente tramite la',
			controllerLinkLabel: 'pagina di contatto',

			purposesTitle: 'Finalità e base giuridica del trattamento',
			purposesIntro: 'I dati raccolti tramite questo sito sono trattati per le finalità e sulla base giuridica indicate di seguito, distinte per tipo di dato.',
			purposeFormsLabel: 'Dati inseriti nei moduli (contatto e richiesta commissione)',
			purposeFormsBody: 'Finalità: rispondere alla richiesta dell\'utente ed eventualmente gestire la commissione richiesta. Base giuridica: esecuzione di misure precontrattuali richieste dall\'interessato (art. 6.1.b GDPR), attivata con l\'invio volontario del modulo.',
			purposeAnalyticsLabel: 'Dati di navigazione aggregati (Google Analytics 4)',
			purposeAnalyticsBody: 'Finalità: capire in forma aggregata come viene utilizzato il sito, per migliorarlo. Base giuridica: consenso dell\'utente (art. 6.1.a GDPR), raccolto tramite il banner cookie e revocabile in qualsiasi momento senza pregiudicare la liceità del trattamento già effettuato.',
			purposeRecaptchaLabel: 'Dati tecnici (Google reCAPTCHA v3)',
			purposeRecaptchaBody: 'Finalità: proteggere il modulo di richiesta commissione da invii automatizzati, spam e abusi. Base giuridica: legittimo interesse del Titolare alla sicurezza del sito e alla prevenzione di frodi (art. 6.1.f GDPR).',

			cookiesTitle: 'Cookie utilizzati',
			cookiesIntro: 'Questo sito utilizza le seguenti categorie di cookie:',
			cookiesNecessaryLabel: 'Necessari',
			cookiesNecessaryBody: 'Google reCAPTCHA v3, usato per proteggere il modulo di contatto dallo spam. Sempre attivo: non richiede consenso in quanto strettamente necessario al funzionamento del modulo.',
			cookiesAnalyticsLabel: 'Analitici (facoltativi)',
			cookiesAnalyticsBody: 'Google Analytics 4, usato in forma aggregata per capire come i visitatori usano il sito. Viene attivato solo dopo aver espresso il consenso tramite il banner cookie.',

			cookieTableTitle: 'Elenco dettagliato dei cookie',
			cookieTableIntro: 'La tabella seguente riepiloga i singoli cookie impostati da questo sito.',
			cookieTableColName: 'Nome',
			cookieTableColProvider: 'Fornitore',
			cookieTableColPurpose: 'Finalità',
			cookieTableColDuration: 'Durata',
			cookieTableColConsent: 'Consenso',
			cookieTableConsentRequired: 'Richiesto',
			cookieTableConsentNotRequired: 'Non richiesto',
			cookieTableGaPurpose: 'Distingue gli utenti per l\'analisi statistica aggregata',
			cookieTableGaDuration: 'Circa 2 anni (valore predefinito Google Analytics 4)',
			cookieTableRecaptchaName: 'Cookie reCAPTCHA (es. _GRECAPTCHA)',
			cookieTableRecaptchaPurpose: 'Distingue traffico umano da traffico automatizzato/bot sul modulo commissioni',
			cookieTableRecaptchaDuration: 'Durata non pubblicata da Google in modo puntuale; indicativamente alcuni mesi',
			cookieTableNote: 'Oltre ai cookie sopra elencati, il sito salva due valori tecnici nel localStorage del browser (non sono cookie in senso tecnico, non vengono trasmessi al server): la lingua scelta (\'vd-locale\') e la preferenza espressa sui cookie (\'vd-cookie-consent\'). Entrambi restano solo sul dispositivo dell\'utente fino a cancellazione manuale dei dati di navigazione.',

			retentionTitle: 'Tempi di conservazione dei dati',
			retentionFormsLabel: 'Dati dei moduli (contatto e commissioni)',
			retentionFormsBody: 'I dati inviati tramite i moduli del sito sono conservati per il tempo necessario a gestire la richiesta e l\'eventuale rapporto con il cliente che ne deriva. Non è previsto un termine di cancellazione automatica: i dati sono soggetti a riesame periodico e vengono cancellati su richiesta dell\'interessato o comunque quando non sono più necessari alle finalità per cui sono stati raccolti, salvo obblighi di conservazione più lunghi previsti dalla legge.',
			retentionAnalyticsLabel: 'Dati di Google Analytics',
			retentionAnalyticsBody: 'I dati a livello di utente e di evento raccolti tramite Google Analytics 4 sono conservati per 2 mesi, il periodo di conservazione predefinito delle proprietà Google Analytics 4 (parametro modificabile dal Titolare fino a un massimo di 14 mesi in Analytics Admin → Impostazioni dati → Conservazione dati). I dati aggregati nei report non sono soggetti a questo limite.',

			transferTitle: 'Trasferimento dei dati extra-UE',
			transferBody: 'Google Analytics 4 e Google reCAPTCHA sono servizi forniti da Google LLC, con sede negli Stati Uniti. L\'eventuale trasferimento di dati verso gli Stati Uniti avviene sulla base delle garanzie adottate da Google, tra cui l\'adesione al Data Privacy Framework UE-USA e/o l\'adozione delle Clausole Contrattuali Standard approvate dalla Commissione Europea. Per maggiori informazioni si rimanda all\'informativa privacy di Google linkata più sotto.',

			rightsTitle: 'Diritti dell\'interessato',
			rightsIntro: 'In qualità di interessato, hai diritto di richiedere in qualsiasi momento, nei limiti e alle condizioni previste dagli articoli 15-21 del GDPR:',
			rightsList: [
				'Accesso ai tuoi dati personali',
				'Rettifica di dati inesatti o incompleti',
				'Cancellazione dei dati (diritto all\'oblio)',
				'Limitazione del trattamento',
				'Portabilità dei dati in un formato strutturato',
				'Opposizione al trattamento',
				'Revoca del consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento effettuato prima della revoca',
			],
			rightsOutro: 'Per esercitare uno di questi diritti, scrivi tramite la',
			rightsLinkLabel: 'pagina di contatto',

			complaintTitle: 'Reclamo al Garante per la protezione dei dati personali',
			complaintBody: 'Se ritieni che il trattamento dei tuoi dati violi la normativa vigente, hai diritto di proporre reclamo al Garante per la protezione dei dati personali, autorità di controllo italiana, consultabile al sito',
			complaintLinkLabel: 'garanteprivacy.it',

			manageTitle: 'Gestisci le tue preferenze',
			manageBody: 'Puoi modificare la tua scelta in qualsiasi momento e far ricomparire il banner dei cookie.',
			manageButton: 'Gestisci preferenze cookie',
			externalTitle: 'Informative di terze parti',
			externalBody: 'Per maggiori dettagli sui dati trattati da Google, consulta la',
			externalLink: 'Informativa privacy di Google',

			updatedTitle: 'Aggiornamenti a questa informativa',
			updatedBody: 'Questa informativa può essere aggiornata nel tempo, ad esempio in caso di modifiche ai servizi utilizzati dal sito o alla normativa applicabile. Si consiglia di consultarla periodicamente.',
			lastUpdatedLabel: 'Ultimo aggiornamento',
			lastUpdatedValue: '12 luglio 2026',
		},
	},
} as const
