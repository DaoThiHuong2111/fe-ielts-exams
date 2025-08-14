'use client'

import { useEffect, useCallback, useRef } from 'react'

export interface QuizKeyboardOptions {
  onSelectOption?: (optionId: string) => void
  onNextQuestion?: () => void
  onPreviousQuestion?: () => void
  onSubmit?: () => void
  onToggleResults?: () => void
  onToggleTimer?: () => void
  options?: string[] // Available option IDs (A, B, C, D, etc.)
  disabled?: boolean
  enableNumberKeys?: boolean // Allow 1-9 to select options
  enableArrowKeys?: boolean // Allow arrow keys for navigation
  enableSpaceSubmit?: boolean // Allow space to submit
}

export interface UseQuizKeyboardReturn {
  focusedOptionIndex: number
  setFocusedOptionIndex: (index: number) => void
}

export function useQuizKeyboard({
  onSelectOption,
  onNextQuestion,
  onPreviousQuestion,
  onSubmit,
  onToggleResults,
  onToggleTimer,
  options = [],
  disabled = false,
  enableNumberKeys = true,
  enableArrowKeys = true,
  enableSpaceSubmit = true
}: QuizKeyboardOptions): UseQuizKeyboardReturn {
  const focusedOptionIndexRef = useRef(0)
  const setFocusedOptionIndex = useCallback((index: number) => {
    focusedOptionIndexRef.current = Math.max(0, Math.min(index, options.length - 1))
  }, [options.length])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return

    // Prevent default for handled keys
    const handledKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'Enter', 'Space', 'Escape',
      '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'
    ]

    if (handledKeys.includes(event.key)) {
      // Don't prevent default if user is typing in an input
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return
      }
      event.preventDefault()
    }

    switch (event.key) {
      // Arrow key navigation
      case 'ArrowUp':
        if (enableArrowKeys && options.length > 0) {
          const newIndex = focusedOptionIndexRef.current > 0 
            ? focusedOptionIndexRef.current - 1 
            : options.length - 1
          setFocusedOptionIndex(newIndex)
        }
        break

      case 'ArrowDown':
        if (enableArrowKeys && options.length > 0) {
          const newIndex = focusedOptionIndexRef.current < options.length - 1 
            ? focusedOptionIndexRef.current + 1 
            : 0
          setFocusedOptionIndex(newIndex)
        }
        break

      case 'ArrowLeft':
        if (enableArrowKeys) {
          onPreviousQuestion?.()
        }
        break

      case 'ArrowRight':
        if (enableArrowKeys) {
          onNextQuestion?.()
        }
        break

      // Selection keys
      case 'Enter':
        if (options.length > 0) {
          const focusedOption = options[focusedOptionIndexRef.current]
          if (focusedOption) {
            onSelectOption?.(focusedOption)
          }
        }
        break

      case ' ': // Space
        if (enableSpaceSubmit) {
          onSubmit?.()
        }
        break

      // Number keys (1-9)
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9':
        if (enableNumberKeys) {
          const optionIndex = parseInt(event.key) - 1
          if (optionIndex < options.length) {
            onSelectOption?.(options[optionIndex])
            setFocusedOptionIndex(optionIndex)
          }
        }
        break

      // Letter keys (A-I)
      case 'a': case 'A':
      case 'b': case 'B':
      case 'c': case 'C':
      case 'd': case 'D':
      case 'e': case 'E':
      case 'f': case 'F':
      case 'g': case 'G':
      case 'h': case 'H':
      case 'i': case 'I':
        const letter = event.key.toUpperCase()
        if (options.includes(letter)) {
          onSelectOption?.(letter)
          setFocusedOptionIndex(options.indexOf(letter))
        }
        break

      // Function keys
      case 'Escape':
        onToggleResults?.()
        break

      case 'F1':
        event.preventDefault()
        onToggleTimer?.()
        break

      // Ctrl/Cmd combinations
      default:
        if (event.ctrlKey || event.metaKey) {
          switch (event.key) {
            case 'Enter':
              onSubmit?.()
              break
            case 'ArrowLeft':
              onPreviousQuestion?.()
              break
            case 'ArrowRight':
              onNextQuestion?.()
              break
          }
        }
        break
    }
  }, [
    disabled,
    options,
    enableNumberKeys,
    enableArrowKeys,
    enableSpaceSubmit,
    onSelectOption,
    onNextQuestion,
    onPreviousQuestion,
    onSubmit,
    onToggleResults,
    onToggleTimer,
    setFocusedOptionIndex
  ])

  // Add event listener
  useEffect(() => {
    if (disabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, disabled])

  // Announce keyboard shortcuts to screen readers
  useEffect(() => {
    if (disabled) return

    const announceShortcuts = () => {
      const shortcuts = [
        'Phím tắt: Số 1-9 hoặc A-I để chọn đáp án',
        'Enter để chọn đáp án đang focus',
        'Mũi tên lên/xuống để di chuyển giữa các đáp án',
        'Mũi tên trái/phải để chuyển câu hỏi',
        'Space để nộp bài',
        'Escape để xem kết quả'
      ].join('. ')

      // Create announcement for screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = shortcuts
      
      document.body.appendChild(announcement)
      
      // Remove after announcement
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 100)
    }

    // Announce shortcuts after a short delay
    const timeoutId = setTimeout(announceShortcuts, 1000)
    return () => clearTimeout(timeoutId)
  }, [disabled])

  return {
    focusedOptionIndex: focusedOptionIndexRef.current,
    setFocusedOptionIndex
  }
}
