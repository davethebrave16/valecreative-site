import { hasMarketingConsent } from './consent'

/**
 * Fire a GA4 custom event via window.gtag.
 * Safe to call when gtag is not loaded (e.g. measurement ID not set,
 * ad blocker, or SSR context) — fails silently.
 */
export function trackEvent(
	eventName: string,
	params: Record<string, string | number | boolean>
): void {
	if (typeof window === 'undefined') return
	if (typeof (window as Window & { gtag?: Function }).gtag !== 'function') return
	;(window as Window & { gtag: Function }).gtag('event', eventName, params)
}

export function trackGalleryOpen(artworkSlug: string, artworkTitle: string): void {
	trackEvent('view_artwork_gallery', {
		artwork_slug: artworkSlug,
		artwork_title: artworkTitle,
	})
}

export function trackCtaClick(
	artworkSlug: string,
	artworkTitle: string,
	ctaType: 'for_sale' | 'commissioned' | 'sold' | 'not_for_sale' | 'fallback'
): void {
	trackEvent('artwork_cta_click', {
		artwork_slug: artworkSlug,
		artwork_title: artworkTitle,
		cta_type: ctaType,
	})
}

export function trackCommissionFormSubmit(
	status: 'success' | 'error',
	requestType: 'commission' | 'course' | 'info',
	errorReason?: 'recaptcha' | 'validation' | 'generic'
): void {
	trackEvent('commission_form_submit', {
		status,
		request_type: requestType,
		...(errorReason ? { error_reason: errorReason } : {}),
	})
}

export function trackCategoryTabToggle(categorySlug: string, origin: 'personal' | 'commissioned'): void {
	trackEvent('category_tab_toggle', {
		category_slug: categorySlug,
		origin,
	})
}

export function trackLanguageSwitch(targetLocale: string): void {
	trackEvent('language_switch', {
		target_locale: targetLocale,
	})
}

/**
 * Fire a Meta Pixel standard event via window.fbq.
 * Safe to call when fbq is not loaded/initialized or marketing consent hasn't been
 * granted (e.g. Pixel ID not set, ad blocker, or SSR context) — fails silently.
 */
export function trackFbEvent(
	eventName: string,
	params?: Record<string, string | number | boolean>
): void {
	if (typeof window === 'undefined') return
	if (typeof (window as Window & { fbq?: Function }).fbq !== 'function') return
	if (!hasMarketingConsent()) return
	;(window as Window & { fbq: Function }).fbq('track', eventName, params)
}
