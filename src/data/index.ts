/**
 * Quiz Data Loader System
 * 
 * Provides dynamic loading and validation of quiz data from JSON files
 */

import type { QuizData } from '@/types/quiz'

// === TYPES ===

export interface QuizSet {
  id: string
  title: string
  questions: QuizData[]
}



// === AVAILABLE QUIZ SETS ===

export const AVAILABLE_QUIZ_SETS = {
  'ielts-reading-set-1': {
    id: 'ielts-reading-set-1',
    title: 'IELTS Reading Practice Set 1'
  },
  'grammar-basics': {
    id: 'grammar-basics',
    title: 'English Grammar Basics'
  },
  'vocabulary-practice': {
    id: 'vocabulary-practice',
    title: 'Vocabulary Practice'
  }
} as const

export type QuizSetId = keyof typeof AVAILABLE_QUIZ_SETS

// === DATA LOADING ===

/**
 * Load quiz set by ID
 */
export async function loadQuizSet(id: QuizSetId): Promise<QuizSet> {
  try {
    let quizData: QuizSet
    
    switch (id) {
      case 'ielts-reading-set-1':
        quizData = await import('./quiz-sets/ielts-reading-set-1.json').then(m => m.default)
        break
      case 'grammar-basics':
        quizData = await import('./quiz-sets/grammar-basics.json').then(m => m.default)
        break
      case 'vocabulary-practice':
        quizData = await import('./quiz-sets/vocabulary-practice.json').then(m => m.default)
        break
      default:
        throw new Error(`Unknown quiz set ID: ${id}`)
    }



    // Sort questions by order
    quizData.questions.sort((a, b) => a.order - b.order)

    return quizData
  } catch (error) {
    console.error(`Failed to load quiz set "${id}":`, error)
    throw new Error(`Failed to load quiz set: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Load all available quiz sets
 */
export async function loadAllQuizSets(): Promise<Record<QuizSetId, QuizSet>> {
  const results: Record<string, QuizSet> = {}
  
  for (const id of Object.keys(AVAILABLE_QUIZ_SETS) as QuizSetId[]) {
    try {
      results[id] = await loadQuizSet(id)
    } catch (error) {
      console.error(`Failed to load quiz set "${id}":`, error)
    }
  }
  
  return results as Record<QuizSetId, QuizSet>
}



// === UTILITIES ===

/**
 * Get quiz set info without loading full data
 */
export function getQuizSetInfo(id: QuizSetId) {
  return AVAILABLE_QUIZ_SETS[id]
}

/**
 * List all available quiz sets
 */
export function listAvailableQuizSets() {
  return Object.values(AVAILABLE_QUIZ_SETS)
}
