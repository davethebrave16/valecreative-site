// Cookie consent per category, stored in localStorage['vd-cookie-consent'].
// Values stay backward compatible with the original accept/reject banner:
//   'accepted'  → statistics + marketing (visitors who accepted before categories existed keep both)
//   'rejected'  → none
//   'analytics' → statistics only (Google Analytics)
//   'marketing' → marketing only (Meta Pixel)
// No value → no choice yet (banner shown, nothing loaded).

export const CONSENT_KEY = 'vd-cookie-consent'

export interface Consent {
	analytics: boolean
	marketing: boolean
}

export function readConsent(): Consent | null {
	let value: string | null = null
	try {
		value = localStorage.getItem(CONSENT_KEY)
	} catch {
		return null
	}
	if (value === null) return null
	return {
		analytics: value === 'accepted' || value === 'analytics',
		marketing: value === 'accepted' || value === 'marketing',
	}
}

export function writeConsent(consent: Consent): void {
	const value = consent.analytics && consent.marketing
		? 'accepted'
		: consent.analytics
			? 'analytics'
			: consent.marketing
				? 'marketing'
				: 'rejected'
	try {
		localStorage.setItem(CONSENT_KEY, value)
	} catch {
		// Storage unavailable (private mode): the choice applies to this page view only.
	}
}

export function hasMarketingConsent(): boolean {
	return readConsent()?.marketing === true
}
