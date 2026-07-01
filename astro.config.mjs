import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
	output: 'static',
	integrations: [react()],
	i18n: {
		defaultLocale: 'it',
		locales: ['it', 'en'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
})
