'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface FillInBlankContextType {
  // Progress tracking for each quiz
  quizProgress: Record<number, boolean> // true if quiz has any answers
  setQuizProgress: (quizIndex: number, hasAnswers: boolean) => void

  // Get progress stats
  getProgressStats: () => {
    totalQuizzes: number
    completedQuizzes: number
    percentage: number
  }

  // Clear all progress
  clearAllProgress: () => void
}

const FillInBlankContext = createContext<FillInBlankContextType | null>(null)

interface FillInBlankProviderProps {
  children: ReactNode
}

export function FillInBlankProvider({ children }: FillInBlankProviderProps) {
  const [quizProgress, setQuizProgressState] = useState<Record<number, boolean>>({})

  const setQuizProgress = (quizIndex: number, hasAnswers: boolean) => {
    setQuizProgressState(prev => ({
      ...prev,
      [quizIndex]: hasAnswers
    }))
  }

  const getProgressStats = () => {
    const totalQuizzes = 3 // We have 3 fill-in-blank quizzes
    const completedQuizzes = Object.values(quizProgress).filter(Boolean).length
    const percentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0

    return {
      totalQuizzes,
      completedQuizzes,
      percentage
    }
  }

  const clearAllProgress = () => {
    setQuizProgressState({})
  }

  const value: FillInBlankContextType = {
    quizProgress,
    setQuizProgress,
    getProgressStats,
    clearAllProgress
  }

  return (
    <FillInBlankContext.Provider value={value}>
      {children}
    </FillInBlankContext.Provider>
  )
}

export function useFillInBlank() {
  const context = useContext(FillInBlankContext)
  if (!context) {
    throw new Error('useFillInBlank must be used within FillInBlankProvider')
  }
  return context
}
