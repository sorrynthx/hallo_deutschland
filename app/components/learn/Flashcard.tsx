// app/components/learn/Flashcard.tsx
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

interface FlashcardProps {
    items: VocabItem[]
    locationLabel: string
    onComplete?: () => void
    partCollected?: boolean
}

export default function Flashcard({ items, locationLabel, onComplete, partCollected = false }: FlashcardProps) {
    const [index, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [done, setDone] = useState(false)
    const [score, setScore] = useState({ know: 0, unknown: 0 })

    useEffect(() => {
        setIndex(0); setFlipped(false); setDone(false); setScore({ know: 0, unknown: 0 })
    }, [items])

    const current = items[index]

    const handleAnswer = (answer: 'know' | 'unknown') => {
        setScore(prev => ({ ...prev, [answer]: prev[answer] + 1 }))
        if (index + 1 >= items.length) { setDone(true) }
        else { setIndex(i => i + 1); setFlipped(false) }
    }

    const handleRetry = () => {
        setIndex(0); setFlipped(false); setDone(false); setScore({ know: 0, unknown: 0 })
    }

    if (done) return (
        <CompleteScreen
            score={score}
            knowLabel="알아요 😄"
            unknownLabel="어려워요 😕"
            onRetry={handleRetry}
            onComplete={onComplete}
            partCollected={partCollected}
        />
    )
    if (!current) return <EmptyState subMessage={`${locationLabel} 카드 준비중...`} />

    return (
        <>
            <div style={{ padding: '10px 16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>카드</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>{index + 1} / {items.length}</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${(index / items.length) * 100}%` }} /></div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px', justifyContent: 'center' }}>
                <div onClick={() => setFlipped(f => !f)} style={{
                    background: 'var(--bg-panel)',
                    border: `2px solid ${flipped ? 'rgba(78,205,196,.5)' : 'rgba(255,255,255,.15)'}`,
                    borderRadius: '18px', padding: '32px 20px', cursor: 'pointer',
                    textAlign: 'center', minHeight: '240px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    transition: 'border-color .3s',
                    boxShadow: flipped ? '0 0 20px rgba(78,205,196,.15)' : 'none',
                }}>
                    {!flipped ? (
                        <>
                            {current.article && (
                                <div style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace', fontWeight: 700, color: ARTICLE_COLOR[current.article] ?? 'var(--text-secondary)' }}>
                                    {current.article}
                                    {current.plural && <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}> · pl. {current.plural}</span>}
                                </div>
                            )}
                            <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-primary)' }}>{current.word}</div>
                            <div style={{ fontSize: '14px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace' }}>{current.pronunciation}</div>
                            <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>탭해서 뒤집기 🃏</div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>{current.meaning}</div>
                            <div style={{ width: '40px', height: '1px', background: 'rgba(78,205,196,.3)' }} />
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{current.example}</div>
                            <div style={{ fontSize: '11px', color: 'var(--mint)', fontFamily: 'Space Mono, monospace' }}>{current.example_pronunciation}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{current.example_translation}</div>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-wrong" onClick={() => handleAnswer('unknown')}
                        style={{ flex: 1, padding: '14px', fontSize: '13px', fontWeight: 700 }}>😕 어려워요</button>
                    <button className="btn btn-correct" onClick={() => handleAnswer('know')}
                        style={{ flex: 1, padding: '14px', fontSize: '13px', fontWeight: 700 }}>😄 알아요!</button>
                </div>
                <div style={{ textAlign: 'center', fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>
                    카드를 탭해서 뜻을 확인한 후 답해요
                </div>
            </div>
        </>
    )
}