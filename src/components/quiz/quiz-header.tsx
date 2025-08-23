'use client'

import { useEffect, useState } from 'react'

interface QuizHeaderProps {
  title: string
  timeLimit: number // in minutes
  onSubmit: () => void
  isSubmitting?: boolean
}

export default function QuizHeader({
  title,
  timeLimit,
  onSubmit,
  isSubmitting = false
}: QuizHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60) // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onSubmit])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900">
        {title}
      </h1>

      {/* Timer and Submit */}
      <div className="flex items-center gap-4">
        <div className="text-lg font-mono font-bold text-gray-700">
          {formatTime(timeLeft)}
        </div>
        
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
        </button>
      </div>
    </header>
  )
}