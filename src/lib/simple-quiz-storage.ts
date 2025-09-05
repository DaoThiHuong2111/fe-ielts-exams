import { MultiPartQuiz } from '@/types/multi-part-quiz'
import readingQuizData from '@/app/(web)/data/reading-quiz.json'

/**
 * Simple localStorage operations for quiz management
 * Pattern: quiz_id = localStorage key, quiz_json = localStorage value
 */

// Generate random quiz ID
export const generateQuizId = (): string => {
  return Date.now().toString()
}

// Save quiz by ID (ADMIN ONLY)
export const saveQuizById = (id: string, quiz: MultiPartQuiz): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(id, JSON.stringify(quiz))
  } catch (error) {
    console.error('Failed to save quiz:', error)
  }
}

// Get quiz by ID (READ ONLY)
export const getQuizById = (id: string): MultiPartQuiz | null => {
  if (typeof window === 'undefined') return null
  
  try {
    // First check localStorage for dynamic quizzes
    const data = localStorage.getItem(id)
    if (data) {
      return JSON.parse(data)
    }
    
    // If not found in localStorage, check for static quiz data
    if (id === 'reading-quiz' || id === 'reading-quiz-sample') {
      return readingQuizData as MultiPartQuiz
    }
    
    return null
  } catch (error) {
    console.error('Failed to load quiz:', error)
    return null
  }
}

// Delete quiz by ID (ADMIN ONLY)
export const deleteQuizById = (id: string): void => {
  if (typeof window === 'undefined') return
  try {
    console.log('🗑️ Attempting to delete quiz ID:', id)
    
    // Check if quiz exists before deletion
    const existsBefore = localStorage.getItem(id) !== null
    console.log('📦 Quiz exists before deletion:', existsBefore)
    
    // Remove from localStorage
    localStorage.removeItem(id)
    
    // Verify deletion
    const existsAfter = localStorage.getItem(id) !== null
    console.log('📦 Quiz exists after deletion:', existsAfter)
    
    if (existsBefore && !existsAfter) {
      console.log('✅ Quiz successfully deleted from localStorage')
    } else if (!existsBefore) {
      console.log('⚠️ Quiz was already not in localStorage')
    } else {
      console.log('❌ Failed to delete quiz from localStorage')
    }
  } catch (error) {
    console.error('Failed to delete quiz:', error)
  }
}

// Get all quiz IDs (ADMIN ONLY - for management page)
export const getAllQuizIds = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const allKeys = Object.keys(localStorage)
    // Filter only quiz keys (numeric IDs)
    return allKeys.filter(key => /^\d+$/.test(key))
  } catch (error) {
    console.error('Failed to get quiz IDs:', error)
    return []
  }
}

// Get all quizzes (ADMIN ONLY - for management page)
export const getAllQuizzes = (): MultiPartQuiz[] => {
  const quizIds = getAllQuizIds()
  const quizzes: MultiPartQuiz[] = []
  
  quizIds.forEach(id => {
    const quiz = getQuizById(id)
    if (quiz) {
      quizzes.push({ ...quiz, id })
    }
  })
  
  return quizzes
}

// Create new quiz template (ADMIN ONLY)
export const createNewQuiz = (type: 'reading' | 'listening'): MultiPartQuiz => {
  const id = generateQuizId()
  
  const newQuiz: MultiPartQuiz = {
    id,
    title: type === 'reading' ? "Quiz Reading Mới" : "Quiz Listening Mới",
    totalTimeLimit: type === 'reading' ? 60 : 30,
    testType: type,
    parts: [
      {
        partNumber: 1,
        title: "Part 1",
        content: {
          title: type === 'reading' ? 'Reading Passage 1' : 'Listening Section 1',
          subtitle: 'Nội dung của bạn ở đây...',
          ...(type === 'reading' 
            ? {
                paragraphs: [
                  {
                    label: 'A',
                    text: 'Passage text của bạn ở đây...'
                  }
                ]
              }
            : {
                audioUrl: `/audio/${type}-section-1.mp3`
              })
        },
        questions: [
          {
            id: "p1q1",
            type: "MULTIPLE_CHOICE",
            prompt: "Câu hỏi mẫu?",
            options: [
              { id: "a", text: "Lựa chọn A" },
              { id: "b", text: "Lựa chọn B" },
              { id: "c", text: "Lựa chọn C" },
              { id: "d", text: "Lựa chọn D" }
            ]
          }
        ]
      }
    ],
    metadata: {
      totalQuestions: 1
    }
  }

  saveQuizById(id, newQuiz)
  return newQuiz
}