// app/components/learn/ConversationQuiz.tsx
'use client'

import { useState } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'
import { ConversationItem } from '../../types'
import { ROLE_COLOR } from '../../constants'
import { useQuizLogic } from '../../hooks/useQuizLogic'
import { ProgressBar } from '../ui/ProgressBar'
import { FeedbackBanner } from '../ui/FeedbackBanner'

interface ConversationQuizProps {
    items: ConversationItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

function ConversationCard({ item, onNext }: { item: ConversationItem; onNext: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<string | null>(null)
    const isCorrect = selected === item.answer

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 py-2 px-3 bg-[var(--bg-panel)] border border-[rgba(255,255,255,.08)] rounded-[10px]">
                <span className="text-[20px]">{item.situation_icon}</span>
                <div>
                    <div className="text-[9px] text-[var(--mint)] font-mono font-bold">SITUATION</div>
                    <div className="text-[12px] font-bold text-[var(--text-primary)]">{item.situation}</div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {item.dialogue.map((line, i) => {
                    const isRight = ['patient', 'customer', 'person_b'].includes(line.role.toLowerCase())
                    const color = ROLE_COLOR[line.role] ?? '#a090c0'
                    return (
                        <div key={i} className={`flex flex-col gap-0.5 ${isRight ? 'items-end' : 'items-start'}`}>
                            <div className="text-[8px] font-mono font-bold mb-0.5" style={{ color }}>{line.role.toUpperCase()}</div>
                            <div className="max-w-[85%] py-2.5 px-3" style={{
                                borderRadius: isRight ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                background: isRight ? 'rgba(120,180,224,.12)' : 'var(--bg-panel)',
                                border: `1px solid ${isRight ? 'rgba(120,180,224,.3)' : 'rgba(255,255,255,.08)'}`
                            }}>
                                <div className="text-[12px] text-[var(--text-primary)] font-semibold mb-1">{line.text}</div>
                                <div className="text-[10px] font-mono" style={{ color }}>{line.pronunciation}</div>
                                <div className="text-[10px] text-[var(--text-dim)] mt-0.5">{line.translation}</div>
                            </div>
                        </div>
                    )
                })}

                <div className="flex flex-col items-end gap-0.5">
                    <div className="text-[8px] text-[#c4a8ff] font-mono font-bold mb-0.5">YOU</div>
                    {!selected ? (
                        <div className="max-w-[85%] py-2.5 px-3 rounded-[12px_12px_2px_12px] bg-[rgba(196,168,255,.08)] border-[1.5px] border-dashed border-[rgba(196,168,255,.4)]">
                            <div className="text-[11px] text-[var(--text-dim)] font-mono">뭐라고 할까요? 👇</div>
                        </div>
                    ) : (
                        <div className="max-w-[85%] py-2.5 px-3 rounded-[12px_12px_2px_12px]" style={{
                            background: isCorrect ? 'rgba(78,205,196,.12)' : 'rgba(232,138,138,.12)',
                            border: `1.5px solid ${isCorrect ? 'rgba(78,205,196,.4)' : 'rgba(232,138,138,.4)'}`
                        }}>
                            <div className={`text-[12px] font-semibold ${isCorrect ? 'text-[var(--mint)]' : 'text-[var(--wrong)]'}`}>{selected}</div>
                        </div>
                    )}
                </div>
            </div>

            {!selected && (
                <div className="flex flex-col gap-1.5">
                    {item.choices.map((choice, i) => (
                        <button key={i} className="btn flex-col items-start gap-0.5 p-3 text-left bg-[rgba(0,0,0,.2)] border-[rgba(255,255,255,.15)] text-[var(--text-primary)]" onClick={() => setSelected(choice.text)}>
                            <div className="text-[12px] font-semibold">{choice.text}</div>
                            <div className="text-[10px] text-[var(--mint)] font-mono">{choice.pronunciation}</div>
                            <div className="text-[10px] text-[var(--text-dim)]">{choice.translation}</div>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <FeedbackBanner
                    isCorrect={isCorrect}
                    correctAnswer={item.answer}
                    explanation={item.explanation}
                    grammarPoint={item.grammar_point}
                />
            )}

            {selected && (
                <button className="btn btn-mint p-3.5 text-[13px]" onClick={() => onNext(isCorrect)}>
                    다음 대화 →
                </button>
            )}
        </div>
    )
}

/**
 * ConversationQuiz 컴포넌트: 주어진 대화 항목(items)을 순서대로 표시하고 사용자의 응답을 처리합니다.
 * - items: 대화 문제 목록 (JSON에서 파싱된 배열)
 * - onComplete: 퀴즈가 완전히 끝났을 때 상위 컴포넌트로 완료를 알리는 콜백
 */
export default function ConversationQuiz({ items, locationLabel, onComplete, partCollected = false }: ConversationQuizProps) {
    // 커스텀 훅을 통해 현재 인덱스, 퀴즈 완료 여부, 그리고 다음 문제로 넘어가는 함수를 가져옵니다.
    const { index, done, score, currentItem: current, handleNext, handleRetry } = useQuizLogic(items)

    // 퀴즈를 모두 완료(done === true)하면 CompleteScreen을 렌더링합니다.
    if (done) return <CompleteScreen score={score} knowLabel="정답 ✓" unknownLabel="오답 ✗" onRetry={handleRetry} onComplete={onComplete} partCollected={partCollected} />

    // 데이터가 없거나 잘못되었을 때 표시할 빈 화면입니다.
    if (!current) return <EmptyState subMessage={`${locationLabel} 대화 준비중...`} />

    return (
        <>
            {/* 상단 공통 UI 컴포넌트로 문제 진행 상황 표시 */}
            <ProgressBar current={index + 1} total={items.length} label="대화" />
            <div className="flex-1 p-4 overflow-y-auto">
                {/*
                    현재 문제를 렌더링하고, 사용자가 선택을 마쳐 '다음 대화' 버튼을 누르면
                    handleNext 콜백이 실행되어 상위 상태(score, index)가 업데이트됩니다.
                */}
                <ConversationCard key={current.id} item={current} onNext={handleNext} />
            </div>
        </>
    )
}