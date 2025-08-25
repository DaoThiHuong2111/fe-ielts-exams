'use client'

import { QuizContentWithSelection } from '@/components/quiz'
import { DragDropQuestion } from '@/components/quiz/drag-drop-question'
import QuizFooter from '@/components/quiz/quiz-footer'
import QuizHeader from '@/components/quiz/quiz-header'
import {
  getAllAnsweredQuestions,
  getPartByNumber,
  getQuestionsByPart,
  initializeMultiPartQuizState,
  normalizeQuizData
} from '@/lib/multi-part-quiz-utils'
import { MultiPartQuiz, MultiPartQuizState, isMultiPartQuiz } from '@/types/multi-part-quiz'
import { use, useLayoutEffect, useState } from 'react'
import multiPartQuizData from '../../../data/multi-part-quiz.json'
import singlePartQuizData from '../../../data/quiz.json'

interface ReadingQuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReadingQuizDetailPage({ params }: ReadingQuizDetailPageProps) {
  use(params) // Use params to avoid unused variable warning
  
  // State management
  const [isClient, setIsClient] = useState(false)
  const [quiz, setQuiz] = useState<MultiPartQuiz | null>(null)
  const [quizState, setQuizState] = useState<MultiPartQuizState | null>(null)

  // Initialize quiz data and state
  useLayoutEffect(() => {
    setIsClient(true)
    
    // For demo, we'll try to load multi-part data first, fallback to single-part
    let quizData: MultiPartQuiz
    try {
      // Try loading multi-part quiz
      if (isMultiPartQuiz(multiPartQuizData)) {
        quizData = multiPartQuizData as MultiPartQuiz
      } else {
        // Fallback to converting single-part quiz
        quizData = normalizeQuizData(singlePartQuizData)
      }
    } catch {
      // Final fallback
      quizData = normalizeQuizData(singlePartQuizData)
    }
    
    setQuiz(quizData)
    setQuizState(initializeMultiPartQuizState(quizData))
  }, [])

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
  const groupConsecutiveQuestions = (questions: any[]) => {
    const groups: any[] = []
    let currentGroup: any = null
    
    questions.forEach(question => {
      if (!currentGroup || currentGroup.type !== question.type) {
        currentGroup = {
          type: question.type,
          questions: [question],
          startNumber: question.partQuestionNumber,
          endNumber: question.partQuestionNumber,
          instruction: question.instruction
        }
        groups.push(currentGroup)
      } else {
        currentGroup.questions.push(question)
        currentGroup.endNumber = question.partQuestionNumber
      }
    })
    
    return groups
  }

  const questionGroups = groupConsecutiveQuestions(currentPartQuestions)

  const renderQuestionGroup = (group: any) => {
    switch (group.type) {
      case 'MULTIPLE_CHOICE':
        // Multiple choice questions are rendered individually since each has different prompts
        const question = group.questions[0]
        return (
          <div className="space-y-3">
            <p className="font-medium">{question.prompt}</p>
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      {isClient ? (
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={quizState.answers[question.id] === option.id}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded" />
                  )}
                  <span className="text-sm">{option.id.toUpperCase()}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'TRUE_FALSE_NOTGIVEN':
        return (
          <div className="space-y-4">
            {group.instruction && <p className="text-sm text-gray-600">{group.instruction}</p>}
            {group.questions.map((question: any) => (
              <div key={question.id} className="border-l-2 border-gray-200 pl-4">
                <p className="mb-2">{question.text}</p>
                <div className="flex space-x-4">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                    <label key={option} className="flex items-center space-x-1 cursor-pointer">
                        {isClient ? (
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={quizState.answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'SENTENCE_COMPLETION':
        return (
          <div className="space-y-4">
            {group.instruction && <p className="text-sm text-gray-600">{group.instruction}</p>}
            {group.questions.map((question: any) => {
              const parts = question.text.split(/_{2,}/g) // Split by 2 or more underscores
              
              return (
                <div key={question.id} className="flex flex-wrap items-center gap-1 mb-3">
                  {parts.map((part: string, index: number) => (
                    <span key={index} className="inline-flex items-center">
                      <span>{part}</span>
                      {index < parts.length - 1 && (
                        isClient ? (
                          <input
                            type="text"
                            placeholder=""
                            value={quizState.answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 mx-1 w-40 text-center inline-block"
                          />
                        ) : (
                          <div className="border border-gray-300 rounded px-2 py-1 mx-1 w-40 h-8 bg-gray-50 inline-block" />
                        )
                      )}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        )

      case 'PARAGRAPH_MATCHING_TABLE':
        // All paragraph matching questions in one table
        const firstQuestion = group.questions[0]
        // Dynamic grid calculation: questions take 6 parts, options divided equally
        const optionCount = firstQuestion.paragraphLabels.length
        const optionFraction = optionCount > 0 ? (4 / optionCount).toFixed(2) : '1' // 4 parts divided among options
        const gridTemplate = `6fr ${Array(optionCount).fill(`${optionFraction}fr`).join(' ')}`
        
        return (
          <div className="space-y-4">
            {group.instruction && <p className="text-sm text-gray-600 mb-4">{group.instruction}</p>}
            <div className="border border-gray-200 rounded overflow-hidden">
              {/* Table Header */}
              <div className="grid bg-blue-500 text-white" style={{gridTemplateColumns: gridTemplate}}>
                <div className="p-3 font-medium border-r border-blue-400">Questions</div>
                {firstQuestion.paragraphLabels.map((label: string) => (
                  <div key={label} className="p-1 flex items-center justify-center font-medium text-xs border-r border-blue-400 last:border-r-0">
                    {label}
                  </div>
                ))}
              </div>
              
              {/* Table Rows for all questions in the group */}
              {group.questions.map((question: any, index: number) => (
                <div key={question.id} id={`question-${question.id}`} className={`grid ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`} style={{gridTemplateColumns: gridTemplate}}>
                  <div className="p-3 border-r border-gray-200 text-sm">
                    <span className="font-medium">{question.partQuestionNumber}.</span> {question.text}
                  </div>
                  {question.paragraphLabels.map((label: string) => (
                    <div key={label} className="p-1 flex items-center justify-center border-r border-gray-200 last:border-r-0">
                      {isClient ? (
                        <input
                          type="radio"
                          name={question.id}
                          value={label}
                          checked={quizState.answers[question.id] === label}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )

      case 'DRAG_AND_DROP':
        return (
          <DragDropQuestion
            questions={group.questions}
            answers={quizState.answers}
            onAnswerChange={handleAnswerChange}
            isClient={isClient}
            currentPartData={currentPartData}
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

      {/* Main Content - 2 column layout */}
      <main className="flex-1 min-h-0">
        <div className="flex h-full">
          {/* Left Side - Reading Passage for Current Part */}
          <div className="w-1/2 border-r border-gray-200 bg-white h-full">
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
                  
                  {currentPartData.content.paragraphs.map((paragraph: any) => (
                    <div key={paragraph.label} className="mb-4">
                      <p className="text-black leading-relaxed">
                        <span className="font-bold text-xl text-black bg-white mr-1">{paragraph.label}</span>
                        {paragraph.text}
                      </p>
                    </div>
                  ))}
                </div>
              </QuizContentWithSelection>
            </div>
          </div>

          {/* Right Side - Questions for Current Part */}
          <div className="w-1/2 bg-white h-full">
            <div className="h-full overflow-y-auto p-6">
              <QuizContentWithSelection 
                containerId={`quiz-questions-part-${quizState.currentPart}`}
                className="space-y-8"
              >
                {questionGroups.map((group) => {
                  // Create a group ID for scrolling (use the first question's ID)
                  const groupId = group.questions[0].id
                  const groupTitle = group.questions.length > 1 
                    ? `Questions ${group.startNumber}-${group.endNumber} (${group.type.replace(/_/g, ' ')})`
                    : `Question ${group.startNumber} (${group.type.replace(/_/g, ' ')})`
                  
                  return (
                    <div 
                      key={groupId} 
                      id={`question-${groupId}`}
                      className="border-b border-gray-100 pb-6 last:border-b-0"
                    >
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {groupTitle}
                        </span>
                      </div>
                      {renderQuestionGroup(group)}
                    </div>
                  )
                })}
              </QuizContentWithSelection>
            </div>
          </div>
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