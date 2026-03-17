// app/components/learn/EmptyState.tsx
'use client'

import { useRouter } from 'next/navigation'

interface EmptyStateProps {
    message?: string
    subMessage?: string
    comingSoon?: boolean
}

export default function EmptyState({
    message = '데이터가 없어요',
    subMessage = '준비중...',
    comingSoon = false,
}: EmptyStateProps) {
    const router = useRouter()
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <div className="text-[48px]">{comingSoon ? '🚧' : '🐶'}</div>
            <div className="text-center">
                <div className="text-[14px] font-bold text-[var(--text-primary)] mb-1.5">
                    {message}
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                    {subMessage}
                </div>
            </div>
            <button
                className="btn btn-mint px-6 py-3"
                onClick={() => router.back()}
            >
                ← 돌아가기
            </button>
        </div>
    )
}