/**
 * Quiz Storage Utilities
 * 
 * Manages custom quiz data in localStorage
 */

import type { QuizData } from '@/types/quiz'

const STORAGE_KEY = 'custom-quiz-data'

export interface StoredQuizData {
  quizzes: QuizData[]
  createdAt: string
  updatedAt: string
}

/**
 * Save quiz data to localStorage
 */
export function saveQuizData(quizzes: QuizData[]): void {
  try {
    const data: StoredQuizData = {
      quizzes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Failed to save quiz data:', error)
  }
}

/**
 * Load quiz data from localStorage
 */
export function loadQuizData(): QuizData[] {
  try {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const data: StoredQuizData = JSON.parse(stored)
    return data.quizzes || []
  } catch (error) {
    console.error('Failed to load quiz data:', error)
    return []
  }
}

/**
 * Add a new quiz to storage
 */
export function addQuizToStorage(quiz: QuizData): void {
  const existing = loadQuizData()
  const updated = [...existing, quiz]
  saveQuizData(updated)
}

/**
 * Clear all quiz data from storage
 */
export function clearQuizData(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error('Failed to clear quiz data:', error)
  }
}

/**
 * Check if custom quiz data exists
 */
export function hasCustomQuizData(): boolean {
  try {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}
