'use client'

interface HeaderProps {
    title?: string
    showBack?: boolean
    onBack?: () => void
    level?: string
}

export default function Header({
    title = '독일 마을',
    showBack = false,
    onBack,
    level,
}: HeaderProps) {
    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 30,
            background: 'rgba(30, 18, 53, 0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(78,205,196,.2)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
        }}>

            {/* 왼쪽: 뒤로가기 또는 아바타 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                {showBack ? (
                    <button
                        onClick={onBack}
                        className="no-select"
                        style={{
                            background: 'rgba(78,205,196,.1)',
                            border: '1.5px solid rgba(78,205,196,.4)',
                            borderRadius: '8px',
                            color: 'var(--mint)',
                            fontFamily: 'Space Mono, monospace',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '6px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        ← 뒤로
                    </button>
                ) : (
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#3d2460',
                        border: '2px solid var(--mint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 0 10px rgba(78,205,196,.4)',
                        flexShrink: 0,
                    }}>
                        🐶
                    </div>
                )}

                <div>
                    <div style={{
                        fontSize: '8px',
                        color: 'var(--mint)',
                        fontFamily: 'Space Mono, monospace',
                        fontWeight: 700,
                        letterSpacing: '.1em',
                    }}>
                        ALIEN K-9
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '.02em',
                    }}>
                        {title}
                    </div>
                </div>
            </div>

            {/* 오른쪽: 레벨 뱃지 + 점수 + 부품 */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                {level && (
                    <span className="badge badge-mint" style={{ fontSize: '9px' }}>
                        ▶ {level}
                    </span>
                )}
                <span className="badge badge-gold">⭐ 320</span>
                <span
                    className="badge badge-mint glow-pulse"
                    style={{ animationDuration: '2.5s' }}
                >
                    ⚙ 2/8
                </span>
            </div>

        </header>
    )
}