// Multi-Part Quiz Type Definitions for IELTS System
// Based on IELTS Reading and Listening test structure

export interface QuizPart {
  partNumber: number
  title: string
  timeLimit: number // in minutes
  content: {
    title: string
    subtitle?: string
    paragraphs?: Paragraph[]
    // For listening parts
    audioUrl?: string
    transcript?: string
  }
  questions: Question[]
  questionRange?: { 
    start: number // e.g., 1, 14, 27
    end: number   // e.g., 13, 26, 40
  }
  // Shared drag options for DRAG_AND_DROP questions in this part
  sharedDragOptions?: DragOption[]
}

export interface Paragraph {
  label: string // A, B, C, D, E, F
  text: string
}

export interface Question {
  id: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE_NOTGIVEN' | 'SENTENCE_COMPLETION' | 'PARAGRAPH_MATCHING_TABLE' | 'DRAG_AND_DROP' | 'TABLE_COMPLETION' | 'NOTE_COMPLETION' | 'MULTIPLE_SELECT' | 'MATCHING_TABLE'
  prompt?: string
  text?: string
  points: number
  instruction?: string
  wordLimit?: {
    maxWords: number
    maxNumbers: number
    allowNumbers: boolean
    allowHyphens: boolean
  }
  // Question type specific properties
  options?: QuestionOption[]
  correctAnswer?: string
  answerFormat?: 'text' | 'number'
  paragraphLabels?: string[]
  
  // Listening specific properties
  tableData?: {
    headers: string[]
    rows: any[]
    options?: Record<string, string>
  }
  notes?: string[]
  answers?: Record<string, string>
  maxSelections?: number
  correctAnswers?: string[]
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface DragOption {
  id: string
  label: string // A, B, C, D, etc.
  text: string
  isCorrect?: boolean
}

export interface MultiPartQuiz {
  testId: string
  title: string
  totalTimeLimit: number // Total time for entire test (e.g., 60 minutes for Reading)
  testType: 'reading' | 'listening'
  parts: QuizPart[]
  metadata: {
    totalQuestions: number // 40 for full IELTS test
    partsCount: number // 3 for Reading, 4 for Listening
    difficulty: 'easy' | 'medium' | 'hard'
    academic: boolean
    publishedDate: string
    questionTypes: string[]
    skillAssessed: string[]
  }
}

// State management interfaces
export interface PartProgress {
  answeredQuestions: Set<string>
  totalQuestions: number
  isCompleted: boolean
  timeSpent: number // in seconds
}

export interface MultiPartQuizState {
  currentPart: number
  answers: Record<string, string> // questionId -> answer
  partProgress: Record<number, PartProgress> // partNumber -> progress
  timeRemaining: Record<number, number> // partNumber -> seconds remaining
  overallTimeRemaining: number // seconds remaining for entire test
  isSubmitted: boolean
}

// Navigation and UI interfaces
export interface PartNavigationItem {
  partNumber: number
  title: string
  questionRange?: { start: number; end: number }
  isCompleted: boolean
  isActive: boolean
  answeredCount: number
  totalCount: number
}