/**
 * Core Quiz Type Definitions
 *
 * Centralized type definitions for the quiz system
 */

// === CORE TYPES ===

export interface QuizOption {
  id: string
  label: string // A, B, C, D, etc.
  text: string
}

// === QUIZ TYPES ===
export type QuizType = 'multiple-choice' | 'fill-in-blanks'

// === FILL IN THE BLANKS TYPES ===
export interface BlankPosition {
  id: string // Unique identifier for this blank
  startIndex: number // Start position in the text
  endIndex: number // End position in the text
  placeholder?: string // Placeholder text for the input
  maxLength?: number // Maximum characters allowed
  correctAnswer?: string // Correct answer for validation
}

export interface FillInBlanksData {
  id: string
  type: 'fill-in-blanks'
  title?: string
  instruction?: string
  passage?: string | { title?: string; content: string } // Reading passage text (optional)
  passageTitle?: string // Title for the passage (when passage is string)
  text: string // The main text with blanks
  blanks: BlankPosition[] // Array of blank positions

  estimatedTime?: number // minutes
  tags?: string[]
  category?: 'reading' | 'listening' | 'writing' | 'speaking'
}

// === MULTIPLE CHOICE TYPES ===
export interface MultipleChoiceData {
  id: string
  type: 'multiple-choice'
  title?: string
  instruction?: string
  passage?: string | { title?: string; content: string } // Reading passage text
  passageTitle?: string // Title for the passage (when passage is string)
  options: QuizOption[]
  maxSelections?: number
  correctAnswers?: string[] // For checking answers

  estimatedTime?: number // minutes
  tags?: string[]
  category?: 'reading' | 'listening' | 'writing' | 'speaking'
}

// === UNIFIED QUIZ DATA ===
export type QuizData = MultipleChoiceData | FillInBlanksData

// === ANSWER TYPES ===
export interface MultipleChoiceAnswer {
  questionId: string
  type: 'multiple-choice'
  selectedOptions: string[]
  timeSpent: number // seconds
  isCorrect?: boolean
  timestamp: number
}

export interface FillInBlanksAnswer {
  questionId: string
  type: 'fill-in-blanks'
  answers: Record<string, string> // blankId -> user's answer
  timeSpent: number // seconds
  correctCount?: number
  totalBlanks?: number
  timestamp: number
}

export type QuizAnswer = MultipleChoiceAnswer | FillInBlanksAnswer

export interface QuizSession {
  id: string
  startTime: Date
  endTime?: Date
  answers: QuizAnswer[]
  currentQuestionIndex: number
  status: 'not-started' | 'in-progress' | 'completed' | 'paused' | 'abandoned'
  totalTimeSpent: number // seconds
  score?: number
  maxScore?: number
}

export interface QuizResult {
  sessionId: string
  quizId: string
  score: number
  maxScore: number
  percentage: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number // seconds
  answers: QuizAnswer[]
  completedAt: Date
}

export interface QuizAnalytics {
  averageTimePerQuestion: number
  mostDifficultQuestions: string[]
  accuracyRate: number
  improvementSuggestions: string[]
  strongAreas: string[]
  weakAreas: string[]
}

// Component Props Types
export interface QuizContainerProps {
  quiz: QuizData
  onSubmit?: (answers: { selectedOptions: string[] }) => void
  showResults?: boolean
  className?: string
  onSelectionChange?: (selectedOptions: string[]) => void
  selectedOptions?: string[] // Controlled component - selections from parent
  disabled?: boolean
  autoSave?: boolean
}

export interface QuizQuestionProps {
  title?: string
  instruction?: string
  options: QuizOption[]
  selectedOptions?: string[]
  onOptionToggle?: (optionId: string) => void
  maxSelections?: number
  className?: string
  showResults?: boolean
  correctAnswers?: string[]
  disabled?: boolean
}

export interface AnswerOptionProps {
  id: string
  label: string // A, B, C, D, etc.
  text: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
  showResults?: boolean
  isCorrect?: boolean
  correctAnswers?: string[]
  disabled?: boolean
}

export interface ProgressSidebarProps {
  quizCount: number
  currentQuizIndex: number
  quizSelections: Record<number, string[]>
  onQuizSelect: (index: number) => void
  className?: string
  showProgress?: boolean
  showStats?: boolean
}

export interface ReadingPassageProps {
  title?: string
  passage: string
  className?: string
  highlightedText?: string[]
}

// Context Types
export interface QuizContextType {
  currentQuiz: QuizData
  currentSelections: string[]
  showResults: boolean
  handleSelectionChange: (selectedOptions: string[]) => void
  session?: QuizSession
  analytics?: QuizAnalytics
}

// Hook Return Types
export interface UseQuizStateReturn {
  currentQuiz: QuizData
  currentSelections: string[]
  showResults: boolean
  isLoading: boolean
  error: string | null
  handleSelectionChange: (selectedOptions: string[]) => void
  submitQuiz: () => Promise<void>
  resetQuiz: () => void
}

// Event Types
export type QuizEventType = 
  | 'quiz-started'
  | 'question-answered'
  | 'question-changed'
  | 'quiz-submitted'
  | 'quiz-completed'
  | 'quiz-paused'
  | 'quiz-resumed'
  | 'time-warning'
  | 'time-up'

export interface QuizEvent {
  type: QuizEventType
  timestamp: number
  data?: Record<string, any>
}

// === UTILITY TYPES ===
export type QuizStatus = QuizSession['status']

export type QuizCategory = NonNullable<QuizData['category']>

// === VALIDATION TYPES ===
export interface QuizValidationError {
  field: string
  message: string
  code: string
}

export interface QuizValidationResult {
  isValid: boolean
  errors: QuizValidationError[]
}
