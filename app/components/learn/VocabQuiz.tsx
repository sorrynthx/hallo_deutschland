// app/components/learn/VocabQuiz.tsx
'use client'

import { useState } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'
import { VocabItem } from '../../types'
import { ARTICLE_COLOR } from '../../constants'
import { useQuizLogic } from '../../hooks/useQuizLogic'
import { ProgressBar } from '../ui/ProgressBar'
import { QuizCard } from '../ui/QuizCard'

interface VocabQuizProps {
    items: VocabItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

/**
 * VocabQuiz 컴포넌트: 단어 암기 여부를 묻는 형태의 퀴즈입니다.
 * '알아요/몰라요' 버튼을 통해 상태가 기록되며 카드가 뒤집혀 뜻을 보여줍니다.
 */
export default function VocabQuiz({ items, locationLabel, onComplete, partCollected = false }: VocabQuizProps) {
    // 퀴즈 공통 상태(진행도, 점수) 관리 훅
    const { index, done, score, currentItem: current, handleNext, handleRetry } = useQuizLogic(items)

    // 카드가 뒤집혔는지 여부를 관리하는 로컬 상태
    const [flipped, setFlipped] = useState(false)

    // 사용자가 방금 누른 답변('know' 또는 'unknown')을 잠시 시각적으로 표시하기 위한 상태
    const [result, setResult] = useState<'know' | 'unknown' | null>(null)

    // React 공식 권장 패턴(렌더링 중 상태 업데이트)을 사용하여 인덱스 변경 시 로컬 상태 초기화
    const [prevIndex, setPrevIndex] = useState(index)

    if (index !== prevIndex) {
        setPrevIndex(index)
        setFlipped(false)
        setResult(null)
    }

    /**
     * 답변 버튼('알아요', '몰라요')을 눌렀을 때 실행됩니다.
     * 결과(result) 상태를 잠시 유지하여 테두리 색상 등에 피드백을 주고,
     * 일정 시간(600ms) 지연 후에 실질적인 '다음 문제로 넘어가기' 로직(handleNext)을 호출합니다.
     */
    const handleAnswer = (answer: 'know' | 'unknown') => {
        setResult(answer)
        setTimeout(() => {
            handleNext(answer === 'know')
        }, 600)
    }

    // 처음부터 다시 풀기 시 훅의 상태 리셋과 로컬 상태 리셋을 동시에 수행합니다.
    const onRetry = () => {
        handleRetry()
        setFlipped(false)
        setResult(null)
    }

    if (done) return (
        <CompleteScreen
            score={score}
            onRetry={onRetry}
            onComplete={onComplete}
            partCollected={partCollected}
        />
    )
    if (!current) return <EmptyState subMessage={`${locationLabel} 단어 준비중...`} />

    return (
        <>
            <ProgressBar current={index + 1} total={items.length} label="진행" />

            <div className="flex-1 flex flex-col p-4 gap-3.5 overflow-y-auto">
                <div className="flex items-end gap-2.5">
                    <div className="float-anim text-[36px] shrink-0" style={{ animationDuration: '2s' }}>🐶</div>
                    <div className="bg-[var(--bg-panel)] border-[1.5px] border-[rgba(255,255,255,.1)] rounded-[12px_12px_12px_2px] py-2.5 px-3 flex-1">
                        <div className="text-[10px] text-[var(--text-secondary)]">이 단어... 아는가요?</div>
                        <div className="text-[9px] text-[var(--text-dim)] mt-0.5 italic">Kennst du dieses Wort?</div>
                    </div>
                </div>

                <QuizCard onClick={() => setFlipped(f => !f)} className="cursor-pointer text-center transition-[outline] duration-200" style={{
                    outline: result === 'know' ? '2px solid var(--mint)' : result === 'unknown' ? '2px solid var(--wrong)' : 'none',
                }}>
                    {!flipped ? (
                        <div className="py-3">
                            {current.article && (
                                <div className="text-[11px] font-mono font-bold mb-1.5" style={{ color: ARTICLE_COLOR[current.article] ?? 'var(--text-secondary)' }}>
                                    {current.article}
                                    {current.plural && <span className="text-[var(--text-dim)] font-normal"> · pl. {current.plural}</span>}
                                </div>
                            )}
                            <div className="text-[32px] font-bold text-[var(--text-primary)] tracking-[.04em]">{current.word}</div>
                            <div className="text-[13px] text-[var(--mint)] mt-1.5 font-mono">{current.pronunciation}</div>
                            <div className="text-[10px] text-[var(--text-dim)] mt-2.5 font-mono">탭하면 예문 보기 👆</div>
                        </div>
                    ) : (
                        <div className="py-2 text-left">
                            <div className="text-[22px] font-bold text-[var(--text-primary)] text-center mb-3">{current.meaning}</div>
                            <div className="border-t border-[rgba(255,255,255,.08)] pt-3">
                                <div className="text-[11px] text-[var(--text-secondary)] italic mb-1">{current.example}</div>
                                <div className="text-[11px] text-[var(--mint)] font-mono mb-0.5">{current.example_pronunciation}</div>
                                <div className="text-[11px] text-[var(--text-dim)]">{current.example_translation}</div>
                            </div>
                            {current.tags?.length > 0 && (
                                <div className="flex gap-1 flex-wrap mt-2.5">
                                    {current.tags.map(tag => (
                                        <span key={tag} className="badge bg-[rgba(78,205,196,.08)] border border-[rgba(78,205,196,.2)] text-[var(--text-dim)] text-[8px]">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </QuizCard>
            </div>

            <div style={{ padding: '12px 16px 20px', display: 'flex', gap: '10px' }}>
                <button className="btn btn-wrong" disabled={!!result} onClick={() => handleAnswer('unknown')}
                    style={{ flex: 1, padding: '16px', fontSize: '14px', fontWeight: 700, opacity: result && result !== 'unknown' ? 0.4 : 1 }}>
                    ❌ 몰라요
                </button>
                <button className="btn btn-correct glow-pulse" disabled={!!result} onClick={() => handleAnswer('know')}
                    style={{ flex: 1, padding: '16px', fontSize: '14px', fontWeight: 700, opacity: result && result !== 'know' ? 0.4 : 1 }}>
                    ⭕ 알아요!
                </button>
            </div>
        </>
    )
}