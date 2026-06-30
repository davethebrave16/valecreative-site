import { useState } from 'react'

// TODO: decide destination before wiring this up.
// Options:
//   (a) write to a Firestore 'contacts' collection (simple, same pattern as CommissionRequestForm)
//   (b) POST to a Firebase Cloud Function / Cloud Run endpoint (allows email notification)
//   (c) use a third-party form service (Formspree, Resend, etc.)
//
// The form is intentionally non-functional until this is decided.
// The submit handler sets a visible message so the user knows it's not connected yet.

export default function ContactForm() {
	const [status, setStatus] = useState('idle') // 'idle' | 'submitted'

	const [fields, setFields] = useState({
		name: '',
		email: '',
		message: '',
	})

	const handleChange = (e) => {
		setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// NOT connected — see TODO above
		setStatus('submitted')
	}

	if (status === 'submitted') {
		return (
			<div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: 4 }}>
				<p style={{ color: '#555' }}>
					Contact form not yet connected — please email us directly.
				</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} noValidate>
			<label>
				Name
				<input
					type="text"
					name="name"
					value={fields.name}
					onChange={handleChange}
					autoComplete="name"
				/>
			</label>

			<label>
				Email
				<input
					type="email"
					name="email"
					value={fields.email}
					onChange={handleChange}
					autoComplete="email"
				/>
			</label>

			<label>
				Message
				<textarea
					name="message"
					value={fields.message}
					onChange={handleChange}
					rows={5}
				/>
			</label>

			<button type="submit">Send (coming soon)</button>
		</form>
	)
}
