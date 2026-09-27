import { useState } from 'react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from '@/lib/firebaseConfig'
import { trackCommissionFormSubmit, trackFbEvent } from '@/lib/analytics'

// Positional mapping — index must stay aligned with commissions.form.requestTypes in both it.ts and en.ts
// ['Commissione'/'Commission', "Corso d'arte"/'Art course', 'Informazioni'/'Information']
const REQUEST_TYPE_CANONICAL = ['commission', 'course', 'info']

// Reverse lookup: canonical string -> first matching index in REQUEST_TYPE_CANONICAL
const CANONICAL_TO_INDEX = { commission: 0, course: 1, info: 2 }

const functions = getFunctions(app, 'europe-west1')
const submitCommission = httpsCallable(functions, 'submitCommission')

// reCAPTCHA v3 is loaded only on this form, on first interaction (or at submit as a fallback, e.g.
// autofill without focus) — never globally, so it doesn't compete with other pages' loading.
const RECAPTCHA_TIMEOUT_MS = 10000
let recaptchaPromise = null

function loadRecaptcha(siteKey) {
	if (recaptchaPromise) return recaptchaPromise
	recaptchaPromise = new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		script.async = true
		script.onload = () => {
			if (window.grecaptcha?.ready) window.grecaptcha.ready(() => resolve(window.grecaptcha))
			else reject(new Error('grecaptcha unavailable'))
		}
		script.onerror = () => reject(new Error('reCAPTCHA script failed to load'))
		document.head.appendChild(script)
	}).catch((err) => {
		// Allow a retry on the next submit (e.g. after disabling an ad blocker).
		recaptchaPromise = null
		document.querySelector('script[src*="recaptcha/api.js"]')?.remove()
		throw err
	})
	return recaptchaPromise
}

function withTimeout(promise, ms) {
	return Promise.race([
		promise,
		new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
	])
}

export default function CommissionRequestForm({ labels }) {
	const form = labels?.form ?? {}
	const success = labels?.success ?? {}
	const errorMsg = labels?.error ?? 'Something went wrong. Please try again.'

	const [status, setStatus] = useState('idle') // 'idle' | 'pending' | 'success' | 'error'
	const [serverError, setServerError] = useState('')
	const [reqTypeIndex, setReqTypeIndex] = useState(() => {
		if (typeof window === 'undefined') return 0
		const preType = new URLSearchParams(window.location.search).get('type')
		return preType && preType in CANONICAL_TO_INDEX ? CANONICAL_TO_INDEX[preType] : 0
	})
	const [fieldErrors, setFieldErrors] = useState({})

	// Read from the DOM (set by BaseLayout.astro) rather than import.meta.env, by design
	const recaptchaSiteKey = typeof document !== 'undefined' ? document.body?.dataset?.recaptchaKey || '' : ''

	const [fields, setFields] = useState(() => {
		const base = { clientName: '', email: '', description: '', honeypot: '' }
		if (typeof window === 'undefined') return base
		const params = new URLSearchParams(window.location.search)
		const preType = params.get('type')
		const preRef = params.get('ref')
		if (preRef && (preType === 'info' || preType === 'commission')) {
			base.description = `Ho visto l'opera "${preRef}" e vorrei saperne di più.`
		}
		return base
	})

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	const validate = () => {
		const errors = {}
		if (!fields.clientName.trim()) errors.clientName = form.requiredError
		if (!fields.email.trim()) errors.email = form.requiredError
		else if (!EMAIL_RE.test(fields.email.trim())) errors.email = form.emailInvalidError
		if (!fields.description.trim()) errors.description = form.requiredError
		return errors
	}

	const handlePrefetchRecaptcha = () => {
		if (recaptchaSiteKey) loadRecaptcha(recaptchaSiteKey).catch(() => {})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFields((prev) => ({ ...prev, [name]: value }))
		setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (fields.honeypot) return

		const errors = validate()
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors)
			return
		}

		setStatus('pending')
		setServerError('')
		setFieldErrors({})

		let recaptchaToken = ''
		if (recaptchaSiteKey) {
			try {
				const grecaptcha = await withTimeout(loadRecaptcha(recaptchaSiteKey), RECAPTCHA_TIMEOUT_MS)
				recaptchaToken = await withTimeout(
					grecaptcha.execute(recaptchaSiteKey, { action: 'submit_commission' }),
					RECAPTCHA_TIMEOUT_MS,
				)
			} catch {
				// Script blocked/failed: don't call the function (it would reject an empty token anyway).
				// Same analytics event the server-side rejection produces.
				setServerError(labels?.recaptchaUnavailable ?? errorMsg)
				setStatus('error')
				trackCommissionFormSubmit('error', REQUEST_TYPE_CANONICAL[reqTypeIndex], 'recaptcha')
				return
			}
		}

		try {
			await submitCommission({
				type: REQUEST_TYPE_CANONICAL[reqTypeIndex],
				clientName: fields.clientName.trim(),
				email: fields.email.trim(),
				description: fields.description.trim(),
				honeypot: fields.honeypot,
				recaptchaToken,
			})
			setStatus('success')
			trackCommissionFormSubmit('success', REQUEST_TYPE_CANONICAL[reqTypeIndex])
			trackFbEvent('Lead')
		} catch (err) {
			const code = err?.code ?? ''
			let errorReason = 'generic'
			if (code === 'functions/permission-denied') {
				errorReason = 'recaptcha'
				setServerError('Verifica di sicurezza non superata. Ricarica la pagina e riprova.')
			} else if (code === 'functions/invalid-argument') {
				errorReason = 'validation'
				setServerError('Controlla i dati inseriti e riprova.')
			} else {
				setServerError(errorMsg)
			}
			setStatus('error')
			trackCommissionFormSubmit('error', REQUEST_TYPE_CANONICAL[reqTypeIndex], errorReason)
		}
	}

	if (status === 'success') {
		return (
			<div style={{ border: '1px solid var(--verde)', background: 'linear-gradient(180deg,#fff,var(--parchment))', borderRadius: 8, padding: 'clamp(28px,4vw,46px)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, maxWidth: 560 }}>
				<span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--verde)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>✓</span>
				<h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: 30, margin: 0, color: 'var(--ink)' }}>{success.title}</h3>
				<p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: '#52564c', maxWidth: '42ch' }}>{success.message}</p>
				<button
					onClick={() => setStatus('idle')}
					style={{ marginTop: 6, fontWeight: 600, fontSize: 14, color: 'var(--verde)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
				>
					{success.again}
				</button>
			</div>
		)
	}

	const reqTypes = form.requestTypes ?? []

	return (
		<form
			onSubmit={handleSubmit}
			onFocus={handlePrefetchRecaptcha}
			onInput={handlePrefetchRecaptcha}
			noValidate
			style={{ border: '1px solid var(--line)', background: 'var(--parchment)', borderRadius: 8, padding: 'clamp(22px,3vw,38px)', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}
		>
			{/* Honeypot */}
			<input name="honeypot" value={fields.honeypot} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />

			{/* Name + Email row */}
			<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
				<label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
					<span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bark)' }}>{form.name}</span>
					<input
						className="vd-field"
						type="text"
						name="clientName"
						value={fields.clientName}
						onChange={handleChange}
						required
						autoComplete="name"
						placeholder={form.namePlaceholder}
						disabled={status === 'pending'}
						aria-invalid={fieldErrors.clientName ? 'true' : 'false'}
						style={fieldErrors.clientName ? { borderColor: 'var(--rose)' } : undefined}
					/>
					{fieldErrors.clientName && (
						<span role="alert" style={{ color: 'var(--rose)', fontSize: '0.85rem' }}>{fieldErrors.clientName}</span>
					)}
				</label>
				<label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
					<span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bark)' }}>{form.email}</span>
					<input
						className="vd-field"
						type="email"
						name="email"
						value={fields.email}
						onChange={handleChange}
						required
						autoComplete="email"
						placeholder={form.emailPlaceholder}
						disabled={status === 'pending'}
						aria-invalid={fieldErrors.email ? 'true' : 'false'}
						style={fieldErrors.email ? { borderColor: 'var(--rose)' } : undefined}
					/>
					{fieldErrors.email && (
						<span role="alert" style={{ color: 'var(--rose)', fontSize: '0.85rem' }}>{fieldErrors.email}</span>
					)}
				</label>
			</div>

			{/* Request type chips */}
			{reqTypes.length > 0 && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
					<span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bark)' }}>{form.requestType}</span>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
						{reqTypes.map((type, idx) => (
							<button
								key={type}
								type="button"
								onClick={() => setReqTypeIndex(idx)}
								style={{
									fontFamily: "'Hanken Grotesk', sans-serif",
									fontSize: 13,
									fontWeight: 600,
									padding: '8px 15px',
									borderRadius: 999,
									border: '1px solid var(--line)',
									cursor: 'pointer',
									transition: '0.2s ease',
									background: idx === reqTypeIndex ? 'var(--forest)' : 'transparent',
									color: idx === reqTypeIndex ? '#fff' : 'var(--ink)',
									borderColor: idx === reqTypeIndex ? 'var(--forest)' : 'var(--line)',
								}}
							>
								{type}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Message */}
			<label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
				<span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bark)' }}>{form.message}</span>
				<textarea
					className="vd-field"
					name="description"
					value={fields.description}
					onChange={handleChange}
					required
					rows={5}
					placeholder={form.messagePlaceholder}
					disabled={status === 'pending'}
					style={fieldErrors.description ? { resize: 'vertical', lineHeight: 1.5, borderColor: 'var(--rose)' } : { resize: 'vertical', lineHeight: 1.5 }}
					aria-invalid={fieldErrors.description ? 'true' : 'false'}
				/>
				{fieldErrors.description && (
					<span role="alert" style={{ color: 'var(--rose)', fontSize: '0.85rem' }}>{fieldErrors.description}</span>
				)}
			</label>

			{status === 'error' && (
				<p role="alert" style={{ color: 'var(--rose)', fontSize: '0.9rem' }}>{serverError || errorMsg}</p>
			)}

			<button
				type="submit"
				disabled={status === 'pending'}
				style={{
					alignSelf: 'flex-start',
					background: 'var(--verde)',
					color: '#fff',
					fontWeight: 600,
					fontSize: 15.5,
					padding: '14px 30px',
					border: 'none',
					borderRadius: 999,
					cursor: status === 'pending' ? 'not-allowed' : 'pointer',
					opacity: status === 'pending' ? 0.7 : 1,
					transition: '0.3s ease',
				}}
			>
				{status === 'pending' ? (form.submitting ?? '…') : (form.submit ?? 'Send')}
			</button>
		</form>
	)
}
