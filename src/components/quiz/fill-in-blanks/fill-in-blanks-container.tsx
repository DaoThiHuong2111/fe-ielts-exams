'use client'

import { cn } from "@/lib/utils"
import type { FillInBlanksData } from "@/types/quiz"
import { useState } from 'react'
import { ReadingPassage } from "../reading-passage"
import { FillInBlanksQuestion } from "./fill-in-blanks-question"

interface FillInBlanksContainerProps {
  quiz: FillInBlanksData
  showResults?: boolean
  className?: string
  onAnswerChange?: (answers: Record<string, string>) => void
  answers?: Record<string, string> // Controlled component - answers from parent
  disabled?: boolean
}

export function FillInBlanksContainer({
  quiz,
  showResults = false,
  className,
  onAnswerChange,
  answers: controlledAnswers,
  disabled = false
}: FillInBlanksContainerProps) {
  const [internalAnswers, setInternalAnswers] = useState<Record<string, string>>({})
  
  // Use controlled answers if provided, otherwise use internal state
  const answers = controlledAnswers ?? internalAnswers
  
  const handleAnswerChange = (blankId: string, value: string) => {
    const newAnswers = {
      ...answers,
      [blankId]: value
    }
    
    // If controlled, notify parent. If uncontrolled, update internal state
    if (controlledAnswers !== undefined) {
      onAnswerChange?.(newAnswers)
    } else {
      setInternalAnswers(newAnswers)
      onAnswerChange?.(newAnswers)
    }
  }

  const getCompletionStats = () => {
    const totalBlanks = quiz.blanks.length
    const filledBlanks = Object.values(answers).filter(answer => answer.trim()).length
    const correctBlanks = showResults 
      ? quiz.blanks.filter(blank => {
          const userAnswer = answers[blank.id]?.trim().toLowerCase()
          const correctAnswer = blank.correctAnswer?.trim().toLowerCase()
          return userAnswer === correctAnswer
        }).length 
      : 0
    
    return { totalBlanks, filledBlanks, correctBlanks }
  }

  const stats = getCompletionStats()

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      {/* Reading Passage Section */}
      {quiz.passage && (
        <ReadingPassage
          title={typeof quiz.passage === 'object' ? quiz.passage.title : quiz.passageTitle}
          passage={typeof quiz.passage === 'object' ? quiz.passage.content : quiz.passage}
        />
      )}

      {/* Fill in the Blanks Question Section */}
      <FillInBlanksQuestion
        title={quiz.title}
        instruction={quiz.instruction}
        text={quiz.text}
        blanks={quiz.blanks}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        showResults={showResults}
        disabled={disabled}
        autoFocus={true}
      />

      {/* Overall Results Summary */}
      {showResults && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">Tổng kết:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-100 rounded">
              <div className="text-2xl font-bold text-blue-600">{stats.filledBlanks}</div>
              <div className="text-blue-800">Đã điền</div>
            </div>
            <div className="text-center p-3 bg-green-100 rounded">
              <div className="text-2xl font-bold text-green-600">{stats.correctBlanks}</div>
              <div className="text-green-800">Đúng</div>
            </div>
            <div className="text-center p-3 bg-purple-100 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((stats.correctBlanks / stats.totalBlanks) * 100)}%
              </div>
              <div className="text-purple-800">Độ chính xác</div>
            </div>
          </div>
          
          {/* Detailed breakdown */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="font-medium text-gray-800 mb-2">Chi tiết:</h5>
            <div className="space-y-2 text-sm text-gray-600">
              {quiz.blanks.map((blank) => {
                const userAnswer = answers[blank.id]?.trim()
                const isCorrect = userAnswer?.toLowerCase() === blank.correctAnswer?.toLowerCase()
                
                return (
                  <div key={blank.id} className="flex justify-between items-center">
                    <span>Chỗ trống {blank.id}:</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        userAnswer 
                          ? isCorrect 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-600"
                      )}>
                        {userAnswer || "Chưa điền"}
                      </span>
                      {showResults && !isCorrect && blank.correctAnswer && (
                        <span className="text-xs text-green-600">
                          → {blank.correctAnswer}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
