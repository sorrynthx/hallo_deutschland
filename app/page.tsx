'use client'

import { useRouter } from 'next/navigation'
import { useLevel } from './contexts/LevelContext'

export default function Home() {
  const router = useRouter()
  const { level } = useLevel()

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 16px 40px', background: 'var(--white)' }}>

      {/* ── MASCOT SECTION ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 36, paddingBottom: 32 }}>
        {/* Avatar */}
        <div
          className="pop-in"
          style={{
            width: 96, height: 96,
            borderRadius: '50%',
            border: '3px solid var(--gray-300)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 52,
            background: 'var(--white)',
            marginBottom: 16,
            boxShadow: '0 4px 0 var(--gray-300)',
          }}
        >
          🐶
        </div>

        {/* Speech Bubble */}
        <div
          className="fade-up"
          style={{
            background: 'var(--white)',
            border: '2.5px solid var(--gray-300)',
            borderRadius: 16,
            padding: '14px 20px',
            textAlign: 'center',
            maxWidth: 280,
            position: 'relative',
            boxShadow: '0 4px 0 var(--gray-300)',
          }}
        >
          {/* bubble tail */}
          <div style={{
            position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '11px solid transparent',
            borderRight: '11px solid transparent',
            borderBottom: '13px solid var(--gray-300)',
          }} />
          <div style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '11px solid var(--white)',
          }} />

          <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-900)', lineHeight: 1.4 }}>
            Hallo! 나는 맥스야 🐾
          </p>
          <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-500)', marginTop: 6, lineHeight: 1.4 }}>
            오늘도 같이 독일어 공부해보자!<br />
            현재 레벨:{' '}
            <span style={{ color: 'var(--green)', fontWeight: 900, fontSize: 16 }}>{level}</span>
          </p>
        </div>
      </div>

      {/* ── MENU CARDS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Quiz Card */}
        <div className="card fade-up" style={{ animationDelay: '0.05s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--gold-light)',
              border: '2px solid var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>⚡</div>
            <div>
              <p style={{ fontWeight: 900, fontSize: 18, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: 4 }}>초스피드 단어 퀴즈</p>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.3 }}>랜덤 5개 단어를 플래시 카드로</p>
            </div>
          </div>
          <button className="btn btn-green" onClick={() => router.push('/quiz')}>
            퀴즈 시작하기
          </button>
        </div>

        {/* Grammar Card */}
        <div className="card fade-up" style={{ animationDelay: '0.12s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'var(--purple-light)',
              border: '2px solid var(--purple)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, flexShrink: 0,
            }}>📚</div>
            <div>
              <p style={{ fontWeight: 900, fontSize: 18, color: 'var(--gray-900)', lineHeight: 1.2, marginBottom: 4 }}>핵심 문법 레슨</p>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.3 }}>{level} 레벨 필수 문법 정복하기</p>
            </div>
          </div>
          <button className="btn btn-blue" onClick={() => router.push('/grammar')}>
            레슨 보기
          </button>
        </div>

      </div>
    </main>
  )
}