'use client'

import { FillInBlanksContainer } from '@/components/quiz'
import { useFillInBlank } from '@/contexts/quiz-context'
import type { FillInBlanksData } from '@/types/quiz'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Sample quiz data - flat structure
const sampleQuizzes: FillInBlanksData[] = [
  {
    id: "climate-change",
    type: "fill-in-blanks",
    title: "Climate Change Facts",
    instruction: "Fill in the missing words based on the context.",
    estimatedTime: 8,
    text: "The effects of climate change include ___s, ___ents, and changes in precipitation patterns. Scientists agree that ___n is needed to reduce greenhouse gas emissions and limit global warming t___.5 degrees Celsius above pre-industrial levels.",
    blanks: [
      {
        id: "blank-1",
        startIndex: 42,
        endIndex: 45,
        correctAnswer: "flood"
      },
      {
        id: "blank-2",
        startIndex: 48,
        endIndex: 54,
        correctAnswer: "extreme weather ev"
      },
      {
        id: "blank-3",
        startIndex: 120,
        endIndex: 126,
        correctAnswer: "urgent actio"
      },
      {
        id: "blank-4",
        startIndex: 200,
        endIndex: 201,
        correctAnswer: "o 1"
      }
    ]
  },
  {
    id: "grammar-conditionals",
    type: "fill-in-blanks",
    title: "Conditional Sentences",
    instruction: "Complete the conditional sentences with correct verb forms.",
    estimatedTime: 6,
    text: "If I ___ studied harder, I would have passed the exam. If she ___ more time, she will finish the project. Unless we ___ now, we'll be late for the meeting.",
    blanks: [
      {
        id: "blank-1",
        startIndex: 5,
        endIndex: 8,
        correctAnswer: "had"
      },
      {
        id: "blank-2",
        startIndex: 65,
        endIndex: 68,
        correctAnswer: "has"
      },
      {
        id: "blank-3",
        startIndex: 125,
        endIndex: 130,
        correctAnswer: "leave"
      }
    ]
  },
  {
    id: "vocabulary-academic",
    type: "fill-in-blanks",
    title: "Academic Vocabulary",
    instruction: "Fill in the blanks with appropriate academic words.",
    estimatedTime: 5,
    text: "The research ___ significant findings about student performance. The study ___ that regular practice improves learning outcomes. These results ___ previous research in the field.",
    blanks: [
      {
        id: "blank-1",
        startIndex: 13,
        endIndex: 21,
        correctAnswer: "revealed"
      },
      {
        id: "blank-2",
        startIndex: 75,
        endIndex: 84,
        correctAnswer: "indicates"
      },
      {
        id: "blank-3",
        startIndex: 145,
        endIndex: 152,
        correctAnswer: "confirm"
      }
    ]
  }
]

export default function FillInBlankDemoPage() {
  const searchParams = useSearchParams()
  const { setQuizProgress } = useFillInBlank()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)

  // Global state to store answers for all quizzes
  const [allQuizAnswers, setAllQuizAnswers] = useState<Record<number, Record<string, string>>>({})

  // Get quiz index from URL params and sync with layout
  useEffect(() => {
    const urlQuizIndex = parseInt(searchParams.get('quiz') || '0', 10)
    if (urlQuizIndex !== currentQuizIndex) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [searchParams, currentQuizIndex])

  // Get current quiz based on URL params
  const currentQuiz = sampleQuizzes[currentQuizIndex] || sampleQuizzes[0]

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

  // Clear all answers function (not used anymore, using page reload instead)
  // const clearAllAnswers = () => {
  //   setAllQuizAnswers({})
  // }











  if (!currentQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center bg-white rounded-lg p-12 shadow-sm">
          <p className="text-gray-600">No fill-in-blanks questions available.</p>
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
