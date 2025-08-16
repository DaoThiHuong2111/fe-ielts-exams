'use client'

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

import { QuizContainer } from '@/components/quiz'
import { useQuiz } from '@/contexts/quiz-context'
import { loadQuizData, getAllQuestionsFlat } from '@/lib/quiz-storage'
import type { MultipleChoiceData } from '@/types/quiz'
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
function MultipleChoiceContent() {
  const searchParams = useSearchParams()
  const quizContext = useQuiz()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizzes, setQuizzes] = useState<MultipleChoiceData[]>([])
  const [showResults, setShowResults] = useState(false)

  // Load quizzes from localStorage on mount - supports both formats
  useEffect(() => {
    // Try to load from new passage format first
    const allQuestions = getAllQuestionsFlat()
    if (allQuestions.length > 0) {
      const multipleChoiceQuizzes = allQuestions.filter(
        (quiz): quiz is MultipleChoiceData => quiz.type === 'multiple-choice'
      )
      setQuizzes(multipleChoiceQuizzes)
    } else {
      // Fall back to legacy format
      const customQuizzes = loadQuizData()
      const multipleChoiceQuizzes = customQuizzes.filter(
        (quiz): quiz is MultipleChoiceData => quiz.type === 'multiple-choice'
      )
      setQuizzes(multipleChoiceQuizzes)
    }
  }, [])

  // Get quiz index from URL params and sync with layout
  useEffect(() => {
    const urlQuizIndex = parseInt(searchParams.get('quiz') || '0', 10)
    if (urlQuizIndex !== currentQuizIndex) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [searchParams, currentQuizIndex])
  
  // Check for showResults state from localStorage and handle reset
  useEffect(() => {
    const checkShowResults = () => {
      const shouldShow = localStorage.getItem('quizShowResults') === 'true'
      setShowResults(shouldShow)
    }
    
    const handleResetSignal = () => {
      // Listen for reset signals from layout
      const resetFlag = localStorage.getItem('quizReset')
      if (resetFlag === 'true') {
        // Clear all selections when reset is triggered using context
        quizContext.clearAllProgress()
        setCurrentQuizIndex(0)
        setShowResults(false)
        
        // Clear the reset flag
        localStorage.removeItem('quizReset')
      }
    }
    
    // Check initially
    checkShowResults()
    handleResetSignal()
    
    // Listen for storage events (changes from other components)
    window.addEventListener('storage', (e) => {
      if (e.key === 'quizShowResults') {
        checkShowResults()
      }
      if (e.key === 'quizReset') {
        handleResetSignal()
      }
    })
    
    return () => window.removeEventListener('storage', checkShowResults)
  }, [])

  // Get current quiz based on URL params
  const currentQuiz = quizzes[currentQuizIndex] || quizzes[0]

  // Get selections for current quiz from context
  const currentSelections = quizContext.quizSelections[currentQuizIndex] || []

  // Update selections for current quiz using context
  const handleSelectionChange = (newSelections: string[]) => {
    quizContext.setQuizSelections(currentQuizIndex, newSelections)
  }

  // Handle empty state
  if (quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center bg-white rounded-lg p-12 shadow-sm">
          <p className="text-gray-600">Không có câu hỏi trắc nghiệm nào.</p>
          <a href="/quiz-generate" className="text-blue-500 hover:underline mt-2 inline-block">
            Tạo câu hỏi mới →
          </a>
        </div>
      </div>
    )
  }

  return (
    <QuizContainer
      quiz={currentQuiz}
      selectedOptions={currentSelections}
      onSelectionChange={handleSelectionChange}
      showResults={showResults}
      className="p-1 sm:p-2"
    />
  )
}

// Main export component wrapped in Suspense
export default function MultipleChoiceDemoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MultipleChoiceContent />
    </Suspense>
  )
}
