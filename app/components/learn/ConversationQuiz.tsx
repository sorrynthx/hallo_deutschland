// app/components/learn/ConversationQuiz.tsx
'use client'

import { useState, useEffect } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'

interface DialogueLine {
    role: string
    text: string
    pronunciation: string
    translation: string
    isQuestion?: boolean
}

interface Choice {
    text: string
    pronunciation: string
    translation: string
}

interface ConversationItem {
    id: string
    situation: string
    situation_icon: string
    dialogue: DialogueLine[]
    choices: Choice[]
    answer: string
    explanation: string
    grammar_point: string
    week: string
}

interface ConversationQuizProps {
    items: ConversationItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

const ROLE_COLOR: Record<string, string> = {
    Patient: '#78b4e0',
    Arzt: '#6BCB77',
    Rezeptionist: '#FFB450',
    staff: '#FFB450',
    customer: '#78b4e0',
    waiter: '#6BCB77',
    person_a: '#78b4e0',
    person_b: '#c4a8ff',
}

function ConversationCard({ item, onNext }: { item: ConversationItem; onNext: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<string | null>(null)
    const isCorrect = selected === item.answer

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px' }}>
                <span style={{ fontSize: '20px' }}>{item.situation_icon}</span>
                <div>
                    <div style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>SITUATION</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.situation}</div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.dialogue.map((line, i) => {
                    const isRight = ['patient', 'customer', 'person_b'].includes(line.role.toLowerCase())
                    const color = ROLE_COLOR[line.role] ?? '#a090c0'
                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isRight ? 'flex-end' : 'flex-start', gap: '2px' }}>
                            <div style={{ fontSize: '8px', color, fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '2px' }}>{line.role.toUpperCase()}</div>
                            <div style={{ maxWidth: '85%', padding: '10px 12px', borderRadius: isRight ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: isRight ? 'rgba(120,180,224,.12)' : 'var(--bg-panel)', border: `1px solid ${isRight ? 'rgba(120,180,224,.3)' : 'rgba(255,255,255,.08)'}` }}>
                                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{line.text}</div>
                                <div style={{ fontSize: '10px', color, fontFamily: 'Space Mono, monospace' }}>{line.pronunciation}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>{line.translation}</div>
                            </div>
                        </div>
                    )
                })}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{ fontSize: '8px', color: '#c4a8ff', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '2px' }}>YOU</div>
                    {!selected ? (
                        <div style={{ maxWidth: '85%', padding: '10px 12px', borderRadius: '12px 12px 2px 12px', background: 'rgba(196,168,255,.08)', border: '1.5px dashed rgba(196,168,255,.4)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>뭐라고 할까요? 👇</div>
                        </div>
                    ) : (
                        <div style={{ maxWidth: '85%', padding: '10px 12px', borderRadius: '12px 12px 2px 12px', background: isCorrect ? 'rgba(78,205,196,.12)' : 'rgba(232,138,138,.12)', border: `1.5px solid ${isCorrect ? 'rgba(78,205,196,.4)' : 'rgba(232,138,138,.4)'}` }}>
                            <div style={{ fontSize: '12px', color: isCorrect ? 'var(--mint)' : 'var(--wrong)', fontWeight: 600 }}>{selected}</div>
                        </div>
                    )}
                </div>
            </div>

            {!selected && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {item.choices.map((choice, i) => (
                        <button key={i} className="btn" onClick={() => setSelected(choice.text)}
                            style={{ padding: '12px', textAlign: 'left', background: 'rgba(0,0,0,.2)', borderColor: 'rgba(255,255,255,.15)', color: 'var(--text-primary)', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>{choice.text}</div>
                            <div style={{ fontSize: '10px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace' }}>{choice.pronunciation}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{choice.translation}</div>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <div style={{ background: isCorrect ? 'rgba(78,205,196,.08)' : 'rgba(232,138,138,.08)', border: `1px solid ${isCorrect ? 'rgba(78,205,196,.3)' : 'rgba(232,138,138,.3)'}`, borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isCorrect ? 'var(--mint)' : 'var(--wrong)', fontFamily: 'Space Mono, monospace' }}>
                        {isCorrect ? '✓ 정답!' : `✗ 정답: ${item.answer}`}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.explanation}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: '6px', marginTop: '2px' }}>
                        💡 {item.grammar_point}
                    </div>
                </div>
            )}

            {selected && (
                <button className="btn btn-mint" style={{ padding: '14px', fontSize: '13px' }} onClick={() => onNext(isCorrect)}>
                    다음 대화 →
                </button>
            )}
        </div>
    )
}

export default function ConversationQuiz({ items, locationLabel, onComplete, partCollected = false }: ConversationQuizProps) {
    const [index, setIndex] = useState(0)
    const [done, setDone] = useState(false)
    const [score, setScore] = useState({ know: 0, unknown: 0 })

    useEffect(() => { setIndex(0); setDone(false); setScore({ know: 0, unknown: 0 }) }, [items])

    const current = items[index]

    const handleNext = (correct: boolean) => {
        setScore(prev => ({ ...prev, know: prev.know + (correct ? 1 : 0), unknown: prev.unknown + (correct ? 0 : 1) }))
        if (index + 1 >= items.length) setDone(true)
        else setIndex(i => i + 1)
    }

    const handleRetry = () => { setIndex(0); setDone(false); setScore({ know: 0, unknown: 0 }) }

    if (done) return <CompleteScreen score={score} knowLabel="정답 ✓" unknownLabel="오답 ✗" onRetry={handleRetry} onComplete={onComplete} partCollected={partCollected} />
    if (!current) return <EmptyState subMessage={`${locationLabel} 대화 준비중...`} />

    return (
        <>
            <div style={{ padding: '10px 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>대화</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>{index + 1} / {items.length}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(index / items.length) * 100}%` }} /></div>
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                <ConversationCard key={current.id} item={current} onNext={handleNext} />
            </div>
        </>
    )
}