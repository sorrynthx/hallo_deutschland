// app/components/learn/VocabQuiz.tsx
'use client'

import { useState, useEffect } from 'react'
import CompleteScreen from './CompleteScreen'
import EmptyState from './EmptyState'

interface VocabItem {
    id: string
    word: string
    article: string | null
    plural: string | null
    pronunciation: string
    meaning: string
    example: string
    example_translation: string
    example_pronunciation: string
    tags: string[]
    week: string
}

const ARTICLE_COLOR: Record<string, string> = {
    der: '#78b4e0',
    die: '#e88a8a',
    das: '#6BCB77',
}

interface VocabQuizProps {
    items: VocabItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

export default function VocabQuiz({ items, locationLabel, onComplete, partCollected = false }: VocabQuizProps) {
    const [index, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [result, setResult] = useState<'know' | 'unknown' | null>(null)
    const [done, setDone] = useState(false)
    const [score, setScore] = useState({ know: 0, unknown: 0 })

    useEffect(() => {
        setIndex(0); setFlipped(false); setResult(null)
        setDone(false); setScore({ know: 0, unknown: 0 })
    }, [items])

    const current = items[index]
    const progress = items.length > 0 ? (index / items.length) * 100 : 0

    const handleAnswer = (answer: 'know' | 'unknown') => {
        setResult(answer)
        setScore(prev => ({ ...prev, [answer]: prev[answer] + 1 }))
        setTimeout(() => {
            if (index + 1 >= items.length) { setDone(true) }
            else { setIndex(i => i + 1); setFlipped(false); setResult(null) }
        }, 600)
    }

    const handleRetry = () => {
        setIndex(0); setFlipped(false); setResult(null)
        setDone(false); setScore({ know: 0, unknown: 0 })
    }

    if (done) return (
        <CompleteScreen
            score={score}
            onRetry={handleRetry}
            onComplete={onComplete}
            partCollected={partCollected}
        />
    )
    if (!current) return <EmptyState subMessage={`${locationLabel} 단어 준비중...`} />

    return (
        <>
            <div style={{ padding: '10px 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>진행</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>{index + 1} / {items.length}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '14px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <div className="float-anim" style={{ fontSize: '36px', flexShrink: 0, animationDuration: '2s' }}>🐶</div>
                    <div style={{ background: 'var(--bg-panel)', border: '1.5px solid rgba(255,255,255,.1)', borderRadius: '12px 12px 12px 2px', padding: '10px 12px', flex: 1 }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>이 단어... 아는가요?</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '2px', fontStyle: 'italic' }}>Kennst du dieses Wort?</div>
                    </div>
                </div>

                <div className="card" onClick={() => setFlipped(f => !f)} style={{
                    cursor: 'pointer', textAlign: 'center',
                    outline: result === 'know' ? '2px solid var(--mint)' : result === 'unknown' ? '2px solid var(--wrong)' : 'none',
                    transition: 'outline .2s',
                }}>
                    {!flipped ? (
                        <div style={{ padding: '12px 0' }}>
                            {current.article && (
                                <div style={{ fontSize: '11px', fontFamily: 'Space Mono, monospace', fontWeight: 700, color: ARTICLE_COLOR[current.article] ?? 'var(--text-secondary)', marginBottom: '6px' }}>
                                    {current.article}
                                    {current.plural && <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}> · pl. {current.plural}</span>}
                                </div>
                            )}
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '.04em' }}>{current.word}</div>
                            <div style={{ fontSize: '13px', color: 'var(--mint)', marginTop: '6px', fontFamily: 'Space Mono, monospace' }}>{current.pronunciation}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '10px', fontFamily: 'Space Mono, monospace' }}>탭하면 예문 보기 👆</div>
                        </div>
                    ) : (
                        <div style={{ padding: '8px 0', textAlign: 'left' }}>
                            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px' }}>{current.meaning}</div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '12px' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '4px' }}>{current.example}</div>
                                <div style={{ fontSize: '11px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', marginBottom: '2px' }}>{current.example_pronunciation}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{current.example_translation}</div>
                            </div>
                            {current.tags?.length > 0 && (
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    {current.tags.map(tag => (
                                        <span key={tag} className="badge" style={{ background: 'rgba(78,205,196,.08)', border: '1px solid rgba(78,205,196,.2)', color: 'var(--text-dim)', fontSize: '8px' }}>{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
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