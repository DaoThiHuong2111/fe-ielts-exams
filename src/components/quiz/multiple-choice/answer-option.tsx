'use client'

import { cn } from "@/lib/utils"
import React from 'react'

interface AnswerOptionProps {
  id: string
  label: string // A, B, C, D, etc.
  text: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
  showResults?: boolean
  isCorrect?: boolean
  correctAnswers?: string[]
  disabled?: boolean
  isMultipleChoice?: boolean // true for multiple selection, false for single selection
}

export const AnswerOption = React.memo(function AnswerOption({
  id,
  label,
  text,
  isSelected = false,
  onClick,
  className,
  showResults = false,
  correctAnswers = [],
  disabled = false,
  isMultipleChoice = false
}: AnswerOptionProps) {
  const isCorrect = correctAnswers.includes(id)
  
  // Determine styling based on results mode
  const getOptionStyling = () => {
    if (!showResults) {
      // Normal mode - show selection state
      return {
        container: cn(
          "flex items-start gap-3 p-1 sm:p-2 rounded-lg border cursor-pointer transition-all duration-200",
          "hover:border-yellow-400 hover:bg-yellow-50",
          "active:scale-[0.98] active:bg-yellow-100", // Mobile touch feedback
          isSelected
            ? "border-yellow-400 bg-yellow-50 shadow-sm"
            : "border-gray-200 bg-white"
        ),
        badge: cn(
          "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
          "sm:w-7 sm:h-7 sm:text-sm",
          isSelected
            ? "bg-yellow-400 text-white"
            : "bg-gray-100 text-gray-600"
        )
      }
    }
    
    // Results mode - show correct/incorrect
    if (isCorrect && isSelected) {
      // Correct and selected - GREEN
      return {
        container: "flex items-start gap-3 p-1 sm:p-2 rounded-lg border-2 border-green-500 bg-green-50",
        badge: "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-green-500 text-white sm:w-7 sm:h-7 sm:text-sm"
      }
    } else if (isCorrect && !isSelected) {
      // Correct but not selected - GREEN outline
      return {
        container: "flex items-start gap-3 p-1 sm:p-2 rounded-lg border-2 border-green-300 bg-green-50",
        badge: "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-green-100 text-green-700 border-2 border-green-300 sm:w-7 sm:h-7 sm:text-sm"
      }
    } else if (!isCorrect && isSelected) {
      // Wrong and selected - RED
      return {
        container: "flex items-start gap-3 p-1 sm:p-2 rounded-lg border-2 border-red-500 bg-red-50",
        badge: "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-red-500 text-white sm:w-7 sm:h-7 sm:text-sm"
      }
    } else {
      // Not correct, not selected - gray
      return {
        container: "flex items-start gap-3 p-1 sm:p-2 rounded-lg border border-gray-200 bg-gray-50",
        badge: "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold bg-gray-100 text-gray-600 sm:w-7 sm:h-7 sm:text-sm"
      }
    }
  }

  const styling = getOptionStyling()
  
  return (
    <div
      role={isMultipleChoice ? "checkbox" : "radio"}
      aria-checked={isSelected}
      aria-labelledby={`option-${id}-label`}
      aria-describedby={`option-${id}-text`}
      tabIndex={disabled ? -1 : 0}
      className={cn(styling.container, className)}
      onClick={showResults || disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (!showResults && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick?.()
        }
      }}
      style={{ cursor: showResults || disabled ? 'default' : 'pointer' }}
      aria-disabled={disabled}
    >
      <div className={styling.badge} aria-hidden="true">
        {label}
        {showResults && isCorrect && <span className="ml-1" aria-label="Đúng">✓</span>}
        {showResults && !isCorrect && isSelected && <span className="ml-1" aria-label="Sai">✗</span>}
      </div>
      <div className="flex-1">
        <span className="sr-only" id={`option-${id}-label`}>
          Đáp án {label}
        </span>
        <p
          className="text-xs text-gray-700 leading-relaxed sm:text-sm"
          id={`option-${id}-text`}
        >
          {text}
        </p>
        {showResults && (
          <span className="sr-only">
            {isCorrect ? 'Đáp án đúng' : 'Đáp án sai'}
            {isSelected ? ', đã chọn' : ', chưa chọn'}
          </span>
        )}
      </div>
    </div>
  )
})
