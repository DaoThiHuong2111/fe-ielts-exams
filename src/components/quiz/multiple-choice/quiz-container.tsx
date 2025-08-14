'use client'

import { cn } from "@/lib/utils"
import type { MultipleChoiceData } from "@/types/quiz"
import { useState } from 'react'
import { ReadingPassage } from "../reading-passage"
import { QuizQuestion } from "./quiz-question"

interface QuizContainerProps {
  quiz: MultipleChoiceData
  showResults?: boolean
  className?: string
  onSelectionChange?: (selectedOptions: string[]) => void
  selectedOptions?: string[] // Controlled component - selections from parent
}

export function QuizContainer({
  quiz,
  showResults = false,
  className,
  onSelectionChange,
  selectedOptions: controlledSelectedOptions
}: QuizContainerProps) {
  const [internalSelectedOptions, setInternalSelectedOptions] = useState<string[]>([])
  
  // Use controlled selectedOptions if provided, otherwise use internal state
  const selectedOptions = controlledSelectedOptions ?? internalSelectedOptions
  
  const handleOptionToggle = (optionId: string) => {
    const newOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId) // Remove option
      : quiz.maxSelections && selectedOptions.length >= quiz.maxSelections
        ? selectedOptions // Don't add if at limit
        : [...selectedOptions, optionId] // Add option
    
    // If controlled, notify parent. If uncontrolled, update internal state
    if (controlledSelectedOptions !== undefined) {
      onSelectionChange?.(newOptions)
    } else {
      setInternalSelectedOptions(newOptions)
      onSelectionChange?.(newOptions)
    }
  }



  const getCorrectCount = () => {
    if (!quiz.correctAnswers) return 0
    return selectedOptions.filter(option => quiz.correctAnswers?.includes(option)).length
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Reading Passage Section */}
      {quiz.passage && (
        <ReadingPassage
          title={typeof quiz.passage === 'object' ? quiz.passage.title : quiz.passageTitle}
          passage={typeof quiz.passage === 'object' ? quiz.passage.content : quiz.passage}
        />
      )}

      {/* Question Section */}
      <QuizQuestion
        title={quiz.title}
        instruction={quiz.instruction}
        options={quiz.options}
        selectedOptions={selectedOptions}
        onOptionToggle={handleOptionToggle}
        maxSelections={quiz.maxSelections}
        showResults={showResults}
        correctAnswers={quiz.correctAnswers}
      />

      {/* Results Summary */}
      {showResults && quiz.correctAnswers && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Kết quả:</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>Đáp án bạn chọn: <span className="font-medium">{selectedOptions.length > 0 ? selectedOptions.join(", ") : "Chưa chọn"}</span></p>
            <p>Đáp án đúng: <span className="font-medium">{quiz.correctAnswers.join(", ")}</span></p>
            <p>Số đáp án đúng: <span className="font-medium text-green-600">{getCorrectCount()}/{quiz.correctAnswers.length}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}
