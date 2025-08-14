'use client'

import { cn } from "@/lib/utils"
import { CheckCircle, Circle, Clock, Target } from 'lucide-react'
import React from 'react'

interface ProgressSidebarProps {
  quizCount: number
  currentQuizIndex: number
  quizSelections: Record<number, string[]>
  onQuizSelect: (index: number) => void
  className?: string
  showProgress?: boolean
  showStats?: boolean
  timeSpent?: number // seconds
}

export const ProgressSidebar = React.memo(function ProgressSidebar({
  quizCount,
  currentQuizIndex,
  quizSelections,
  onQuizSelect,
  className,
  showProgress = true,
  showStats = true,
  timeSpent = 0
}: ProgressSidebarProps) {
  // Calculate statistics
  const answeredCount = Object.keys(quizSelections).filter(key =>
    quizSelections[parseInt(key)]?.length > 0
  ).length

  const completionPercentage = Math.round((answeredCount / quizCount) * 100)
  const averageTimePerQuestion = timeSpent > 0 && answeredCount > 0
    ? Math.round(timeSpent / answeredCount)
    : 0

  const getQuizStatus = (index: number) => {
    if (quizSelections[index]?.length > 0) return 'answered'
    return 'not-answered'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return 'border-2 border-blue-500 bg-blue-100 text-blue-700'
    }
    
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white border border-green-600'
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
    }
  }

  // Calculate grid columns based on quiz count for optimal layout
  const getGridCols = () => {
    if (quizCount <= 10) return 'grid-cols-5'
    if (quizCount <= 25) return 'grid-cols-5'
    return 'grid-cols-8' // For 50+ questions
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tiến độ làm bài
        </h3>
        <p className="text-sm text-gray-600">
          {answeredCount}/{quizCount} câu đã làm
        </p>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Hoàn thành</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStats && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <div className="font-medium text-gray-900">{answeredCount}</div>
              <div className="text-gray-600">Đã làm</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <Circle className="h-4 w-4 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900">{quizCount - answeredCount}</div>
              <div className="text-gray-600">Còn lại</div>
            </div>
          </div>

          {timeSpent > 0 && (
            <>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900">{formatTime(timeSpent)}</div>
                  <div className="text-gray-600">Tổng thời gian</div>
                </div>
              </div>

              {averageTimePerQuestion > 0 && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Target className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="font-medium text-gray-900">{averageTimePerQuestion}s</div>
                    <div className="text-gray-600">TB/câu</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Grid of question numbers */}
      <div className={cn("grid gap-2", getGridCols())}>
        {Array.from({ length: quizCount }, (_, index) => {
          const status = getQuizStatus(index)
          const isCurrent = currentQuizIndex === index

          return (
            <button
              key={index}
              onClick={() => onQuizSelect(index)}
              className={cn(
                "w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center",
                getStatusColor(status, isCurrent)
              )}
              title={`Câu ${index + 1} - ${
                status === 'answered' ? `Đã làm (${quizSelections[index]?.length || 0} đáp án)` :
                'Chưa làm'
              }`}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
})
