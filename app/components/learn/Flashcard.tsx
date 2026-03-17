// app/components/learn/Flashcard.tsx
'use client'

import { useState } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'
import { VocabItem } from '../../types'
import { ARTICLE_COLOR } from '../../constants'
import { useQuizLogic } from '../../hooks/useQuizLogic'
import { ProgressBar } from '../ui/ProgressBar'

interface FlashcardProps {
    items: VocabItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

/**
 * Flashcard 컴포넌트: 사용자가 카드를 탭하여 뜻을 확인한 후 스스로 알았는지 판별하는 학습 도구입니다.
 */
export default function Flashcard({ items, locationLabel, onComplete, partCollected = false }: FlashcardProps) {
    // 진행도, 점수 관리를 담당하는 커스텀 훅
    const { index, done, score, currentItem: current, handleNext, handleRetry } = useQuizLogic(items)

    // 현재 단어 카드가 뒤집혔는지(뜻, 예문 등이 보이는 상태인지) 여부
    const [flipped, setFlipped] = useState(false)

    // React 공식 패턴(렌더링 중 상태 업데이트)을 사용하여 인덱스 변경 시 로컬 상태 초기화
    const [prevIndex, setPrevIndex] = useState(index)

    if (index !== prevIndex) {
        setPrevIndex(index)
        setFlipped(false)
    }

    /**
     * 답변을 처리하는 함수입니다.
     * 'know' (알아요)를 선택하면 점수가 오르고, 'unknown' (어려워요)를 선택하면 오답 처리 후 다음 카드로 넘어갑니다.
     */
    const handleAnswer = (answer: 'know' | 'unknown') => {
        handleNext(answer === 'know')
    }

    // 결과 화면에서 '다시 풀기'를 눌렀을 때의 동작
    const onRetry = () => {
        handleRetry()
        setFlipped(false)
    }

    if (done) return (
        <CompleteScreen
            score={score}
            knowLabel="알아요 😄"
            unknownLabel="어려워요 😕"
            onRetry={onRetry}
            onComplete={onComplete}
            partCollected={partCollected}
        />
    )
    if (!current) return <EmptyState subMessage={`${locationLabel} 카드 준비중...`} />

    return (
        <>
            <ProgressBar current={index + 1} total={items.length} label="카드" />

            <div className="flex-1 flex flex-col p-4 gap-4 justify-center">
                <div onClick={() => setFlipped(f => !f)} className="bg-[var(--bg-panel)] rounded-[18px] py-8 px-5 cursor-pointer text-center min-h-[240px] flex flex-col items-center justify-center gap-3 transition-[border-color] duration-300" style={{
                    border: `2px solid ${flipped ? 'rgba(78,205,196,.5)' : 'rgba(255,255,255,.15)'}`,
                    boxShadow: flipped ? '0 0 20px rgba(78,205,196,.15)' : 'none',
                }}>
                    {!flipped ? (
                        <>
                            {current.article && (
                                <div className="text-[12px] font-mono font-bold" style={{ color: ARTICLE_COLOR[current.article] ?? 'var(--text-secondary)' }}>
                                    {current.article}
                                    {current.plural && <span className="text-[var(--text-dim)] font-normal"> · pl. {current.plural}</span>}
                                </div>
                            )}
                            <div className="text-[36px] font-bold text-[var(--text-primary)]">{current.word}</div>
                            <div className="text-[14px] text-[var(--mint)] font-mono">{current.pronunciation}</div>
                            <div className="mt-2 text-[10px] text-[var(--text-dim)] font-mono">탭해서 뒤집기 🃏</div>
                        </>
                    ) : (
                        <>
                            <div className="text-[28px] font-bold text-[var(--text-primary)]">{current.meaning}</div>
                            <div className="w-[40px] h-[1px] bg-[rgba(78,205,196,.3)]" />
                            <div className="text-[12px] text-[var(--text-secondary)] italic">{current.example}</div>
                            <div className="text-[11px] text-[var(--mint)] font-mono">{current.example_pronunciation}</div>
                            <div className="text-[11px] text-[var(--text-dim)]">{current.example_translation}</div>
                        </>
                    )}
                </div>

                <div className="flex gap-2.5">
                    <button className="btn btn-wrong flex-1 p-3.5 text-[13px] font-bold" onClick={() => handleAnswer('unknown')}>
                        😕 어려워요
                    </button>
                    <button className="btn btn-correct flex-1 p-3.5 text-[13px] font-bold" onClick={() => handleAnswer('know')}>
                        😄 알아요!
                    </button>
                </div>
                <div className="text-center text-[9px] text-[var(--text-dim)] font-mono">
                    카드를 탭해서 뜻을 확인한 후 답해요
                </div>
            </div>
        </>
    )
}