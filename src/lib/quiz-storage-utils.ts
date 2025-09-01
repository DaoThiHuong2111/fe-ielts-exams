import { MultiPartQuiz } from '@/types/multi-part-quiz'
import readingQuizData from '@/app/(web)/data/reading-quiz.json'
import listeningQuizData from '@/app/(web)/data/listening-quiz.json'

const STORAGE_KEYS = {
  READING_QUIZ: 'reading-quiz-data',
  LISTENING_QUIZ: 'listening-quiz-data'
} as const

/**
 * Initialize localStorage with quiz data if not already present
 */
export const initializeQuizStorage = (): void => {
  if (typeof window === 'undefined') return

  // Initialize reading quiz data
  if (!localStorage.getItem(STORAGE_KEYS.READING_QUIZ)) {
    localStorage.setItem(STORAGE_KEYS.READING_QUIZ, JSON.stringify(readingQuizData))
  }

  // Initialize listening quiz data  
  if (!localStorage.getItem(STORAGE_KEYS.LISTENING_QUIZ)) {
    localStorage.setItem(STORAGE_KEYS.LISTENING_QUIZ, JSON.stringify(listeningQuizData))
  }
}

/**
 * Get reading quiz data from localStorage
 */
export const getReadingQuizFromStorage = (): MultiPartQuiz | null => {
  if (typeof window === 'undefined') return null

  try {
    const data = localStorage.getItem(STORAGE_KEYS.READING_QUIZ)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error parsing reading quiz data from localStorage:', error)
    return null
  }
}

/**
 * Get listening quiz data from localStorage
 */
export const getListeningQuizFromStorage = (): MultiPartQuiz | null => {
  if (typeof window === 'undefined') return null

  try {
    const data = localStorage.getItem(STORAGE_KEYS.LISTENING_QUIZ)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error parsing listening quiz data from localStorage:', error)
    return null
  }
}

/**
 * Update reading quiz data in localStorage
 */
export const updateReadingQuizInStorage = (quizData: MultiPartQuiz): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.READING_QUIZ, JSON.stringify(quizData))
  } catch (error) {
    console.error('Error saving reading quiz data to localStorage:', error)
  }
}

/**
 * Update listening quiz data in localStorage
 */
export const updateListeningQuizInStorage = (quizData: MultiPartQuiz): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.LISTENING_QUIZ, JSON.stringify(quizData))
  } catch (error) {
    console.error('Error saving listening quiz data to localStorage:', error)
  }
}

/**
 * Clear all quiz data from localStorage
 */
export const clearQuizStorage = (): void => {
  if (typeof window === 'undefined') return

  localStorage.removeItem(STORAGE_KEYS.READING_QUIZ)
  localStorage.removeItem(STORAGE_KEYS.LISTENING_QUIZ)
}

/**
 * Reset quiz data to original state
 */
export const resetQuizStorage = (): void => {
  if (typeof window === 'undefined') return

  localStorage.setItem(STORAGE_KEYS.READING_QUIZ, JSON.stringify(readingQuizData))
  localStorage.setItem(STORAGE_KEYS.LISTENING_QUIZ, JSON.stringify(listeningQuizData))
}