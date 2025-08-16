'use client'

import { QuizContainer } from '@/components/quiz'
import { useQuiz } from '@/contexts/quiz-context'
import { loadQuizData } from '@/lib/quiz-storage'
import type { MultipleChoiceData } from '@/types/quiz'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MultipleChoiceDemoPage() {
  const searchParams = useSearchParams()
  const { setQuizProgress } = useQuiz()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizzes, setQuizzes] = useState<MultipleChoiceData[]>([])

  // Global state to store selections for all quizzes
  const [allQuizSelections, setAllQuizSelections] = useState<Record<number, string[]>>({})

  // Load quizzes from localStorage on mount
  useEffect(() => {
    const customQuizzes = loadQuizData()
    const multipleChoiceQuizzes = customQuizzes.filter(
      (quiz): quiz is MultipleChoiceData => quiz.type === 'multiple-choice'
    )
    setQuizzes(multipleChoiceQuizzes)
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
      showResults={false}
      className="p-6"
    />
  )
}
