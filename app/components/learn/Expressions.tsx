// app/components/learn/Expressions.tsx
'use client'

import { useState } from 'react'
import EmptyState from './EmptyState'

interface Alternative {
    phrase: string
    pronunciation: string
    nuance: string
}

interface Response {
    text: string
    pronunciation: string
    translation: string
}

interface ExpressionItem {
    id: string
    phrase: string
    pronunciation: string
    meaning: string
    usage: string
    alternatives: Alternative[]
    responses: Response[]
    week: string
}

interface ExpressionsProps {
    items: ExpressionItem[]
    locationLabel: string
    onComplete?: () => void  // ← 추가 (스크롤 끝에서 호출)
}

function ExpressionCard({ item }: { item: ExpressionItem }) {
    const [expanded, setExpanded] = useState(false)

    const handleTTS = (text: string) => {
        if (!('speechSynthesis' in window)) return
        const utt = new SpeechSynthesisUtterance(text)
        utt.lang = 'de-DE'
        utt.rate = 0.85
        window.speechSynthesis.speak(utt)
    }

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{item.phrase}</div>
                    <div style={{ fontSize: '12px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', marginBottom: '4px' }}>{item.pronunciation}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.meaning}</div>
                </div>
                <button onClick={() => handleTTS(item.phrase)} style={{ background: 'rgba(78,205,196,.1)', border: '1.5px solid rgba(78,205,196,.4)', borderRadius: '10px', padding: '8px 10px', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}>
                    🔊
                </button>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-dim)', background: 'rgba(255,255,255,.04)', borderRadius: '6px', padding: '8px 10px' }}>
                💬 {item.usage}
            </div>

            <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', color: 'var(--mint)', fontSize: '10px', fontFamily: 'Space Mono, monospace', fontWeight: 700, cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                {expanded ? '▲ 접기' : '▼ 비슷한 표현 / 응답'}
            </button>

            {expanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.alternatives?.length > 0 && (
                        <div>
                            <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '6px' }}>비슷한 표현</div>
                            {item.alternatives.map((alt, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', padding: '8px 0', borderBottom: i < item.alternatives.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{alt.phrase}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace' }}>{alt.pronunciation}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{alt.nuance}</div>
                                    </div>
                                    <button onClick={() => handleTTS(alt.phrase)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>🔊</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {item.responses?.length > 0 && (
                        <div>
                            <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '6px' }}>응답 예시</div>
                            {item.responses.map((res, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', background: 'rgba(255,255,255,.03)', borderRadius: '6px', marginBottom: '4px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{res.text}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace' }}>{res.pronunciation}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{res.translation}</div>
                                    </div>
                                    <button onClick={() => handleTTS(res.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>🔊</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default function Expressions({ items, locationLabel, onComplete }: ExpressionsProps) {
    if (!items?.length) return <EmptyState subMessage={`${locationLabel} 표현 준비중...`} />

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace', marginBottom: '4px' }}>
                총 {items.length}개 표현 · 🔊 버튼으로 발음 들어보기
            </div>
            {items.map(item => <ExpressionCard key={item.id} item={item} />)}

            {/* 모두 읽었으면 완료 버튼 */}
            <button
                className="btn btn-mint"
                style={{ padding: '14px', fontSize: '13px', marginTop: '8px' }}
                onClick={onComplete}
            >
                ✓ 모두 읽었어요!
            </button>
        </div>
    )
}