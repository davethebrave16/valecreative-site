import { it } from './it'
import { en } from './en'

const translations = { it, en } as const

export type Locale = keyof typeof translations
export type Translations = typeof it

export function useTranslations(locale: string | undefined): Translations {
	const key = (locale ?? 'it') as Locale
	return (translations[key] ?? translations.it) as Translations
}

export function getLocalePath(locale: string | undefined, path: string): string {
	if (!locale || locale === 'it') return path
	return `/en${path === '/' ? '' : path}`
}
