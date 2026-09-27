import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
	site: 'https://valentinadamiano.it',
	output: 'static',
	// Outside node_modules so CI can persist it with actions/cache (npm ci wipes node_modules).
	// Holds the downloaded Storage originals and the generated AVIF/WebP variants.
	cacheDir: './.astro-cache',
	image: {
		// Artwork/series/content images live in Firebase Storage; <RemoteImage> optimizes them at build time.
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				pathname: '/v0/b/valecreative-prod.firebasestorage.app/o/**',
			},
		],
	},
	integrations: [
		react(),
		sitemap({
			i18n: {
				defaultLocale: 'it',
				locales: { it: 'it-IT', en: 'en-US' },
			},
			// Only the real /it/* and /en/* content pages are indexable — exclude the root
			// language-gateway page (src/pages/index.astro), which just redirects.
			filter: (page) => /\/(it|en)(\/|$)/.test(new URL(page).pathname),
		}),
	],
	i18n: {
		defaultLocale: 'it',
		locales: ['it', 'en'],
		routing: {
			prefixDefaultLocale: true,
			// Astro's built-in "/" -> "/it/" redirect always picks the default locale. We replace it
			// with our own gateway page (src/pages/index.astro) that also checks browser language.
			redirectToDefaultLocale: false,
		},
	},
})
