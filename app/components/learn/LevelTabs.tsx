// app/components/learn/LevelTabs.tsx
'use client'

const LEVEL_LABELS: Record<string, string> = {
    baby: 'BABY', a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2',
}

interface LevelTabsProps {
    availableLevels: string[]
    level: string
    onSelect: (level: string) => void
}

export default function LevelTabs({ availableLevels, level, onSelect }: LevelTabsProps) {
    return (
        <div style={{
            display: 'flex', gap: '6px', padding: '10px 16px',
            background: 'var(--bg-panel)',
            borderBottom: '1px solid rgba(255,255,255,.06)',
            overflowX: 'auto',
        }}>
            {availableLevels.map(lv => (
                <button
                    key={lv}
                    onClick={() => onSelect(lv)}
                    style={{
                        padding: '4px 12px', borderRadius: '20px',
                        fontSize: '10px', fontFamily: 'Space Mono, monospace', fontWeight: 700,
                        cursor: 'pointer', border: '1.5px solid', flexShrink: 0,
                        background: level === lv ? 'var(--mint)' : 'transparent',
                        borderColor: level === lv ? 'var(--mint)' : 'rgba(255,255,255,.15)',
                        color: level === lv ? 'var(--mint-dark)' : 'var(--text-secondary)',
                    }}
                >
                    {LEVEL_LABELS[lv] ?? lv.toUpperCase()}
                </button>
            ))}
        </div>
    )
}