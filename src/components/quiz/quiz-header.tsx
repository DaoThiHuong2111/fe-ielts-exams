'use client'

import { getPartByNumber, getTotalProgress } from '@/lib/multi-part-quiz-utils'
import { MultiPartQuiz } from '@/types/multi-part-quiz'
import { useEffect, useState } from 'react'

interface QuizHeaderProps {
  quiz: MultiPartQuiz
  currentPart: number
  answers: Record<string, string>
  onSubmit: () => void
  isSubmitting?: boolean
  overallTimeLeft?: number // Optional: for overall test timer
}

export default function QuizHeader({
  quiz,
  currentPart,
  answers,
  onSubmit,
  isSubmitting = false,
  overallTimeLeft
}: QuizHeaderProps) {
  const timeLeft = overallTimeLeft ?? (quiz.totalTimeLimit * 60)
  
  const currentPartData = getPartByNumber(quiz, currentPart)
  const progress = getTotalProgress(quiz, answers)

  useEffect(() => {
    if (timeLeft === 0) {
      onSubmit()
    }
  }, [timeLeft, onSubmit])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }

  const getTimeWarningColor = (seconds: number) => {
    const minutes = seconds / 60
    if (minutes <= 5) return 'text-red-600'
    if (minutes <= 10) return 'text-yellow-600'
    return 'text-gray-700'
  }

  return (
    <header className="bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Title and Part Info */}
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-900">
            {quiz.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Part {currentPart} of {quiz.parts.length}: {currentPartData?.title || `Part ${currentPart}`}
            </span>
            <span>
              {(() => {
                // Calculate continuous question range for current part based on JSON structure
                let questionNumber = 1
                let startQuestion = 1
                let endQuestion = 0

                // Count all questions in all parts to get the correct numbering
                for (let i = 0; i < quiz.parts.length; i++) {
                  const part = quiz.parts[i]
                  let partStartQuestion = questionNumber

                  // Count questions in this part based on JSON structure
                  part.questions.forEach(question => {
                    if (question.type === 'TABLE_COMPLETION') {
                      const tableData = question.tableData
                      if (tableData?.rows) {
                        tableData.rows.forEach((row: any) => {
                          const answersCount = Object.keys(row.answers || {}).length
                          questionNumber += answersCount
                        })
                      }
                    } else if (question.type === 'MATCHING_TABLE') {
                      const tableData = question.tableData
                      if (tableData?.rows) {
                        questionNumber += tableData.rows.length
                      }
                    } else if (question.type === 'MULTIPLE_SELECT') {
                      // For MULTIPLE_SELECT in listening, each option counts as a separate question
                      // Based on the requirement: Part 3 should be 13-19 (7 questions) for maxSelections: 3
                      // This suggests we should count all options, not just maxSelections
                      questionNumber += question.options?.length || question.maxSelections || 1
                    } else {
                      // Regular questions (MULTIPLE_CHOICE, SENTENCE_COMPLETION, etc.)
                      questionNumber += 1
                    }
                  })

                  if (part.partNumber === currentPart) {
                    startQuestion = partStartQuestion
                    endQuestion = questionNumber - 1
                    break
                  }
                }

                return `Questions ${startQuestion}-${endQuestion}`
              })()}
            </span>

          </div>
        </div>

        {/* Timer and Submit */}
        <div className="flex items-center gap-4">
          {/* Progress Bar */}
          <div className="hidden md:flex flex-col items-end">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {progress.percentage}% complete
            </span>
          </div>
          
          {/* Timer */}
          <div className="text-center">
            <div className={`text-lg font-mono font-bold ${getTimeWarningColor(timeLeft)}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-gray-500">
              Time left
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>
    </header>
  )
}