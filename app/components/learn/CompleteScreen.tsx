// app/components/learn/CompleteScreen.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuizCard } from '../ui/QuizCard'

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
            const timer = setTimeout(() => setShowPart(true), 400)
            return () => clearTimeout(timer)
        }
    }, [onComplete, partCollected])

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5">
            <div className="float-anim text-[64px]">🐶</div>

            <div className="text-center">
                <div className="text-[10px] text-[var(--mint)] font-mono font-bold mb-2">
                    COMPLETE!
                </div>
                <div className="text-[22px] font-bold text-[var(--text-primary)]">
                    수고했어요!
                </div>
            </div>

            {/* 부품 획득 */}
            {showPart && (
                <div className="bg-[rgba(78,205,196,.12)] border-2 border-[var(--mint)] rounded-[14px] px-5 py-3.5 text-center animate-[slide-up_.4s_cubic-bezier(.22,1,.36,1)]">
                    <div className="text-[32px] mb-1.5 ufo-glow">🛸</div>
                    <div className="text-[10px] text-[var(--mint)] font-mono font-bold mb-1">
                        PART COLLECTED!
                    </div>
                    <div className="text-[13px] text-[var(--text-primary)] font-bold">
                        우주선 부품 획득!
                    </div>
                </div>
            )}

            {/* 점수 */}
            <QuizCard className="w-full flex gap-3">
                <div className="flex-1 text-center">
                    <div className="text-[28px] font-bold text-[var(--mint)]">{score.know}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-mono">{knowLabel}</div>
                </div>
                <div className="w-[1px] bg-[rgba(255,255,255,.1)]" />
                <div className="flex-1 text-center">
                    <div className="text-[28px] font-bold text-[var(--wrong)]">{score.unknown}</div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-mono">{unknownLabel}</div>
                </div>
            </QuizCard>

            <div className="flex flex-col gap-2.5 w-full">
                <button
                    className="btn btn-mint w-full p-3.5 text-[13px]"
                    onClick={onRetry}
                >
                    🔄 다시 풀기
                </button>
                <button
                    className="btn w-full p-3.5 text-[13px] border-[rgba(255,255,255,.2)] text-[var(--text-secondary)]"
                    onClick={() => router.back()}
                >
                    ← 마을로 돌아가기
                </button>
            </div>
        </div>
    )
}