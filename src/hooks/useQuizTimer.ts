'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseQuizTimerOptions {
  duration: number // seconds
  onTimeUp?: () => void
  onWarning?: (timeLeft: number) => void
  warningThreshold?: number // seconds, default 300 (5 minutes)
  autoStart?: boolean
}

export interface UseQuizTimerReturn {
  timeLeft: number
  isActive: boolean
  isPaused: boolean
  isFinished: boolean
  formattedTime: string
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  addTime: (seconds: number) => void
}

export function useQuizTimer({
  duration,
  onTimeUp,
  onWarning,
  warningThreshold = 300,
  autoStart = false
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const warningTriggeredRef = useRef(false)

  // Format time as MM:SS or HH:MM:SS
  const formattedTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Timer effect
  useEffect(() => {
    if (isActive && !isPaused && !isFinished && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          
          // Trigger warning if threshold reached
          if (newTime === warningThreshold && !warningTriggeredRef.current) {
            warningTriggeredRef.current = true
            onWarning?.(newTime)
          }
          
          // Time's up
          if (newTime <= 0) {
            setIsActive(false)
            setIsFinished(true)
            onTimeUp?.()
            return 0
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, isFinished, timeLeft, onTimeUp, onWarning, warningThreshold])

  const start = useCallback(() => {
    if (!isFinished) {
      setIsActive(true)
      setIsPaused(false)
    }
  }, [isFinished])

  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    if (isActive && !isFinished) {
      setIsPaused(false)
    }
  }, [isActive, isFinished])

  const reset = useCallback(() => {
    setTimeLeft(duration)
    setIsActive(false)
    setIsPaused(false)
    setIsFinished(false)
    warningTriggeredRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [duration])

  const addTime = useCallback((seconds: number) => {
    if (!isFinished) {
      setTimeLeft(prev => prev + seconds)
    }
  }, [isFinished])

  return {
    timeLeft,
    isActive,
    isPaused,
    isFinished,
    formattedTime: formattedTime(timeLeft),
    start,
    pause,
    resume,
    reset,
    addTime
  }
}
