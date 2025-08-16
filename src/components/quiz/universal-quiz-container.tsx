'use client'

import React from 'react'
import { cn } from "@/lib/utils"
import type { QuizData } from "@/types/quiz"
import { QuizContainer } from "./multiple-choice/quiz-container"
import { FillInBlanksContainer } from "./fill-in-blanks/fill-in-blanks-container"

interface UniversalQuizContainerProps {
  quiz: QuizData
  showResults?: boolean
  className?: string
  // Multiple Choice props
  onSelectionChange?: (selectedOptions: string[]) => void
  selectedOptions?: string[]
  // Fill in the Blanks props
  onAnswerChange?: (answers: Record<string, string>) => void
  answers?: Record<string, string>
  // Common props
  disabled?: boolean
}

export function UniversalQuizContainer({
  quiz,
  showResults = false,
  className,
  onSelectionChange,
  selectedOptions,
  onAnswerChange,
  answers,
  disabled = false
}: UniversalQuizContainerProps) {
  
  // Type guard to check quiz type
  const isMultipleChoice = (quiz: QuizData): quiz is Extract<QuizData, { type: 'multiple-choice' }> => {
    return quiz.type === 'multiple-choice'
  }
  
  const isFillInBlanks = (quiz: QuizData): quiz is Extract<QuizData, { type: 'fill-in-blanks' }> => {
    return quiz.type === 'fill-in-blanks'
  }

  return (
    <div className={cn("quiz-container", className)}>
      {isMultipleChoice(quiz) && (
        <QuizContainer
          quiz={quiz}
          showResults={showResults}
          onSelectionChange={onSelectionChange}
          selectedOptions={selectedOptions}
          className="multiple-choice-quiz"
        />
      )}
      
      {isFillInBlanks(quiz) && (
        <FillInBlanksContainer
          quiz={quiz}
          showResults={showResults}
          onAnswerChange={onAnswerChange}
          answers={answers}
          disabled={disabled}
          className="fill-in-blanks-quiz"
        />
      )}
    </div>
  )
}
