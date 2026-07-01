import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
	site: 'https://valentinadamiano.it',
	output: 'static',
	integrations: [
		react(),
		sitemap({
			i18n: {
				defaultLocale: 'it',
				locales: { it: 'it-IT', en: 'en-US' },
			},
		}),
	],
	i18n: {
		defaultLocale: 'it',
		locales: ['it', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	redirects: {
		'/commissions': '/contact',
		'/en/commissions': '/en/contact',
	},
})
