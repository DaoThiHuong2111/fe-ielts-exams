'use client'

import { cn, generateId } from "@/lib/utils"
import type { QuizOption } from "@/types/quiz"
import { useEffect, useRef } from 'react'
import { AnswerOption } from "./answer-option"

interface QuizQuestionProps {
  title?: string
  instruction?: string
  options: QuizOption[]
  selectedOptions?: string[]
  onOptionToggle?: (optionId: string) => void
  maxSelections?: number
  className?: string
  showResults?: boolean
  correctAnswers?: string[]
  disabled?: boolean
  autoFocus?: boolean
}

export function QuizQuestion({
  title,
  instruction,
  options,
  selectedOptions = [],
  onOptionToggle,
  maxSelections,
  className,
  showResults = false,
  correctAnswers = [],
  disabled = false,
  autoFocus = false
}: QuizQuestionProps) {
  const questionRef = useRef<HTMLDivElement>(null)
  const titleId = generateId('question-title')
  const instructionId = generateId('question-instruction')

  // Auto focus on mount or when question changes
  useEffect(() => {
    if (autoFocus && questionRef.current) {
      questionRef.current.focus()
    }
  }, [autoFocus, title])

  const handleOptionClick = (optionId: string) => {
    if (!onOptionToggle) return

    const isSelected = selectedOptions.includes(optionId)
    
    if (isSelected) {
      // Deselect if already selected
      onOptionToggle(optionId)
    } else {
      // Check if we can select more options
      if (maxSelections && selectedOptions.length >= maxSelections) {
        return // Can't select more
      }
      onOptionToggle(optionId)
    }
  }

  return (
    <div 
      ref={questionRef}
      className={cn("space-y-6", className)}
      tabIndex={-1}
      role="group"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={instruction ? instructionId : undefined}
    >
      {title && (
        <div className="space-y-2">
          <h3 
            id={titleId}
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
          {instruction && (
            <p 
              id={instructionId}
              className="text-sm text-gray-600"
            >
              {instruction}
              {maxSelections && (
                <span className="font-medium text-gray-800">
                  {` (Chọn ${maxSelections} đáp án)`}
                </span>
              )}
            </p>
          )}
        </div>
      )}

      <div 
        className="space-y-3"
        role={maxSelections && maxSelections > 1 ? "group" : "radiogroup"}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={instruction ? instructionId : undefined}
        aria-required="true"
      >
        {options.map((option) => (
          <AnswerOption
            key={option.id}
            id={option.id}
            label={option.label}
            text={option.text}
            isSelected={selectedOptions.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
            showResults={showResults}
            correctAnswers={correctAnswers}
            disabled={disabled}
            isMultipleChoice={maxSelections ? maxSelections > 1 : false}
          />
        ))}
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedOptions.length > 0 && (
          <span>
            Đã chọn {selectedOptions.length} đáp án: {selectedOptions.join(', ')}
            {maxSelections && ` (tối đa ${maxSelections} đáp án)`}
          </span>
        )}
      </div>
    </div>
  )
}
