import React from 'react'

interface ProgressBarProps {
    current: number
    total: number
    label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <div className="pt-2.5 px-4 pb-0">
            <div className="flex justify-between mb-1">
                <span className="text-[9px] text-[var(--text-dim)] font-mono">{label || '진행'}</span>
                <span className="text-[9px] text-[var(--text-dim)] font-mono">{current} / {total}</span>
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
        </div>
    )
}
