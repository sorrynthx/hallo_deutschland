'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useLevel } from '../contexts/LevelContext'

/* ── helpers ──────────────────────────────────────── */

/** topic 문자열에서 짧은 태그 레이블 추출
 *  예) "Das Verb 'sein' (~이다)"  →  "sein"
 *      "Akkusativ (4격 목적어 변화)"  →  "Akkusativ"
 */
function extractTagLabel(topic: string): string {
  const beforeParen = topic.split('(')[0].trim()
  return beforeParen
    .replace(/^Das Verb\s+/i, '')
    .replace(/^Die Verben\s+/i, '')
    .replace(/'/g, '')
    .trim()
}

/** 레슨이 검색어와 매칭되는지 확인 (한/영/독 통합) */
function lessonMatchesSearch(lesson: any, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  const fields: string[] = [
    lesson.topic ?? '',
    lesson.explanation ?? '',
    ...(lesson.examples ?? []).flatMap((e: any) => [e.german ?? '', e.korean ?? '', e.pronunciation ?? '']),
    ...(lesson.conjugation_table ?? []).map((r: any) => `${r.pronoun ?? ''} ${r.form ?? ''}`),
  ]
  return fields.some(f => f.toLowerCase().includes(q))
}

/* ── page ─────────────────────────────────────────── */

export default function GrammarPage() {
  const router = useRouter()
  const { level } = useLevel()
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setSearchQuery('')
    setActiveTag(null)
    fetch(`/data/grammar/${level.toLowerCase()}.json`)
      .then(async r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(d => setLessons(d.lessons ?? []))
      .catch(() => setLessons([]))
      .finally(() => setLoading(false))
  }, [level])

  /* 레슨에서 태그 목록 생성 */
  const tags = useMemo(
    () => lessons.map(l => ({ id: l.id, label: extractTagLabel(l.topic) })),
    [lessons],
  )

  /* 필터링된 레슨 */
  const filteredLessons = useMemo(() => {
    let result = lessons
    if (activeTag) result = result.filter(l => l.id === activeTag)
    if (searchQuery.trim()) result = result.filter(l => lessonMatchesSearch(l, searchQuery.trim()))
    return result
  }, [lessons, activeTag, searchQuery])

  const isFiltered = !!(activeTag || searchQuery.trim())

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    if (q.trim()) setActiveTag(null)
  }

  const handleTag = (id: string) => {
    if (activeTag === id) {
      setActiveTag(null)
    } else {
      setActiveTag(id)
      setSearchQuery('')
    }
  }

  const clearAll = () => {
    setActiveTag(null)
    setSearchQuery('')
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--gray-100)', minHeight: '100dvh' }}>

      {/* ── STICKY HEADER ── */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '2.5px solid var(--gray-300)',
        position: 'sticky', top: 0, zIndex: 30,
      }}>

        {/* 진행 바 행 */}
        <div style={{
          padding: '16px 16px 12px',
          display: 'flex', alignItems: 'center', gap: 12,
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

        {/* 검색 바 + 태그 (레슨이 있을 때만) */}
        {!loading && lessons.length > 0 && (
          <>
            {/* 검색 바 */}
            <div style={{ padding: '0 16px 10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--gray-100)',
                border: '2px solid',
                borderColor: searchQuery ? 'var(--blue)' : 'var(--gray-300)',
                borderRadius: 14,
                padding: '10px 14px',
                transition: 'border-color 0.15s ease',
              }}>
                <span style={{ fontSize: 16, color: searchQuery ? 'var(--blue)' : 'var(--gray-500)', flexShrink: 0, transition: 'color 0.15s' }}>
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="검색... / Search... / Suche..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 15,
                    color: 'var(--gray-900)',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      background: 'var(--gray-300)',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--gray-700)',
                      fontSize: 11,
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 999,
                      lineHeight: 1.4,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 태그 버튼 행 */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                padding: '0 16px 14px',
                scrollbarWidth: 'none',
              }}
            >
              {/* 전체 태그 */}
              <button
                onClick={clearAll}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: `2px solid ${!isFiltered ? 'var(--blue)' : 'var(--gray-300)'}`,
                  background: !isFiltered ? 'var(--blue)' : 'var(--white)',
                  color: !isFiltered ? 'var(--white)' : 'var(--gray-600)',
                  fontFamily: 'inherit',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                전체 ({lessons.length})
              </button>

              {/* 레슨별 태그 */}
              {tags.map(tag => {
                const isActive = activeTag === tag.id
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTag(tag.id)}
                    style={{
                      flexShrink: 0,
                      padding: '6px 14px',
                      borderRadius: 999,
                      border: `2px solid ${isActive ? 'var(--green)' : 'var(--gray-300)'}`,
                      background: isActive ? 'var(--green)' : 'var(--white)',
                      color: isActive ? 'var(--white)' : 'var(--gray-600)',
                      fontFamily: 'inherit',
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, padding: '24px 16px 48px', display: 'flex', flexDirection: 'column', gap: 0 }}>

        <h1 style={{ fontWeight: 900, fontSize: 26, color: 'var(--gray-900)', marginBottom: 20 }}>
          <span style={{ color: 'var(--green)' }}>{level}</span> 핵심 문법
        </h1>

        {loading ? (
          /* 로딩 */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 60 }}>
            <div className="spin" style={{ width: 36, height: 36, borderRadius: '50%', border: '4px solid var(--gray-300)', borderTopColor: 'var(--blue)' }} />
            <p style={{ fontWeight: 700, color: 'var(--gray-500)', fontSize: 15 }}>레슨 불러오는 중...</p>
          </div>

        ) : lessons.length === 0 ? (
          /* 데이터 없음 */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 64 }}>🚧</div>
            <p style={{ fontWeight: 900, fontSize: 20, color: 'var(--gray-900)' }}>{level} 레벨 준비 중!</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.5 }}>이 레벨의 문법 데이터가 아직 없어요.</p>
            <div style={{ marginTop: 16, width: '100%', maxWidth: 240 }}>
              <button className="btn btn-ghost" onClick={() => router.back()}>돌아가기</button>
            </div>
          </div>

        ) : filteredLessons.length === 0 ? (
          /* 검색 결과 없음 */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 64 }}>🔍</div>
            <p style={{ fontWeight: 900, fontSize: 20, color: 'var(--gray-900)' }}>검색 결과 없음</p>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.5 }}>
              {searchQuery
                ? `"${searchQuery}"에 해당하는 문법이 없어요.`
                : '해당 태그의 내용이 없어요.'}
            </p>
            <div style={{ marginTop: 16, width: '100%', maxWidth: 240 }}>
              <button
                className="btn btn-ghost"
                onClick={clearAll}
              >
                전체 보기
              </button>
            </div>
          </div>

        ) : (
          /* 레슨 카드 목록 */
          <>
            {isFiltered && (
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>
                {filteredLessons.length}개 결과
                {searchQuery && ` · "${searchQuery}"`}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredLessons.map((lesson, i) => (
                <LessonCard key={lesson.id} lesson={lesson} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

/* ── LessonCard ───────────────────────────────────── */

function LessonCard({ lesson, index }: { lesson: any; index: number }) {
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
