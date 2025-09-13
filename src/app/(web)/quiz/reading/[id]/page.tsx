'use client'

import { DragDropQuestion, QuizContentWithSelection } from '@/components/quiz'
import QuizFooter from '@/components/quiz/quiz-footer'
import QuizHeader from '@/components/quiz/quiz-header'
import ResizablePanel from '@/components/ui/resizable-panel'
import {
  getAllAnsweredQuestions,
  getPartByNumber,
  getQuestionsByPart,
  initializeMultiPartQuizState
} from '@/lib/multi-part-quiz-utils'
import { getQuestionStartingNumber } from '@/lib/question-numbering-utils'
import { getQuizById } from '@/lib/simple-quiz-storage'
import { MultiPartQuiz, MultiPartQuizState, Paragraph, Question, QuestionOption } from '@/types/multi-part-quiz'
import { use, useEffect, useState } from 'react'

interface ReadingQuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReadingQuizDetailPage({ params }: ReadingQuizDetailPageProps) {
  const resolvedParams = use(params)
  
  // State management
  const [isClient, setIsClient] = useState(false)
  const [quiz, setQuiz] = useState<MultiPartQuiz | null>(null)
  const [quizState, setQuizState] = useState<MultiPartQuizState | null>(null)

  // Initialize quiz data and state
  useEffect(() => {
    setIsClient(true)
    
    // Check if in preview mode
    const urlParams = new URLSearchParams(window.location.search)
    const isPreview = urlParams.get('preview') === 'true'
    
    let quizData: MultiPartQuiz | null = null
    
    if (isPreview) {
      // Preview mode: load from temporary preview key
      const previewKey = `preview-${resolvedParams.id}`
      const previewData = localStorage.getItem(previewKey)
      if (previewData) {
        try {
          quizData = JSON.parse(previewData)
        } catch (error) {
          console.error('Failed to parse preview data:', error)
        }
      }
    } else {
      // Normal mode: load from quiz ID (READ ONLY)
      quizData = getQuizById(resolvedParams.id)
    }
    
    if (quizData) {
      setQuiz(quizData)
      setQuizState(initializeMultiPartQuizState(quizData))
    }
  }, [resolvedParams.id])

  // Timer effect to update overall time remaining
  useEffect(() => {
    if (!quizState) return

    const timer = setInterval(() => {
      setQuizState(prev => {
        if (!prev || prev.overallTimeRemaining <= 0) return prev
        
        return {
          ...prev,
          overallTimeRemaining: Math.max(0, prev.overallTimeRemaining - 1)
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizState !== null])

  // Event handlers
  const handleAnswerChange = (questionId: string, value: string) => {
    if (!quizState) return
    
    setQuizState(prev => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [questionId]: value
      }
    }))
  }

  const handlePartChange = (partNumber: number) => {
    if (!quizState) return
    
    setQuizState(prev => ({
      ...prev!,
      currentPart: partNumber
    }))
  }

  const handleQuestionClick = (questionId: string) => {
    // Find which part contains this question
    if (!quiz) return
    
    for (const part of quiz.parts) {
      if (part.questions.some(q => q.id === questionId)) {
        // Switch to this part if not already active
        if (quizState?.currentPart !== part.partNumber) {
          handlePartChange(part.partNumber)
        }
        
        // Scroll to the question
        setTimeout(() => {
          const element = document.getElementById(`question-${questionId}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        break
      }
    }
  }

  const handleSubmit = () => {
    if (!quizState || !quiz) return
    
    console.log('Submitted answers:', quizState.answers)
    alert(`Bài thi đã được nộp! Answered: ${getAllAnsweredQuestions(quiz, quizState.answers).size}/${quiz.metadata.totalQuestions}`)
  }

  // Loading state
  if (!isClient || !quiz || !quizState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading quiz...</div>
      </div>
    )
  }

  const currentPartData = getPartByNumber(quiz, quizState.currentPart)
  const currentPartQuestions = getQuestionsByPart(quiz, quizState.currentPart)

  // Question group rendering (similar to original but for current part only)
  interface QuestionGroup {
    type: string
    questions: Question[]
    startIndex: number
    instruction?: string
  }

  const groupConsecutiveQuestions = (questions: Question[]): QuestionGroup[] => {
    const groups: QuestionGroup[] = []
    let currentGroup: QuestionGroup | null = null
    
    questions.forEach((question, index) => {
      const shouldGroupWithPrevious = currentGroup && 
        currentGroup.type === question.type &&
        ((question.type === 'SENTENCE_COMPLETION' &&
          currentGroup.questions.length > 0 &&
          currentGroup.questions[currentGroup.questions.length - 1].text === question.text) ||
         question.type === 'PARAGRAPH_MATCHING_TABLE')
      
      if (!currentGroup || (currentGroup.type !== question.type && !shouldGroupWithPrevious)) {
        currentGroup = {
          type: question.type,
          questions: [question],
          startIndex: index,
          instruction: question.instruction
        }
        groups.push(currentGroup)
      } else {
        currentGroup.questions.push(question)
      }
    })
    
    return groups
  }

  const questionGroups = groupConsecutiveQuestions(currentPartQuestions)

  const renderQuestionGroup = (group: QuestionGroup) => {
    switch (group.type) {
      case 'MULTIPLE_CHOICE':
        // Multiple choice questions are rendered individually since each has different prompts
        const question = group.questions[0]
        return (
          <div className="space-y-3">
            <p className="font-medium">{question.prompt}</p>
            <div className="space-y-2">
              {question.options?.map((option: QuestionOption) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={quizState.answers[question.id] === option.id}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="w-4 h-4"
                    suppressHydrationWarning
                  />
                  <span className="text-sm">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'TRUE_FALSE_NOTGIVEN':
        return (
          <div className="space-y-4">
            {group.instruction && <p className="text-sm text-black font-bold">{group.instruction}</p>}
            {group.questions.map((question: Question) => (
              <div key={question.id} className="border-l-2 border-gray-200 pl-4">
                <p className="mb-2">{question.text}</p>
                <div className="flex flex-col space-y-2">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                    <label key={option} className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={quizState.answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4"
                        suppressHydrationWarning
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'SENTENCE_COMPLETION':
        // Check if all questions in group have the same text (grouped questions)
        const firstQuestionText = group.questions[0]?.text || ''
        const hasIdenticalText = group.questions.length > 1 && 
          group.questions.every(q => q.text === firstQuestionText)
        
        if (hasIdenticalText) {
          // Handle grouped questions with identical text
          // Each question has its own correctAnswer (string), combine them for processing
          const allCorrectAnswers = group.questions
            .map(q => {
              // Handle both string and array correctAnswer for backwards compatibility
              if (Array.isArray(q.correctAnswer)) {
                return q.correctAnswer[0] || ''
              }
              return String(q.correctAnswer || '')
            })
            .filter(Boolean)
          
          const baseQuestionNumber = getQuestionStartingNumber(quiz!, quizState.currentPart, group.questions[0].id)
          
          // Split text by all possible answers to find blanks
          let parts = [firstQuestionText]
          let textboxCounter = 0
          
          allCorrectAnswers.forEach((answer: string) => {
            if (answer && typeof answer === 'string' && answer.trim()) {
              const newParts: string[] = []
              parts.forEach(part => {
                if (typeof part === 'string') {
                  const splitParts = part.split(new RegExp(answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'))
                  newParts.push(...splitParts)
                } else {
                  newParts.push(part)
                }
              })
              parts = newParts
            }
          })
          
          return (
            <div className="space-y-4">
              {group.instruction && <p className="text-sm text-black font-bold">{group.instruction}</p>}
              <div className="flex flex-wrap items-center gap-1 mb-3">
                {parts.map((part: string, index: number) => (
                  <span key={index} className="inline-flex items-center">
                    <span>{part}</span>
                    {index < parts.length - 1 && (() => {
                      const questionIndex = textboxCounter
                      textboxCounter++
                      const currentQuestion = group.questions[questionIndex] || group.questions[0]
                      const questionNumber = baseQuestionNumber + questionIndex
                      
                      return (
                        <input
                          type="text"
                          placeholder={questionNumber.toString()}
                          value={quizState.answers[currentQuestion.id] || ''}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 mx-1 w-40 text-center inline-block"
                          suppressHydrationWarning
                        />
                      )
                    })()}
                  </span>
                ))}
              </div>
            </div>
          )
        } else {
          // Handle individual questions (original logic)
          return (
            <div className="space-y-4">
              {group.instruction && <p className="text-sm text-black font-bold">{group.instruction}</p>}
              {group.questions.map((question: Question, questionIndex: number) => {
                const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer || '']
                const text = question.text || ''
                
                // Calculate continuous question number using centralized utility
                const baseQuestionNumber = getQuestionStartingNumber(quiz!, quizState.currentPart, question.id)
                
                // Split text by all possible answers to find blanks
                let parts = [text]
                let blankCounter = 0
                
                correctAnswers.forEach((answer: string) => {
                  if (answer.trim()) {
                    const newParts: string[] = []
                    parts.forEach(part => {
                      if (typeof part === 'string') {
                        const splitParts = part.split(new RegExp(answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'))
                        newParts.push(...splitParts)
                      } else {
                        newParts.push(part)
                      }
                    })
                    parts = newParts
                  }
                })
                
                // Count blanks (number of parts - 1)
                const numberOfBlanks = Math.max(1, correctAnswers.length)
                
                return (
                  <div key={question.id} className="flex flex-wrap items-center gap-1 mb-3">
                    {text.includes('_') ? (
                      // Handle underscore-style blanks
                      text.split(/(_+)/).map((part: string, index: number) => {
                        if (part.match(/^_+$/)) {
                          blankCounter++
                          const questionNumber = numberOfBlanks > 1 ? 
                            `${baseQuestionNumber + blankCounter - 1}` : 
                            baseQuestionNumber.toString()
                          
                          return (
                            <input
                              key={index}
                              type="text"
                              placeholder={questionNumber}
                              value={quizState.answers[`${question.id}_${blankCounter}`] || quizState.answers[question.id] || ''}
                              onChange={(e) => {
                                const answerKey = numberOfBlanks > 1 ? `${question.id}_${blankCounter}` : question.id
                                handleAnswerChange(answerKey, e.target.value)
                              }}
                              className="border border-gray-300 rounded px-2 py-1 mx-1 w-40 text-center inline-block"
                              suppressHydrationWarning
                            />
                          )
                        }
                        return <span key={index}>{part}</span>
                      })
                    ) : (
                      // Handle word replacement style (legacy support)
                      parts.map((part: string, index: number) => (
                        <span key={index} className="inline-flex items-center">
                          <span>{part}</span>
                          {index < parts.length - 1 && (
                            <input
                              type="text"
                              placeholder={baseQuestionNumber.toString()}
                              value={quizState.answers[question.id] || ''}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 mx-1 w-40 text-center inline-block"
                              suppressHydrationWarning
                            />
                          )}
                        </span>
                      ))
                    )}
                  </div>
                )
              })}
            </div>
          )
        }

      case 'PARAGRAPH_MATCHING_TABLE':
        // All paragraph matching questions in one table
        const firstQuestion = group.questions[0]
        // Dynamic grid calculation: first column for questions, remaining columns for options
        const optionCount = firstQuestion.paragraphLabels?.length || 0
        const gridTemplate = optionCount > 0 ? `2fr ${Array(optionCount).fill('1fr').join(' ')}` : '1fr'
        
        return (
          <div className="space-y-4">
            {group.instruction && <p className="text-sm text-gray-600 mb-4">{group.instruction}</p>}
            <div className="border border-gray-200 rounded overflow-hidden">
              {/* Table Header */}
              <div className="grid bg-blue-500 text-white" style={{gridTemplateColumns: gridTemplate}}>
                <div className="p-3 font-medium border-r border-blue-400">Questions</div>
                {firstQuestion.paragraphLabels?.map((label: string) => (
                  <div key={label} className="p-1 flex items-center justify-center font-medium text-xs border-r border-blue-400 last:border-r-0">
                    {label}
                  </div>
                ))}
              </div>
              
              {/* Table Rows for all questions in the group */}
              {group.questions.map((question: Question, index: number) => {
                // Calculate continuous question number using centralized utility
                const questionNumber = getQuestionStartingNumber(quiz!, quizState.currentPart, question.id)
                
                return (
                <div key={question.id} id={`question-${question.id}`} className={`grid ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`} style={{gridTemplateColumns: gridTemplate}}>
                  <div className="p-3 border-r border-gray-200 text-sm">
                    <span className="font-medium">{questionNumber}.</span> {question.text}
                  </div>
                  {question.paragraphLabels?.map((label: string) => (
                    <div key={label} className="p-1 flex items-center justify-center border-r border-gray-200 last:border-r-0">
                      <input
                        type="radio"
                        name={question.id}
                        value={label}
                        checked={quizState.answers[question.id] === label}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4"
                        suppressHydrationWarning
                      />
                    </div>
                  ))}
                </div>
                )
              })}
            </div>
          </div>
        )

      case 'DRAG_AND_DROP':
        // Calculate starting question number for this part
        let startingQuestionNumber = 1
        for (let i = 0; i < quiz!.parts.length; i++) {
          const part = quiz!.parts[i]
          if (part.partNumber === quizState.currentPart) {
            break
          } else {
            // Count all questions in previous parts
            part.questions.forEach(q => {
              if (q.type === 'TABLE_COMPLETION') {
                const tableData = q.tableData
                if (tableData?.rows) {
                  tableData.rows.forEach((row: any) => {
                    startingQuestionNumber += Object.keys(row.answers || {}).length
                  })
                }
              } else if (q.type === 'MATCHING_TABLE') {
                const tableData = q.tableData
                if (tableData?.rows) {
                  startingQuestionNumber += tableData.rows.length
                }
              } else if (q.type === 'MULTIPLE_SELECT') {
                startingQuestionNumber += q.options?.length || q.maxSelections || 1
              } else {
                startingQuestionNumber += 1
              }
            })
          }
        }

        return (
          <DragDropQuestion
            questions={group.questions}
            answers={quizState.answers}
            onAnswerChange={handleAnswerChange}
            isClient={isClient}
            currentPartData={currentPartData!}
            allPartQuestions={currentPartData!.questions}
            startingQuestionNumber={startingQuestionNumber}
          />
        )

      default:
        return <div>Unsupported question type: {group.type}</div>
    }
  }

  if (!currentPartData) {
    return <div>Part not found</div>
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <QuizHeader
        quiz={quiz}
        currentPart={quizState.currentPart}
        answers={quizState.answers}
        onSubmit={handleSubmit}
        isSubmitting={false}
        overallTimeLeft={quizState.overallTimeRemaining}
      />

      {/* Main Content - 2 column layout with resizable panels */}
      <main className="flex-1 min-h-0">
        <ResizablePanel>
          {/* Left Side - Reading Passage for Current Part */}
          <div className="h-full overflow-y-auto p-6">
            <QuizContentWithSelection 
              containerId={`reading-passage-part-${quizState.currentPart}`}
              className="prose prose-sm max-w-none"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">{currentPartData.content.title}</h2>
                  {currentPartData.content.subtitle && (
                    <p className="text-gray-600 italic">{currentPartData.content.subtitle}</p>
                  )}
                </div>
                
                {currentPartData.content.paragraphs?.map((paragraph: Paragraph) => (
                  <div key={paragraph.label} className="mb-4">
                    <p className="text-black leading-relaxed">
                      {/* Only show label if there are multiple paragraphs */}
                      {currentPartData.content.paragraphs && currentPartData.content.paragraphs.length > 1 && (
                        <span className="font-bold text-xl text-black bg-white mr-1">{paragraph.label}</span>
                      )}
                      {paragraph.text}
                    </p>
                  </div>
                ))}
              </div>
            </QuizContentWithSelection>
          </div>

          {/* Right Side - Questions for Current Part */}
          <div className="h-full overflow-y-auto p-6">
            <QuizContentWithSelection 
              containerId={`quiz-questions-part-${quizState.currentPart}`}
              className="space-y-8"
            >
              {questionGroups.map((group) => {
                // Create a group ID for scrolling (use the first question's ID)
                const groupId = group.questions[0].id
                
                // Calculate continuous question numbers for this group using centralized utility
                const startNumber = getQuestionStartingNumber(quiz!, quizState.currentPart, group.questions[0].id)
                const endNumber = startNumber + group.questions.length - 1
                
                const groupTitle = group.questions.length > 1 
                  ? `Questions ${startNumber}-${endNumber} (${group.type.replace(/_/g, ' ')})`
                  : `Question ${startNumber} (${group.type.replace(/_/g, ' ')})`
                
                return (
                  <div 
                    key={groupId} 
                    id={`question-${groupId}`}
                    className="border-b border-gray-100 pb-6 last:border-b-0"
                  >
                    <div className="mb-4">
                      <span className="text-sm font-bold text-600 bg-gray-100 px-2 py-1 rounded">
                        {groupTitle}
                      </span>
                    </div>
                    {renderQuestionGroup(group)}
                  </div>
                )
              })}
            </QuizContentWithSelection>
          </div>
        </ResizablePanel>
      </main>

      {/* Footer */}
      <QuizFooter
        quiz={quiz}
        answers={quizState.answers}
        currentPart={quizState.currentPart}
        onPartChange={handlePartChange}
        onQuestionClick={handleQuestionClick}
      />
    </div>
  )
}