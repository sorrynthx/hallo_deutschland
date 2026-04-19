'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useLevel } from '../../contexts/LevelContext'

const CARD_COUNT = 5

function Loader() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div className="spin" style={{ width: 36, height: 36, borderRadius: '50%', border: '4px solid var(--gray-300)', borderTopColor: 'var(--green)' }} />
      <p style={{ fontWeight: 700, color: 'var(--gray-500)', fontSize: 15 }}>단어 불러오는 중...</p>
    </div>
  )
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 8 }}>🚧</div>
      <p style={{ fontWeight: 900, fontSize: 20, color: 'var(--gray-900)' }}>단어 데이터 준비 중!</p>
      <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.5 }}>이 토픽의 단어가 아직 없어요.</p>
      <div style={{ marginTop: 16, width: '100%', maxWidth: 240 }}>
        <button className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </div>
    </div>
  )
}

function DoneScreen({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 20, textAlign: 'center' }}>
      <div className="pop-in" style={{ fontSize: 80 }}>🎉</div>
      <p style={{ fontWeight: 900, fontSize: 26, color: 'var(--green)' }}>훌륭해요!</p>
      <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-500)', lineHeight: 1.5 }}>오늘의 단어 학습을 완료했어요.</p>
      <div style={{ marginTop: 8, width: '100%', maxWidth: 280 }}>
        <button className="btn btn-green" onClick={onBack}>다른 토픽 학습하기</button>
      </div>
    </div>
  )
}

export default function QuizPage({ params }: { params: Promise<{ topic: string }> }) {
  const router = useRouter()
  const { level } = useLevel()
  const { topic } = use(params)

  const [words, setWords] = useState<any[]>([])
  const [topicLabel, setTopicLabel] = useState('')
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    setLoading(true)
    setIdx(0)
    setFlipped(false)

    fetch(`/data/vocabulary/${level.toLowerCase()}/${topic}.json`)
      .then(async r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(d => {
        setTopicLabel(d.topic_label ?? topic)
        const shuffled = [...(d.words ?? [])].sort(() => Math.random() - 0.5)
        setWords(shuffled.slice(0, CARD_COUNT))
      })
      .catch(() => setWords([]))
      .finally(() => setLoading(false))
  }, [level, topic])

  const handleFlip = () => {
    if (flipped) return
    setFlipped(true)
    setShowButtons(true)
  }

  const handleNext = () => {
    setFlipped(false)
    setShowButtons(false)
    setTimeout(() => setIdx(i => i + 1), 180)
  }

  const back = () => router.push('/quiz')
  const progress = (idx / CARD_COUNT) * 100
  const word = words[idx]
  const done = !loading && idx >= words.length && words.length > 0

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)', minHeight: '100dvh' }}>

      {/* ── TOP BAR ── */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '2px solid var(--gray-100)' }}>
        <button
          onClick={back}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', fontSize: 22, fontWeight: 900, padding: 4, lineHeight: 1, flexShrink: 0 }}
        >
          ✕
        </button>

        {/* Progress Bar */}
        <div style={{ flex: 1, height: 16, borderRadius: 999, background: 'var(--gray-300)', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${progress}%`,
            background: 'var(--green)', borderRadius: 999,
            transition: 'width 0.4s cubic-bezier(0.34,1.2,0.64,1)',
          }} />
          <div style={{ position: 'absolute', top: 3, left: 6, right: 6, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: 999 }} />
        </div>
      </div>

      {/* ── BODY ── */}
      {loading ? <Loader /> :
       words.length === 0 ? <EmptyState onBack={back} /> :
       done ? <DoneScreen onBack={back} /> : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 20px 32px' }}>

          {/* Topic label + counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{
              fontWeight: 800, fontSize: 12, color: 'var(--green)',
              background: 'var(--green-light)', border: '1.5px solid #a3d977',
              padding: '4px 12px', borderRadius: 999,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {topicLabel}
            </span>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--gray-500)' }}>
              {idx + 1} / {CARD_COUNT}
            </span>
          </div>

          {/* ── FLASH CARD ── */}
          <div
            onClick={handleFlip}
            className="pop-in"
            style={{ flex: 1, maxHeight: 340, cursor: flipped ? 'default' : 'pointer', perspective: '1000px' }}
          >
            <div style={{
              width: '100%', height: '100%', position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* FRONT */}
              <div style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                background: 'var(--white)',
                border: '3px solid var(--gray-300)', borderBottomWidth: 5,
                borderRadius: 24,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '32px 24px', gap: 8,
              }}>
                {word?.article && (
                  <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {word.article}
                  </span>
                )}
                <h2 style={{ fontWeight: 900, fontSize: 42, color: 'var(--gray-900)', textAlign: 'center', lineHeight: 1.2, wordBreak: 'break-word' }}>
                  {word?.word}
                </h2>
                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '6px 16px', borderRadius: 999, display: 'inline-block' }}>
                    탭하여 뒤집기 👆
                  </span>
                </div>
              </div>

              {/* BACK */}
              <div style={{
                position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--green-light)',
                border: '3px solid #a3d977', borderBottomWidth: 5,
                borderRadius: 24,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '28px 24px', gap: 10, overflowY: 'auto',
              }}>
                <p style={{ fontWeight: 900, fontSize: 34, color: 'var(--green-dark)', textAlign: 'center', lineHeight: 1.2 }}>
                  {word?.meaning}
                </p>
                <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--green-dark)', background: 'rgba(255,255,255,0.6)', padding: '5px 14px', borderRadius: 999 }}>
                  {word?.pronunciation}
                </p>
                {word?.example && (
                  <div style={{ marginTop: 8, background: 'var(--white)', border: '2px solid #c6eda0', borderRadius: 14, padding: '14px 18px', textAlign: 'center', width: '100%' }}>
                    <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--gray-900)', marginBottom: 4, lineHeight: 1.4 }}>{word.example}</p>
                    <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.4, marginBottom: word.example_pronunciation ? 6 : 0 }}>{word.example_translation}</p>
                    {word.example_pronunciation && (
                      <p style={{ fontWeight: 600, fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4, borderTop: '1px solid #e8f7d8', paddingTop: 6 }}>
                        🔊 {word.example_pronunciation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div style={{
            marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10,
            opacity: showButtons ? 1 : 0,
            pointerEvents: showButtons ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
          }}>
            <button className="btn btn-green" onClick={handleNext}>✓&nbsp; 알고 있어요</button>
            <button className="btn btn-ghost" onClick={handleNext}>↩&nbsp; 다시 학습할게요</button>
          </div>
        </div>
      )}
    </main>
  )
}
