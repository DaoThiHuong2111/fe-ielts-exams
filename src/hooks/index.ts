/**
 * Quiz Hooks
 * 
 * Custom React hooks for quiz functionality
 */

// Timer hooks
export { useQuizTimer } from './useQuizTimer'
export type { UseQuizTimerOptions, UseQuizTimerReturn } from './useQuizTimer'

// Progress hooks
export { useQuizProgress, useQuizQuestionProgress } from './useQuizProgress'
export type { 
  QuizProgressStats, 
  UseQuizProgressOptions,
  QuizQuestionProgress,
  UseQuizQuestionProgressOptions 
} from './useQuizProgress'

// Auto-save hooks
export { useQuizAutoSave } from './useQuizAutoSave'
export type { 
  QuizSaveData,
  UseQuizAutoSaveOptions,
  UseQuizAutoSaveReturn 
} from './useQuizAutoSave'

// Keyboard navigation hooks
export { useQuizKeyboard } from './useQuizKeyboard'
export type { 
  QuizKeyboardOptions,
  UseQuizKeyboardReturn 
} from './useQuizKeyboard'

// Touch gesture hooks
export { 
  useSwipeGestures, 
  useMouseSwipeGestures, 
  useSwipeGesturesCombined 
} from './useSwipeGestures'
export type { 
  SwipeGestureOptions,
  TouchPoint 
} from './useSwipeGestures'
