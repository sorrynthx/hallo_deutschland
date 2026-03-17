// app/components/learn/GrammarQuiz.tsx
'use client'

import { useState } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'
import { GrammarItem } from '../../types'
import { useQuizLogic } from '../../hooks/useQuizLogic'
import { ProgressBar } from '../ui/ProgressBar'
import { FeedbackBanner } from '../ui/FeedbackBanner'
import { QuizCard } from '../ui/QuizCard'

interface GrammarQuizProps {
    items: GrammarItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

function FillBlank({ item, onNext }: { item: GrammarItem; onNext: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<string | null>(null)
    const isCorrect = selected === item.answer

    return (
        <div className="flex flex-col gap-3.5">
            <div className="bg-[var(--bg-panel)] border border-[rgba(78,205,196,.2)] rounded-[10px] py-2.5 px-3.5">
                <div className="text-[9px] text-[var(--mint)] font-mono font-bold mb-1">GRAMMAR POINT</div>
                <div className="text-[12px] font-bold text-[var(--text-primary)]">{item.topic}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-1">{item.topic_explanation}</div>
            </div>

            <QuizCard className="text-center p-5">
                <div className="text-[18px] font-bold text-[var(--text-primary)] leading-[1.8] whitespace-pre-wrap break-keep">
                    {item.question.split('____').map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <span className="inline-block min-w-[60px] px-2 mx-1" style={{
                                    borderBottom: `2px solid ${selected ? (isCorrect ? 'var(--mint)' : 'var(--wrong)') : 'rgba(78,205,196,.5)'}`,
                                    color: selected ? (isCorrect ? 'var(--mint)' : 'var(--wrong)') : 'transparent',
                                }}>
                                    {selected ?? ''}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
                <div className="text-[11px] text-[var(--text-dim)] mt-2">{item.question_translation}</div>
            </QuizCard>

            <div className="grid grid-cols-2 gap-2">
                {item.options.map(opt => {
                    let bg = 'rgba(0,0,0,.2)', border = 'rgba(255,255,255,.15)', color = 'var(--text-primary)'
                    if (selected) {
                        if (opt === item.answer) { bg = 'rgba(78,205,196,.15)'; border = 'var(--mint)'; color = 'var(--mint)' }
                        else if (opt === selected) { bg = 'rgba(232,138,138,.15)'; border = 'var(--wrong)'; color = 'var(--wrong)' }
                    }
                    return (
                        <button key={opt} className="btn p-3 text-[14px] font-bold" onClick={() => !selected && setSelected(opt)}
                            style={{ background: bg, borderColor: border, color }}>
                            {opt}
                        </button>
                    )
                })}
            </div>

            {selected && (
                <FeedbackBanner
                    isCorrect={isCorrect}
                    explanation={item.explanation}
                />
            )}

            {selected && item.related_table?.length > 0 && (
                <div className="bg-[var(--bg-panel)] border border-[rgba(255,255,255,.08)] rounded-[10px] overflow-hidden">
                    <div className="py-2 px-3 text-[9px] text-[var(--mint)] font-mono font-bold border-b border-[rgba(255,255,255,.06)]">RELATED TABLE</div>
                    {item.related_table.map((row, i) => (
                        <div key={i} className="flex py-2 px-3 gap-3" style={{ borderBottom: i < item.related_table.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', background: row.form === item.answer || row.dative === item.answer ? 'rgba(78,205,196,.06)' : 'transparent' }}>
                            <span className="text-[11px] text-[var(--text-dim)] font-mono min-w-[80px]">{row.pronoun}</span>
                            <span className={`text-[11px] font-bold ${row.form === item.answer || row.dative === item.answer ? 'text-[var(--mint)]' : 'text-[var(--text-secondary)]'}`}>
                                {row.form ?? row.dative}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {selected && (
                <button className="btn btn-mint p-3.5 text-[13px]" onClick={() => onNext(isCorrect)}>
                    다음 문제 →
                </button>
            )}
        </div>
    )
}

function ConjugationTable({ item, onNext }: { item: GrammarItem; onNext: (correct: boolean) => void }) {
    const [revealed, setRevealed] = useState<Set<number>>(new Set())
    const allRevealed = revealed.size === item.related_table.length

    return (
        <div className="flex flex-col gap-3.5">
            <div className="bg-[var(--bg-panel)] border border-[rgba(78,205,196,.2)] rounded-[10px] py-2.5 px-3.5">
                <div className="text-[9px] text-[var(--mint)] font-mono font-bold mb-1">CONJUGATION</div>
                <div className="text-[14px] font-bold text-[var(--text-primary)]">{item.topic}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-1">{item.topic_explanation}</div>
            </div>
            <div className="text-[11px] text-[var(--text-dim)] font-mono text-center">각 칸을 탭해서 활용형을 확인하세요</div>
            <div className="bg-[var(--bg-panel)] border border-[rgba(255,255,255,.08)] rounded-[10px] overflow-hidden">
                <div className="grid grid-cols-2 py-2 px-3 border-b border-[rgba(255,255,255,.1)] bg-[rgba(78,205,196,.06)]">
                    <span className="text-[9px] text-[var(--mint)] font-mono font-bold">PRONOUN</span>
                    <span className="text-[9px] text-[var(--mint)] font-mono font-bold">FORM</span>
                </div>
                {item.related_table.map((row, i) => (
                    <div key={i} onClick={() => setRevealed(prev => new Set([...prev, i]))}
                        className="grid grid-cols-2 py-2.5 px-3 cursor-pointer" style={{ borderBottom: i < item.related_table.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', background: revealed.has(i) ? 'rgba(78,205,196,.04)' : 'transparent' }}>
                        <span className="text-[12px] text-[var(--text-secondary)] font-mono">{row.pronoun}</span>
                        <span className="text-[13px] font-bold transition-all duration-200" style={{
                            color: revealed.has(i) ? 'var(--mint)' : 'transparent',
                            background: revealed.has(i) ? 'transparent' : 'rgba(255,255,255,.1)',
                            borderRadius: '4px',
                            padding: revealed.has(i) ? '0' : '2px 8px'
                        }}>
                            {row.form ?? row.dative ?? row.nominative}
                        </span>
                    </div>
                ))}
            </div>
            {allRevealed && (
                <button className="btn btn-mint p-3.5 text-[13px]" onClick={() => onNext(true)}>다음 문제 →</button>
            )}
        </div>
    )
}

/**
 * GrammarQuiz 컴포넌트: 문법 문제(빈칸 채우기, 활용표, 격변화표)를 렌더링하고 상태를 관리합니다.
 * - items: 문법 문제 목록 (json 배열)
 * - 현재 아이템의 type에 따라 적절한 하위 컴포넌트(FillBlank 또는 ConjugationTable)를 동적으로 표시합니다.
 */
export default function GrammarQuiz({ items, locationLabel, onComplete, partCollected = false }: GrammarQuizProps) {
    // 퀴즈 진행 상태 관리를 위한 공통 훅 사용
    const { index, done, score, currentItem: current, handleNext, handleRetry } = useQuizLogic(items)

    // 퀴즈를 모두 완료한 경우
    if (done) return <CompleteScreen score={score} knowLabel="정답 ✓" unknownLabel="오답 ✗" onRetry={handleRetry} onComplete={onComplete} partCollected={partCollected} />

    // 로딩 중이거나 데이터가 없는 경우
    if (!current) return <EmptyState subMessage={`${locationLabel} 문법 준비중...`} />

    return (
        <>
            {/* 문제 진행 막대 */}
            <ProgressBar current={index + 1} total={items.length} label="문제" />
            <div className="flex-1 p-4 overflow-y-auto">
                {/*
                    current.type 을 기반으로 적합한 퀴즈 화면을 렌더링합니다.
                    key 값에 current.id를 넣으면 문제가 변경될 때 하위 컴포넌트의 상태가 완전히 리셋됩니다.
                */}
                {current.type === 'fill_blank' && <FillBlank key={current.id} item={current} onNext={handleNext} />}
                {(current.type === 'conjugation_table' || current.type === 'declension_table') && <ConjugationTable key={current.id} item={current} onNext={handleNext} />}
            </div>
        </>
    )
}