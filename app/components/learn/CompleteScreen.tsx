// app/components/learn/CompleteScreen.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CompleteScreenProps {
    score: { know: number; unknown: number }
    knowLabel?: string
    unknownLabel?: string
    onRetry: () => void
    onComplete?: () => void   // ← 완료 시 호출 (localStorage 저장)
    partCollected?: boolean   // ← 부품 획득 여부
}

export default function CompleteScreen({
    score,
    knowLabel = '알아요 ⭕',
    unknownLabel = '몰라요 ❌',
    onRetry,
    onComplete,
    partCollected = false,
}: CompleteScreenProps) {
    const router = useRouter()
    const [showPart, setShowPart] = useState(false)

    useEffect(() => {
        // 완료 시 저장 호출
        onComplete?.()
        // 부품 획득이면 애니메이션
        if (partCollected) {
            setTimeout(() => setShowPart(true), 400)
        }
    }, [])

    return (
        <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px', gap: '20px',
        }}>

            <div className="float-anim" style={{ fontSize: '64px' }}>🐶</div>

            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '8px' }}>
                    COMPLETE!
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    수고했어요!
                </div>
            </div>

            {/* 부품 획득 */}
            {showPart && (
                <div style={{
                    background: 'rgba(78,205,196,.12)',
                    border: '2px solid var(--mint)',
                    borderRadius: '14px',
                    padding: '14px 20px',
                    textAlign: 'center',
                    animation: 'slide-up .4s cubic-bezier(.22,1,.36,1)',
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '6px' }} className="ufo-glow">🛸</div>
                    <div style={{ fontSize: '10px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '4px' }}>
                        PART COLLECTED!
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 700 }}>
                        우주선 부품 획득!
                    </div>
                </div>
            )}

            {/* 점수 */}
            <div className="card" style={{ width: '100%', display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--mint)' }}>{score.know}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>{knowLabel}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,.1)' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--wrong)' }}>{score.unknown}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>{unknownLabel}</div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <button
                    className="btn btn-mint"
                    style={{ width: '100%', padding: '14px', fontSize: '13px' }}
                    onClick={onRetry}
                >
                    🔄 다시 풀기
                </button>
                <button
                    className="btn"
                    style={{ width: '100%', padding: '14px', fontSize: '13px', borderColor: 'rgba(255,255,255,.2)', color: 'var(--text-secondary)' }}
                    onClick={() => router.back()}
                >
                    ← 마을로 돌아가기
                </button>
            </div>
        </div>
    )
}