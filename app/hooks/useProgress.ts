// app/hooks/useProgress.ts
'use client'

import { useState, useEffect, useCallback } from 'react'

export interface LocationProgress {
    vocabulary: boolean
    grammar: boolean
    conversation: boolean
    expressions: boolean
}

export interface ProgressStore {
    progress: { [key: string]: LocationProgress }
    score: number
}

// 부품 획득 조건
export function isPartCollected(progress: LocationProgress, level: string): boolean {
    if (level === 'baby') return progress.vocabulary && progress.expressions
    return progress.vocabulary && progress.grammar && progress.conversation
}

// 진행률 계산 (0~100)
export function calcProgress(progress: LocationProgress, level: string): number {
    if (level === 'baby') {
        const done = [progress.vocabulary, progress.expressions].filter(Boolean).length
        return Math.round((done / 2) * 100)
    }
    const done = [progress.vocabulary, progress.grammar, progress.conversation].filter(Boolean).length
    return Math.round((done / 3) * 100)
}

// 타입별 점수
const TYPE_SCORE: Record<string, number> = {
    vocabulary: 10,
    grammar: 15,
    conversation: 15,
    expressions: 10,
    flashcard: 5,
}

const STORAGE_KEY = 'deutsch_progress'

const DEFAULT_PROGRESS: LocationProgress = {
    vocabulary: false, grammar: false, conversation: false, expressions: false,
}

const DEFAULT_STORE: ProgressStore = { progress: {}, score: 0 }

export function useProgress() {
    const [store, setStore] = useState<ProgressStore>(DEFAULT_STORE)

    // 초기 로드
    useEffect(() => {
        let isMounted = true;
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw && isMounted) {
                const parsed = JSON.parse(raw)
                // 구버전 (객체 바로 저장) 마이그레이션
                setTimeout(() => {
                    if (parsed && !parsed.progress) {
                        setStore({ progress: parsed, score: 0 })
                    } else {
                        setStore(parsed)
                    }
                }, 0)
            }
        } catch { /* 무시 */ }
        return () => { isMounted = false }
    }, [])

    // 저장
    const save = useCallback((next: ProgressStore) => {
        setStore(next)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* 무시 */ }
    }, [])

    // 학습 완료 표시
    const markComplete = useCallback((locationId: string, level: string, typeId: string) => {
        setStore(prev => {
            const key = `${locationId}_${level}`
            const existing = prev.progress[key] ?? { ...DEFAULT_PROGRESS }

            // 이미 완료한 타입이면 점수 안 줌
            const alreadyDone = existing[typeId as keyof LocationProgress]
            const addScore = alreadyDone ? 0 : (TYPE_SCORE[typeId] ?? 10)

            const updated: LocationProgress = { ...existing, [typeId]: true }
            const next: ProgressStore = {
                progress: { ...prev.progress, [key]: updated },
                score: prev.score + addScore,
            }
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* 무시 */ }
            return next
        })
    }, [])

    // 특정 장소+레벨 진행 상황
    const getProgress = useCallback((locationId: string, level: string): LocationProgress => {
        const key = `${locationId}_${level}`
        return store.progress[key] ?? { ...DEFAULT_PROGRESS }
    }, [store])

    // 부품 획득 여부
    const isCollected = useCallback((locationId: string, level: string): boolean => {
        return isPartCollected(getProgress(locationId, level), level)
    }, [getProgress])

    // 전체 획득 부품 수
    const totalCollected = useCallback((): number => {
        return Object.entries(store.progress).filter(([key, progress]) => {
            const level = key.split('_')[1] ?? 'a1'
            return isPartCollected(progress, level)
        }).length
    }, [store])

    // 진행률 (0~100)
    const getProgressPct = useCallback((locationId: string, level: string): number => {
        return calcProgress(getProgress(locationId, level), level)
    }, [getProgress])

    // 현재 점수
    const totalScore = store.score

    // 전체 초기화
    const reset = useCallback(() => save(DEFAULT_STORE), [save])

    return {
        store,
        markComplete,
        getProgress,
        isCollected,
        totalCollected,
        getProgressPct,
        totalScore,
        reset,
    }
}