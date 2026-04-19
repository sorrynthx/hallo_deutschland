'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Level = 'A1' | 'A2' | 'B1' | 'B2'

interface LevelContextType {
  level: Level
  setLevel: (level: Level) => void
}

const LevelContext = createContext<LevelContextType | undefined>(undefined)

export function LevelProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState<Level>('A1')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedLevel = localStorage.getItem('appLevel') as Level | null
    if (savedLevel && ['A1', 'A2', 'B1', 'B2'].includes(savedLevel)) {
      setLevel(savedLevel)
    }
  }, [])

  const handleSetLevel = (newLevel: Level) => {
    setLevel(newLevel)
    localStorage.setItem('appLevel', newLevel)
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) return null

  return (
    <LevelContext.Provider value={{ level, setLevel: handleSetLevel }}>
      {children}
    </LevelContext.Provider>
  )
}

export function useLevel() {
  const context = useContext(LevelContext)
  if (!context) {
    throw new Error('useLevel must be used within a LevelProvider')
  }
  return context
}
