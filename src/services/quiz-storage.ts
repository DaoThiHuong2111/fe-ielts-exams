import { MultiPartQuiz } from '@/types/multi-part-quiz'

/**
 * @deprecated This interface and implementation use localStorage and will be removed
 * TODO-REMOVE: Replace with quiz-api.service.ts for all quiz operations
 */
export interface QuizStorage {
  getAllQuizzes(): MultiPartQuiz[]
  getQuizById(id: string): MultiPartQuiz | null
  saveQuiz(quiz: MultiPartQuiz): void
  deleteQuiz(id: string): void
  createNewQuiz(type: 'reading' | 'listening'): MultiPartQuiz
}

class LocalStorageQuizService implements QuizStorage {
  private readonly STORAGE_KEY = 'ielts-quizzes'
  
  // Legacy keys for compatibility
  private readonly LEGACY_KEYS = {
    READING_QUIZ: 'reading-quiz-data',
    LISTENING_QUIZ: 'listening-quiz-data'
  }

  constructor() {
    // Initialize with default quizzes if localStorage is empty
    this.initializeDefaultQuizzes()
  }

  private initializeDefaultQuizzes(): void {
    // Check if already initialized
    if (typeof window === 'undefined') return // SSR check
    const existing = localStorage.getItem(this.STORAGE_KEY)
    if (existing) {
      return
    }

    // For now, start with empty array - default quizzes will be loaded by components
    this.saveQuizzes([])
  }

  getAllQuizzes(): MultiPartQuiz[] {
    try {
      let data = localStorage.getItem(this.STORAGE_KEY)
      
      // If new storage is empty, try to migrate from legacy keys
      if (!data) {
        const migratedQuizzes = this.migrateLegacyData()
        if (migratedQuizzes.length > 0) {
          this.saveQuizzes(migratedQuizzes)
          return migratedQuizzes
        }
      }
      
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load quizzes from localStorage:', error)
      return []
    }
  }

  private migrateLegacyData(): MultiPartQuiz[] {
    const migratedQuizzes: MultiPartQuiz[] = []
    
    try {
      // Migrate reading quiz
      const readingData = localStorage.getItem(this.LEGACY_KEYS.READING_QUIZ)
      if (readingData) {
        const readingQuiz = JSON.parse(readingData)
        migratedQuizzes.push({ ...readingQuiz, id: 'reading-1' })
      }
      
      // Migrate listening quiz  
      const listeningData = localStorage.getItem(this.LEGACY_KEYS.LISTENING_QUIZ)
      if (listeningData) {
        const listeningQuiz = JSON.parse(listeningData)
        migratedQuizzes.push({ ...listeningQuiz, id: 'listening-1' })
      }
      
      console.log('Migrated legacy quiz data:', migratedQuizzes.length, 'quizzes')
      
      // Clean up legacy keys after successful migration
      if (migratedQuizzes.length > 0) {
        this.cleanupLegacyKeys()
      }
    } catch (error) {
      console.error('Failed to migrate legacy data:', error)
    }
    
    return migratedQuizzes
  }

  private cleanupLegacyKeys(): void {
    try {
      localStorage.removeItem(this.LEGACY_KEYS.READING_QUIZ)
      localStorage.removeItem(this.LEGACY_KEYS.LISTENING_QUIZ)
      console.log('Cleaned up legacy localStorage keys')
    } catch (error) {
      console.error('Failed to cleanup legacy keys:', error)
    }
  }

  getQuizById(id: string): MultiPartQuiz | null {
    const quizzes = this.getAllQuizzes()
    return quizzes.find(quiz => quiz.id === id) || null
  }

  saveQuiz(quiz: MultiPartQuiz): void {
    const quizzes = this.getAllQuizzes()
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id)
    
    if (existingIndex >= 0) {
      // Update existing quiz
      quizzes[existingIndex] = quiz
    } else {
      // Add new quiz
      quizzes.push(quiz)
    }
    
    this.saveQuizzes(quizzes)
    
    // Also sync to legacy keys for compatibility with display components
    this.syncToLegacyKeys(quiz)
  }

  private syncToLegacyKeys(quiz: MultiPartQuiz): void {
    try {
      // Sync reading quiz to legacy key
      if (quiz.id === 'reading-1' || quiz.testType === 'reading') {
        const { id, ...quizData } = quiz
        localStorage.setItem(this.LEGACY_KEYS.READING_QUIZ, JSON.stringify(quizData))
      }
      
      // Sync listening quiz to legacy key
      if (quiz.id === 'listening-1' || quiz.testType === 'listening') {
        const { id, ...quizData } = quiz
        localStorage.setItem(this.LEGACY_KEYS.LISTENING_QUIZ, JSON.stringify(quizData))
      }
    } catch (error) {
      console.error('Failed to sync to legacy keys:', error)
    }
  }

  deleteQuiz(id: string): void {
    const quizzes = this.getAllQuizzes()
    const quizToDelete = quizzes.find(quiz => quiz.id === id)
    const filteredQuizzes = quizzes.filter(quiz => quiz.id !== id)
    
    this.saveQuizzes(filteredQuizzes)
    
    // Also remove from legacy keys if needed
    if (quizToDelete) {
      this.removeFromLegacyKeys(quizToDelete)
    }
  }

  private removeFromLegacyKeys(quiz: MultiPartQuiz): void {
    try {
      // Remove reading quiz from legacy key
      if (quiz.id === 'reading-1' || quiz.testType === 'reading') {
        localStorage.removeItem(this.LEGACY_KEYS.READING_QUIZ)
      }
      
      // Remove listening quiz from legacy key
      if (quiz.id === 'listening-1' || quiz.testType === 'listening') {
        localStorage.removeItem(this.LEGACY_KEYS.LISTENING_QUIZ)
      }
    } catch (error) {
      console.error('Failed to remove from legacy keys:', error)
    }
  }

  createNewQuiz(type: 'reading' | 'listening'): MultiPartQuiz {
    const newId = `${type}-${Date.now()}`
    
    const newQuiz: MultiPartQuiz = {
      id: newId,
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

    // Save new quiz to localStorage
    this.saveQuiz(newQuiz)
    
    return newQuiz
  }

  private saveQuizzes(quizzes: MultiPartQuiz[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(quizzes))
    } catch (error) {
      console.error('Failed to save quizzes to localStorage:', error)
    }
  }

  // Utility methods for import/export
  importQuiz(quizData: Partial<MultiPartQuiz>): MultiPartQuiz | null {
    try {
      // Validate required fields
      if (!quizData.title || !quizData.testType || !quizData.parts) {
        throw new Error('Invalid quiz format')
      }

      const newId = `${quizData.testType}-${Date.now()}`
      const newQuiz: MultiPartQuiz = {
        id: newId,
        title: quizData.title,
        totalTimeLimit: quizData.totalTimeLimit || 60,
        testType: quizData.testType as 'reading' | 'listening',
        parts: quizData.parts,
        metadata: quizData.metadata || { totalQuestions: 0 }
      }

      this.saveQuiz(newQuiz)
      return newQuiz
    } catch (error) {
      console.error('Failed to import quiz:', error)
      return null
    }
  }

  exportQuiz(id: string): Partial<MultiPartQuiz> | null {
    const quiz = this.getQuizById(id)
    if (!quiz) return null

    // Return quiz without ID for clean export
    const { id: _, ...exportData } = quiz
    return exportData
  }

  exportAllQuizzes(): Partial<MultiPartQuiz>[] {
    const quizzes = this.getAllQuizzes()
    return quizzes.map(({ id, ...quiz }) => quiz)
  }
}

// Singleton instance
const quizStorageService = new LocalStorageQuizService()

export default quizStorageService