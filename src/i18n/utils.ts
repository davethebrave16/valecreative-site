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
