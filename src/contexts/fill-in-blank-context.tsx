'use client'

import { createContext, ReactNode, useContext, useState, useCallback } from 'react'
import { loadQuizData } from '@/lib/quiz-storage'
import type { FillInBlanksData } from '@/types/quiz'

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

  const getProgressStats = useCallback(() => {
    // Dynamically load quiz data and count fill-in-blanks quizzes
    const allQuizzes = loadQuizData()
    const fillInBlanksQuizzes = allQuizzes.filter(
      (quiz): quiz is FillInBlanksData => quiz.type === 'fill-in-blanks'
    )
    const totalQuizzes = fillInBlanksQuizzes.length
    const completedQuizzes = Object.values(quizProgress).filter(Boolean).length
    const percentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0

    return {
      totalQuizzes,
      completedQuizzes,
      percentage
    }
  }, [quizProgress])

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
