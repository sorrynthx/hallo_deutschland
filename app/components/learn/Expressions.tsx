// app/components/learn/Expressions.tsx
'use client'

import { useState } from 'react'
import EmptyState from './EmptyState'
import { ExpressionItem } from '../../types'
import { QuizCard } from '../ui/QuizCard'

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
        <QuizCard className="flex flex-col gap-2.5">
            <div className="flex justify-between items-start gap-2.5">
                <div className="flex-1">
                    <div className="text-[16px] font-bold text-[var(--text-primary)] mb-1">{item.phrase}</div>
                    <div className="text-[12px] text-[var(--mint)] font-mono mb-1">{item.pronunciation}</div>
                    <div className="text-[13px] text-[var(--text-secondary)]">{item.meaning}</div>
                </div>
                <button onClick={() => handleTTS(item.phrase)} className="bg-[rgba(78,205,196,.1)] border-[1.5px] border-[rgba(78,205,196,.4)] rounded-[10px] py-2 px-2.5 cursor-pointer text-[16px] shrink-0">
                    🔊
                </button>
            </div>

            <div className="text-[11px] text-[var(--text-dim)] bg-[rgba(255,255,255,.04)] rounded-[6px] py-2 px-2.5">
                💬 {item.usage}
            </div>

            <button onClick={() => setExpanded(e => !e)} className="bg-none border-none text-[var(--mint)] text-[10px] font-mono font-bold cursor-pointer text-left p-0">
                {expanded ? '▲ 접기' : '▼ 비슷한 표현 / 응답'}
            </button>

            {expanded && (
                <div className="flex flex-col gap-2.5">
                    {item.alternatives?.length > 0 && (
                        <div>
                            <div className="text-[9px] text-[var(--text-dim)] font-mono font-bold mb-1.5">비슷한 표현</div>
                            {item.alternatives.map((alt, i) => (
                                <div key={i} className="flex justify-between items-start gap-2 py-2 border-b border-[rgba(255,255,255,.04)]" style={{ borderBottom: i < item.alternatives.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                                    <div className="flex-1">
                                        <div className="text-[12px] text-[var(--text-primary)] font-semibold">{alt.phrase}</div>
                                        <div className="text-[10px] text-[var(--mint)] font-mono">{alt.pronunciation}</div>
                                        <div className="text-[10px] text-[var(--text-dim)] mt-0.5">{alt.nuance}</div>
                                    </div>
                                    <button onClick={() => handleTTS(alt.phrase)} className="bg-none border-none cursor-pointer text-[14px] shrink-0">🔊</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {item.responses?.length > 0 && (
                        <div>
                            <div className="text-[9px] text-[var(--text-dim)] font-mono font-bold mb-1.5">응답 예시</div>
                            {item.responses.map((res, i) => (
                                <div key={i} className="flex justify-between items-start gap-2 py-2 px-2.5 bg-[rgba(255,255,255,.03)] rounded-[6px] mb-1">
                                    <div className="flex-1">
                                        <div className="text-[12px] text-[var(--text-primary)] font-semibold">{res.text}</div>
                                        <div className="text-[10px] text-[var(--mint)] font-mono">{res.pronunciation}</div>
                                        <div className="text-[10px] text-[var(--text-dim)]">{res.translation}</div>
                                    </div>
                                    <button onClick={() => handleTTS(res.text)} className="bg-none border-none cursor-pointer text-[14px] shrink-0">🔊</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </QuizCard>
    )
}

/**
 * Expressions 컴포넌트: 유용한 표현 리스트를 렌더링하고 학습합니다.
 * 이 컴포넌트는 다른 퀴즈 컴포넌트들(Conversation, Grammar 등)과 달리 정답을 맞추는 로직 없이
 * 목록을 스크롤하며 학습하는 용도입니다.
 */
export default function Expressions({ items, locationLabel, onComplete }: ExpressionsProps) {
    if (!items?.length) return <EmptyState subMessage={`${locationLabel} 표현 준비중...`} />

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <div className="text-[9px] text-[var(--text-dim)] font-mono mb-1">
                총 {items.length}개 표현 · 🔊 버튼으로 발음 들어보기
            </div>
            {/* 전체 아이템들을 반복해서 카드 형태로 보여줍니다. */}
            {items.map(item => <ExpressionCard key={item.id} item={item} />)}

            {/* 모두 학습(스크롤)한 후 완료 버튼을 눌러 상태를 갱신합니다. */}
            <button
                className="btn btn-mint p-3.5 text-[13px] mt-2"
                onClick={onComplete}
            >
                ✓ 모두 읽었어요!
            </button>
        </div>
    )
}