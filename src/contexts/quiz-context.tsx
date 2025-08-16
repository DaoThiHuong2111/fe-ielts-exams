'use client'

import React, { createContext, ReactNode, useContext, useState } from 'react'

type QuizType = 'fill-in-blank' | 'multiple-choice'

interface QuizContextType {
  // Quiz type
  quizType: QuizType

  // Progress tracking for each quiz
  quizProgress: Record<number, boolean> // true if quiz has any answers
  setQuizProgress: (quizIndex: number, hasAnswers: boolean) => void

  // Multiple choice selections: { quizIndex: selectedOptions[] }
  quizSelections: Record<number, string[]>
  setQuizSelections: (quizIndex: number, selections: string[]) => void
  getAllQuizSelections: () => Record<number, string[]>

  // Fill-in-blank answers: { quizIndex: { blankId: answer } }
  fillInBlankAnswers: Record<number, Record<string, string>>
  setFillInBlankAnswers: (quizIndex: number, answers: Record<string, string>) => void
  getAllFillInBlankAnswers: () => Record<number, Record<string, string>>

  // Get progress stats
  getProgressStats: () => {
    totalQuizzes: number
    completedQuizzes: number
    percentage: number
  }

  // Calculate quiz results (for grading)
  calculateQuizResults: (quizzes: any[]) => {
    correct: number
    total: number
    answered: number
    percentage: number
    completionRate: number
  }

  // Clear all progress and answers
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
  // Use refs to avoid render loops
  const progressRef = React.useRef<Record<number, boolean>>({})
  const selectionsRef = React.useRef<Record<number, string[]>>({})
  const fillInBlankAnswersRef = React.useRef<Record<number, Record<string, string>>>({})

  // State
  const [quizProgress, setQuizProgressState] = useState<Record<number, boolean>>({})
  const [quizSelections, setQuizSelectionsState] = useState<Record<number, string[]>>({})
  const [fillInBlankAnswers, setFillInBlankAnswersState] = useState<Record<number, Record<string, string>>>({})

  // Progress methods
  const setQuizProgress = (quizIndex: number, hasAnswers: boolean) => {
    progressRef.current = {
      ...progressRef.current,
      [quizIndex]: hasAnswers
    }
    setQuizProgressState(progressRef.current)
  }

  // Multiple choice selection methods
  const setQuizSelections = (quizIndex: number, selections: string[]) => {
    selectionsRef.current = {
      ...selectionsRef.current,
      [quizIndex]: selections
    }
    setQuizSelectionsState(selectionsRef.current)
    
    // Update progress based on selections
    const hasAnswers = selections.length > 0
    setQuizProgress(quizIndex, hasAnswers)
  }

  const getAllQuizSelections = () => {
    return selectionsRef.current
  }

  // Fill-in-blank answer methods
  const setFillInBlankAnswers = (quizIndex: number, answers: Record<string, string>) => {
    fillInBlankAnswersRef.current = {
      ...fillInBlankAnswersRef.current,
      [quizIndex]: answers
    }
    setFillInBlankAnswersState(fillInBlankAnswersRef.current)
    
    // Update progress based on answers
    const hasAnswers = Object.values(answers).some(answer => answer.trim().length > 0)
    setQuizProgress(quizIndex, hasAnswers)
  }

  const getAllFillInBlankAnswers = () => {
    return fillInBlankAnswersRef.current
  }

  const getProgressStats = () => {
    // Use ref for calculations to avoid render dependencies
    const completedQuizzes = Object.values(progressRef.current).filter(Boolean).length
    const percentage = totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0

    return {
      totalQuizzes,
      completedQuizzes,
      percentage
    }
  }

  const calculateQuizResults = (quizzes: any[]) => {
    const totalQuestions = quizzes.length
    let totalCorrect = 0
    let totalAnswered = 0

    quizzes.forEach((quiz, index) => {
      if (quiz.type === 'fill-in-blanks') {
        // Handle fill-in-blank evaluation
        const userAnswers = fillInBlankAnswersRef.current[index]
        if (userAnswers && Object.keys(userAnswers).length > 0) {
          totalAnswered++
          
          // Get correct answers from quiz data
          const correctAnswers = quiz.blanks.map((blank: any) => blank.correctAnswer || '')
          
          // Get user answers in the order of blanks
          const userAnswersArray = quiz.blanks.map((blank: any) => userAnswers[blank.id] || '')
          
          // Check if all answers are correct (case-insensitive comparison)
          if (userAnswersArray.length === correctAnswers.length) {
            const isAllCorrect = userAnswersArray.every((answer, i) => {
              const userAnswer = answer.trim().toLowerCase()
              const correctAnswer = correctAnswers[i].trim().toLowerCase()
              return userAnswer === correctAnswer
            })
            
            if (isAllCorrect) {
              totalCorrect++
            }
          }
        }
      } else if (quiz.type === 'multiple-choice') {
        // Handle multiple choice evaluation
        const userSelections = selectionsRef.current[index] || []
        if (userSelections.length > 0) {
          totalAnswered++
          
          // Get correct answers from quiz data
          const correctAnswers = quiz.correctAnswers || []
          
          // Check if all selected options are correct AND all correct options are selected
          const correctCount = userSelections.filter(option => correctAnswers.includes(option)).length
          const incorrectCount = userSelections.filter(option => !correctAnswers.includes(option)).length
          const missedCount = correctAnswers.filter(answer => !userSelections.includes(answer)).length
          
          // A question is correct only if:
          // 1. All selected answers are correct (incorrectCount === 0)
          // 2. All correct answers are selected (missedCount === 0)
          // 3. User actually selected something (userSelections.length > 0)
          const isAllCorrect = userSelections.length > 0 && incorrectCount === 0 && missedCount === 0
          
          if (isAllCorrect) {
            totalCorrect++
          }
        }
      }
    })

    return {
      correct: totalCorrect,
      total: totalQuestions,
      answered: totalAnswered,
      percentage: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      completionRate: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0
    }
  }

  const clearAllProgress = () => {
    // Clear all refs
    progressRef.current = {}
    selectionsRef.current = {}
    fillInBlankAnswersRef.current = {}
    
    // Clear all state
    setQuizProgressState({})
    setQuizSelectionsState({})
    setFillInBlankAnswersState({})
  }

  const value: QuizContextType = {
    quizType,
    quizProgress,
    setQuizProgress,
    quizSelections,
    setQuizSelections,
    getAllQuizSelections,
    fillInBlankAnswers,
    setFillInBlankAnswers,
    getAllFillInBlankAnswers,
    getProgressStats,
    calculateQuizResults,
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
