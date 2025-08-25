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
            Questions {currentPartItem?.questionRange.start}-{currentPartItem?.questionRange.end}
          </span>
        </div>
        
        {/* Question Numbers for Current Part */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentPartQuestions.map((question) => {
            const isAnswered = answeredQuestionsInCurrentPart.has(question.id)
            const isCurrent = currentQuestionId === question.id
            
            // For drag and drop questions in part 4, show 32-35 instead of 1-4
            const displayNumber = currentPart === 4 && question.type === 'DRAG_AND_DROP' 
              ? question.partQuestionNumber + 31 
              : question.partQuestionNumber
            
            return (
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
                title={`Question ${displayNumber}`}
              >
                {displayNumber}
              </button>
            )
          })}
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

// Legacy QuizFooter for backward compatibility with single-part quizzes
interface LegacyQuestion {
  id: string
  questionNumber: number
  type: string
}

interface LegacyQuizFooterProps {
  questions: LegacyQuestion[]
  answeredQuestions: Set<string>
  currentQuestionId?: string
  onQuestionClick: (questionId: string) => void
}

export function LegacyQuizFooter({
  questions,
  answeredQuestions,
  currentQuestionId,
  onQuestionClick
}: LegacyQuizFooterProps) {
  return (
    <footer className="bg-white border-t px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Part 1</span>
        
        {questions.map((question) => {
          const isAnswered = answeredQuestions.has(question.id)
          const isCurrent = currentQuestionId === question.id
          
          return (
            <button
              key={question.id}
              onClick={() => onQuestionClick(question.id)}
              className={`
                w-8 h-8 text-sm font-medium border rounded
                ${isAnswered 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }
                ${isCurrent ? 'ring-2 ring-blue-300' : ''}
              `}
            >
              {question.questionNumber}
            </button>
          )
        })}
        
        <div className="ml-4 text-sm text-gray-500">
          {answeredQuestions.size}/{questions.length}
        </div>
      </div>
    </footer>
  )
}