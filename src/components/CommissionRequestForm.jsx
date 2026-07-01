import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

export default function CommissionRequestForm({ labels }) {
	const form = labels?.form ?? {}
	const success = labels?.success ?? {}
	const errorMsg = labels?.error ?? 'Something went wrong. Please try again.'

	const [status, setStatus] = useState('idle') // 'idle' | 'pending' | 'success' | 'error'
	const [serverError, setServerError] = useState('')
	const [reqType, setReqType] = useState(form.requestTypes?.[0] ?? 'Commissione')

	const [fields, setFields] = useState({
		clientName: '',
		email: '',
		description: '',
		honeypot: '',
	})

	const handleChange = (e) => {
		setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (fields.honeypot) return

		setStatus('pending')
		setServerError('')

		try {
			await addDoc(collection(db, 'commissions'), {
				clientName: fields.clientName.trim(),
				email: fields.email.trim(),
				description: fields.description.trim(),
				requestType: reqType,
				status: 'new',
				requestedAt: serverTimestamp(),
			})
			setStatus('success')
		} catch (err) {
			setServerError(err?.message ?? errorMsg)
			setStatus('error')
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
					/>
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
					/>
				</label>
			</div>

			{/* Request type chips */}
			{reqTypes.length > 0 && (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
					<span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--bark)' }}>{form.requestType}</span>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
						{reqTypes.map((type) => (
							<button
								key={type}
								type="button"
								onClick={() => setReqType(type)}
								style={{
									fontFamily: "'Hanken Grotesk', sans-serif",
									fontSize: 13,
									fontWeight: 600,
									padding: '8px 15px',
									borderRadius: 999,
									border: '1px solid var(--line)',
									cursor: 'pointer',
									transition: '0.2s ease',
									background: type === reqType ? 'var(--forest)' : 'transparent',
									color: type === reqType ? '#fff' : 'var(--ink)',
									borderColor: type === reqType ? 'var(--forest)' : 'var(--line)',
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
					style={{ resize: 'vertical', lineHeight: 1.5 }}
				/>
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
