'use client'

import { useEffect } from 'react'

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
    <>
      {children}
    </>
  )
}
