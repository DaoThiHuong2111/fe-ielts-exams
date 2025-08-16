/**
 * Quiz Storage Utilities
 * 
 * Manages custom quiz data in localStorage
 */

import type { 
  QuizData, 
  PassageWithQuestions, 
  QuizStorageData, 
  Question,
  MultipleChoiceQuestion,
  FillInBlanksQuestion,
  MultipleChoiceData,
  FillInBlanksData 
} from '@/types/quiz'

const STORAGE_KEY = 'custom-quiz-data'
const STORAGE_VERSION = '2.0.0' // Version for tracking storage format changes

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

// === NEW PASSAGE-BASED STORAGE FUNCTIONS ===

/**
 * Save passages with questions to localStorage
 */
export function savePassageData(passages: PassageWithQuestions[]): void {
  try {
    const data: QuizStorageData = {
      passages,
      version: STORAGE_VERSION
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    console.error('Failed to save passage data:', error)
  }
}

/**
 * Load passages with questions from localStorage
 */
export function loadPassageData(): PassageWithQuestions[] {
  try {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const data = JSON.parse(stored)
    
    // Check if it's the new format
    if (data.version === STORAGE_VERSION && data.passages) {
      return data.passages
    }
    
    // Convert legacy format to new format
    if (data.quizzes) {
      return convertLegacyToPassages(data.quizzes)
    }
    
    return []
  } catch (error) {
    console.error('Failed to load passage data:', error)
    return []
  }
}

/**
 * Convert legacy quiz data to passage-based structure
 */
export function convertLegacyToPassages(legacyQuizzes: QuizData[]): PassageWithQuestions[] {
  const passageMap = new Map<string, PassageWithQuestions>()
  
  legacyQuizzes.forEach(quiz => {
    const passageContent = typeof quiz.passage === 'string' 
      ? quiz.passage 
      : quiz.passage?.content || ''
    
    const passageTitle = typeof quiz.passage === 'object' 
      ? quiz.passage.title 
      : quiz.passageTitle
    
    // Create a unique key for grouping by passage
    const passageKey = passageContent || `no-passage-${quiz.id}`
    
    if (!passageMap.has(passageKey)) {
      // Create new passage
      const passageId = `passage-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      passageMap.set(passageKey, {
        id: passageId,
        title: passageTitle,
        content: passageContent,
        category: quiz.category,
        tags: quiz.tags,
        estimatedTime: quiz.estimatedTime,
        questions: []
      })
    }
    
    const passage = passageMap.get(passageKey)!
    
    // Convert quiz to question
    if (quiz.type === 'multiple-choice') {
      passage.questions.push({
        id: quiz.id,
        type: 'multiple-choice',
        title: quiz.title,
        instruction: quiz.instruction,
        options: quiz.options,
        maxSelections: quiz.maxSelections,
        correctAnswers: quiz.correctAnswers,
        passageId: passage.id,
        orderIndex: passage.questions.length
      })
    } else if (quiz.type === 'fill-in-blanks') {
      passage.questions.push({
        id: quiz.id,
        type: 'fill-in-blanks',
        title: quiz.title,
        instruction: quiz.instruction,
        text: quiz.text,
        blanks: quiz.blanks,
        passageId: passage.id,
        orderIndex: passage.questions.length
      })
    }
  })
  
  return Array.from(passageMap.values())
}

/**
 * Add a new passage with questions to storage
 */
export function addPassageToStorage(passage: PassageWithQuestions): void {
  const existing = loadPassageData()
  const updated = [...existing, passage]
  savePassageData(updated)
}

/**
 * Add a question to an existing passage
 */
export function addQuestionToPassage(passageId: string, question: Question): void {
  const passages = loadPassageData()
  const updatedPassages = passages.map(p => {
    if (p.id === passageId) {
      return {
        ...p,
        questions: [...p.questions, { ...question, passageId, orderIndex: p.questions.length }]
      }
    }
    return p
  })
  savePassageData(updatedPassages)
}

/**
 * Get all questions as flat array (for backwards compatibility)
 */
export function getAllQuestionsFlat(): QuizData[] {
  const passages = loadPassageData()
  const allQuestions: QuizData[] = []
  
  passages.forEach(passage => {
    passage.questions.forEach(question => {
      if (question.type === 'multiple-choice') {
        const mcQuestion = question as MultipleChoiceQuestion
        allQuestions.push({
          id: mcQuestion.id,
          type: 'multiple-choice',
          title: mcQuestion.title || '',
          instruction: mcQuestion.instruction || '',
          passage: passage.content ? { 
            title: passage.title || '', 
            content: passage.content 
          } : undefined,
          passageTitle: passage.title || '',
          options: mcQuestion.options || [],
          maxSelections: mcQuestion.maxSelections ?? 1,
          correctAnswers: mcQuestion.correctAnswers || [],
          category: passage.category,
          tags: passage.tags,
          estimatedTime: passage.estimatedTime
        } as MultipleChoiceData)
      } else if (question.type === 'fill-in-blanks') {
        const fibQuestion = question as FillInBlanksQuestion
        allQuestions.push({
          id: fibQuestion.id,
          type: 'fill-in-blanks',
          title: fibQuestion.title || '',
          instruction: fibQuestion.instruction || '',
          passage: passage.content ? { 
            title: passage.title || '', 
            content: passage.content 
          } : undefined,
          passageTitle: passage.title || '',
          text: fibQuestion.text || '',
          blanks: fibQuestion.blanks || [],
          category: passage.category,
          tags: passage.tags,
          estimatedTime: passage.estimatedTime
        } as FillInBlanksData)
      }
    })
  })
  
  return allQuestions
}
