'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

type QuizType = 'fill-in-blank' | 'multiple-choice'

interface QuizContextType {
  // Quiz type
  quizType: QuizType

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

  // Total quizzes count
  totalQuizzes: number
}

const QuizContext = createContext<QuizContextType | null>(null)

interface QuizProviderProps {
  children: ReactNode
  quizType: QuizType
  totalQuizzes: number
}

export function QuizProvider({ children, quizType, totalQuizzes }: QuizProviderProps) {
  const [quizProgress, setQuizProgressState] = useState<Record<number, boolean>>({})

  const setQuizProgress = (quizIndex: number, hasAnswers: boolean) => {
    setQuizProgressState(prev => ({
      ...prev,
      [quizIndex]: hasAnswers
    }))
  }

  const getProgressStats = () => {
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

  const value: QuizContextType = {
    quizType,
    quizProgress,
    setQuizProgress,
    getProgressStats,
    clearAllProgress,
    totalQuizzes
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}

// Backward compatibility - alias for fill-in-blank
export const useFillInBlank = useQuiz
export const FillInBlankProvider = QuizProvider
