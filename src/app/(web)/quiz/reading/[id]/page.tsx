'use client'

import { QuizContentWithSelection, QuizLayoutWrapper } from '@/components/quiz'
import { use, useLayoutEffect, useState } from 'react'
import quizData from '../../../data/quiz.json'

interface ReadingQuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ReadingQuizDetailPage({ params }: ReadingQuizDetailPageProps) {
  use(params) // Use params to avoid unused variable warning
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration errors by ensuring client-side only rendering
  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = () => {
    console.log('Submitted answers:', answers)
    alert('Bài thi đã được nộp!')
  }

  // Convert questions to format expected by QuizFooter
  const footerQuestions = quizData.questions.map(q => ({
    id: q.id,
    questionNumber: q.questionNumber,
    type: q.type
  }))

  // Simplified answered questions logic for flat structure
  const getAnsweredQuestions = () => {
    const answered = new Set<string>()
    
    quizData.questions.forEach(question => {
      if (answers[question.id]) {
        answered.add(question.id)
      }
    })
    
    return answered
  }

  const answeredQuestions = getAnsweredQuestions()

  const handleQuestionClick = (questionId: string) => {
    // Find the group that contains this question
    const targetGroup = questionGroups.find(group => 
      group.questions.some((q: any) => q.id === questionId)
    )
    
    if (targetGroup) {
      // Use the first question's ID as the group ID for scrolling
      const groupId = targetGroup.questions[0].id
      const element = document.getElementById(`question-${groupId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Group consecutive questions of the same type for better UI presentation
  const groupConsecutiveQuestions = (questions: any[]) => {
    const groups: any[] = []
    let currentGroup: any = null
    
    questions.forEach(question => {
      if (!currentGroup || currentGroup.type !== question.type) {
        // Start new group
        currentGroup = {
          type: question.type,
          questions: [question],
          startNumber: question.questionNumber,
          endNumber: question.questionNumber,
          instruction: question.instruction // Use first question's instruction
        }
        groups.push(currentGroup)
      } else {
        // Add to existing group
        currentGroup.questions.push(question)
        currentGroup.endNumber = question.questionNumber
      }
    })
    
    return groups
  }

  const questionGroups = groupConsecutiveQuestions(quizData.questions)

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
        return (
          <div className="space-y-4">
            {group.instruction && <p className="text-sm text-gray-600 mb-4">{group.instruction}</p>}
            <div className="border border-gray-200 rounded overflow-hidden">
              {/* Table Header */}
              <div className="grid bg-blue-500 text-white" style={{gridTemplateColumns: '2fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr'}}>
                <div className="p-3 font-medium border-r border-blue-400">Questions</div>
                {firstQuestion.paragraphLabels.map((label: string) => (
                  <div key={label} className="p-1 text-center font-medium text-xs border-r border-blue-400 last:border-r-0">
                    {label}
                  </div>
                ))}
              </div>
              
              {/* Table Rows for all questions in the group */}
              {group.questions.map((question: any, index: number) => (
                <div key={question.id} className={`grid ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`} style={{gridTemplateColumns: '2fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr'}}>
                  <div className="p-3 border-r border-gray-200 text-sm">
                    <span className="font-medium">{question.questionNumber}.</span> {question.text}
                  </div>
                  {question.paragraphLabels.map((label: string) => (
                    <div key={label} className="p-1 text-center border-r border-gray-200 last:border-r-0">
                      {isClient ? (
                        <input
                          type="radio"
                          name={question.id}
                          value={label}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-4 h-4"
                        />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded mx-auto" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Unsupported question type: {group.type}</div>
    }
  }

  return (
    <QuizLayoutWrapper
      title={quizData.title}
      timeLimit={quizData.timeLimit}
      questions={footerQuestions}
      answeredQuestions={answeredQuestions}
      onSubmit={handleSubmit}
      onQuestionClick={handleQuestionClick}
    >
      {/* Main Content - 2 cột scroll riêng biệt */}
      <div className="flex h-full">
        {/* Left Side - Reading Passage */}
        <div className="w-1/2 border-r border-gray-200 bg-white h-full">
          <div className="h-full overflow-y-auto p-6">
            <QuizContentWithSelection 
              containerId="reading-passage"
              className="prose prose-sm max-w-none"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">{quizData.content.title}</h2>
                  <p className="text-gray-600 italic">{quizData.content.subtitle}</p>
                </div>
                
                {quizData.content.paragraphs.map((paragraph: any) => (
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

        {/* Right Side - Questions */}
        <div className="w-1/2 bg-white h-full">
          <div className="h-full overflow-y-auto p-6">
            <QuizContentWithSelection 
              containerId="quiz-questions"
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
    </QuizLayoutWrapper>
  )
}