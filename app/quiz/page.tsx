'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLevel } from '../contexts/LevelContext'

interface Topic {
    id: string
    label: string
    korean: string
    icon: string
}

function Loader() {
    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div className="spin" style={{ width: 32, height: 32, borderRadius: '50%', border: '4px solid var(--gray-300)', borderTopColor: 'var(--green)' }} />
        </div>
    )
}

export default function QuizTopicPage() {
    const router = useRouter()
    const { level } = useLevel()
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/data/index.json')
            .then(async r => {
                if (!r.ok) throw new Error('index not found')
                return r.json()
            })
            .then(d => setTopics(d.topics?.[level.toLowerCase()] ?? []))
            .catch(() => setTopics([]))
            .finally(() => setLoading(false))
    }, [level])

    return (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)', minHeight: '100dvh' }}>

            {/* ── TOP BAR ── */}
            <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2px solid var(--gray-100)' }}>
                <button
                    onClick={() => router.push('/')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', fontSize: 22, fontWeight: 900, padding: 4, lineHeight: 1 }}
                >
                    ✕
                </button>
                <h1 style={{ fontWeight: 900, fontSize: 18, color: 'var(--gray-900)' }}>
                    <span style={{ color: 'var(--green)' }}>{level}</span> 토픽 선택
                </h1>
            </div>

            {/* ── BODY ── */}
            <div style={{ flex: 1, padding: '24px 16px 40px', display: 'flex', flexDirection: 'column' }}>
                {loading ? (
                    <Loader />
                ) : topics.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 12 }}>
                        <div style={{ fontSize: 56 }}>🚧</div>
                        <p style={{ fontWeight: 900, fontSize: 20, color: 'var(--gray-900)' }}>{level} 레벨 준비 중!</p>
                        <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>
                            아직 이 레벨의 단어가 없어요.<br />곧 추가될 예정입니다.
                        </p>
                    </div>
                ) : (
                    <>
                        <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>
                            학습할 주제를 골라보세요 👇
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {topics.map((topic, i) => (
                                <button
                                    key={topic.id}
                                    className="fade-up"
                                    onClick={() => router.push(`/quiz/${topic.id}`)}
                                    style={{
                                        animationDelay: `${i * 0.06}s`,
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        background: 'var(--white)',
                                        border: '2.5px solid var(--gray-300)',
                                        borderBottomWidth: 5,
                                        borderRadius: 18,
                                        padding: '16px 18px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        fontFamily: 'inherit',
                                        transition: 'transform 0.1s, border-bottom-width 0.05s',
                                    }}
                                    onMouseDown={e => (e.currentTarget.style.transform = 'translateY(4px)', e.currentTarget.style.borderBottomWidth = '1px')}
                                    onMouseUp={e => (e.currentTarget.style.transform = '', e.currentTarget.style.borderBottomWidth = '5px')}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                                        background: 'var(--green-light)',
                                        border: '2px solid #a3d977',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 26,
                                    }}>
                                        {topic.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: 900, fontSize: 17, color: 'var(--gray-900)', marginBottom: 2 }}>
                                            {topic.label}
                                        </p>
                                        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--gray-500)' }}>
                                            {topic.korean}
                                        </p>
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--gray-300)' }}>›</div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}