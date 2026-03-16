// app/levels/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Ticker from '../components/Ticker'

interface LevelInfo {
    id: string
    label: string
    labelDe: string
    description: string
    locationCount: number
    isCurrent: boolean
}

const LEVELS: LevelInfo[] = [
    { id: 'baby', label: '유아', labelDe: 'Anfänger', description: '알파벳, 색깔, 숫자 등 가장 기초 단어', locationCount: 0, isCurrent: false },
    { id: 'a1', label: 'A1 입문', labelDe: 'Grundstufe A1', description: '간단한 인사, 자기소개, 일상 표현', locationCount: 0, isCurrent: true },
    { id: 'a2', label: 'A2 초급', labelDe: 'Grundstufe A2', description: '쇼핑, 교통, 음식 주문 등 일상 회화', locationCount: 0, isCurrent: false },
    { id: 'b1', label: 'B1 중급', labelDe: 'Mittelstufe B1', description: '여행, 직장, 감정 표현 등 폭넓은 주제', locationCount: 0, isCurrent: false },
    { id: 'b2', label: 'B2 중상급', labelDe: 'Mittelstufe B2', 'description': '뉴스, 토론, 복잡한 문장 구조', locationCount: 0, isCurrent: false },
    { id: 'c1', label: 'C1 고급', labelDe: 'Oberstufe C1', description: '전문적인 주제, 관용표현, 뉘앙스', locationCount: 0, isCurrent: false },
    { id: 'c2', label: 'C2 최고급', labelDe: 'Oberstufe C2', description: '원어민 수준의 표현, 문학, 학술', locationCount: 0, isCurrent: false },
]

const LEVEL_COLORS: Record<string, string> = {
    baby: '#a0c8e0',
    a1: '#4ECDC4',
    a2: '#6BCB77',
    b1: '#FFB450',
    b2: '#FF8C42',
    c1: '#c4a8ff',
    c2: '#e88a8a',
}

export default function LevelsPage() {
    const router = useRouter()
    const [levels, setLevels] = useState(LEVELS)

    useEffect(() => {
        fetch('/data/locations.json')
            .then(r => r.json())
            .then(data => {
                const locations = data.locations ?? []
                // 레벨별 location 개수 계산
                const countMap: Record<string, number> = {}
                locations.forEach((loc: { levels: string[] }) => {
                    loc.levels.forEach(lv => {
                        countMap[lv] = (countMap[lv] ?? 0) + 1
                    })
                })
                setLevels(prev => prev.map(lv => ({ ...lv, locationCount: countMap[lv.id] ?? 0 })))
            })
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
            <Header title="레벨 선택" showBack onBack={() => router.back()} />

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* 안내 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '28px' }}>🐶</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        원하는 레벨을 자유롭게 선택할 수 있어요!
                    </div>
                </div>

                {levels.map(lv => {
                    const color = LEVEL_COLORS[lv.id] ?? 'var(--mint)'
                    const hasData = lv.locationCount > 0
                    const isComingSoon = ['c1', 'c2'].includes(lv.id)

                    return (
                        <div
                            key={lv.id}
                            onClick={() => hasData && router.push('/')}
                            style={{
                                background: 'var(--bg-panel)',
                                border: `1.5px solid ${lv.isCurrent ? color : 'rgba(255,255,255,.08)'}`,
                                borderRadius: '14px', padding: '14px 16px',
                                cursor: hasData ? 'pointer' : 'default',
                                opacity: isComingSoon ? 0.5 : 1,
                                position: 'relative', overflow: 'hidden',
                            }}
                        >
                            {/* current 강조 라인 */}
                            {lv.isCurrent && (
                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: color, borderRadius: '3px 0 0 3px' }} />
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: lv.isCurrent ? color : 'var(--text-primary)' }}>
                                            {lv.label}
                                        </div>
                                        {lv.isCurrent && (
                                            <span className="badge" style={{ background: `${color}22`, border: `1px solid ${color}88`, color, fontSize: '8px' }}>
                                                ▶ 현재
                                            </span>
                                        )}
                                        {isComingSoon && (
                                            <span className="badge" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', color: 'var(--text-dim)', fontSize: '8px' }}>
                                                준비중
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '10px', color, fontFamily: 'Space Mono, monospace', marginBottom: '4px' }}>
                                        {lv.labelDe}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                        {lv.description}
                                    </div>
                                </div>

                                {/* 장소 개수 */}
                                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                    <div style={{ fontSize: '20px', fontWeight: 700, color: hasData ? color : 'var(--text-dim)' }}>
                                        {lv.locationCount}
                                    </div>
                                    <div style={{ fontSize: '8px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>
                                        장소
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>

            <Ticker messages={['★ WÄHLE DEIN LEVEL! ★ 레벨을 선택하세요! ★ VIEL SPASS! ★']} />
        </div>
    )
}