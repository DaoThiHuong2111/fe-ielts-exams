'use client'

import { ProgressSidebar, QuizData, QuizErrorBoundary } from '@/components/quiz'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { QuizProvider, useQuiz } from '@/contexts/quiz-context'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import styles from './quiz-demo.module.css'

// Dữ liệu quiz mẫu dựa trên hình ảnh IELTS thực tế
const sampleQuizzes: QuizData[] = [
  {
    id: 'blockbuster-disadvantages',
    type: 'multiple-choice',
    passageTitle: 'Blockbuster Movies and Museums',
    passage: `Museums have long been bastions of culture and education, but in recent decades, many have embraced the concept of "blockbuster" exhibitions to attract larger audiences and generate revenue. These high-profile shows, often featuring famous artists or popular themes, can draw millions of visitors and create significant media buzz.

However, blockbuster exhibitions are not without their critics and challenges. One major concern is that they fundamentally contradict traditional museum management philosophies that prioritize scholarly research and educational value over commercial success. The pressure to create crowd-pleasing spectacles can lead to a dilution of curatorial integrity and intellectual depth.

Another significant drawback is the substantial financial investment required. Museums must often pay hefty fees for specialist business consulting, marketing campaigns, and enhanced security measures. These costs can strain budgets that might otherwise support more meaningful educational programs or permanent collection development.

The operational burden of blockbuster shows cannot be underestimated. Staff members face dramatically increased workloads, from crowd management to extended opening hours, often leading to burnout and decreased job satisfaction. Despite attracting large numbers during the exhibition period, research suggests that blockbusters rarely translate into sustained increases in overall annual visitor numbers to museums.

Furthermore, the global nature of blockbuster exhibitions means that what proves popular in one cultural context may fail to resonate with audiences in another country. This cultural disconnect can result in poor attendance and financial losses. Perhaps most concerning is how commercial pressures can compromise the exhibition content itself, with sponsors and financial backers potentially influencing the narrative to suit their interests rather than maintaining scholarly objectivity.`,
    title: 'Câu hỏi về Blockbuster Movies',
    instruction: 'Which THREE of the following are mentioned by the writer as disadvantages of blockbusters?',
    maxSelections: 3,
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'they do not suit museum management styles'
      },
      {
        id: 'B', 
        label: 'B',
        text: 'Specialist business advice has to be paid for'
      },
      {
        id: 'C',
        label: 'C', 
        text: 'They involve an increased workload for personnel'
      },
      {
        id: 'D',
        label: 'D',
        text: 'They do not increase overall annual visitor numbers'
      },
      {
        id: 'E',
        label: 'E',
        text: 'They are very tiring to put on'
      },
      {
        id: 'F',
        label: 'F',
        text: 'What is popular in one country may not be popular in another'
      },
      {
        id: 'G',
        label: 'G',
        text: 'The content can be weakened through financial pressure.'
      }
    ],
    correctAnswers: ['A', 'C', 'G']
  },
  {
    id: 'reading-comprehension',
    type: 'multiple-choice',
    passageTitle: 'Scientific Research Methodology',
    passage: `The quality of scientific research depends heavily on the methodology employed in conducting studies. A well-designed research project begins with a clear hypothesis and employs rigorous methods to test this hypothesis objectively. One of the most critical aspects of any research study is ensuring that the sample size is adequate for drawing meaningful conclusions.

Statistical significance cannot be achieved with insufficient data, regardless of how carefully the study is conducted. Researchers must calculate the minimum sample size required to detect meaningful differences or relationships in their data. This calculation depends on factors such as the expected effect size, the desired level of statistical power, and the acceptable risk of Type I and Type II errors.

Furthermore, the methodology must be comprehensive and thoroughly documented to allow for replication by other researchers. This documentation should include detailed descriptions of participant selection criteria, data collection procedures, analytical techniques, and any limitations or potential sources of bias. Without such documentation, the validity and reliability of the research findings remain questionable.

Perhaps most importantly, the conclusions drawn from any study must be firmly grounded in empirical evidence rather than speculation or wishful thinking. This means that researchers should acknowledge when their data does not support their initial hypotheses and avoid overstating the implications of their findings. The scientific community values research that addresses genuine gaps in current knowledge and contributes meaningfully to the existing body of literature.`,
    title: 'Câu hỏi về Research Methodology',
    instruction: 'Choose the correct letters A, B, C, or D for each statement about research methodology.',
    maxSelections: 4,
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'The research methodology was comprehensive and well-documented'
      },
      {
        id: 'B',
        label: 'B',
        text: 'The sample size was sufficient for statistical significance'
      },
      {
        id: 'C',
        label: 'C',
        text: 'The conclusions were supported by empirical evidence'
      },
      {
        id: 'D',
        label: 'D',
        text: 'The study addressed important gaps in current literature'
      }
    ],
    correctAnswers: ['A', 'B', 'C', 'D']
  },
  {
    id: 'environmental-issues',
    type: 'multiple-choice',
    passageTitle: 'Global Environmental Conservation Initiatives',
    passage: `As the world grapples with mounting environmental challenges, experts are advocating for comprehensive strategies that address multiple facets of ecological degradation. The transition to renewable energy sources has emerged as a cornerstone of urban sustainability initiatives. Cities worldwide are investing heavily in solar panels, wind turbines, and other clean energy technologies to reduce their carbon footprint and decrease dependence on fossil fuels.

Policy-driven approaches to reducing plastic consumption have shown remarkable success in numerous countries. Governments are implementing plastic bag bans, promoting biodegradable alternatives, and establishing comprehensive recycling programs. These measures have led to significant reductions in plastic waste entering waterways and natural habitats.

Transportation systems represent another critical area for environmental intervention. Experts consistently recommend the development and promotion of sustainable transportation alternatives, including electric public transit, cycling infrastructure, and pedestrian-friendly urban design. These initiatives not only reduce greenhouse gas emissions but also improve air quality in densely populated areas.

Community education programs play an equally vital role in environmental conservation efforts. When local populations understand the importance of environmental protection and are equipped with practical knowledge about sustainable practices, the impact can be transformative. Educational initiatives help create a culture of environmental responsibility that extends beyond individual actions to influence community-wide behavioral changes.

However, some proposed strategies remain contentious among environmental experts. While some argue for increased industrial production to drive economic growth that could fund environmental initiatives, most conservation specialists maintain that this approach is counterproductive and conflicts with sustainability principles.

Conservation experts universally support the establishment of protected natural reserves and parks as essential components of biodiversity preservation. These protected areas serve as critical habitats for endangered species while also providing opportunities for ecological research and environmental education.`,
    title: 'Câu hỏi về Environmental Conservation',
    instruction: 'Which FOUR of the following strategies are recommended by environmental experts?',
    maxSelections: 4,
    options: [
      {
        id: 'A',
        label: 'A',
        text: 'Implement renewable energy sources in urban areas'
      },
      {
        id: 'B',
        label: 'B',
        text: 'Reduce plastic consumption through policy changes'
      },
      {
        id: 'C',
        label: 'C',
        text: 'Promote sustainable transportation alternatives'
      },
      {
        id: 'D',
        label: 'D',
        text: 'Educate communities about environmental protection'
      },
      {
        id: 'E',
        label: 'E',
        text: 'Increase industrial production to boost economy'
      },
      {
        id: 'F',
        label: 'F',
        text: 'Establish protected natural reserves and parks'
      }
    ],
    correctAnswers: ['A', 'B', 'C', 'D']
  }
]

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

  // Get fill-in-blank context if available
  let quizContext = null
  try {
    if (isFillInBlankPage || isMultipleChoicePage) {
      quizContext = useQuiz()
    }
  } catch (error) {
    // Context not available, use default values
  }

  // Convert quiz progress to compatible format for ProgressSidebar
  const getQuizSelections = () => {
    if (!quizContext) return {}
    const selections: Record<number, string[]> = {}
    Object.entries(quizContext.quizProgress).forEach(([index, hasAnswers]) => {
      if (hasAnswers) {
        selections[parseInt(index)] = ['answered'] // Dummy value to indicate answered
      }
    })
    return selections
  }

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sync URL params with state
  useEffect(() => {
    if (isClient) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [urlQuizIndex, isClient])

  const currentQuiz = sampleQuizzes[currentQuizIndex]
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
      // For now, just show a simple result dialog
      // TODO: Implement proper fill-in-blanks result calculation
      setShowResultDialog(true)
    } else {
      // Handle multiple choice submission
      const results: Record<number, { selectedOptions: string[], correctAnswers: string[] }> = {}

      sampleQuizzes.forEach((quiz, index) => {
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
      return { correct: 0, total: 3 } // Default
    }

    // For multiple choice
    if (!allQuizResults) return { correct: 0, total: 0 }

    let totalCorrect = 0
    let totalQuestions = 0

    sampleQuizzes.forEach((_, index) => {
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
    if (currentQuizIndex < sampleQuizzes.length - 1) {
      const newIndex = currentQuizIndex + 1
      setCurrentQuizIndex(newIndex)
      // Update URL params to sync with fill-in-blank page
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('quiz', newIndex.toString())
      window.history.pushState({}, '', newUrl.toString())
    }
  }

  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      const newIndex = currentQuizIndex - 1
      setCurrentQuizIndex(newIndex)
      // Update URL params to sync with fill-in-blank page
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
                Câu hỏi {currentQuizIndex + 1} / {sampleQuizzes.length}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">{currentQuiz?.title || 'Fill-in-Blanks Quiz'}</p>
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
                    disabled={currentQuizIndex === sampleQuizzes.length - 1}
                    variant="outline" 
                    size="sm"
                  >
                    Sau →
                  </Button>
                </div>
                
                {showResults && (isFillInBlankPage || allQuizResults) && (
                  <div className="mt-8">{/* Removed header and container styling */}
                    {(() => {
                      const quiz = sampleQuizzes[currentQuizIndex]

                      if (isFillInBlankPage) {
                        // Handle fill-in-blanks answer display
                        // Hardcoded answers for demo (in real app, get from API/context)
                        const fillInBlankAnswers = [
                          { title: 'Blockbuster Movies', answers: ['extreme', 'weather', 'disaster', 'effects'] },
                          { title: 'Conditional Sentences', answers: ['would', 'had', 'could'] },
                          { title: 'Environmental Conservation', answers: ['revealed', 'pollution', 'sustainable'] }
                        ]

                        const currentAnswers = fillInBlankAnswers[currentQuizIndex] || fillInBlankAnswers[0]

                        return (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-gray-600 block mb-3">Đáp án đúng:</span>
                            <div className="space-y-2">
                              {currentAnswers.answers.map((answer: string, index: number) => (
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
                    quizCount={sampleQuizzes.length}
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
  const totalQuizzes = 3 // Both pages have 3 quizzes

  return (
    <QuizProvider quizType={quizType} totalQuizzes={totalQuizzes}>
      <QuizDemoLayoutInner>{children}</QuizDemoLayoutInner>
    </QuizProvider>
  )
}


