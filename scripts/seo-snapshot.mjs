#!/usr/bin/env node
// Dependency-free SEO head extractor. Walks a built Astro `dist/` directory and
// pulls <title>, meta description, canonical, hreflang, robots, og/twitter tags,
// and JSON-LD blocks out of every HTML file via regex (no cheerio/jsdom — this
// repo has neither installed, and adding one isn't worth it for a one-off audit
// script). Usage: node scripts/seo-snapshot.mjs dist > snapshot.json

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.argv[2]
if (!root) {
	console.error('Usage: node scripts/seo-snapshot.mjs <dist-dir>')
	process.exit(1)
}

function walk(dir, files = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry)
		const st = statSync(full)
		if (st.isDirectory()) walk(full, files)
		else if (entry.endsWith('.html')) files.push(full)
	}
	return files
}

function extractHead(html) {
	const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
	const head = headMatch ? headMatch[1] : ''

	const title = (head.match(/<title>([\s\S]*?)<\/title>/i) || [, null])[1]?.trim() ?? null

	const metaTags = [...head.matchAll(/<meta\b([^>]*)>/gi)].map((m) => m[1])
	function metaAttr(attrs, key) {
		const nameMatch = attrs.match(/\bname=["']([^"']+)["']/i)
		const propMatch = attrs.match(/\bproperty=["']([^"']+)["']/i)
		const contentMatch = attrs.match(/\bcontent=["']([^"']*)["']/i)
		const name = nameMatch?.[1] ?? propMatch?.[1]
		return name === key ? (contentMatch?.[1] ?? '') : undefined
	}

	let description = null
	let robots = null
	const og = {}
	const twitter = {}
	for (const attrs of metaTags) {
		const nameMatch = attrs.match(/\bname=["']([^"']+)["']/i)
		const propMatch = attrs.match(/\bproperty=["']([^"']+)["']/i)
		const contentMatch = attrs.match(/\bcontent=["']([^"']*)["']/i)
		const key = nameMatch?.[1] ?? propMatch?.[1]
		const content = contentMatch?.[1] ?? ''
		if (!key) continue
		if (key === 'description') description = content
		if (key === 'robots') robots = content
		if (key.startsWith('og:')) og[key] = content
		if (key.startsWith('twitter:')) twitter[key] = content
	}

	const canonicalMatch = head.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)
	const canonical = canonicalMatch
		? (canonicalMatch[0].match(/href=["']([^"']+)["']/i) || [, null])[1]
		: null

	const hreflang = [...head.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*>/gi)]
		.map((m) => m[0])
		.filter((tag) => /hreflang=/i.test(tag))
		.map((tag) => ({
			hreflang: (tag.match(/hreflang=["']([^"']+)["']/i) || [, null])[1],
			href: (tag.match(/href=["']([^"']+)["']/i) || [, null])[1],
		}))

	const jsonLd = [...head.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
		.map((m) => {
			try {
				return JSON.parse(m[1])
			} catch {
				return { __parseError: true, raw: m[1].slice(0, 200) }
			}
		})

	// Also catch JSON-LD placed outside <head> (Astro slot="head" still renders into <head>,
	// but scan body too in case anything landed there).
	const bodyJsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
		.map((m) => {
			try {
				return JSON.parse(m[1])
			} catch {
				return { __parseError: true, raw: m[1].slice(0, 200) }
			}
		})

	const flags = []
	if (title && title.length > 60) flags.push(`title exceeds 60 chars (${title.length})`)
	if (description && description.length > 160) flags.push(`meta description exceeds 160 chars (${description.length})`)

	return {
		title,
		titleLength: title?.length ?? null,
		description,
		descriptionLength: description?.length ?? null,
		canonical,
		hreflang,
		robots,
		og,
		twitter,
		jsonLd: bodyJsonLd.length ? bodyJsonLd : jsonLd,
		flags,
	}
}

const files = walk(root)
const snapshot = {}
for (const file of files) {
	const html = readFileSync(file, 'utf8')
	const key = relative(root, file).split('/').join('/')
	snapshot[key] = extractHead(html)
}

console.log(JSON.stringify(snapshot, null, 2))
