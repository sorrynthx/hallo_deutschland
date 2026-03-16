// app/components/Header.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useProgress } from '../hooks/useProgress'

interface HeaderProps {
    title?: string
    showBack?: boolean
    onBack?: () => void
}

export default function Header({
    title = '독일 마을',
    showBack = false,
    onBack,
}: HeaderProps) {
    const router = useRouter()
    const { totalCollected, totalScore } = useProgress()
    const collected = totalCollected()

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 30,
            background: 'rgba(30, 18, 53, 0.92)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(78,205,196,.2)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
        }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                {showBack ? (
                    <button onClick={onBack} className="no-select" style={{
                        background: 'rgba(78,205,196,.1)', border: '1.5px solid rgba(78,205,196,.4)',
                        borderRadius: '8px', color: 'var(--mint)',
                        fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700,
                        padding: '6px 12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0,
                    }}>
                        ← 뒤로
                    </button>
                ) : (
                    <div onClick={() => router.push('/')} style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: '#3d2460', border: '2px solid var(--mint)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', boxShadow: '0 0 10px rgba(78,205,196,.4)',
                        flexShrink: 0, cursor: 'pointer',
                    }}>🐶</div>
                )}

                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '8px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700, letterSpacing: '.08em' }}>
                        🛸 우주에서 온 강아지
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {title}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <span className="badge badge-gold">
                    ⭐ {totalScore.toLocaleString()}
                </span>
                <span
                    className={`badge badge-mint ${collected > 0 ? 'glow-pulse' : ''}`}
                    style={{ animationDuration: '2.5s', cursor: 'pointer' }}
                    onClick={() => router.push('/parts')}
                >
                    ⚙ {collected} / 8
                </span>
            </div>

        </header>
    )
}