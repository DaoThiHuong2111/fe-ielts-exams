'use client'

import { ReactNode } from 'react'
import QuizFooter from './quiz-footer'
import QuizHeader from './quiz-header'

interface Question {
  id: string
  questionNumber: number
  type: string
}

interface QuizLayoutWrapperProps {
  children: ReactNode
  title: string
  timeLimit: number
  questions: Question[]
  answeredQuestions: Set<string>
  currentQuestionId?: string
  isSubmitting?: boolean
  onSubmit: () => void
  onQuestionClick: (questionId: string) => void
}

export default function QuizLayoutWrapper({
  children,
  title,
  timeLimit,
  questions,
  answeredQuestions,
  currentQuestionId,
  isSubmitting = false,
  onSubmit,
  onQuestionClick
}: QuizLayoutWrapperProps) {
  return (
    <div className="h-screen flex flex-col">
      <QuizHeader
        title={title}
        timeLimit={timeLimit}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />

      <main className="flex-1 min-h-0">
        {children}
      </main>

      <QuizFooter
        questions={questions}
        answeredQuestions={answeredQuestions}
        currentQuestionId={currentQuestionId}
        onQuestionClick={onQuestionClick}
      />
    </div>
  )
}