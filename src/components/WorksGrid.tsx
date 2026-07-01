import { useState } from 'react'

export interface WorkItem {
	id: string
	title: string
	slug: string
	year: number
	availability: 'for_sale' | 'sold' | 'not_for_sale'
	dimensions?: { width?: number; height?: number; unit?: string }
	coverImage?: { thumb?: string; medium?: string; original?: string; alt?: string }
	seriesName?: string
}

interface Props {
	artworks: WorkItem[]
	seriesNames: string[]
	locale?: string
	labels: {
		filterAll: string
		countLabel: (n: number) => string
		legendAvailable: string
		legendRequest: string
		legendSold: string
		availability: Record<string, string>
		orientation: Record<string, string>
	}
}

function getOrientation(dims?: { width?: number; height?: number }) {
	if (!dims?.width || !dims?.height) return 'square'
	const r = dims.width / dims.height
	if (r < 0.85) return 'portrait'
	if (r > 1.2) return 'landscape'
	return 'square'
}

function cellGridStyle(orient: string): React.CSSProperties {
	if (orient === 'portrait') return { gridRow: 'span 3' }
	if (orient === 'landscape') return { gridRow: 'span 2', gridColumn: 'span 2' }
	return { gridRow: 'span 2' }
}

function availabilityColor(availability: string) {
	if (availability === 'for_sale') return 'var(--verde)'
	if (availability === 'sold') return '#9a8d77'
	return '#9a8d77'
}

export default function WorksGrid({ artworks, seriesNames, labels }: Props) {
	const [filter, setFilter] = useState<string>(labels.filterAll)

	const filtered = filter === labels.filterAll
		? artworks
		: artworks.filter((a) => a.seriesName === filter)

	const chips = [labels.filterAll, ...seriesNames]

	return (
		<>
			{/* Filter chips */}
			<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, margin: '30px 0 22px' }}>
				{chips.map((chip) => (
					<button
						key={chip}
						className="vd-chip"
						data-active={chip === filter ? '' : undefined}
						onClick={() => setFilter(chip)}
						style={chip === filter ? { background: 'var(--verde)', color: '#fff', borderColor: 'var(--verde)' } : {}}
					>
						{chip}
					</button>
				))}
				<span style={{ marginLeft: 'auto', fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)' }}>
					{labels.countLabel(filtered.length)}
				</span>
			</div>

			{/* Masonry grid */}
			<div className="vd-grid">
				{filtered.map((artwork) => {
					const orient = getOrientation(artwork.dimensions)
					const imgSrc = artwork.coverImage?.thumb ?? artwork.coverImage?.medium ?? artwork.coverImage?.original
					const avail = artwork.availability
					const dotColor = availabilityColor(avail)
					const tag = labels.orientation[orient] ?? ''

					return (
						<a
							key={artwork.id}
							href={`/works/${artwork.slug}`}
							className="vd-cell"
							style={cellGridStyle(orient)}
						>
							{imgSrc ? (
								<img
									src={imgSrc}
									alt={artwork.coverImage?.alt ?? artwork.title}
									loading="lazy"
									className="vd-img"
									style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							) : (
								<div
									className="vd-img"
									style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg,#33473b 0%,#5d6b4d 40%,#b68a3c 100%)' }}
								/>
							)}
							<span style={{ position: 'absolute', left: 11, top: 9, fontFamily: "'Spline Sans Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.82)', zIndex: 2 }}>
								{tag}
							</span>
							<span style={{ position: 'absolute', right: 11, top: 11, width: 9, height: 9, borderRadius: '50%', zIndex: 2, background: dotColor, boxShadow: '0 0 0 3px rgba(255,255,255,.35)' }} />
							<div className="vd-cap" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14, background: 'linear-gradient(180deg,rgba(0,0,0,0) 42%,rgba(18,26,20,.76))', zIndex: 2 }}>
								<div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, fontWeight: 600, color: '#fff', lineHeight: 1.05 }}>{artwork.title}</div>
								<div style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,.82)', marginTop: 4 }}>
									{artwork.year}{artwork.seriesName ? ` · ${artwork.seriesName}` : ''}
								</div>
							</div>
						</a>
					)
				})}
			</div>

			{/* Legend */}
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 26, fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: 'var(--muted)' }}>
				<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
					<span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--verde)', display: 'inline-block' }} />
					{labels.legendAvailable}
				</span>
				<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
					<span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
					{labels.legendRequest}
				</span>
				<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
					<span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9a8d77', display: 'inline-block' }} />
					{labels.legendSold}
				</span>
			</div>
		</>
	)
}
