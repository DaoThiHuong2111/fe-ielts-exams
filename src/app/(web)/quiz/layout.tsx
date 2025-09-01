'use client'

import { useEffect } from 'react'
import { TextSelectionProvider } from '@/contexts/text-selection-context'

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Ẩn header và footer khi vào trang quiz
    document.body.classList.add('quiz-mode')
    
    return () => {
      // Hiện lại khi rời khỏi trang
      document.body.classList.remove('quiz-mode')
    }
  }, [])

  return (
    <TextSelectionProvider>
      {children}
    </TextSelectionProvider>
  )
}
