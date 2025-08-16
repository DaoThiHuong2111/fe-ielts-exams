'use client'

import { useMemo } from 'react'
import type { QuizData } from '@/types/quiz'

export interface QuizProgressStats {
  completedCount: number
  totalCount: number
  percentage: number
  answeredQuestions: number[]
  unansweredQuestions: number[]
  currentStreak: number
  longestStreak: number
}

export interface UseQuizProgressOptions {
  quizzes: QuizData[]
  quizSelections: Record<number, string[]>
  currentQuizIndex: number
}

export function useQuizProgress({
  quizzes,
  quizSelections,
  currentQuizIndex
}: UseQuizProgressOptions): QuizProgressStats {
  return useMemo(() => {
    const totalCount = quizzes.length
    const answeredQuestions: number[] = []
    const unansweredQuestions: number[] = []

    // Identify answered and unanswered questions
    for (let i = 0; i < totalCount; i++) {
      const hasAnswers = quizSelections[i]?.length > 0
      if (hasAnswers) {
        answeredQuestions.push(i)
      } else {
        unansweredQuestions.push(i)
      }
    }

    const completedCount = answeredQuestions.length
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    for (let i = 0; i < totalCount; i++) {
      const hasAnswers = quizSelections[i]?.length > 0
      
      if (hasAnswers) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
        
        // Current streak calculation (from current position backwards)
        if (i <= currentQuizIndex) {
          currentStreak = tempStreak
        }
      } else {
        tempStreak = 0
        if (i <= currentQuizIndex) {
          currentStreak = 0
        }
      }
    }

    return {
      completedCount,
      totalCount,
      percentage,
      answeredQuestions,
      unansweredQuestions,
      currentStreak,
      longestStreak
    }
  }, [quizzes.length, quizSelections, currentQuizIndex])
}

// Hook for individual quiz progress
export interface UseQuizQuestionProgressOptions {
  quiz: QuizData
  selectedOptions: string[]
  showResults?: boolean
}

export interface QuizQuestionProgress {
  isAnswered: boolean
  isComplete: boolean
  selectedCount: number
  maxSelections: number
  canSelectMore: boolean
  correctCount?: number
  accuracy?: number
}

export function useQuizQuestionProgress({
  quiz,
  selectedOptions,
  showResults = false
}: UseQuizQuestionProgressOptions): QuizQuestionProgress {
  return useMemo(() => {
    const selectedCount = selectedOptions.length
    const maxSelections = quiz.maxSelections || quiz.options.length
    const isAnswered = selectedCount > 0
    const isComplete = selectedCount >= maxSelections
    const canSelectMore = selectedCount < maxSelections

    let correctCount: number | undefined
    let accuracy: number | undefined

    if (showResults && quiz.correctAnswers) {
      correctCount = selectedOptions.filter(option => 
        quiz.correctAnswers?.includes(option)
      ).length
      
      accuracy = selectedCount > 0 
        ? Math.round((correctCount / selectedCount) * 100)
        : 0
    }

    return {
      isAnswered,
      isComplete,
      selectedCount,
      maxSelections,
      canSelectMore,
      correctCount,
      accuracy
    }
  }, [quiz, selectedOptions, showResults])
}
