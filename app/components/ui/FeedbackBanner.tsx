import React from 'react'

interface FeedbackBannerProps {
    isCorrect: boolean
    correctAnswer?: string
    explanation?: string
    grammarPoint?: string
}

export function FeedbackBanner({ isCorrect, correctAnswer, explanation, grammarPoint }: FeedbackBannerProps) {
    const bgColor = isCorrect ? 'rgba(78,205,196,.08)' : 'rgba(232,138,138,.08)'
    const borderColor = isCorrect ? 'rgba(78,205,196,.3)' : 'rgba(232,138,138,.3)'
    const textColor = isCorrect ? 'var(--mint)' : 'var(--wrong)'

    let title = isCorrect ? '✓ 정답!' : '✗ 오답'
    if (!isCorrect && correctAnswer) {
        title = `✗ 정답: ${correctAnswer}`
    }

    return (
        <div
            className="rounded-[10px] p-3 flex flex-col gap-1.5"
            style={{ background: bgColor, border: `1px solid ${borderColor}` }}
        >
            <div className="text-[10px] font-bold font-mono" style={{ color: textColor }}>
                {title}
            </div>
            {explanation && (
                <div className="text-[11px] text-[var(--text-secondary)]">{explanation}</div>
            )}
            {grammarPoint && (
                <div className="text-[10px] text-[var(--text-dim)] border-t border-[rgba(255,255,255,.06)] pt-1.5 mt-0.5">
                    💡 {grammarPoint}
                </div>
            )}
        </div>
    )
}
