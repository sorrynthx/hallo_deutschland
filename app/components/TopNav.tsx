'use client'

import { useLevel } from '../contexts/LevelContext'
import { useRouter, usePathname } from 'next/navigation'

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const

export default function TopNav() {
  const { level, setLevel } = useLevel()
  const router = useRouter()
  const pathname = usePathname()

  // Hide on quiz and grammar pages — those have their own header
  if (pathname !== '/') return null

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '2.5px solid var(--gray-300)',
        background: 'var(--white)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <button
        onClick={() => router.push('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span style={{ fontSize: 28 }}>🐶</span>
        <span style={{ fontWeight: 900, color: 'var(--green)', fontSize: 14, letterSpacing: '0.08em', lineHeight: 1 }}>
          HALLO DE
        </span>
      </button>

      {/* Level Selector */}
      <div style={{ display: 'flex', gap: 6 }}>
        {LEVELS.map((l) => {
          const active = level === l
          return (
            <button
              key={l}
              onClick={() => setLevel(l)}
              style={{
                fontFamily: 'inherit',
                fontWeight: 800,
                fontSize: 13,
                padding: '6px 10px',
                borderRadius: 10,
                border: '2.5px solid',
                borderColor: active ? 'var(--blue-shadow)' : 'var(--gray-300)',
                borderBottomWidth: active ? 4 : 4,
                background: active ? 'var(--blue)' : 'var(--white)',
                color: active ? 'var(--white)' : 'var(--gray-500)',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
                lineHeight: 1,
              }}
            >
              {l}
            </button>
          )
        })}
      </div>
    </header>
  )
}
