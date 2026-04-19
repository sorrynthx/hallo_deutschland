'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLevel } from '../contexts/LevelContext'

export default function GrammarPage() {
  const router = useRouter()
  const { level } = useLevel()
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/data/grammar/${level.toLowerCase()}.json`)
      .then(async r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(d => setLessons(d.lessons ?? []))
      .catch(() => setLessons([]))
      .finally(() => setLoading(false))
  }, [level])

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--gray-100)', minHeight: '100dvh' }}>

      {/* ── TOP BAR ── */}
      <div style={{
        padding: '16px 16px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--white)',
        borderBottom: '2.5px solid var(--gray-300)',
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', fontSize: 22, fontWeight: 900, padding: 4, lineHeight: 1, flexShrink: 0 }}
        >
          ✕
        </button>
        <div style={{ flex: 1, height: 16, borderRadius: 999, background: 'var(--gray-300)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: '100%', background: 'var(--blue)', borderRadius: 999 }} />
          <div style={{ position: 'absolute', top: 3, left: 6, right: 6, height: 4, background: 'rgba(255,255,255,0.35)', borderRadius: 999 }} />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, padding: '24px 16px 48px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        <h1 style={{ fontWeight: 900, fontSize: 26, color: 'var(--gray-900)', marginBottom: 20 }}>
          <span style={{ color: 'var(--green)' }}>{level}</span> 핵심 문법
        </h1>

        {loading ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 60 }}>
            <div className="spin" style={{ width: 36, height: 36, borderRadius: '50%', border: '4px solid var(--gray-300)', borderTopColor: 'var(--blue)' }} />
            <p style={{ fontWeight: 700, color: 'var(--gray-500)', fontSize: 15 }}>레슨 불러오는 중...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 64 }}>🚧</div>
            <p style={{ fontWeight: 900, fontSize: 20, color: 'var(--gray-900)' }}>{level} 레벨 준비 중!</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.5 }}>이 레벨의 문법 데이터가 아직 없어요.</p>
            <div style={{ marginTop: 16, width: '100%', maxWidth: 240 }}>
              <button className="btn btn-ghost" onClick={() => router.back()}>돌아가기</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {lessons.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function LessonCard({ lesson, index }: { lesson: any, index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="fade-up"
      style={{
        animationDelay: `${index * 0.06}s`,
        background: 'var(--white)',
        border: '2.5px solid var(--gray-300)',
        borderBottomWidth: 5,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Lesson Header */}
      <div style={{
        background: 'var(--blue)',
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 15, color: 'var(--white)', flexShrink: 0,
        }}>
          {index + 1}
        </div>
        <h2 style={{ fontWeight: 900, fontSize: 16, color: 'var(--white)', lineHeight: 1.3 }}>
          {lesson.topic}
        </h2>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 18px 0' }}>
        {/* Explanation */}
        <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)', lineHeight: 1.65, marginBottom: 16 }}>
          {lesson.explanation}
        </p>

        {/* Example */}
        {lesson.examples?.[0] && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 800, fontSize: 12, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              핵심 예문
            </p>
            <div style={{
              background: 'var(--blue-light)',
              borderLeft: '4px solid var(--blue)',
              borderRadius: '0 12px 12px 0',
              padding: '12px 14px',
            }}>
              <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-900)', marginBottom: 4, lineHeight: 1.4 }}>
                {lesson.examples[0].german}
              </p>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.4, marginBottom: lesson.examples[0].pronunciation ? 6 : 0 }}>
                {lesson.examples[0].korean}
              </p>
              {lesson.examples[0].pronunciation && (
                <p style={{
                  fontWeight: 600,
                  fontSize: 11,
                  color: 'var(--blue-dark)',
                  opacity: 0.7,
                  lineHeight: 1.4,
                  borderTop: '1px solid rgba(28,176,246,0.2)',
                  paddingTop: 6,
                  letterSpacing: '0.01em',
                }}>
                  🔊 {lesson.examples[0].pronunciation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Conjugation Table Toggle */}
        {lesson.conjugation_table && (
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 800, fontSize: 14,
                color: 'var(--gray-700)',
                padding: 0, marginBottom: open ? 12 : 0,
              }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 22, height: 22, borderRadius: '50%',
                background: open ? 'var(--green)' : 'var(--gray-300)',
                color: open ? 'var(--white)' : 'var(--gray-700)',
                fontSize: 10,
                transition: 'all 0.2s ease',
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              }}>▶</span>
              변화표 {open ? '접기' : '보기'}
            </button>

            {open && (
              <div className="fade-up" style={{
                border: '2px solid var(--gray-300)',
                borderRadius: 14,
                overflow: 'hidden',
              }}>
                {lesson.conjugation_table.map((row: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 16px',
                    background: i % 2 === 0 ? 'var(--gray-100)' : 'var(--white)',
                    borderBottom: i < lesson.conjugation_table.length - 1 ? '1px solid var(--gray-300)' : 'none',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-700)' }}>{row.pronoun}</span>
                    <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--green)' }}>{row.form}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
