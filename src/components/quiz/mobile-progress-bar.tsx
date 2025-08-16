'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MobileProgressBarProps {
  currentQuestionIndex: number
  totalQuestions: number
  answeredCount: number
  onPrevious?: () => void
  onNext?: () => void
  timeLeft?: number
  className?: string
  showTimer?: boolean
  showQuestionNumbers?: boolean
}

export const MobileProgressBar = React.memo(function MobileProgressBar({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  onPrevious,
  onNext,
  timeLeft,
  className,
  showTimer = true,
  showQuestionNumbers = true
}: MobileProgressBarProps) {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const completionPercentage = (answeredCount / totalQuestions) * 100

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const isTimeWarning = timeLeft !== undefined && timeLeft <= 300 && timeLeft > 0 // 5 minutes
  const isTimeUp = timeLeft !== undefined && timeLeft <= 0

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm',
      className
    )}>
      {/* Main Progress Bar */}
      <div className="relative h-1 bg-gray-200">
        {/* Completion Progress (answered questions) */}
        <div 
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
        {/* Current Progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Content Bar */}
      <div className="flex items-center justify-between px-4 py-2 min-h-[48px]">
        {/* Left: Previous Button + Question Info */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            className="h-8 w-8 p-0"
            aria-label="Câu hỏi trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {showQuestionNumbers && (
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-gray-900">
                {currentQuestionIndex + 1}
              </span>
              <span className="text-gray-500">/{totalQuestions}</span>
            </div>
          )}
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-3 text-xs">
          {/* Answered Count */}
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span className="font-medium">{answeredCount}</span>
          </div>

          {/* Timer */}
          {showTimer && timeLeft !== undefined && (
            <div className={cn(
              'flex items-center gap-1 font-mono',
              isTimeUp ? 'text-red-600' :
              isTimeWarning ? 'text-orange-600' :
              'text-gray-600'
            )}>
              <Clock className="h-3 w-3" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Right: Next Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="h-8 w-8 p-0"
            aria-label="Câu hỏi tiếp theo"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
})

// Compact version for very small screens
export const CompactMobileProgressBar = React.memo(function CompactMobileProgressBar({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  timeLeft,
  className
}: Pick<MobileProgressBarProps, 'currentQuestionIndex' | 'totalQuestions' | 'answeredCount' | 'timeLeft' | 'className'>) {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const completionPercentage = (answeredCount / totalQuestions) * 100

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const isTimeWarning = timeLeft !== undefined && timeLeft <= 300 && timeLeft > 0
  const isTimeUp = timeLeft !== undefined && timeLeft <= 0

  return (
    <div className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200',
      className
    )}>
      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-200">
        <div 
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
          style={{ width: `${completionPercentage}%` }}
        />
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Compact Info */}
      <div className="flex items-center justify-between px-3 py-1 text-xs">
        <span className="font-medium text-gray-900">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓{answeredCount}</span>
          {timeLeft !== undefined && (
            <span className={cn(
              'font-mono',
              isTimeUp ? 'text-red-600' :
              isTimeWarning ? 'text-orange-600' :
              'text-gray-600'
            )}>
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

// Hook to detect if mobile progress bar should be used
export function useMobileProgressBar() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
