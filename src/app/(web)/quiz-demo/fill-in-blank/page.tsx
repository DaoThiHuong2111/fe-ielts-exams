'use client'

import { FillInBlanksContainer } from '@/components/quiz'
import { useFillInBlank } from '@/contexts/quiz-context'
import { loadQuizData, getAllQuestionsFlat } from '@/lib/quiz-storage'
import type { FillInBlanksData } from '@/types/quiz'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FillInBlankDemoPage() {
  const searchParams = useSearchParams()
  const { setQuizProgress } = useFillInBlank()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizzes, setQuizzes] = useState<FillInBlanksData[]>([])

  // Global state to store answers for all quizzes
  const [allQuizAnswers, setAllQuizAnswers] = useState<Record<number, Record<string, string>>>({})
  const [showResults, setShowResults] = useState(false)

  // Load quizzes from localStorage on mount - supports both formats
  useEffect(() => {
    // Try to load from new passage format first
    const allQuestions = getAllQuestionsFlat()
    if (allQuestions.length > 0) {
      const fillInBlanksQuizzes = allQuestions.filter(
        (quiz): quiz is FillInBlanksData => quiz.type === 'fill-in-blanks'
      )
      setQuizzes(fillInBlanksQuizzes)
    } else {
      // Fall back to legacy format
      const customQuizzes = loadQuizData()
      const fillInBlanksQuizzes = customQuizzes.filter(
        (quiz): quiz is FillInBlanksData => quiz.type === 'fill-in-blanks'
      )
      setQuizzes(fillInBlanksQuizzes)
    }
  }, [])

  // Get quiz index from URL params and sync with layout
  useEffect(() => {
    const urlQuizIndex = parseInt(searchParams.get('quiz') || '0', 10)
    if (urlQuizIndex !== currentQuizIndex) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [searchParams, currentQuizIndex])

  // Get current quiz based on URL params
  const currentQuiz = quizzes[currentQuizIndex] || quizzes[0]

  // Get answers for current quiz
  const currentAnswers = allQuizAnswers[currentQuizIndex] || {}

  // Update answers for current quiz
  const handleAnswerChange = (newAnswers: Record<string, string>) => {
    setAllQuizAnswers(prev => ({
      ...prev,
      [currentQuizIndex]: newAnswers
    }))

    // Update progress tracking
    const hasAnswers = Object.values(newAnswers).some(answer => answer.trim().length > 0)
    setQuizProgress(currentQuizIndex, hasAnswers)
  }

  // Expose quiz answers to window for layout grading
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).getRealQuizAnswers = () => {
        // Convert allQuizAnswers to the format expected by layout
        // Layout expects: { [quizIndex]: string[] } where string[] are the user answers in order
        const formattedAnswers: Record<number, string[]> = {}
        
        Object.entries(allQuizAnswers).forEach(([quizIndex, answerRecord]) => {
          const quiz = quizzes[parseInt(quizIndex)]
          if (quiz && quiz.type === 'fill-in-blanks') {
            // Get answers in the order of blanks
            const answersArray = quiz.blanks.map(blank => answerRecord[blank.id] || '')
            formattedAnswers[parseInt(quizIndex)] = answersArray
          }
        })
        
        return formattedAnswers
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).getRealQuizAnswers
      }
    }
  }, [allQuizAnswers, quizzes])

  // Listen for results flag from localStorage
  useEffect(() => {
    const checkForResults = () => {
      const showResultsFlag = localStorage.getItem('quizShowResults')
      setShowResults(showResultsFlag === 'true')
    }

    // Check on mount
    checkForResults()

    // Listen for storage changes (results flag)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quizShowResults') {
        setShowResults(e.newValue === 'true')
      } else if (e.key === 'quizReset') {
        // Reset all answers when reset is triggered
        setAllQuizAnswers({})
        setShowResults(false)
        // Clean up the flag
        localStorage.removeItem('quizReset')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Handle empty state
  if (!currentQuiz || quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center bg-white rounded-lg p-12 shadow-sm">
          <p className="text-gray-600">Không có câu hỏi điền từ nào.</p>
          <a href="/quiz-generate" className="text-blue-500 hover:underline mt-2 inline-block">
            Tạo câu hỏi mới →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <FillInBlanksContainer
        quiz={currentQuiz}
        answers={currentAnswers}
        onAnswerChange={handleAnswerChange}
        showResults={showResults}
        className="p-4 sm:p-6"
      />
    </div>
  )
}
