import {
    MultiPartQuiz,
    MultiPartQuizState,
    PartNavigationItem,
    PartProgress,
    Question,
    QuizPart
} from '@/types/multi-part-quiz'

/**
 * Get the current part based on a question ID
 */
export const getCurrentPartByQuestionId = (quiz: MultiPartQuiz, questionId: string): QuizPart | null => {
  for (const part of quiz.parts) {
    if (part.questions.some(q => q.id === questionId)) {
      return part
    }
  }
  return null
}

/**
 * Get part by part number
 */
export const getPartByNumber = (quiz: MultiPartQuiz, partNumber: number): QuizPart | null => {
  return quiz.parts.find(part => part.partNumber === partNumber) || null
}

/**
 * Get all questions for a specific part
 */
export const getQuestionsByPart = (quiz: MultiPartQuiz, partNumber: number): Question[] => {
  const part = getPartByNumber(quiz, partNumber)
  return part ? part.questions : []
}

/**
 * Get total answered questions in a specific part
 */
export const getTotalAnsweredInPart = (
  answers: Record<string, string>, 
  part: QuizPart
): number => {
  return part.questions.filter(question => {
    const answer = answers[question.id]
    return answer && answer.trim() !== ''
  }).length
}

/**
 * Check if a part is completed (all questions answered)
 */
export const isPartCompleted = (
  answers: Record<string, string>, 
  part: QuizPart
): boolean => {
  return getTotalAnsweredInPart(answers, part) === part.questions.length
}

/**
 * Get progress for a specific part
 */
export const getPartProgress = (
  answers: Record<string, string>, 
  part: QuizPart
): PartProgress => {
  const answeredQuestions = new Set(
    part.questions
      .filter(q => answers[q.id] && answers[q.id].trim() !== '')
      .map(q => q.id)
  )

  return {
    answeredQuestions,
    totalQuestions: part.questions.length,
    isCompleted: answeredQuestions.size === part.questions.length,
    timeSpent: 0 // This would be tracked separately
  }
}

/**
 * Get navigation items for all parts
 */
export const getPartNavigationItems = (
  quiz: MultiPartQuiz, 
  answers: Record<string, string>,
  currentPart: number
): PartNavigationItem[] => {
  return quiz.parts.map(part => {
    const progress = getPartProgress(answers, part)
    return {
      partNumber: part.partNumber,
      title: part.title,
      questionRange: part.questionRange,
      isCompleted: progress.isCompleted,
      isActive: part.partNumber === currentPart,
      answeredCount: progress.answeredQuestions.size,
      totalCount: progress.totalQuestions
    }
  })
}

/**
 * Get all answered questions across all parts
 */
export const getAllAnsweredQuestions = (
  quiz: MultiPartQuiz, 
  answers: Record<string, string>
): Set<string> => {
  const answeredQuestions = new Set<string>()
  
  quiz.parts.forEach(part => {
    part.questions.forEach(question => {
      if (answers[question.id] && answers[question.id].trim() !== '') {
        answeredQuestions.add(question.id)
      }
    })
  })
  
  return answeredQuestions
}

/**
 * Get total progress across all parts
 */
export const getTotalProgress = (
  quiz: MultiPartQuiz, 
  answers: Record<string, string>
): { answeredCount: number; totalCount: number; percentage: number } => {
  const answeredQuestions = getAllAnsweredQuestions(quiz, answers)
  const totalQuestions = quiz.metadata.totalQuestions
  
  return {
    answeredCount: answeredQuestions.size,
    totalCount: totalQuestions,
    percentage: Math.round((answeredQuestions.size / totalQuestions) * 100)
  }
}

/**
 * Initialize multi-part quiz state
 */
export const initializeMultiPartQuizState = (quiz: MultiPartQuiz): MultiPartQuizState => {
  const partProgress: Record<number, PartProgress> = {}
  const timeRemaining: Record<number, number> = {}
  
  quiz.parts.forEach(part => {
    partProgress[part.partNumber] = {
      answeredQuestions: new Set(),
      totalQuestions: part.questions.length,
      isCompleted: false,
      timeSpent: 0
    }
    timeRemaining[part.partNumber] = part.timeLimit * 60 // Convert to seconds
  })
  
  return {
    currentPart: 1,
    answers: {},
    partProgress,
    timeRemaining,
    overallTimeRemaining: quiz.totalTimeLimit * 60, // Convert to seconds
    isSubmitted: false
  }
}

/**
 * Get question number within current part
 */
export const getPartLocalQuestionNumber = (
  quiz: MultiPartQuiz, 
  questionId: string
): number | null => {
  for (const part of quiz.parts) {
    const question = part.questions.find(q => q.id === questionId)
    if (question) {
      return question.partQuestionNumber
    }
  }
  return null
}

/**
 * Get global question number
 */
export const getGlobalQuestionNumber = (
  quiz: MultiPartQuiz, 
  questionId: string
): number | null => {
  for (const part of quiz.parts) {
    const question = part.questions.find(q => q.id === questionId)
    if (question) {
      return question.questionNumber
    }
  }
  return null
}

/**
 * Validate quiz structure
 */
export const validateQuizStructure = (quiz: MultiPartQuiz): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Check if parts exist
  if (!quiz.parts || quiz.parts.length === 0) {
    errors.push("Quiz must have at least one part")
  }
  
  // Check question numbering consistency
  let expectedGlobalNumber = 1
  quiz.parts.forEach((part, partIndex) => {
    if (part.questionRange.start !== expectedGlobalNumber) {
      errors.push(`Part ${partIndex + 1} question range start should be ${expectedGlobalNumber}`)
    }
    
    part.questions.forEach((question, qIndex) => {
      if (question.questionNumber !== expectedGlobalNumber) {
        errors.push(`Question ${question.id} should have global number ${expectedGlobalNumber}`)
      }
      if (question.partQuestionNumber !== qIndex + 1) {
        errors.push(`Question ${question.id} should have part-local number ${qIndex + 1}`)
      }
      expectedGlobalNumber++
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}