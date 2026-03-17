import { useState } from 'react'

/**
 * 퀴즈 컴포넌트들에서 공통으로 사용되는 상태와 로직을 관리하는 커스텀 훅입니다.
 * @param items - 퀴즈에 표시될 데이터 아이템들의 배열
 */
export function useQuizLogic<T>(items: T[]) {
    // 현재 진행 중인 문제의 인덱스 (0부터 시작)
    const [index, setIndex] = useState(0)

    // 모든 퀴즈 문제를 다 풀었는지 나타내는 상태 (true면 CompleteScreen 표시)
    const [done, setDone] = useState(false)

    // 사용자의 점수 기록 (know: 맞춘 문제 수 / 아는 단어, unknown: 틀린 문제 수 / 모르는 단어)
    const [score, setScore] = useState({ know: 0, unknown: 0 })

    // React 19 StrictMode 등에서 Effect 내부에서의 동기적 setState를 지양하므로,
    // items가 변경되었을 때 상태를 초기화하는 로직은 파생 상태나 상위 컴포넌트의 key prop 리마운트로 처리합니다.

    /**
     * 사용자가 답을 제출한 후, 다음 문제로 넘어가거나 결과를 기록하는 함수입니다.
     * @param correct - 사용자가 제출한 답이 정답(혹은 '알아요')인지 여부
     */
    const handleNext = (correct: boolean) => {
        // 정답 여부에 따라 점수를 업데이트합니다.
        setScore(prev => ({
            ...prev,
            know: prev.know + (correct ? 1 : 0),
            unknown: prev.unknown + (correct ? 0 : 1)
        }))

        // 현재 인덱스가 배열의 끝에 도달했다면 퀴즈를 완료(done = true) 처리합니다.
        if (index + 1 >= items.length) {
            setDone(true)
        } else {
            // 아직 문제가 남았다면 다음 문제로 인덱스를 1 증가시킵니다.
            setIndex(i => i + 1)
        }
    }

    /**
     * 퀴즈 완료 화면에서 '다시 풀기' 버튼을 눌렀을 때 호출되는 함수입니다.
     * 처음부터 다시 풀 수 있도록 인덱스와 점수를 초기화합니다.
     */
    const handleRetry = () => {
        setIndex(0)
        setDone(false)
        setScore({ know: 0, unknown: 0 })
    }

    // 컴포넌트에서 필요한 상태와 함수들만 묶어서 반환합니다.
    return {
        index,
        setIndex,
        done,
        setDone,
        score,
        setScore,
        currentItem: items[index],
        handleNext,
        handleRetry
    }
}
