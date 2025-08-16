'use client'

import { ProgressSidebar, QuizData, QuizErrorBoundary } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { QuizProvider, useQuiz } from '@/contexts/quiz-context'
import { loadQuizData } from '@/lib/quiz-storage'
import type { MultipleChoiceData, FillInBlanksData } from '@/types/quiz'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import styles from './quiz-demo.module.css'

interface QuizDemoLayoutProps {
  children: ReactNode
}

function QuizDemoLayoutInner({ children }: QuizDemoLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Detect page type
  const isFillInBlankPage = pathname?.includes('/fill-in-blank')
  const isMultipleChoicePage = pathname?.includes('/multi-choice')

  // Get quiz index from URL params, default to 0
  const urlQuizIndex = parseInt(searchParams.get('quiz') || '0', 10)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(urlQuizIndex)
  const [showResults, setShowResults] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [allQuizResults, setAllQuizResults] = useState<Record<number, { selectedOptions: string[], correctAnswers: string[] }> | null>(null)
  const [quizSelections, setQuizSelections] = useState<Record<number, string[]>>({})
  const [isClient, setIsClient] = useState(false)
  const [quizzes, setQuizzes] = useState<QuizData[]>([])

  // Get quiz context if available
  let quizContext = null
  try {
    if (isFillInBlankPage || isMultipleChoicePage) {
      quizContext = useQuiz()
    }
  } catch {
    // Context not available, use default values
    quizContext = null
  }

  // Convert quiz progress to compatible format for ProgressSidebar
  const getQuizSelections = () => {
    if (!quizContext) return {}
    
    const selections: Record<number, string[]> = {}
    Object.entries(quizContext.quizProgress).forEach(([index, hasAnswers]) => {
      if (hasAnswers) {
        selections[parseInt(index)] = ['answered'] // Mark as answered
      }
    })
    return selections
  }

  // Load quizzes from localStorage on mount
  useEffect(() => {
    const allQuizzes = loadQuizData()
    
    // Filter quizzes based on page type
    let filteredQuizzes: QuizData[] = []
    if (isFillInBlankPage) {
      filteredQuizzes = allQuizzes.filter(
        (quiz): quiz is FillInBlanksData => quiz.type === 'fill-in-blanks'
      )
    } else if (isMultipleChoicePage) {
      filteredQuizzes = allQuizzes.filter(
        (quiz): quiz is MultipleChoiceData => quiz.type === 'multiple-choice'
      )
    }
    
    setQuizzes(filteredQuizzes)
    setIsClient(true)
  }, [isFillInBlankPage, isMultipleChoicePage])

  // Sync URL params with state
  useEffect(() => {
    if (isClient) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [urlQuizIndex, isClient])

  const currentQuiz = quizzes[currentQuizIndex]
  const currentSelections = quizSelections[currentQuizIndex] || []

  // Reset results when quiz changes, but keep selections
  useEffect(() => {
    if (!showResults) {
      setAllQuizResults(null)
    }
  }, [currentQuizIndex, showResults])

  const handleQuizSubmit = () => {
    if (isFillInBlankPage) {
      // Handle fill-in-blanks submission
      setShowResultDialog(true)
    } else {
      // Handle multiple choice submission
      const results: Record<number, { selectedOptions: string[], correctAnswers: string[] }> = {}

      quizzes.forEach((quiz, index) => {
        const selections = quizSelections[index] || []
        // Check if quiz has correctAnswers property (multiple choice)
        const correctAnswers = 'correctAnswers' in quiz ? (quiz.correctAnswers || []) : []
        results[index] = {
          selectedOptions: selections,
          correctAnswers: correctAnswers
        }
      })

      setAllQuizResults(results)
      setShowResultDialog(true)
    }
  }

  const getTotalCorrectAnswers = () => {
    if (isFillInBlankPage || isMultipleChoicePage) {
      // For quiz pages, use context progress
      if (quizContext) {
        const stats = quizContext.getProgressStats()
        return { correct: stats.completedQuizzes, total: stats.totalQuizzes }
      }
      return { correct: 0, total: quizzes.length || 0 } // Default
    }

    // For multiple choice
    if (!allQuizResults) return { correct: 0, total: 0 }

    let totalCorrect = 0
    let totalQuestions = 0

    quizzes.forEach((_, index) => {
      const result = allQuizResults[index]
      if (result) {
        const correctCount = result.selectedOptions.filter(option =>
          result.correctAnswers.includes(option)
        ).length

        if (correctCount === result.correctAnswers.length && result.selectedOptions.length === result.correctAnswers.length) {
          totalCorrect++
        }
        totalQuestions++
      }
    })

    return { correct: totalCorrect, total: totalQuestions }
  }

  const handleViewAnswers = () => {
    setShowResultDialog(false)
    setShowResults(true)
    setCurrentQuizIndex(0)
  }

  const handleRestartAll = () => {
    setShowResultDialog(false)
    setShowResults(false)
    setAllQuizResults(null)
    setQuizSelections({})
    setCurrentQuizIndex(0)

    // Clear quiz progress
    if (quizContext) {
      quizContext.clearAllProgress()
    }

    // For fill-in-blanks, trigger page reload to clear all answers
    // This is the most reliable way to reset all state
    if (isFillInBlankPage) {
      window.location.reload()
    }
  }

  const handleSelectionChange = (selectedOptions: string[]) => {
    setQuizSelections(prev => ({
      ...prev,
      [currentQuizIndex]: selectedOptions
    }))
  }

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      const newIndex = currentQuizIndex + 1
      setCurrentQuizIndex(newIndex)
      // Update URL params
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('quiz', newIndex.toString())
      window.history.pushState({}, '', newUrl.toString())
    }
  }

  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      const newIndex = currentQuizIndex - 1
      setCurrentQuizIndex(newIndex)
      // Update URL params
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('quiz', newIndex.toString())
      window.history.pushState({}, '', newUrl.toString())
    }
  }

  const handleRestart = () => {
    setShowResults(false)
    setAllQuizResults(null)
    setShowResultDialog(false)
    setQuizSelections(prev => ({
      ...prev,
      [currentQuizIndex]: []
    }))

    // For fill-in-blanks, trigger page reload to clear all answers
    // This is the most reliable way to reset all state
    if (isFillInBlankPage) {
      window.location.reload()
    }
  }

  const handleQuizSelect = (index: number) => {
    setCurrentQuizIndex(index)
    // Update URL params to sync with fill-in-blank page
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('quiz', index.toString())
    window.history.pushState({}, '', newUrl.toString())
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Hero Section */}
      <section className={`${styles['hero-gradient']} text-white py-8 sm:py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4">
              IELTS Quiz Demo
            </h1>
          </div>
        </div>
      </section>

      {/* Quiz Navigation */}
      <section className="py-4 sm:py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Câu hỏi {currentQuizIndex + 1} / {quizzes.length || 0}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">{currentQuiz?.title || 'Loading...'}</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleQuizSubmit}
                disabled={
                  (isFillInBlankPage || isMultipleChoicePage)
                    ? (quizContext?.getProgressStats().completedQuizzes === 0 || showResultDialog || showResults)
                    : (Object.keys(quizSelections).filter(key => quizSelections[parseInt(key)]?.length > 0).length === 0 || showResultDialog || showResults)
                }
                className="bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                📝 Nộp bài
              </Button>
              <Button
                onClick={handleRestart}
                variant="outline"
                size="sm"
                className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                🔄 Làm lại
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Content */}
      <section className="py-6 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
            {/* Main Quiz Content - Full width on mobile, 3/4 on desktop */}
            <div className="col-span-1 xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
                <QuizErrorBoundary>
                  {children}
                </QuizErrorBoundary>
                
                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-center gap-3">
                  <Button
                    onClick={handlePrevQuiz}
                    disabled={currentQuizIndex === 0}
                    variant="outline"
                    size="sm"
                  >
                    ← Trước
                  </Button>
                  <Button
                    onClick={handleNextQuiz}
                    disabled={currentQuizIndex === quizzes.length - 1}
                    variant="outline" 
                    size="sm"
                  >
                    Sau →
                  </Button>
                </div>
                
                {showResults && (isFillInBlankPage || allQuizResults) && (
                  <div className="mt-8">{/* Removed header and container styling */}
                    {(() => {
                      const quiz = quizzes[currentQuizIndex]

                      if (isFillInBlankPage) {
                        // Handle fill-in-blanks answer display
                        // Get correct answers from the quiz data
                        if (!quiz || quiz.type !== 'fill-in-blanks') return null
                        
                        const fillInBlanksQuiz = quiz as FillInBlanksData
                        const correctAnswers = fillInBlanksQuiz.blanks.map(blank => blank.correctAnswer || '')

                        return (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-gray-600 block mb-3">Đáp án đúng:</span>
                            <div className="space-y-2">
                              {correctAnswers.map((answer: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="w-6 h-6 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center justify-center">
                                    {index + 1}
                                  </span>
                                  <span className="text-green-800 font-medium">
                                    {answer}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }

                      // Handle multiple choice answer display
                      const result = allQuizResults?.[currentQuizIndex]
                      if (!result) return null
                      
                      const correctCount = result.selectedOptions.filter(option => 
                        result.correctAnswers.includes(option)
                      ).length
                      
                      const isAllCorrect = correctCount === result.correctAnswers.length && result.selectedOptions.length === result.correctAnswers.length
                      
                      // Handle multiple choice answer display - clean format like fill-in-blank
                      return (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-gray-600 block mb-3">Đáp án đúng:</span>
                          <div className="space-y-2">
                            {result.correctAnswers.map((answer: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="text-green-800 font-medium">
                                  {answer}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Sidebar - Hidden on mobile */}
            <div className="hidden xl:block xl:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <ProgressSidebar
                    quizCount={quizzes.length || 0}
                    currentQuizIndex={currentQuizIndex}
                    quizSelections={(isFillInBlankPage || isMultipleChoicePage) ? getQuizSelections() : quizSelections}
                    onQuizSelect={handleQuizSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              🎯 Kết quả làm bài
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Bạn đã hoàn thành bài kiểm tra
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-6 py-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {getTotalCorrectAnswers().correct}/{getTotalCorrectAnswers().total}
              </div>
              <p className="text-lg text-gray-700 font-medium">
                Số câu đúng
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Điểm số: {Math.round((getTotalCorrectAnswers().correct / getTotalCorrectAnswers().total) * 100)}%
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(getTotalCorrectAnswers().correct / getTotalCorrectAnswers().total) * 100}%` 
                }}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-center gap-3">
            <Button
              onClick={handleViewAnswers}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              👁️ Xem đáp án
            </Button>
            <Button
              onClick={handleRestartAll}
              variant="outline"
              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              🔄 Làm lại
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Wrapper with QuizProvider
export default function QuizDemoLayout({ children }: QuizDemoLayoutProps) {
  const pathname = usePathname()
  const isFillInBlankPage = pathname?.includes('/fill-in-blank')
  const isMultipleChoicePage = pathname?.includes('/multi-choice')

  // Determine quiz type and total quizzes
  const quizType = isFillInBlankPage ? 'fill-in-blank' : 'multiple-choice'
  // Total quizzes will be determined dynamically from localStorage
  const [totalQuizzes, setTotalQuizzes] = useState(0)
  
  useEffect(() => {
    const allQuizzes = loadQuizData()
    let count = 0
    
    if (isFillInBlankPage) {
      count = allQuizzes.filter(q => q.type === 'fill-in-blanks').length
    } else if (isMultipleChoicePage) {
      count = allQuizzes.filter(q => q.type === 'multiple-choice').length
    }
    
    setTotalQuizzes(count || 1) // Default to 1 if no quizzes
  }, [isFillInBlankPage, isMultipleChoicePage])

  return (
    <QuizProvider quizType={quizType} totalQuizzes={totalQuizzes}>
      <QuizDemoLayoutInner>{children}</QuizDemoLayoutInner>
    </QuizProvider>
  )
}


