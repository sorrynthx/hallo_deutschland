// app/parts/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Ticker from '../components/Ticker'
import { useProgress } from '../hooks/useProgress'

interface Part {
    id: string
    name: string
    locationId: string
    locationLabel: string
    level: string
    collected: boolean
    progress: number
}

const PARTS_CONFIG = [
    { id: 'engine_coil', name: 'ENGINE COIL', locationId: 'bakery', level: 'baby' },
    { id: 'power_cell', name: 'POWER CELL', locationId: 'station', level: 'a1' },
    { id: 'nav_module', name: 'NAV MODULE', locationId: 'market', level: 'a1' },
    { id: 'antenna', name: 'ANTENNA', locationId: 'inn', level: 'a1' },
    { id: 'fuel_tank', name: 'FUEL TANK', locationId: 'hospital', level: 'a2' },
    { id: 'warp_drive', name: 'WARP DRIVE', locationId: 'library', level: 'a2' },
    { id: 'laser_cannon', name: 'LASER CANNON', locationId: 'school', level: 'b1' },
    { id: 'hyperdrive', name: 'HYPERDRIVE', locationId: 'park', level: 'b1' },
]

const PART_ICONS: Record<string, string> = {
    engine_coil: '🔩',
    power_cell: '🔋',
    nav_module: '🧭',
    antenna: '📡',
    fuel_tank: '🛢',
    warp_drive: '🌀',
    laser_cannon: '🔦',
    hyperdrive: '🚀',
}

export default function PartsPage() {
    const router = useRouter()
    const { isCollected, getProgressPct } = useProgress()
    const [parts, setParts] = useState<Part[]>([])

    useEffect(() => {
        fetch('/data/locations.json')
            .then(r => r.json())
            .then(data => {
                const locationMap: Record<string, string> = {}
                    ; (data.locations ?? []).forEach((loc: { id: string; label: string }) => {
                        locationMap[loc.id] = loc.label
                    })
                const ps: Part[] = PARTS_CONFIG.map(p => ({
                    ...p,
                    locationLabel: locationMap[p.locationId] ?? p.locationId,
                    collected: isCollected(p.locationId, p.level),
                    progress: getProgressPct(p.locationId, p.level),
                }))
                setParts(ps)
            })
    }, [isCollected, getProgressPct])

    const collected = parts.filter(p => p.collected).length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
            <Header title="우주선 수리" showBack onBack={() => router.back()} />

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* UFO + 강아지 */}
                <div style={{ textAlign: 'center', padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div className="float-anim ufo-glow" style={{ fontSize: '56px' }}>🛸</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🐶</span>
                        <div style={{ background: 'var(--bg-panel)', border: '1.5px solid rgba(78,205,196,.3)', borderRadius: '10px 10px 10px 2px', padding: '8px 12px' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                {collected < 8 ? `아직 ${8 - collected}개가 더 필요해!` : '모든 부품을 모았어! 이제 집으로! 🎉'}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '2px' }}>
                                {collected < 8 ? `Ich brauche noch ${8 - collected} Teile!` : 'Alle Teile gesammelt!'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 전체 진행 */}
                <div style={{ background: 'var(--bg-panel)', border: '1.5px solid rgba(78,205,196,.3)', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>PARTS COLLECTED</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-gold)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
                            {collected} / 8
                        </div>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${(collected / 8) * 100}%` }} />
                    </div>
                </div>

                {/* 부품 그리드 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {parts.map(part => (
                        <div key={part.id}
                            onClick={() => !part.collected && router.push(`/learn/${part.locationId}/vocabulary?level=${part.level}`)}
                            style={{
                                background: part.collected ? 'rgba(78,205,196,.08)' : 'rgba(255,255,255,.03)',
                                border: `1.5px solid ${part.collected ? 'rgba(78,205,196,.5)' : 'rgba(255,255,255,.1)'}`,
                                borderRadius: '12px', padding: '12px',
                                cursor: part.collected ? 'default' : 'pointer',
                                display: 'flex', flexDirection: 'column', gap: '6px',
                            }}
                        >
                            <div style={{ fontSize: '24px', lineHeight: 1 }}>{PART_ICONS[part.id]}</div>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: part.collected ? 'var(--mint)' : 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>
                                {part.name}
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                                {part.locationLabel} · {part.level.toUpperCase()}
                            </div>
                            {part.collected ? (
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                                    background: 'rgba(78,205,196,.15)', border: '1px solid rgba(78,205,196,.4)',
                                    borderRadius: '20px', padding: '2px 8px',
                                    fontSize: '8px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700,
                                    alignSelf: 'flex-start',
                                }}>DONE</div>
                            ) : (
                                <>
                                    <div className="progress-track" style={{ height: '4px' }}>
                                        <div style={{ background: 'var(--horizon-top)', height: '100%', borderRadius: '20px', width: `${part.progress}%`, transition: 'width .4s' }} />
                                    </div>
                                    <div style={{ fontSize: '8px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>{part.progress}%</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            <Ticker messages={['★ SAMMLE ALLE TEILE! ★ 부품을 모아 우주로! ★ VIEL ERFOLG! ★']} />
        </div>
    )
}