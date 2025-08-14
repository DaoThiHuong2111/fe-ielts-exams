'use client'

import React, { useEffect, useRef } from 'react'

interface ScreenReaderAnnouncementsProps {
  message: string
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  delay?: number // milliseconds
}

export const ScreenReaderAnnouncements = React.memo(function ScreenReaderAnnouncements({
  message,
  priority = 'polite',
  atomic = true,
  delay = 100
}: ScreenReaderAnnouncementsProps) {
  const announcementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!message) return

    const timeoutId = setTimeout(() => {
      if (announcementRef.current) {
        // Clear previous message
        announcementRef.current.textContent = ''
        
        // Set new message after a brief pause to ensure screen readers pick it up
        setTimeout(() => {
          if (announcementRef.current) {
            announcementRef.current.textContent = message
          }
        }, 50)
      }
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [message, delay])

  return (
    <div
      ref={announcementRef}
      className="sr-only"
      aria-live={priority}
      aria-atomic={atomic}
      role="status"
    />
  )
})

// Hook for managing screen reader announcements
export function useScreenReaderAnnouncements() {
  const announce = (
    message: string, 
    priority: 'polite' | 'assertive' = 'polite',
    delay: number = 100
  ) => {
    // Create temporary announcement element
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.setAttribute('role', 'status')
    announcement.className = 'sr-only'
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      announcement.textContent = message
      
      // Remove after announcement
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 3000)
    }, delay)
  }

  return { announce }
}

// Predefined announcement messages for quiz
export const QuizAnnouncements = {
  questionChanged: (questionNumber: number, totalQuestions: number) =>
    `Câu hỏi ${questionNumber} trong tổng số ${totalQuestions} câu hỏi`,
  
  optionSelected: (option: string, totalSelected: number, maxSelections?: number) =>
    maxSelections 
      ? `Đã chọn đáp án ${option}. Tổng cộng ${totalSelected} trong ${maxSelections} đáp án được phép chọn`
      : `Đã chọn đáp án ${option}. Tổng cộng ${totalSelected} đáp án đã chọn`,
  
  optionDeselected: (option: string, totalSelected: number) =>
    `Đã bỏ chọn đáp án ${option}. Còn lại ${totalSelected} đáp án đã chọn`,
  
  maxSelectionsReached: (maxSelections: number) =>
    `Đã đạt giới hạn tối đa ${maxSelections} đáp án. Vui lòng bỏ chọn một đáp án khác trước khi chọn đáp án mới`,
  
  quizSubmitted: (score?: number, totalQuestions?: number) =>
    score !== undefined && totalQuestions !== undefined
      ? `Đã nộp bài. Điểm số: ${score} trên ${totalQuestions}`
      : 'Đã nộp bài thành công',
  
  resultsShown: () =>
    'Đang hiển thị kết quả. Các đáp án đúng được đánh dấu màu xanh, đáp án sai được đánh dấu màu đỏ',
  
  timerWarning: (timeLeft: number) => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `Cảnh báo: Còn lại ${minutes} phút ${seconds} giây`
  },
  
  timeUp: () =>
    'Hết giờ làm bài. Bài thi sẽ được tự động nộp',
  
  keyboardShortcuts: () =>
    'Phím tắt có sẵn: Số 1-9 hoặc A-I để chọn đáp án, Enter để xác nhận, mũi tên để điều hướng, Space để nộp bài, Escape để xem kết quả',
  
  progressUpdate: (completed: number, total: number, percentage: number) =>
    `Tiến độ: Đã hoàn thành ${completed} trong ${total} câu hỏi, ${percentage} phần trăm`,
  
  errorOccurred: (errorMessage?: string) =>
    errorMessage 
      ? `Đã xảy ra lỗi: ${errorMessage}`
      : 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại',
  
  autoSaved: () =>
    'Tiến độ đã được tự động lưu',
  
  dataRestored: () =>
    'Đã khôi phục tiến độ làm bài trước đó'
}
