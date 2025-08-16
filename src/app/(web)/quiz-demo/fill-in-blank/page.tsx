'use client'

// Force dynamic rendering due to parent layout using cookies
export const runtime = 'edge' // Optional: use edge runtime
export const dynamic = 'force-dynamic'

import { FillInBlanksContainer } from '@/components/quiz'
import { useFillInBlank } from '@/contexts/quiz-context'
import { loadQuizData, getAllQuestionsFlat } from '@/lib/quiz-storage'
import type { FillInBlanksData } from '@/types/quiz'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center bg-white rounded-lg p-12 shadow-sm">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}

// Component that uses useSearchParams
function FillInBlankContent() {
  const searchParams = useSearchParams()
  const quizContext = useFillInBlank()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizzes, setQuizzes] = useState<FillInBlanksData[]>([])
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

  // Get answers for current quiz from context
  const currentAnswers = quizContext.fillInBlankAnswers[currentQuizIndex] || {}

  // Update answers for current quiz using context
  const handleAnswerChange = (newAnswers: Record<string, string>) => {
    quizContext.setFillInBlankAnswers(currentQuizIndex, newAnswers)
  }

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
        // Reset all answers when reset is triggered using context
        quizContext.clearAllProgress()
        setShowResults(false)
        // Clean up the flag
        localStorage.removeItem('quizReset')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [quizContext])

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
        className="p-1 sm:p-2"
      />
    </div>
  )
}

// Main export component wrapped in Suspense
export default function FillInBlankDemoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FillInBlankContent />
    </Suspense>
  )
}
