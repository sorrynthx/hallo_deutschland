'use client'

interface TickerProps {
    messages?: string[]
}

const DEFAULT_MESSAGES = [
    '★ ALIEN K-9 DEUTSCH QUEST',
    '★ 우주선 부품을 찾아라!',
    '★ VIEL SPASS!',
    '★ 독일어를 배워 집으로!',
    '★ LERNE DEUTSCH!',
    '★ SAMMLE ALLE TEILE!',
]

export default function Ticker({ messages = DEFAULT_MESSAGES }: TickerProps) {
    const text = messages.join('   ') + '   '

    return (
        <div className="ticker-wrap" style={{ flexShrink: 0 }}>
            <span className="ticker-text">
                {/* 끊김 없이 보이도록 두 번 반복 */}
                {text}{text}
            </span>
        </div>
    )
}