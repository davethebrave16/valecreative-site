import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { readFileSync } from 'node:fs'

// The sitemap lists only indexable pages. Rather than duplicating each page's indexing rules here (or keeping a
// manifest file that could go stale in a cached CI workspace), the filter reads the page's own robots meta from
// the freshly built HTML: whatever is `noindex` (empty series, series without English, empty /series index) is
// left out. The filter runs at astro:build:done, after every page has been written to dist/.
const OUT_DIR = './dist'
function isNoindex(pathname) {
	try {
		const dir = decodeURIComponent(pathname).replace(/\/?$/, '/')
		const html = readFileSync(`${OUT_DIR}${dir}index.html`, 'utf8')
		return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)
	} catch {
		return false
	}
}

export default defineConfig({
	site: 'https://valentinadamiano.it',
	output: 'static',
	// Outside node_modules so CI can persist it with actions/cache (npm ci wipes node_modules).
	// Holds the downloaded Storage originals and the generated AVIF/WebP variants.
	cacheDir: './.astro-cache',
	// Inline the (small, ~12 KB) global CSS incl. @font-face rules: no render-blocking stylesheet request.
	build: { inlineStylesheets: 'always' },
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
			filter: (page) => {
				const { pathname } = new URL(page)
				if (!/\/(it|en)(\/|$)/.test(pathname)) return false
				return !isNoindex(pathname)
			},
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
