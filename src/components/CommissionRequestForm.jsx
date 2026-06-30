import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebaseConfig'

export default function CommissionRequestForm() {
	const [status, setStatus] = useState('idle') // 'idle' | 'pending' | 'success' | 'error'
	const [errorMessage, setErrorMessage] = useState('')

	const [fields, setFields] = useState({
		clientName: '',
		email: '',
		phone: '',
		description: '',
		estimatedBudget: '',
		honeypot: '', // must stay empty
	})

	const handleChange = (e) => {
		setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		// Honeypot check — bots fill hidden fields
		if (fields.honeypot) return

		setStatus('pending')
		setErrorMessage('')

		try {
			await addDoc(collection(db, 'commissions'), {
				clientName: fields.clientName.trim(),
				email: fields.email.trim(),
				phone: fields.phone.trim() || null,
				description: fields.description.trim(),
				estimatedBudget: fields.estimatedBudget ? Number(fields.estimatedBudget) : null,
				status: 'new',
				requestedAt: serverTimestamp(),
			})
			setStatus('success')
		} catch (err) {
			setErrorMessage(err?.message ?? 'Something went wrong. Please try again.')
			setStatus('error')
		}
	}

	if (status === 'success') {
		return (
			<div style={{ padding: '1.5rem', border: '1px solid #2e6b55', borderRadius: 4 }}>
				<p style={{ fontWeight: 600, color: '#2e6b55' }}>Thank you for your request!</p>
				<p style={{ marginTop: '0.5rem', color: '#444' }}>
					I'll review your submission and get back to you soon.
				</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} noValidate>
			{/* Honeypot — hidden from users, filled by bots */}
			<input
				name="honeypot"
				value={fields.honeypot}
				onChange={handleChange}
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
				style={{ display: 'none' }}
			/>

			<label>
				Name <span aria-hidden="true">*</span>
				<input
					type="text"
					name="clientName"
					value={fields.clientName}
					onChange={handleChange}
					required
					autoComplete="name"
					disabled={status === 'pending'}
				/>
			</label>

			<label>
				Email <span aria-hidden="true">*</span>
				<input
					type="email"
					name="email"
					value={fields.email}
					onChange={handleChange}
					required
					autoComplete="email"
					disabled={status === 'pending'}
				/>
			</label>

			<label>
				Phone
				<input
					type="tel"
					name="phone"
					value={fields.phone}
					onChange={handleChange}
					autoComplete="tel"
					disabled={status === 'pending'}
				/>
			</label>

			<label>
				Description of what you have in mind <span aria-hidden="true">*</span>
				<textarea
					name="description"
					value={fields.description}
					onChange={handleChange}
					required
					rows={5}
					disabled={status === 'pending'}
				/>
			</label>

			<label>
				Estimated budget (€)
				<input
					type="number"
					name="estimatedBudget"
					value={fields.estimatedBudget}
					onChange={handleChange}
					min={0}
					step={1}
					disabled={status === 'pending'}
				/>
			</label>

			{status === 'error' && (
				<p role="alert" style={{ color: '#c0392b', fontSize: '0.9rem' }}>
					{errorMessage}
				</p>
			)}

			<button type="submit" disabled={status === 'pending'}>
				{status === 'pending' ? 'Sending…' : 'Send request'}
			</button>
		</form>
	)
}
