'use client'

import { QuizContentWithSelection } from '@/components/quiz'
import QuizFooter from '@/components/quiz/quiz-footer'
import QuizHeader from '@/components/quiz/quiz-header'
import {
  getAllAnsweredQuestions,
  getPartByNumber,
  getQuestionsByPart,
  initializeMultiPartQuizState
} from '@/lib/multi-part-quiz-utils'
import { getQuestionStartingNumber } from '@/lib/question-numbering-utils'
import { 
  initializeQuizStorage, 
  getListeningQuizFromStorage 
} from '@/lib/quiz-storage-utils'
import { MultiPartQuiz, MultiPartQuizState, Question, QuestionOption } from '@/types/multi-part-quiz'
import { use, useEffect, useState } from 'react'

interface ListeningQuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ListeningQuizDetailPage({ params }: ListeningQuizDetailPageProps) {
  use(params)
  
  // State management
  const [isClient, setIsClient] = useState(false)
  const [quiz, setQuiz] = useState<MultiPartQuiz | null>(null)
  const [quizState, setQuizState] = useState<MultiPartQuizState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Initialize quiz data and state
  useEffect(() => {
    setIsClient(true)
    
    // Initialize localStorage with quiz data
    initializeQuizStorage()
    
    // Load quiz data from localStorage
    const quizData = getListeningQuizFromStorage()
    
    if (quizData) {
      setQuiz(quizData)
      setQuizState(initializeMultiPartQuizState(quizData))
    }
  }, [])

  // Timer effect
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

  const handleMultiSelectChange = (questionId: string, optionId: string, checked: boolean) => {
    if (!quizState) return
    
    setQuizState(prev => {
      const currentAnswers = prev!.answers[questionId]?.split(',').filter(Boolean) || []
      let newAnswers: string[]
      
      if (checked) {
        newAnswers = [...currentAnswers, optionId]
      } else {
        newAnswers = currentAnswers.filter(id => id !== optionId)
      }
      
      return {
        ...prev!,
        answers: {
          ...prev!.answers,
          [questionId]: newAnswers.join(',')
        }
      }
    })
  }

  const handlePartChange = (partNumber: number) => {
    if (!quizState) return
    
    setQuizState(prev => ({
      ...prev!,
      currentPart: partNumber
    }))
  }

  const handleQuestionClick = (questionId: string) => {
    if (!quiz) return
    
    for (const part of quiz.parts) {
      if (part.questions.some(q => q.id === questionId)) {
        if (quizState?.currentPart !== part.partNumber) {
          handlePartChange(part.partNumber)
        }
        
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

  const handlePlayAudio = () => {
    const audio = document.getElementById(`audio-section-${quizState?.currentPart}`) as HTMLAudioElement
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (time: number) => {
    const audio = document.getElementById(`audio-section-${quizState?.currentPart}`) as HTMLAudioElement
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  // Question rendering functions
  const renderTableCompletionQuestion = (question: Question, startingNumber: number = 1) => {
    const tableData = question.tableData
    if (!tableData) return null

    let currentNumber = startingNumber

    return (
      <div className="space-y-4">
        <p className="text-sm text-black font-bold">{question.text}</p>
        <div className="border border-gray-200 rounded overflow-hidden">
          {/* Table Header */}
          <div className="grid bg-blue-500 text-white" style={{gridTemplateColumns: `repeat(${tableData.headers.length}, 1fr)`}}>
            {tableData.headers.map((header: string, index: number) => (
              <div key={index} className="p-3 font-medium border-r border-blue-400 last:border-r-0 text-center">
                {header}
              </div>
            ))}
          </div>
          
          {/* Table Rows */}
          {tableData.rows.map((row: any, rowIndex: number) => (
            <div key={rowIndex} className={`grid ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`} style={{gridTemplateColumns: `repeat(${tableData.headers.length}, 1fr)`}}>
              {row.cells.map((cell: string, cellIndex: number) => {
                // Check if there are answers for this row that should be replaced in this cell
                const answersInCell = Object.entries(row.answers || {}).filter(([questionId, answer]) => {
                  return cell.includes(answer as string)
                })
                
                if (answersInCell.length > 0) {
                  // Process the cell text to replace answers with input placeholders
                  let processedCell = cell
                  
                  answersInCell.forEach(([questionId, answer]) => {
                    const answerStr = answer as string
                    const regex = new RegExp(answerStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
                    processedCell = processedCell.replace(regex, `__INPUT_${currentNumber}__`)
                    currentNumber++
                  })
                  
                  // Split by input placeholders and render
                  const parts = processedCell.split(/(__INPUT_\d+__)/g)
                  
                  return (
                    <div key={cellIndex} className="p-3 border-r border-gray-200 last:border-r-0 text-sm flex flex-wrap items-center gap-1">
                      {parts.map((part: string, partIndex: number) => {
                        const inputMatch = part.match(/__INPUT_(\d+)__/)
                        if (inputMatch) {
                          const displayNumber = inputMatch[1]
                          const questionId = Object.keys(row.answers || {}).find(key => 
                            cell.includes(row.answers[key])
                          ) || displayNumber
                          return (
                            <input
                              key={partIndex}
                              type="text"
                              placeholder={displayNumber}
                              value={quizState.answers[`l1q${questionId}`] || ''}
                              onChange={(e) => handleAnswerChange(`l1q${questionId}`, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 w-16 text-center inline-block"
                              suppressHydrationWarning
                            />
                          )
                        }
                        return part && <span key={partIndex}>{part}</span>
                      })}
                    </div>
                  )
                }
                
                return (
                  <div key={cellIndex} className="p-3 border-r border-gray-200 last:border-r-0 text-sm">
                    {cell}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }


  const renderMultipleChoiceQuestion = (question: Question) => {
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
  }

  const renderMultipleSelectQuestion = (question: Question) => {
    const selectedAnswers = quizState.answers[question.id]?.split(',').filter(Boolean) || []
    
    return (
      <div className="space-y-4">
        <p className="text-sm text-black font-bold">{question.instruction}</p>
        <p className="font-medium">{question.prompt}</p>
        <div className="space-y-2">
          {question.options?.map((option: QuestionOption) => (
            <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                value={option.id}
                checked={selectedAnswers.includes(option.id)}
                onChange={(e) => handleMultiSelectChange(question.id, option.id, e.target.checked)}
                className="w-4 h-4"
                disabled={!selectedAnswers.includes(option.id) && selectedAnswers.length >= (question.maxSelections || question.options?.length || 0)}
                suppressHydrationWarning
              />
              <span className="text-sm">{option.text}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  const renderMatchingTableQuestion = (question: Question) => {
    const tableData = question.tableData
    if (!tableData) return null

    return (
      <div className="space-y-4">
        <p className="text-sm text-black font-bold">{question.instruction}</p>
        <p className="font-medium">{question.prompt}</p>
        
        {/* Options explanation */}
        <div className="bg-gray-50 p-4 rounded">
          {Object.entries(tableData.options || {}).map(([key, value]) => (
            <div key={key} className="text-sm mb-1">
              <span className="font-medium">{key}.</span> {value}
            </div>
          ))}
        </div>

        {/* Matching table */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <div className="grid bg-blue-500 text-white" style={{gridTemplateColumns: `repeat(${tableData.headers.length}, 1fr)`}}>
            {tableData.headers.map((header: string, index: number) => (
              <div key={index} className="p-3 font-medium border-r border-blue-400 last:border-r-0 text-center">
                {header}
              </div>
            ))}
          </div>
          
          {tableData.rows.map((row: any, rowIndex: number) => (
            <div key={rowIndex} className={`grid ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`} style={{gridTemplateColumns: `repeat(${tableData.headers.length}, 1fr)`}}>
              <div className="p-3 border-r border-gray-200 text-sm">
                {row.label}
              </div>
              {Object.keys(tableData.options || {}).map((option) => (
                <div key={option} className="p-3 flex items-center justify-center border-r border-gray-200 last:border-r-0">
                  <input
                    type="radio"
                    name={row.questionId}
                    value={option}
                    checked={quizState.answers[row.questionId] === option}
                    onChange={(e) => handleAnswerChange(row.questionId, e.target.value)}
                    className="w-4 h-4"
                    suppressHydrationWarning
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderQuestion = (question: Question, questionNumber: number = 1) => {
    switch (question.type) {
      case 'TABLE_COMPLETION':
        return renderTableCompletionQuestion(question, questionNumber)
      case 'MULTIPLE_CHOICE':
        return renderMultipleChoiceQuestion(question)
      case 'MULTIPLE_SELECT':
        return renderMultipleSelectQuestion(question)
      case 'MATCHING_TABLE':
        return renderMatchingTableQuestion(question)
      case 'SENTENCE_COMPLETION':
        const correctAnswer = question.correctAnswer || ''
        const text = question.text || ''
        const parts = text.split(new RegExp(correctAnswer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))
        
        return (
          <div className="space-y-4">
            {question.instruction && <p className="text-sm text-black font-bold">{question.instruction}</p>}
            <div className="flex flex-wrap items-center gap-1 mb-3">
              {parts.map((part: string, index: number) => (
                <span key={index} className="inline-flex items-center">
                  <span>{part}</span>
                  {index < parts.length - 1 && (
                    <input
                      type="text"
                      placeholder={questionNumber.toString()}
                      value={quizState.answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 mx-1 w-40 text-center inline-block"
                      suppressHydrationWarning
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        )
      default:
        return <div>Unsupported question type: {question.type}</div>
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

      {/* Main Content - Full screen layout for listening */}
      <main className="flex-1 min-h-0 bg-white">
        <div className="h-full overflow-y-auto p-6 bg-white">
          <QuizContentWithSelection 
            containerId={`listening-quiz-part-${quizState.currentPart}`}
            className="space-y-6"
          >
            {/* Audio Player Section - Left aligned */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={handlePlayAudio}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-600">{formatTime(duration)}</span>
              </div>
              
              <audio
                id={`audio-section-${quizState.currentPart}`}
                src={currentPartData.content.audioUrl}
                onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
                onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            {/* Section Title */}
            <h2 className="text-xl font-bold">{currentPartData.content.title}</h2>

            {/* Questions Section */}
            <div className="space-y-6">
              {(() => {
                return currentPartQuestions.map((question: Question, questionIndex: number) => {
                  // Calculate continuous question number using centralized utility
                  const currentQuestionNumber = getQuestionStartingNumber(quiz!, quizState.currentPart, question.id)

                  
                  return (
                    <div 
                      key={question.id} 
                      id={`question-${question.id}`}
                    >
                      {renderQuestion(question, currentQuestionNumber)}
                    </div>
                  )
                })
              })()}
            </div>
          </QuizContentWithSelection>
        </div>
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