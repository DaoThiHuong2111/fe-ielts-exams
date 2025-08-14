'use client'

import { cn } from "@/lib/utils"
import React, { useEffect, useRef } from 'react'

interface BlankInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  showResults?: boolean
  isCorrect?: boolean
  correctAnswer?: string
  disabled?: boolean
  className?: string
  autoFocus?: boolean
}

export const BlankInput = React.memo(function BlankInput({
  id,
  value,
  onChange,
  placeholder = "...",
  maxLength = 50,
  showResults = false,
  isCorrect,
  correctAnswer,
  disabled = false,
  className,
  autoFocus = false
}: BlankInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])



  // Fixed dot count - no hint about answer length
  const dotCount = 10

  return (
    <span className="inline-block relative">
      {/* Visual container with input */}
      <span
        className={cn(
          'inline-block relative cursor-text',
          'border-b-2 border-dotted transition-colors duration-200 min-h-[1.5em]',
          showResults
            ? isCorrect
              ? 'border-green-500'
              : 'border-red-500'
            : value.trim()
              ? 'border-blue-500'
              : 'border-gray-400 hover:border-gray-600',
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Input field */}
        <input
          ref={inputRef}
          id={`blank-${id}`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          disabled={disabled || showResults}
          className={cn(
            'bg-transparent border-none outline-none text-center min-w-[80px]',
            'font-medium',
            showResults
              ? isCorrect
                ? 'text-green-700'
                : 'text-red-700'
              : 'text-blue-700'
          )}
          style={{
            width: `${Math.max(value.length * 8 + 10, 80)}px`
          }}
          aria-label={`Điền vào chỗ trống ${id}`}
          aria-describedby={showResults ? `blank-${id}-result` : undefined}
        />

        {/* Empty space when no value - just show the border-bottom */}
        {!value.trim() && (
          <span className="text-transparent pointer-events-none select-none">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        )}
      </span>

      {/* Results indicator */}
      {showResults && (
        <span className="ml-1 text-sm">
          {isCorrect ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-red-600">✗</span>
          )}
        </span>
      )}

      {/* Correct answer display */}
      {showResults && !isCorrect && correctAnswer && (
        <span className="ml-2 text-xs text-green-600 font-medium">
          ({correctAnswer})
        </span>
      )}

      {/* Screen reader feedback */}
      <div className="sr-only" aria-live="polite">
        {showResults && (
          <span>
            Chỗ trống {id}: {isCorrect ? 'Đúng' : `Sai, đáp án đúng là ${correctAnswer}`}
          </span>
        )}
      </div>
    </span>
  )
})
