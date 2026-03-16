// app/mission/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Ticker from '../components/Ticker'

interface LocationMeta {
    id: string
    icon: string
    label: string
    korean: string
    color: string
    colorBorder: string
    levels: string[]
}

const LEARN_TYPES = [
    { id: 'vocabulary', icon: '📝', label: '단어 퀴즈' },
    { id: 'grammar', icon: '🔬', label: '문법 퀴즈' },
    { id: 'conversation', icon: '💬', label: '대화 퀴즈' },
    { id: 'expressions', icon: '🔊', label: '표현 정리' },
]

export default function MissionPage() {
    const router = useRouter()
    const [locations, setLocations] = useState<LocationMeta[]>([])

    useEffect(() => {
        fetch('/data/locations.json')
            .then(r => r.json())
            .then(data => setLocations(data.locations ?? []))
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
            <Header title="오늘의 미션" showBack onBack={() => router.back()} />

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* 강아지 말풍선 */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <div className="float-anim" style={{ fontSize: '36px', flexShrink: 0 }}>🐶</div>
                    <div style={{ background: 'var(--bg-panel)', border: '1.5px solid rgba(255,255,255,.1)', borderRadius: '12px 12px 12px 2px', padding: '10px 12px', flex: 1 }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>빨리! 독일어를 배워야 해!</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px', fontStyle: 'italic' }}>Beeil dich! Ich muss Deutsch lernen!</div>
                    </div>
                </div>

                {/* 미션 상태 */}
                <div style={{ background: 'var(--bg-panel)', border: '1.5px solid rgba(78,205,196,.3)', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>MISSION STATUS</div>
                        <div className="ufo-glow" style={{ fontSize: '24px' }}>🛸</div>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>마을 곳곳을 탐험하며 독일어를 배워요</div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: '25%' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>진행중</span>
                        <span style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace' }}>2 / 8 부품</span>
                    </div>
                </div>

                <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>
                    AVAILABLE MISSIONS — 장소를 선택하세요
                </div>

                {/* 미션 카드 */}
                {locations.map(loc => (
                    <div key={loc.id} style={{
                        background: 'var(--bg-panel)',
                        border: `1.5px solid ${loc.colorBorder ?? 'rgba(255,255,255,.1)'}`,
                        borderRadius: '14px',
                    }}>
                        {/* 장소 헤더 */}
                        <div style={{
                            padding: '12px 14px',
                            borderBottom: '1px solid rgba(255,255,255,.06)',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            background: 'rgba(255,255,255,.02)',
                        }}>
                            <span style={{ fontSize: '22px' }}>{loc.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {loc.label}
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '6px' }}>
                                        {loc.korean}
                                    </span>
                                </div>
                                <div style={{ fontSize: '9px', color: loc.color, fontFamily: 'Space Mono, monospace', marginTop: '2px' }}>
                                    {loc.levels.map(l => l.toUpperCase()).join(' · ')}
                                </div>
                            </div>
                        </div>

                        {/* 학습 유형 버튼 2x2 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                            {LEARN_TYPES.map((type, i) => (
                                <button
                                    key={type.id}
                                    onClick={() => router.push(`/learn/${loc.id}/${type.id}?level=${loc.levels[0]}`)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        borderTop: '1px solid rgba(255,255,255,.04)',
                                        borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,.04)' : 'none',
                                        color: 'var(--text-secondary)',
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        fontSize: '11px', fontFamily: 'Space Mono, monospace',
                                        transition: 'background .15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.04)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <span style={{ fontSize: '14px' }}>{type.icon}</span>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

            </div>

            <Ticker messages={['★ BEEIL DICH! ★ 오늘의 미션을 완료하자! ★ VIEL ERFOLG! ★']} />
        </div>
    )
}