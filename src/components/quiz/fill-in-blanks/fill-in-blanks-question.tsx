'use client'

import { cn } from "@/lib/utils"
import type { BlankPosition } from "@/types/quiz"
import React, { useEffect, useMemo, useRef } from 'react'
import { BlankInput } from "./blank-input"

interface FillInBlanksQuestionProps {
  title?: string
  instruction?: string
  text: string
  blanks: BlankPosition[]
  answers?: Record<string, string>
  onAnswerChange?: (blankId: string, value: string) => void
  showResults?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

export function FillInBlanksQuestion({
  title,
  instruction,
  text,
  blanks,
  answers = {},
  onAnswerChange,
  showResults = false,
  disabled = false,
  autoFocus = false,
  className
}: FillInBlanksQuestionProps) {
  const questionRef = useRef<HTMLDivElement>(null)
  const titleId = `fill-question-title-${Math.random().toString(36).substring(2, 11)}`
  const instructionId = `fill-question-instruction-${Math.random().toString(36).substring(2, 11)}`

  // Auto focus on mount or when question changes
  useEffect(() => {
    if (autoFocus && questionRef.current) {
      questionRef.current.focus()
    }
  }, [autoFocus, title])

  // Parse text and create segments with blanks
  const textSegments = useMemo(() => {
    // Sort blanks by start index to process them in order
    const sortedBlanks = [...blanks].sort((a, b) => a.startIndex - b.startIndex)
    
    const segments: Array<{
      type: 'text' | 'blank'
      content: string
      blank?: BlankPosition
    }> = []
    
    let currentIndex = 0
    
    sortedBlanks.forEach((blank) => {
      // Add text before the blank
      if (currentIndex < blank.startIndex) {
        segments.push({
          type: 'text',
          content: text.slice(currentIndex, blank.startIndex)
        })
      }
      
      // Add the blank
      segments.push({
        type: 'blank',
        content: text.slice(blank.startIndex, blank.endIndex),
        blank
      })
      
      currentIndex = blank.endIndex
    })
    
    // Add remaining text after the last blank
    if (currentIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(currentIndex)
      })
    }
    
    return segments
  }, [text, blanks])

  const handleAnswerChange = (blankId: string, value: string) => {
    onAnswerChange?.(blankId, value)
  }

  const getBlankCorrectness = (blank: BlankPosition) => {
    if (!showResults || !blank.correctAnswer) return undefined
    const userAnswer = answers[blank.id]?.trim().toLowerCase()
    const correctAnswer = blank.correctAnswer.trim().toLowerCase()
    return userAnswer === correctAnswer
  }

  const getCompletionStats = () => {
    const totalBlanks = blanks.length
    const filledBlanks = Object.values(answers).filter(answer => answer.trim()).length
    const correctBlanks = showResults 
      ? blanks.filter(blank => getBlankCorrectness(blank) === true).length 
      : 0
    
    return { totalBlanks, filledBlanks, correctBlanks }
  }

  const stats = getCompletionStats()

  return (
    <div
      ref={questionRef}
      className={cn("space-y-4 sm:space-y-6", className)}
      tabIndex={-1}
      role="group"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={instruction ? instructionId : undefined}
    >
      {/* Title and Instructions */}
      {title && (
        <div className="space-y-2">
          <h3
            id={titleId}
            className="text-base sm:text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
          {instruction && (
            <p
              id={instructionId}
              className="text-sm text-gray-600"
            >
              {instruction}
              <span className="font-medium text-gray-800 ml-2 block sm:inline mt-1 sm:mt-0">
                ({stats.filledBlanks}/{stats.totalBlanks} chỗ trống đã điền)
              </span>
            </p>
          )}
        </div>
      )}

      {/* Text with Blanks */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border">
        <div className="text-sm sm:text-base leading-relaxed text-gray-800">
          {textSegments.map((segment, index) => (
            <React.Fragment key={index}>
              {segment.type === 'text' ? (
                <span>{segment.content}</span>
              ) : (
                <BlankInput
                  id={segment.blank!.id}
                  value={answers[segment.blank!.id] || ''}
                  onChange={(value) => handleAnswerChange(segment.blank!.id, value)}
                  placeholder={segment.blank!.placeholder}
                  maxLength={segment.blank!.maxLength}
                  showResults={showResults}
                  isCorrect={getBlankCorrectness(segment.blank!)}
                  correctAnswer={segment.blank!.correctAnswer}
                  disabled={disabled}
                  autoFocus={autoFocus && segment.blank!.id === blanks[0]?.id} // Focus first blank
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Progress and Results */}
      {showResults && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Kết quả:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Số chỗ trống đã điền: <span className="font-medium">{stats.filledBlanks}/{stats.totalBlanks}</span></p>
            <p>Số đáp án đúng: <span className="font-medium text-green-600">{stats.correctBlanks}/{stats.totalBlanks}</span></p>
            <p>Độ chính xác: <span className="font-medium">{Math.round((stats.correctBlanks / stats.totalBlanks) * 100)}%</span></p>
          </div>
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {stats.filledBlanks > 0 && (
          <span>
            Đã điền {stats.filledBlanks} trong {stats.totalBlanks} chỗ trống
            {showResults && `, ${stats.correctBlanks} đáp án đúng`}
          </span>
        )}
      </div>
    </div>
  )
}
