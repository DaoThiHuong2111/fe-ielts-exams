import type { QuizData, BlankPosition, FillInBlanksData } from '@/types/quiz'

/**
 * Utility functions for quiz management
 */

// === FILL IN THE BLANKS HELPERS ===

/**
 * Create blank positions from text with markers
 * Example: "The [quick] brown [fox] jumps" -> creates blanks for "quick" and "fox"
 */
export function createBlanksFromMarkers(
  text: string,
  markerStart: string = '[',
  markerEnd: string = ']'
): { processedText: string; blanks: BlankPosition[] } {
  const blanks: BlankPosition[] = []
  let processedText = text
  let blankCounter = 1
  let offset = 0

  const regex = new RegExp(`\\${markerStart}([^\\${markerEnd}]+)\\${markerEnd}`, 'g')
  let match

  while ((match = regex.exec(text)) !== null) {
    const originalWord = match[1]
    const startIndex = match.index - offset
    const endIndex = startIndex
    
    const blankId = `blank-${blankCounter}`
    
    blanks.push({
      id: blankId,
      startIndex,
      endIndex,
      correctAnswer: originalWord,
      placeholder: `${blankCounter}`,
      maxLength: Math.max(originalWord.length + 5, 20)
    })
    
    // Remove the markers from the text
    processedText = processedText.replace(match[0], '')
    offset += match[0].length
    blankCounter++
  }

  return { processedText, blanks }
}

/**
 * Create blank positions manually with specific indices
 */
export function createBlanksFromIndices(
  text: string,
  blankDefinitions: Array<{
    startIndex: number
    endIndex: number
    correctAnswer?: string
    placeholder?: string
    maxLength?: number
  }>
): BlankPosition[] {
  return blankDefinitions.map((def, index) => ({
    id: `blank-${index + 1}`,
    startIndex: def.startIndex,
    endIndex: def.endIndex,
    correctAnswer: def.correctAnswer || text.slice(def.startIndex, def.endIndex),
    placeholder: def.placeholder || `${index + 1}`,
    maxLength: def.maxLength || 50
  }))
}

/**
 * Validate fill-in-blanks quiz data
 */
export function validateFillInBlanksQuiz(quiz: FillInBlanksData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!quiz.text || quiz.text.trim().length === 0) {
    errors.push('Text is required')
  }

  if (!quiz.blanks || quiz.blanks.length === 0) {
    errors.push('At least one blank is required')
  }

  // Check for overlapping blanks
  const sortedBlanks = [...quiz.blanks].sort((a, b) => a.startIndex - b.startIndex)
  for (let i = 0; i < sortedBlanks.length - 1; i++) {
    const current = sortedBlanks[i]
    const next = sortedBlanks[i + 1]
    
    if (current.endIndex > next.startIndex) {
      errors.push(`Blanks ${current.id} and ${next.id} overlap`)
    }
  }

  // Check if blank positions are within text bounds
  quiz.blanks.forEach(blank => {
    if (blank.startIndex < 0 || blank.endIndex > quiz.text.length) {
      errors.push(`Blank ${blank.id} position is out of text bounds`)
    }
    
    if (blank.startIndex >= blank.endIndex) {
      errors.push(`Blank ${blank.id} has invalid position (start >= end)`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Calculate fill-in-blanks quiz score
 */
export function calculateFillInBlanksScore(
  quiz: FillInBlanksData,
  answers: Record<string, string>
): {
  totalBlanks: number
  filledBlanks: number
  correctBlanks: number
  accuracy: number
  score: number
  maxScore: number
} {
  const totalBlanks = quiz.blanks.length
  const filledBlanks = Object.values(answers).filter(answer => answer.trim()).length
  
  const correctBlanks = quiz.blanks.filter(blank => {
    const userAnswer = answers[blank.id]?.trim().toLowerCase()
    const correctAnswer = blank.correctAnswer?.trim().toLowerCase()
    return userAnswer === correctAnswer
  }).length

  const accuracy = totalBlanks > 0 ? (correctBlanks / totalBlanks) * 100 : 0
  const score = correctBlanks
  const maxScore = totalBlanks

  return {
    totalBlanks,
    filledBlanks,
    correctBlanks,
    accuracy,
    score,
    maxScore
  }
}

// === GENERAL QUIZ HELPERS ===

/**
 * Type guard to check if quiz is multiple choice
 */
export function isMultipleChoiceQuiz(quiz: QuizData): quiz is Extract<QuizData, { type: 'multiple-choice' }> {
  return quiz.type === 'multiple-choice'
}

/**
 * Type guard to check if quiz is fill-in-blanks
 */
export function isFillInBlanksQuiz(quiz: QuizData): quiz is Extract<QuizData, { type: 'fill-in-blanks' }> {
  return quiz.type === 'fill-in-blanks'
}

/**
 * Get quiz type display name
 */
export function getQuizTypeDisplayName(type: QuizData['type']): string {
  switch (type) {
    case 'multiple-choice':
      return 'Trắc nghiệm'
    case 'fill-in-blanks':
      return 'Điền vào chỗ trống'
    default:
      return 'Không xác định'
  }
}
