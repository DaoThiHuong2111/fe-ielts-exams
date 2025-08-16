'use client'

import { QuizContainer } from '@/components/quiz'
import { useQuiz } from '@/contexts/quiz-context'
import { loadQuizData, getAllQuestionsFlat } from '@/lib/quiz-storage'
import type { MultipleChoiceData } from '@/types/quiz'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MultipleChoiceDemoPage() {
  const searchParams = useSearchParams()
  const { setQuizProgress } = useQuiz()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizzes, setQuizzes] = useState<MultipleChoiceData[]>([])
  const [showResults, setShowResults] = useState(false)

  // Global state to store selections for all quizzes
  const [allQuizSelections, setAllQuizSelections] = useState<Record<number, string[]>>({})

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
        // Clear all selections when reset is triggered
        setAllQuizSelections({})
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

  // Get selections for current quiz
  const currentSelections = allQuizSelections[currentQuizIndex] || []

  // Update selections for current quiz
  const handleSelectionChange = (newSelections: string[]) => {
    setAllQuizSelections(prev => ({
      ...prev,
      [currentQuizIndex]: newSelections
    }))

    // Update progress tracking
    const hasSelections = newSelections.length > 0
    setQuizProgress(currentQuizIndex, hasSelections)
    
    // Communicate selection data to layout via window
    if (typeof window !== 'undefined' && (window as any).handleQuizSelectionChange) {
      (window as any).handleQuizSelectionChange(newSelections)
    }
  }
  
  // Expose real quiz selections to layout
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).getRealQuizSelections = () => allQuizSelections
    }
  }, [allQuizSelections])

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
      className="p-6"
    />
  )
}
