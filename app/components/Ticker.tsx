// app/components/Ticker.tsx
'use client'

interface TickerProps {
    messages?: string[]
}

// 화면별 기본 메시지 — 컨셉에 맞게 작성
const DEFAULT_MESSAGES = [
    '🐶 멍멍... 여기가 독일이라고?',
    '🛸 우주선이 고장났어요. 도와주세요!',
    '📡 부품을 모아야 집에 갈 수 있어요',
    '🥐 저 빵집에서 뭔가 냄새가... Bäckerei?',
    '🔋 Guten Tag! 이 말이 인사래요',
    '🌀 독일어만 배우면 우주로 돌아갈 수 있어!',
    '⚙ Ich brauche Hilfe! 도움이 필요해요!',
    '🗺️ 마을 지도를 보며 독일어를 익혀봐요',
    '💬 Wie bitte? 뭐라고요?',
    '🔩 Viel Erfolg! 화이팅이래요!',
]

export default function Ticker({ messages = DEFAULT_MESSAGES }: TickerProps) {
    const text = [...messages, ...messages].join('   ✦   ')

    return (
        <div className="ticker-wrap" style={{ flexShrink: 0 }}>
            <span
                className="ticker-text"
                style={{
                    // 느리게 — 글자 수에 비례해서 속도 조절
                    animationDuration: `${Math.max(messages.length * 8, 40)}s`,
                }}
            >
                {text}
            </span>
        </div>
    )
}