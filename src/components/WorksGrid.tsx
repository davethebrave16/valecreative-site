import { useState } from 'react'
import { getLocalePath } from '@/i18n/utils'

export interface WorkItem {
	id: string
	title: string
	slug: string
	year: number
	availability: 'for_sale' | 'sold' | 'not_for_sale'
	origin?: 'personal' | 'commissioned'
	categoryIds?: string[]
	dimensions?: { width?: number; height?: number; unit?: string }
	coverImage?: { thumb?: string; medium?: string; original?: string; alt?: string }
	seriesName?: string
}

interface CategoryOption {
	id: string
	name: string
	coverImage?: { thumb?: string; medium?: string; original?: string; alt?: string }
}

interface Props {
	artworks: WorkItem[]
	categories: CategoryOption[]
	locale?: string
	labels: {
		filterPersonal: string
		filterCommissioned: string
		countSuffix: string
		legendAvailable: string
		legendSold: string
		selectCategoryHint: string
		availability: Record<string, string>
		orientation: Record<string, string>
	}
}

const CATEGORY_GRADS = [
	'linear-gradient(155deg,#33473b 0%,#5d6b4d 40%,#b68a3c 100%)',
	'radial-gradient(120% 110% at 72% 18%,#c98f5a 0%,#4a5640 50%,#20281f 100%)',
	'linear-gradient(160deg,#2e403a 0%,#7d8a6a 54%,#e3c277 100%)',
	'radial-gradient(120% 120% at 40% 82%,#b68a3c 0%,#5a4632 42%,#232e26 100%)',
]

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
	return 'var(--rose)'
}

function firstCategoryFor(origin: 'personal' | 'commissioned', artworks: WorkItem[], categories: CategoryOption[]) {
	const originFiltered = artworks.filter((a) => a.origin === origin)
	const visible = categories.filter((cat) => originFiltered.some((a) => a.categoryIds?.includes(cat.id)))
	return visible[0]?.id ?? null
}

export default function WorksGrid({ artworks, categories, locale, labels }: Props) {
	const [originFilter, setOriginFilter] = useState<'personal' | 'commissioned'>('personal')
	const [categoryFilter, setCategoryFilter] = useState<string | null>(() =>
		firstCategoryFor('personal', artworks, categories)
	)

	const originFiltered = artworks.filter((a) => a.origin === originFilter)

	const visibleCategories = categories.filter((cat) =>
		originFiltered.some((a) => a.categoryIds?.includes(cat.id))
	)

	const filtered = categoryFilter
		? originFiltered.filter((a) => a.categoryIds?.includes(categoryFilter))
		: []

	function handleOriginChange(next: 'personal' | 'commissioned') {
		setOriginFilter(next)
		setCategoryFilter(firstCategoryFor(next, artworks, categories))
	}

	const originTabs: { key: 'personal' | 'commissioned'; label: string }[] = [
		{ key: 'personal', label: labels.filterPersonal },
		{ key: 'commissioned', label: labels.filterCommissioned },
	]

	return (
		<>
			{/* Legend */}
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, margin: '0 0 22px', fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: 'var(--muted)' }}>
				<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
					<span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--verde)', display: 'inline-block' }} />
					{labels.legendAvailable}
				</span>
				<span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
					<span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rose)', display: 'inline-block' }} />
					{labels.legendSold}
				</span>
			</div>

			{/* Origin tabs */}
			<div style={{ display: 'flex', gap: 6, margin: '30px 0 0', borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
				{originTabs.map(({ key, label }) => (
					<button
						key={key}
						onClick={() => handleOriginChange(key)}
						style={{
							fontFamily: "'Spline Sans Mono', monospace",
							fontSize: 11,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
							padding: '8px 18px',
							border: 'none',
							background: 'none',
							cursor: 'pointer',
							color: originFilter === key ? 'var(--forest)' : 'var(--muted)',
							borderBottom: originFilter === key ? '2px solid var(--forest)' : '2px solid transparent',
							marginBottom: -1,
							transition: 'color 0.15s, border-color 0.15s',
						}}
					>
						{label}
					</button>
				))}
			</div>

			{/* Category grid */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, margin: '18px 0 22px' }}>
				{visibleCategories.map((cat, i) => {
					const imgSrc = cat.coverImage?.thumb ?? cat.coverImage?.medium ?? cat.coverImage?.original
					const isActive = cat.id === categoryFilter

					return (
						<button
							key={cat.id}
							onClick={() => setCategoryFilter(cat.id)}
							style={{
								position: 'relative',
								aspectRatio: '1 / 1',
								borderRadius: 5,
								overflow: 'hidden',
								padding: 0,
								cursor: 'pointer',
								border: isActive ? '2px solid var(--verde)' : '2px solid transparent',
								boxShadow: isActive ? '0 0 0 1px var(--verde)' : 'none',
								transition: 'border-color 0.2s, box-shadow 0.2s',
							}}
						>
							{imgSrc ? (
								<img
									src={imgSrc}
									alt={cat.coverImage?.alt ?? cat.name}
									loading="lazy"
									style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
								/>
							) : (
								<div style={{ position: 'absolute', inset: 0, background: CATEGORY_GRADS[i % CATEGORY_GRADS.length] }} />
							)}
							<div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 10, background: 'linear-gradient(180deg,rgba(0,0,0,0) 42%,rgba(18,26,20,.76))' }}>
								<span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.1, textAlign: 'left' }}>
									{cat.name}
								</span>
							</div>
						</button>
					)
				})}
			</div>

			{categoryFilter ? (
				<>
					<div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0 0 14px' }}>
						<span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)' }}>
							{filtered.length} {labels.countSuffix}
						</span>
					</div>

					{/* Masonry grid */}
					<div className="vd-grid">
						{filtered.map((artwork) => {
							const orient = getOrientation(artwork.dimensions)
							const imgSrc = artwork.coverImage?.thumb ?? artwork.coverImage?.medium ?? artwork.coverImage?.original
							const avail = artwork.availability
							const dotColor = availabilityColor(avail)
							const firstCategory = categories.find(c => artwork.categoryIds?.includes(c.id))
							const tag = firstCategory ? `[ ${firstCategory.name} ]` : ''

							return (
								<a
									key={artwork.id}
									href={getLocalePath(locale, `/works/${artwork.slug}`)}
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
									<span
										title={labels.availability[avail] ?? avail}
										style={{ position: 'absolute', right: 11, top: 11, width: 15, height: 15, borderRadius: '50%', zIndex: 2, background: dotColor, boxShadow: '0 0 0 4px rgba(255,255,255,.35)' }}
									/>
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
				</>
			) : (
				<p style={{ fontSize: 14, color: 'var(--muted)', margin: '4px 0 0' }}>{labels.selectCategoryHint}</p>
			)}
		</>
	)
}
