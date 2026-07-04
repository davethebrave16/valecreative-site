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
