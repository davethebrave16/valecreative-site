import { it } from './it'
import { en } from './en'

const translations = { it, en } as const

export type Locale = keyof typeof translations
export type Translations = typeof it

export function useTranslations(locale: string | undefined): Translations {
	const key = (locale ?? 'it') as Locale
	return (translations[key] ?? translations.it) as Translations
}

export const locales = Object.keys(translations) as Locale[]

export function getLocalePath(locale: string | undefined, path: string): string {
	const l = locale ?? 'it'
	return `/${l}${path === '/' ? '' : path}`
}

// Resolves a bilingual Firestore field pair (e.g. title/titleEn) to the string to render.
// Falls back to the Italian value whenever the English one is missing or empty, so
// translations can be added gradually per document.
export function localize(it: string, en: string | undefined, locale: Locale): string {
	return locale === 'en' && en ? en : it
}
