// app/components/learn/GrammarQuiz.tsx
'use client'

import { useState, useEffect } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'

interface RelatedTableRow {
    pronoun?: string
    person?: string      // ← Gemini가 간혹 person으로 생성
    form?: string
    nominative?: string
    dative?: string
    accusative?: string
}

interface GrammarItem {
    id: string
    type: 'fill_blank' | 'conjugation_table' | 'declension_table'
    topic: string
    topic_explanation: string
    question: string
    question_translation: string
    options: string[]
    answer: string
    explanation: string
    related_table: RelatedTableRow[]
    week: string
}

interface GrammarQuizProps {
    items: GrammarItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

/* 필드명 정규화 — Gemini가 pronoun/person 혼용해서 생성할 수 있음 */
function getLabel(row: RelatedTableRow): string {
    return row.pronoun ?? row.person ?? row.nominative ?? ''
}
function getValue(row: RelatedTableRow): string {
    return row.form ?? row.dative ?? row.accusative ?? ''
}

/* ── fill_blank ── */
function FillBlank({ item, onNext }: { item: GrammarItem; onNext: (correct: boolean) => void }) {
    const [selected, setSelected] = useState<string | null>(null)
    const isCorrect = selected === item.answer

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* 문법 포인트 */}
            <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(78,205,196,.2)', borderRadius: '10px', padding: '10px 14px' }}>
                <div style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '4px' }}>GRAMMAR POINT</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.topic}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.topic_explanation}</div>
            </div>

            {/* 문제 */}
            <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.8 }}>
                    {item.question.split('____').map((part, i, arr) => (
                        <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <span style={{
                                    display: 'inline-block', minWidth: '60px',
                                    borderBottom: `2px solid ${selected ? (isCorrect ? 'var(--mint)' : 'var(--wrong)') : 'rgba(78,205,196,.5)'}`,
                                    color: selected ? (isCorrect ? 'var(--mint)' : 'var(--wrong)') : 'transparent',
                                    padding: '0 8px', margin: '0 4px',
                                }}>
                                    {selected ?? ''}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>{item.question_translation}</div>
            </div>

            {/* 보기 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {item.options.map(opt => {
                    let bg = 'rgba(0,0,0,.2)', border = 'rgba(255,255,255,.15)', color = 'var(--text-primary)'
                    if (selected) {
                        if (opt === item.answer) { bg = 'rgba(78,205,196,.15)'; border = 'var(--mint)'; color = 'var(--mint)' }
                        else if (opt === selected) { bg = 'rgba(232,138,138,.15)'; border = 'var(--wrong)'; color = 'var(--wrong)' }
                    }
                    return (
                        <button key={opt} className="btn" onClick={() => !selected && setSelected(opt)}
                            style={{ padding: '12px', fontSize: '14px', fontWeight: 700, background: bg, borderColor: border, color }}>
                            {opt}
                        </button>
                    )
                })}
            </div>

            {/* 해설 */}
            {selected && (
                <div style={{
                    background: isCorrect ? 'rgba(78,205,196,.08)' : 'rgba(232,138,138,.08)',
                    border: `1px solid ${isCorrect ? 'rgba(78,205,196,.3)' : 'rgba(232,138,138,.3)'}`,
                    borderRadius: '10px', padding: '12px',
                }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: isCorrect ? 'var(--mint)' : 'var(--wrong)', marginBottom: '4px', fontFamily: 'Space Mono, monospace' }}>
                        {isCorrect ? '✓ 정답!' : '✗ 오답'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.explanation}</div>
                </div>
            )}

            {/* 관련 표 — 빈 배열이면 숨김 */}
            {selected && item.related_table?.length > 0 && (
                <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ padding: '8px 12px', fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                        RELATED TABLE
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {item.related_table.map((row, i) => {
                            const label = getLabel(row)
                            const value = getValue(row)
                            const isHighlight = value === item.answer
                            return (
                                <div key={i} style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1.5fr',
                                    padding: '8px 12px', gap: '12px',
                                    borderBottom: i < item.related_table.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                                    background: isHighlight ? 'rgba(78,205,196,.06)' : 'transparent',
                                }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>{label}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: isHighlight ? 'var(--mint)' : 'var(--text-secondary)' }}>
                                        {value}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {selected && (
                <button className="btn btn-mint" style={{ padding: '14px', fontSize: '13px' }} onClick={() => onNext(isCorrect)}>
                    다음 문제 →
                </button>
            )}
        </div>
    )
}

/* ── conjugation_table / declension_table ── */
function ConjugationTable({ item, onNext }: { item: GrammarItem; onNext: (correct: boolean) => void }) {
    const [revealed, setRevealed] = useState<Set<number>>(new Set())
    const allRevealed = item.related_table.length > 0 && revealed.size === item.related_table.length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(78,205,196,.2)', borderRadius: '10px', padding: '10px 14px' }}>
                <div style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700, marginBottom: '4px' }}>
                    {item.type === 'declension_table' ? 'DECLENSION' : 'CONJUGATION'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.topic}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>{item.topic_explanation}</div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace', textAlign: 'center' }}>
                각 칸을 탭해서 확인하세요 👆
            </div>

            {item.related_table.length > 0 ? (
                <div style={{ background: 'var(--bg-panel)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,.1)', background: 'rgba(78,205,196,.06)' }}>
                        <span style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
                            {item.type === 'declension_table' ? 'CASE' : 'PRONOUN'}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>FORM</span>
                    </div>
                    {item.related_table.map((row, i) => {
                        const label = getLabel(row)
                        const value = getValue(row)
                        return (
                            <div key={i}
                                onClick={() => setRevealed(prev => new Set([...prev, i]))}
                                style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                                    padding: '10px 12px', cursor: 'pointer',
                                    borderBottom: i < item.related_table.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                                    background: revealed.has(i) ? 'rgba(78,205,196,.04)' : 'transparent',
                                    transition: 'background .15s',
                                }}
                            >
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>{label}</span>
                                <span style={{
                                    fontSize: '13px', fontWeight: 700,
                                    color: revealed.has(i) ? 'var(--mint)' : 'transparent',
                                    background: revealed.has(i) ? 'transparent' : 'rgba(255,255,255,.1)',
                                    borderRadius: '4px',
                                    padding: revealed.has(i) ? '0' : '2px 8px',
                                    transition: 'all .2s',
                                }}>
                                    {value}
                                </span>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '11px', fontFamily: 'Space Mono, monospace' }}>
                    표 데이터가 없어요
                </div>
            )}

            {allRevealed && (
                <button className="btn btn-mint" style={{ padding: '14px', fontSize: '13px' }} onClick={() => onNext(true)}>
                    다음 문제 →
                </button>
            )}
        </div>
    )
}

/* ── 메인 ── */
export default function GrammarQuiz({ items, locationLabel, onComplete, partCollected = false }: GrammarQuizProps) {
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

    if (done) return (
        <CompleteScreen
            score={score} knowLabel="정답 ✓" unknownLabel="오답 ✗"
            onRetry={handleRetry} onComplete={onComplete} partCollected={partCollected}
        />
    )
    if (!current) return <EmptyState subMessage={`${locationLabel} 문법 준비중...`} />

    return (
        <>
            <div style={{ padding: '10px 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>문제</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>{index + 1} / {items.length}</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${(index / items.length) * 100}%` }} />
                </div>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
                {current.type === 'fill_blank' && (
                    <FillBlank key={current.id} item={current} onNext={handleNext} />
                )}
                {(current.type === 'conjugation_table' || current.type === 'declension_table') && (
                    <ConjugationTable key={current.id} item={current} onNext={handleNext} />
                )}
            </div>
        </>
    )
}