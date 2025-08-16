'use client'

// Force dynamic rendering due to parent layout using cookies
export const dynamic = 'force-dynamic'

import { ProgressSidebar, QuizErrorBoundary } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { QuizProvider, useQuiz } from '@/contexts/quiz-context'
import { loadQuizData, getAllQuestionsFlat } from '@/lib/quiz-storage'
import type { QuizData, MultipleChoiceData, FillInBlanksData } from '@/types/quiz'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState, Suspense } from 'react'
import styles from './quiz-demo.module.css'

// Loading component for layout Suspense fallback
function LayoutLoadingFallback() {
  return (
    <div className="min-h-dvh bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    </div>
  )
}

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
  const isMainQuizDemoPage = pathname === '/quiz-demo'

  // Get quiz index from URL params, default to 0
  const urlQuizIndex = parseInt(searchParams.get('quiz') || '0', 10)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(urlQuizIndex)
  const [showResults, setShowResults] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [allQuizResults, setAllQuizResults] = useState<Record<number, { selectedOptions: string[], correctAnswers: string[] }> | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [quizzes, setQuizzes] = useState<QuizData[]>([])
  const [hasCleared, setHasCleared] = useState(false)

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

  // Clear quiz results and localStorage flags on page refresh/mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear quiz-related localStorage flags on page load/refresh
      localStorage.removeItem('quizShowResults')
      
      // Reset all states to initial values
      setShowResults(false)
      setShowResultDialog(false)
      setAllQuizResults(null)
    }
  }, []) // Only run once on mount
  
  // Clear quiz context progress when available - only once
  useEffect(() => {
    if (quizContext && (isFillInBlankPage || isMultipleChoicePage) && !hasCleared) {
      quizContext.clearAllProgress()
      setHasCleared(true)
    }
  }, [quizContext, isFillInBlankPage, isMultipleChoicePage, hasCleared]) // Run when quizContext becomes available
  
  // Note: Removed sync logic - now using QuizContext directly

  // Load quizzes from localStorage on mount
  useEffect(() => {
    const loadSampleQuizData = async () => {
      try {
        // Try to load from new passage format first, then fallback to legacy
        const passageQuestions = getAllQuestionsFlat()
        const legacyQuizzes = loadQuizData()
        
        // Combine both sources (passage questions take priority)
        let allQuizzes = passageQuestions.length > 0 ? passageQuestions : legacyQuizzes
        
        
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
        } else {
          // For main quiz-demo page, load all quizzes
          filteredQuizzes = allQuizzes
        }
        
        setQuizzes(filteredQuizzes)
      } catch (error) {
        console.error('Error loading quiz data:', error)
      } finally {
        setIsClient(true)
      }
    }
    
    loadSampleQuizData()
  }, [isFillInBlankPage, isMultipleChoicePage])

  // Sync URL params with state
  useEffect(() => {
    if (isClient) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [urlQuizIndex, isClient])

  const currentQuiz = quizzes[currentQuizIndex]

  // Reset results when quiz changes, but keep selections
  useEffect(() => {
    if (!showResults) {
      setAllQuizResults(null)
    }
  }, [currentQuizIndex, showResults])


  const handleQuizSubmit = () => {
    console.log('🚀 [SUBMIT] Quiz submitted');
    
    if (isFillInBlankPage) {
      // Handle fill-in-blanks submission
      setShowResultDialog(true)
      setShowResults(true) // Show results after submission
    } else {
      // Handle multiple choice submission
      const results: Record<number, { selectedOptions: string[], correctAnswers: string[] }> = {}
      
      // Get real selection data from page component
      const realSelections = typeof window !== 'undefined' && (window as any).getRealQuizSelections 
        ? (window as any).getRealQuizSelections() 
        : {}
      
      console.log('🚀 [SUBMIT] Real quiz selections from page:', realSelections);

      quizzes.forEach((quiz, index) => {
        // Use real selections from page component instead of context selections
        const selections = realSelections[index] || []
        // Check if quiz has correctAnswers property (multiple choice)
        const correctAnswers = 'correctAnswers' in quiz ? (quiz.correctAnswers || []) : []
        
        console.log(`🚀 [SUBMIT] Quiz ${index}:`);
        console.log(`   - Real Selections: [${selections.join(', ')}]`);
        console.log(`   - Correct answers: [${correctAnswers.join(', ')}]`);
        
        results[index] = {
          selectedOptions: selections,
          correctAnswers: correctAnswers
        }
      })
      
      console.log('🚀 [SUBMIT] Final results object:', results);

      setAllQuizResults(results)
      setShowResults(true) // Show results after submission
      // Store in localStorage for page component to read
      localStorage.setItem('quizShowResults', 'true')
      setShowResultDialog(true)
    }
  }

  const getTotalCorrectAnswers = () => {
    // Use QuizContext to calculate results instead of manual calculation
    if (quizContext) {
      return quizContext.calculateQuizResults(quizzes)
    }
    
    // Fallback for main quiz-demo page (no context)
    return {
      correct: 0,
      total: quizzes.length,
      answered: 0,
      percentage: 0,
      completionRate: 0
    }
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
    
    // Reset to first question (index 0)
    setCurrentQuizIndex(0)
    
    // Clear localStorage flags
    localStorage.removeItem('quizShowResults')
    
    // Signal page components to reset their state
    localStorage.setItem('quizReset', 'true')
    // Trigger storage event manually for same-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'quizReset',
      newValue: 'true'
    }))
    
    // Clear quiz context progress
    if (quizContext) {
      quizContext.clearAllProgress()
    }
    
    // Update URL to show first question
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('quiz', '0')
    window.history.pushState({}, '', newUrl.toString())

    // For fill-in-blanks, trigger page reload to ensure clean state
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

  // Check if at least one question has been answered
  const hasAnsweredAtLeastOne = () => {
    if (quizContext) {
      // Use QuizContext progress tracking for sub-pages
      const stats = quizContext.getProgressStats()
      return stats.completedQuizzes > 0
    }
    
    // For main quiz-demo page (no context), always return false since we don't track answers there
    return false
  }

  return (
    <div className="min-h-dvh bg-gray-50 pt-8">
      {!isMainQuizDemoPage && (
        <section className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="text-center md:text-left">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  Câu hỏi {currentQuizIndex + 1} / {quizzes.length || 0}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">{currentQuiz?.title || 'Loading...'}</p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleQuizSubmit}
                  disabled={!hasAnsweredAtLeastOne()}
                  className={`text-white ${
                    hasAnsweredAtLeastOne() 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  size="xs"
                >
                  📝 Nộp bài
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="xs"
                  className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                >
                  🔄 Làm lại
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-2 sm:py-3">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
            <div className="col-span-1 xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-3">
                <QuizErrorBoundary>{children}</QuizErrorBoundary>
                
                <div className="mt-2 sm:mt-3 flex justify-center gap-3">
                  <Button
                    onClick={handlePrevQuiz}
                    disabled={currentQuizIndex === 0}
                    variant="outline"
                    size="xs"
                    className="px-2 py-1"
                  >
                    ← Trước
                  </Button>
                  <Button
                    onClick={handleNextQuiz}
                    disabled={currentQuizIndex === quizzes.length - 1}
                    variant="outline" 
                    size="xs"
                    className="px-2 py-1"
                  >
                    Sau →
                  </Button>
                </div>

                {showResults && (isFillInBlankPage || allQuizResults) && (
                  <div className="mt-8">
                    {(() => {
                      const quiz = quizzes[currentQuizIndex]

                      if (isFillInBlankPage) {
                        // Handle fill-in-blanks answer display
                        // Get correct answers from the quiz data
                        if (!quiz || quiz.type !== 'fill-in-blanks') return null

                        const fillInBlanksQuiz = quiz
                        const correctAnswers = fillInBlanksQuiz.blanks.map(
                          (blank) => blank.correctAnswer || ''
                        )

                        return (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-gray-600 block mb-3">
                              Đáp án đúng:
                            </span>
                            <div className="space-y-2">
                              {correctAnswers.map((answer: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
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

                      const correctCount = result.selectedOptions.filter((option) =>
                        result.correctAnswers.includes(option)
                      ).length

                      const isAllCorrect =
                        correctCount === result.correctAnswers.length &&
                        result.selectedOptions.length === result.correctAnswers.length

                      // Handle multiple choice answer display - clean format like fill-in-blank
                      return (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-gray-600 block mb-3">
                            Đáp án đúng:
                          </span>
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
            {!isMainQuizDemoPage && (
              <div className="hidden xl:block xl:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <ProgressSidebar
                      quizCount={quizzes.length || 0}
                      currentQuizIndex={currentQuizIndex}
                      quizSelections={getQuizSelections()}
                      onQuizSelect={handleQuizSelect}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {isMainQuizDemoPage && <div className="h-24"></div>}

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-900">
              🎯 Kết quả làm bài
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              Bạn đã hoàn thành bài kiểm tra
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {(() => {
              // Cache the result to avoid multiple calculations
              const result = getTotalCorrectAnswers()
              
              // Calculate score color based on percentage
              const getScoreColor = (percentage: number) => {
                if (percentage >= 80) return 'text-green-600'
                if (percentage >= 60) return 'text-yellow-600'
                if (percentage >= 40) return 'text-orange-600'
                return 'text-red-600'
              }
              
              const getScoreBgColor = (percentage: number) => {
                if (percentage >= 80) return 'bg-green-500'
                if (percentage >= 60) return 'bg-yellow-500'
                if (percentage >= 40) return 'bg-orange-500'
                return 'bg-red-500'
              }
              
              return (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Độ chính xác</span>
                      <span className={`text-lg font-bold ${getScoreColor(result.percentage || 0)}`}>
                        {result.percentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`${getScoreBgColor(result.percentage || 0)} h-4 rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${result.percentage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {result.correct}
                      </div>
                      <div className="text-xs text-blue-700 font-medium">
                        Câu đúng
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="text-2xl font-bold text-gray-600 mb-1">
                        {(result.answered || 0) - result.correct}
                      </div>
                      <div className="text-xs text-gray-700 font-medium">
                        Câu sai
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {result.total - (result.answered || 0)}
                      </div>
                      <div className="text-xs text-orange-700 font-medium">
                        Chưa làm
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tổng số câu hỏi:</span>
                      <span className="font-semibold text-gray-900">{result.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Số câu đã làm:</span>
                      <span className="font-semibold text-gray-900">{result.answered || 0}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    {(() => {
                      const percentage = result.percentage || 0
                      if (percentage >= 80) {
                        return <p className="text-green-600 font-medium">🎉 Xuất sắc! Bạn đã làm rất tốt!</p>
                      } else if (percentage >= 60) {
                        return <p className="text-yellow-600 font-medium">👍 Tốt! Bạn có thể cải thiện thêm.</p>
                      } else if (percentage >= 40) {
                        return <p className="text-orange-600 font-medium">📚 Cần ôn tập thêm để cải thiện kết quả.</p>
                      } else if (result.answered > 0) {
                        return <p className="text-red-600 font-medium">💪 Hãy ôn tập kỹ hơn và thử lại!</p>
                      } else {
                        return <p className="text-gray-600 font-medium">😅 Bạn chưa trả lời câu hỏi nào.</p>
                      }
                    })()}
                  </div>
                </>
              )
            })()}
          </div>

          <DialogFooter className="sm:justify-center gap-3">
            <Button
              onClick={handleViewAnswers}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
            >
              👁️ Xem đáp án
            </Button>
            <Button
              onClick={handleRestartAll}
              variant="outline"
              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 shadow-sm"
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
    const loadQuizCount = async () => {
      try {
        // Try to load from localStorage first
        const passageQuestions = getAllQuestionsFlat()
        const legacyQuizzes = loadQuizData()
        let allQuizzes = passageQuestions.length > 0 ? passageQuestions : legacyQuizzes
        
        
        let count = 0
        
        if (isFillInBlankPage) {
          count = allQuizzes.filter(q => q.type === 'fill-in-blanks').length
        } else if (isMultipleChoicePage) {
          count = allQuizzes.filter(q => q.type === 'multiple-choice').length
        }
        
        setTotalQuizzes(count)
      } catch (error) {
        console.error('Error loading quiz count:', error)
        setTotalQuizzes(0)
      }
    }
    
    loadQuizCount()
  }, [isFillInBlankPage, isMultipleChoicePage])

  return (
    <QuizProvider quizType={quizType} totalQuizzes={totalQuizzes}>
      <Suspense fallback={<LayoutLoadingFallback />}>
        <QuizDemoLayoutInner>{children}</QuizDemoLayoutInner>
      </Suspense>
    </QuizProvider>
  )
}
