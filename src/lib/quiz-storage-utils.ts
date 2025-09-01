import { MultiPartQuiz } from '@/types/multi-part-quiz'
import quizStorageService from '@/services/quiz-storage'

/**
 * Initialize localStorage with quiz data if not already present
 */
export const initializeQuizStorage = (): void => {
  if (typeof window === 'undefined') return
  
  // Service will auto-initialize and migrate legacy data
  quizStorageService.getAllQuizzes()
}

/**
 * Get reading quiz data from localStorage
 */
export const getReadingQuizFromStorage = (): MultiPartQuiz | null => {
  if (typeof window === 'undefined') return null
  
  return quizStorageService.getQuizById('reading-1')
}

/**
 * Get listening quiz data from localStorage
 */
export const getListeningQuizFromStorage = (): MultiPartQuiz | null => {
  if (typeof window === 'undefined') return null
  
  return quizStorageService.getQuizById('listening-1')
}

/**
 * Update reading quiz data in localStorage
 */
export const updateReadingQuizInStorage = (quizData: MultiPartQuiz): void => {
  if (typeof window === 'undefined') return
  
  quizStorageService.saveQuiz({ ...quizData, id: 'reading-1' })
}

/**
 * Update listening quiz data in localStorage
 */
export const updateListeningQuizInStorage = (quizData: MultiPartQuiz): void => {
  if (typeof window === 'undefined') return
  
  quizStorageService.saveQuiz({ ...quizData, id: 'listening-1' })
}

/**
 * Clear all quiz data from localStorage
 */
export const clearQuizStorage = (): void => {
  if (typeof window === 'undefined') return
  
  // Clear main storage
  const readingQuiz = quizStorageService.getQuizById('reading-1')
  const listeningQuiz = quizStorageService.getQuizById('listening-1')
  
  if (readingQuiz) quizStorageService.deleteQuiz('reading-1')
  if (listeningQuiz) quizStorageService.deleteQuiz('listening-1')
}

/**
 * Reset quiz data to original state
 */
export const resetQuizStorage = (): void => {
  if (typeof window === 'undefined') return
  
  // Clear existing and let admin page reinitialize defaults
  clearQuizStorage()
  
  // Force re-initialization
  initializeQuizStorage()
}