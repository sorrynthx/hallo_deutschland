// app/learn/[locationId]/[typeId]/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '../../../components/Header'
import Ticker from '../../../components/Ticker'
import LevelTabs from '../../../components/learn/LevelTabs'
import EmptyState from '../../../components/learn/EmptyState'
import VocabQuiz from '../../../components/learn/VocabQuiz'
import Flashcard from '../../../components/learn/Flashcard'
import GrammarQuiz from '../../../components/learn/GrammarQuiz'
import ConversationQuiz from '../../../components/learn/ConversationQuiz'
import Expressions from '../../../components/learn/Expressions'
import { useProgress } from '../../../hooks/useProgress'

interface LocationMeta {
    id: string
    levels: string[]
    label: string
    korean: string
}

const TITLE: Record<string, string> = {
    vocabulary: '단어 퀴즈',
    flashcard: '플래시카드',
    grammar: '문법 퀴즈',
    conversation: '대화 퀴즈',
    expressions: '표현 정리',
    mission: '오늘의 미션',
}

function LearnContent() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()

    const locationId = params.locationId as string
    const typeId = params.typeId as string
    const defaultLevel = searchParams.get('level') ?? 'baby'

    const [locationMeta, setLocationMeta] = useState<LocationMeta | null>(null)
    const [availableLevels, setAvailableLevels] = useState<string[]>([])
    const [level, setLevel] = useState(defaultLevel)
    const [data, setData] = useState<Record<string, unknown> | null>(null)

    /* 진도 훅 */
    const { markComplete, isCollected, getProgressPct } = useProgress()

    /* locations.json 로드 */
    useEffect(() => {
        fetch('/data/locations.json')
            .then(r => r.json())
            .then(d => {
                const loc = d.locations?.find((l: LocationMeta) => l.id === locationId)
                if (loc) { setLocationMeta(loc); setAvailableLevels(loc.levels ?? []) }
            })
    }, [locationId])

    /* 콘텐츠 데이터 로드 */
    useEffect(() => {
        if (!level) return
        setData(null)
        fetch(`/data/${locationId}/${level}.json`)
            .then(r => r.json())
            .then(d => setData(d))
            .catch(() => setData({ items: { vocabulary: [], grammar: [], conversation: [], expressions: [] } }))
    }, [locationId, level])

    const locationLabel = locationMeta ? `${locationMeta.label} · ${level.toUpperCase()}` : ''

    /* 학습 완료 처리 */
    const handleComplete = () => {
        markComplete(locationId, level, typeId)
    }

    /* 부품 획득 여부 */
    const partCollected = isCollected(locationId, level)
    const progressPct = getProgressPct(locationId, level)

    const vocabItems = ((data as Record<string, Record<string, unknown[]>>)?.items?.vocabulary ?? []) as never[]
    const gramItems = ((data as Record<string, Record<string, unknown[]>>)?.items?.grammar ?? []) as never[]
    const convItems = ((data as Record<string, Record<string, unknown[]>>)?.items?.conversation ?? []) as never[]
    const exprItems = ((data as Record<string, Record<string, unknown[]>>)?.items?.expressions ?? []) as never[]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

            <Header title={TITLE[typeId] ?? '학습'} showBack onBack={() => router.back()} />

            {/* 진행률 표시 */}
            <div style={{ padding: '6px 16px', background: 'var(--bg-panel)', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '8px', color: 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>
                        {locationLabel}
                    </span>
                    <span style={{ fontSize: '8px', color: partCollected ? 'var(--mint)' : 'var(--text-dim)', fontFamily: 'Space Mono, monospace' }}>
                        {partCollected ? '⚙ 부품 획득!' : `${progressPct}%`}
                    </span>
                </div>
                <div className="progress-track" style={{ height: '3px' }}>
                    <div className="progress-fill" style={{ width: `${progressPct}%`, background: partCollected ? 'var(--mint)' : undefined }} />
                </div>
            </div>

            <LevelTabs availableLevels={availableLevels} level={level} onSelect={setLevel} />

            {/* 로딩 */}
            {!data && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontSize: '11px' }}>
                    LOADING...
                </div>
            )}

            {/* typeId 분기 */}
            {data && typeId === 'vocabulary' && <VocabQuiz items={vocabItems} locationLabel={locationLabel} onComplete={handleComplete} partCollected={partCollected} />}
            {data && typeId === 'flashcard' && <Flashcard items={vocabItems} locationLabel={locationLabel} onComplete={handleComplete} partCollected={partCollected} />}
            {data && typeId === 'grammar' && <GrammarQuiz items={gramItems} locationLabel={locationLabel} onComplete={handleComplete} partCollected={partCollected} />}
            {data && typeId === 'conversation' && <ConversationQuiz items={convItems} locationLabel={locationLabel} onComplete={handleComplete} partCollected={partCollected} />}
            {data && typeId === 'expressions' && <Expressions items={exprItems} locationLabel={locationLabel} onComplete={handleComplete} />}

            {data && !['vocabulary', 'flashcard', 'grammar', 'conversation', 'expressions'].includes(typeId) && (
                <EmptyState comingSoon message="준비중이에요" subMessage={`${TITLE[typeId] ?? typeId} 화면 곧 추가돼요!`} />
            )}

            <Ticker />
        </div>
    )
}

export default function LearnPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', color: 'var(--mint)', fontFamily: 'Space Mono, monospace', fontSize: '12px' }}>
                LOADING...
            </div>
        }>
            <LearnContent />
        </Suspense>
    )
}