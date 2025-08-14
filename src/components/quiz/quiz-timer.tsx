'use client'

import React from 'react'
import { Clock, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useQuizTimer } from '@/hooks/useQuizTimer'

interface QuizTimerProps {
  duration: number // seconds
  onTimeUp?: () => void
  onWarning?: (timeLeft: number) => void
  warningThreshold?: number // seconds
  autoStart?: boolean
  showControls?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const QuizTimer = React.memo(function QuizTimer({
  duration,
  onTimeUp,
  onWarning,
  warningThreshold = 300, // 5 minutes
  autoStart = false,
  showControls = true,
  className,
  size = 'md'
}: QuizTimerProps) {
  const {
    timeLeft,
    isActive,
    isPaused,
    isFinished,
    formattedTime,
    start,
    pause,
    resume,
    reset
  } = useQuizTimer({
    duration,
    onTimeUp,
    onWarning,
    warningThreshold,
    autoStart
  })

  // Determine styling based on time left
  const getTimerStyling = () => {
    if (isFinished) {
      return {
        container: 'border-red-500 bg-red-50',
        text: 'text-red-700',
        icon: 'text-red-500'
      }
    }
    
    if (timeLeft <= warningThreshold) {
      return {
        container: 'border-orange-400 bg-orange-50',
        text: 'text-orange-700',
        icon: 'text-orange-500'
      }
    }
    
    return {
      container: 'border-gray-300 bg-white',
      text: 'text-gray-700',
      icon: 'text-gray-500'
    }
  }

  const styling = getTimerStyling()
  
  // Size variants
  const sizeClasses = {
    sm: {
      container: 'px-3 py-2',
      text: 'text-sm',
      icon: 'h-4 w-4',
      button: 'h-7 w-7'
    },
    md: {
      container: 'px-4 py-3',
      text: 'text-base',
      icon: 'h-5 w-5',
      button: 'h-8 w-8'
    },
    lg: {
      container: 'px-6 py-4',
      text: 'text-lg',
      icon: 'h-6 w-6',
      button: 'h-10 w-10'
    }
  }

  const sizeClass = sizeClasses[size]

  return (
    <div className={cn(
      'flex items-center justify-between border rounded-lg transition-all duration-200',
      styling.container,
      sizeClass.container,
      className
    )}>
      {/* Timer Display */}
      <div className="flex items-center gap-2">
        <div className={cn('flex-shrink-0', styling.icon)}>
          {isFinished ? (
            <AlertTriangle className={sizeClass.icon} />
          ) : (
            <Clock className={sizeClass.icon} />
          )}
        </div>
        
        <div className="flex flex-col">
          <span className={cn(
            'font-mono font-semibold tabular-nums',
            styling.text,
            sizeClass.text
          )}>
            {formattedTime}
          </span>
          
          {size !== 'sm' && (
            <span className="text-xs text-gray-500">
              {isFinished ? 'Hết giờ' : 
               isPaused ? 'Tạm dừng' : 
               isActive ? 'Đang chạy' : 'Chưa bắt đầu'}
            </span>
          )}
        </div>
      </div>

      {/* Timer Controls */}
      {showControls && (
        <div className="flex items-center gap-1">
          {!isFinished && (
            <>
              {!isActive || isPaused ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isPaused ? resume : start}
                  className={cn('p-0', sizeClass.button)}
                  title={isPaused ? 'Tiếp tục' : 'Bắt đầu'}
                >
                  <Play className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={pause}
                  className={cn('p-0', sizeClass.button)}
                  title="Tạm dừng"
                >
                  <Pause className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className={cn('p-0', sizeClass.button)}
            title="Đặt lại"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
})

// Compact timer for mobile/small spaces
export const CompactTimer = React.memo(function CompactTimer({
  duration,
  onTimeUp,
  warningThreshold = 300,
  autoStart = false,
  className
}: Omit<QuizTimerProps, 'showControls' | 'size'>) {
  const { timeLeft, isFinished, formattedTime } = useQuizTimer({
    duration,
    onTimeUp,
    warningThreshold,
    autoStart
  })

  const isWarning = timeLeft <= warningThreshold && !isFinished

  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono',
      isFinished ? 'bg-red-100 text-red-700' :
      isWarning ? 'bg-orange-100 text-orange-700' :
      'bg-gray-100 text-gray-700',
      className
    )}>
      <Clock className="h-3 w-3" />
      <span className="tabular-nums">{formattedTime}</span>
    </div>
  )
})
