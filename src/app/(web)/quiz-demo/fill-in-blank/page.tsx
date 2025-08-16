'use client'

import { FillInBlanksContainer } from '@/components/quiz'
import { useFillInBlank } from '@/contexts/quiz-context'
import { loadQuizData } from '@/lib/quiz-storage'
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

  // Load quizzes from localStorage on mount
  useEffect(() => {
    const customQuizzes = loadQuizData()
    const fillInBlanksQuizzes = customQuizzes.filter(
      (quiz): quiz is FillInBlanksData => quiz.type === 'fill-in-blanks'
    )
    setQuizzes(fillInBlanksQuizzes)
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
        showResults={false}
        className="p-4 sm:p-6"
      />
    </div>
  )
}
