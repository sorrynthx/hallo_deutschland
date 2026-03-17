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
        <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '16px', padding: '24px',
        }}>
            <div style={{ fontSize: '48px' }}>{comingSoon ? '🚧' : '🐶'}</div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {message}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'Space Mono, monospace' }}>
                    {subMessage}
                </div>
            </div>
            <button
                className="btn btn-mint"
                style={{ padding: '12px 24px' }}
                onClick={() => router.back()}
            >
                ← 돌아가기
            </button>
        </div>
    )
}