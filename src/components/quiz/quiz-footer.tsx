'use client'

import { getPartNavigationItems, getQuestionsByPart } from '@/lib/multi-part-quiz-utils'
import { MultiPartQuiz } from '@/types/multi-part-quiz'
import { CompactPartSelector, PartNavigationItem } from './part-navigation'

interface QuizFooterProps {
  quiz: MultiPartQuiz
  answers: Record<string, string>
  currentPart: number
  currentQuestionId?: string
  onPartChange: (partNumber: number) => void
  onQuestionClick: (questionId: string) => void
}

export default function QuizFooter({
  quiz,
  answers,
  currentPart,
  currentQuestionId,
  onPartChange,
  onQuestionClick
}: QuizFooterProps) {
  const navigationItems = getPartNavigationItems(quiz, answers, currentPart)
  const currentPartQuestions = getQuestionsByPart(quiz, currentPart)
  const currentPartItem = navigationItems.find(item => item.isActive)
  
  // Get answered questions for current part only
  const answeredQuestionsInCurrentPart = new Set(
    currentPartQuestions
      .filter(q => answers[q.id] && answers[q.id].trim() !== '')
      .map(q => q.id)
  )

  return (
    <footer className="bg-white border-t px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        {/* Part Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 mr-2">Parts:</span>
          {navigationItems.map((item) => (
            <PartNavigationItem
              key={item.partNumber}
              item={item}
              onPartChange={onPartChange}
            />
          ))}
        </div>
        
        {/* Part Navigation - Mobile */}
        <div className="lg:hidden">
          <CompactPartSelector
            quiz={quiz}
            answers={answers}
            currentPart={currentPart}
            onPartChange={onPartChange}
          />
        </div>
        
        {/* Current Part Info */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            {currentPartItem?.title || `Part ${currentPart}`}:
          </span>
          <span className="text-sm text-gray-500">
{currentPartItem?.questionRange ? `Questions ${currentPartItem.questionRange.start}-${currentPartItem.questionRange.end}` : `Section ${currentPart}`}
          </span>
        </div>
        
        {/* Question Numbers for Current Part */}
        <div className="flex items-center gap-2 flex-wrap">
          {(() => {
            // Calculate the starting question number for this part based on JSON structure
            let questionNumber = 1

            // Count all questions in previous parts to get the correct starting number
            for (let i = 0; i < quiz.parts.length; i++) {
              const part = quiz.parts[i]
              if (part.partNumber === currentPart) {
                break
              }
              // Count questions in previous parts based on JSON structure
              part.questions.forEach(question => {
                if (question.type === 'TABLE_COMPLETION') {
                  const tableData = question.tableData
                  if (tableData?.rows) {
                    tableData.rows.forEach((row: any) => {
                      const answersCount = Object.keys(row.answers || {}).length
                      questionNumber += answersCount
                    })
                  }
                } else if (question.type === 'MATCHING_TABLE') {
                  const tableData = question.tableData
                  if (tableData?.rows) {
                    questionNumber += tableData.rows.length
                  }
                } else if (question.type === 'MULTIPLE_SELECT') {
                  // For MULTIPLE_SELECT in listening, each option counts as a separate question
                  questionNumber += question.options?.length || question.maxSelections || 1
                } else {
                  // Regular questions (MULTIPLE_CHOICE, SENTENCE_COMPLETION, etc.)
                  questionNumber += 1
                }
              })
            }
            const buttons: JSX.Element[] = []
            
            // Create buttons for questions in current part based on JSON structure
            const currentPartData = quiz.parts.find(part => part.partNumber === currentPart)
            if (currentPartData) {
              currentPartData.questions.forEach((question: any) => {
                const isCurrent = currentQuestionId === question.id

                if (question.type === 'TABLE_COMPLETION') {
                  const tableData = question.tableData
                  if (tableData?.rows) {
                    tableData.rows.forEach((row: any) => {
                      Object.keys(row.answers || {}).forEach((answerKey) => {
                        const questionId = `l${currentPart}q${answerKey}`
                        const isAnswered = answers[questionId] && answers[questionId].trim() !== ''

                        buttons.push(
                          <button
                            key={`${question.id}-${answerKey}`}
                            onClick={() => onQuestionClick(question.id)}
                            className={`
                              w-8 h-8 text-sm font-medium border rounded transition-colors
                              ${isAnswered
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }
                              ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                            `}
                            title={`Question ${questionNumber}`}
                          >
                            {questionNumber}
                          </button>
                        )
                        questionNumber++
                      })
                    })
                  }
                } else if (question.type === 'MATCHING_TABLE') {
                  const tableData = question.tableData
                  if (tableData?.rows) {
                    tableData.rows.forEach((row: any) => {
                      const questionId = row.questionId
                      const isAnswered = answers[questionId] && answers[questionId].trim() !== ''

                      buttons.push(
                        <button
                          key={questionId}
                          onClick={() => onQuestionClick(question.id)}
                          className={`
                            w-8 h-8 text-sm font-medium border rounded transition-colors
                            ${isAnswered
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }
                            ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                          `}
                          title={`Question ${questionNumber}`}
                        >
                          {questionNumber}
                        </button>
                      )
                      questionNumber++
                    })
                  }
                } else if (question.type === 'MULTIPLE_SELECT') {
                  // MULTIPLE_SELECT: each option counts as a separate question
                  const optionCount = question.options?.length || question.maxSelections || 1
                  for (let i = 0; i < optionCount; i++) {
                    const isAnswered = answers[question.id] && answers[question.id].split(',').length > i

                    buttons.push(
                      <button
                        key={`${question.id}_${i}`}
                        onClick={() => onQuestionClick(question.id)}
                        className={`
                          w-8 h-8 text-sm font-medium border rounded transition-colors
                          ${isAnswered
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                          }
                          ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                        `}
                        title={`Question ${questionNumber}`}
                      >
                        {questionNumber}
                      </button>
                    )
                    questionNumber++
                  }
                } else {
                  // Regular question types (MULTIPLE_CHOICE, SENTENCE_COMPLETION, etc.)
                  const isAnswered = answers[question.id] && answers[question.id].trim() !== ''

                  buttons.push(
                    <button
                      key={question.id}
                      onClick={() => onQuestionClick(question.id)}
                      className={`
                        w-8 h-8 text-sm font-medium border rounded transition-colors
                        ${isAnswered
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }
                        ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                      `}
                      title={`Question ${questionNumber}`}
                    >
                      {questionNumber}
                    </button>
                  )
                  questionNumber++
                }
              })
            }
            
            return buttons
          })()}
        </div>
        
        {/* Progress Summary */}
        <div className="flex items-center gap-4 ml-auto text-sm text-gray-500">
          <span>
            Current Part: {answeredQuestionsInCurrentPart.size}/{currentPartQuestions.length}
          </span>
          <span className="hidden md:inline">
            Overall: {navigationItems.reduce((acc, item) => acc + item.answeredCount, 0)}/
            {navigationItems.reduce((acc, item) => acc + item.totalCount, 0)}
          </span>
        </div>
      </div>
    </footer>
  )
}