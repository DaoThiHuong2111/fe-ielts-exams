'use client'

import { ProgressSidebar, QuizErrorBoundary } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { QuizProvider, useQuiz } from '@/contexts/quiz-context'
import { loadQuizData, getAllQuestionsFlat } from '@/lib/quiz-storage'
import type { QuizData, MultipleChoiceData, FillInBlanksData } from '@/types/quiz'
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

  // Sync selections with page component by listening to context changes
  useEffect(() => {
    if (isMultipleChoicePage && quizContext) {
      // Sync progress from page component context to layout
      const contextProgress = quizContext.quizProgress
      const newSelections: Record<number, string[]> = {}
      Object.entries(contextProgress).forEach(([index, hasAnswers]) => {
        if (hasAnswers) {
          newSelections[parseInt(index)] = ['answered'] // Just mark as answered
        }
      })
      setQuizSelections(newSelections)
    }
  }, [isMultipleChoicePage, quizContext?.quizProgress])

// Load quizzes from localStorage on mount
  useEffect(() => {
    const loadSampleQuizData = async () => {
      try {
        // Try to load from new passage format first, then fallback to legacy
        const passageQuestions = getAllQuestionsFlat()
        const legacyQuizzes = loadQuizData()
        
        // Combine both sources (passage questions take priority)
        let allQuizzes = passageQuestions.length > 0 ? passageQuestions : legacyQuizzes
        
        // If no quizzes are found in localStorage, load sample data
        if (allQuizzes.length === 0) {
          // Import and use the sample data
          const sampleData = await import('@/data/quiz-sets/ielts-reading-practice.json')
          
          if (sampleData && sampleData.default && sampleData.default.passages) {
            // Convert passages to flat quiz format
            const flatQuizzes: QuizData[] = []
            
            sampleData.default.passages.forEach((passage: any) => {
              passage.questions.forEach((question: any) => {
                if (question.type === 'multiple-choice') {
                  flatQuizzes.push({
                    id: question.id,
                    type: 'multiple-choice',
                    title: question.title || '',
                    instruction: question.instruction || '',
                    passage: passage.content ? { 
                      title: passage.title || '', 
                      content: passage.content 
                    } : undefined,
                    passageTitle: passage.title || '',
                    options: question.options || [],
                    maxSelections: question.maxSelections ?? 1,
                    correctAnswers: question.correctAnswers || [],
                    category: passage.category,
                    tags: passage.tags,
                    estimatedTime: passage.estimatedTime
                  })
                } else if (question.type === 'fill-in-blanks') {
                  flatQuizzes.push({
                    id: question.id,
                    type: 'fill-in-blanks',
                    title: question.title || '',
                    instruction: question.instruction || '',
                    passage: passage.content ? { 
                      title: passage.title || '', 
                      content: passage.content 
                    } : undefined,
                    passageTitle: passage.title || '',
                    text: question.text || '',
                    blanks: question.blanks || [],
                    category: passage.category,
                    tags: passage.tags,
                    estimatedTime: passage.estimatedTime
                  })
                }
              })
            })
            
            // Use the converted sample data
            allQuizzes = flatQuizzes
          }
        }
        
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
      setShowResults(true) // Show results after submission
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
      setShowResults(true) // Show results after submission
      // Store in localStorage for page component to read
      localStorage.setItem('quizShowResults', 'true')
      setShowResultDialog(true)
    }
  }

  const getTotalCorrectAnswers = () => {
    // Universal logic for all quiz pages
    const totalQuestions = quizzes.length
    let totalCorrect = 0
    let totalAnswered = 0
    
    if (isFillInBlankPage) {
      // For fill-in-blanks, use context progress as a fallback
      if (quizContext) {
        const stats = quizContext.getProgressStats()
        return { 
          correct: stats.completedQuizzes, 
          total: stats.totalQuizzes,
          answered: stats.completedQuizzes,
          percentage: stats.totalQuizzes > 0 ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0,
          completionRate: stats.totalQuizzes > 0 ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) : 0
        }
      }
    }

    // For multiple choice pages (both sub-page and main page) - use actual quiz data
    quizzes.forEach((_, index) => {
      let selections: string[] = []
      
      if (isMultipleChoicePage) {
        // Get selections from quiz context for sub-pages
        // But fall back to quizSelections if context doesn't have the data
        const contextSelections = getQuizSelections()
        selections = contextSelections[index] || quizSelections[index] || []
        
        // For multiple choice context, we need to get actual user selections
        // The context just tracks "has answers" but not the actual selections
        // So prioritize quizSelections from the component state
        if (quizSelections[index]?.length > 0) {
          selections = quizSelections[index]
        }
      } else {
        // Main quiz-demo page
        selections = quizSelections[index] || []
      }
      
      const hasAnswered = selections.length > 0
      
      if (hasAnswered) {
        totalAnswered++
        
        // Get quiz correct answers
        const quiz = quizzes[index]
        const correctAnswers = 'correctAnswers' in quiz ? (quiz.correctAnswers || []) : []
        
        // Check if this question is answered correctly
        // For multiple choice: all selected options must be correct AND all correct options must be selected
        const correctCount = selections.filter(option => correctAnswers.includes(option)).length
        const incorrectCount = selections.filter(option => !correctAnswers.includes(option)).length
        const missedCount = correctAnswers.filter(answer => !selections.includes(answer)).length
        
        // A question is correct only if:
        // 1. All selected answers are correct (incorrectCount === 0)
        // 2. All correct answers are selected (missedCount === 0)
        const isAllCorrect = incorrectCount === 0 && missedCount === 0
        
        if (isAllCorrect) {
          totalCorrect++
        }
      }
    })

    return { 
      correct: totalCorrect, 
      total: totalQuestions, 
      answered: totalAnswered,
      percentage: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      completionRate: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0
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
    // Clear all selections for current quiz
    setQuizSelections(prev => ({
      ...prev,
      [currentQuizIndex]: []
    }))
    
    // Clear localStorage flag
    localStorage.removeItem('quizShowResults')

    // For both multiple choice and fill-in-blanks, reload to ensure clean state
    window.location.reload()
  }

  const handleQuizSelect = (index: number) => {
    setCurrentQuizIndex(index)
    // Update URL params to sync with fill-in-blank page
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('quiz', index.toString())
    window.history.pushState({}, '', newUrl.toString())
  }

  return (
    <div className="min-h-dvh bg-gray-50 pt-8">
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
                  (() => {
                    if (showResultDialog || showResults) return true;
                    
                    if (isFillInBlankPage) {
                      return quizContext?.getProgressStats().completedQuizzes === 0;
                    }
                    
                    if (isMultipleChoicePage) {
                      // For multiple choice sub-pages, check if all quizzes have answers
                      const hasAllAnswers = quizzes.every((_, index) => {
                        const contextSelections = getQuizSelections();
                        const selections = contextSelections[index] || quizSelections[index] || [];
                        return selections.length > 0;
                      });
                      return !hasAllAnswers;
                    }
                    
                    // For main quiz page
                    return Object.keys(quizSelections).filter(key => quizSelections[parseInt(key)]?.length > 0).length === 0;
                  })()
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
                  {/* Progress Bar with Score */}
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

                  {/* Detailed Stats Grid */}
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

                  {/* Summary with better formatting */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Tổng số câu hỏi:</span>
                      <span className="font-semibold text-gray-900">{result.total}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Số câu đã làm:</span>
                      <span className="font-semibold text-gray-900">{result.answered || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tỷ lệ hoàn thành:</span>
                      <span className="font-semibold text-gray-900">{result.completionRate || 0}%</span>
                    </div>
                  </div>

                  {/* Performance Message */}
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
                    })()
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
        
        // If no quizzes in localStorage, load from sample data
        if (allQuizzes.length === 0) {
          const sampleData = await import('@/data/quiz-sets/ielts-reading-practice.json')
          
          if (sampleData && sampleData.default && sampleData.default.passages) {
            // Convert passages to flat quiz format and count them
            const flatQuizzes: any[] = []
            
            sampleData.default.passages.forEach((passage: any) => {
              passage.questions.forEach((question: any) => {
                flatQuizzes.push({
                  type: question.type
                })
              })
            })
            
            allQuizzes = flatQuizzes
          }
        }
        
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
      <QuizDemoLayoutInner>{children}</QuizDemoLayoutInner>
    </QuizProvider>
  )
}


