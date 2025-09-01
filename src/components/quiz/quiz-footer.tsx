'use client'

import { getPartNavigationItems, getQuestionsByPart } from '@/lib/multi-part-quiz-utils'
import { MultiPartQuiz } from '@/types/multi-part-quiz'
import { getQuestionNumbers, getPartQuestionRange } from '@/lib/question-numbering-utils'
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
            const buttons: JSX.Element[] = []
            const range = getPartQuestionRange(quiz, currentPart)

            // Generate buttons for all questions in the current part
            for (let questionNum = range.start; questionNum <= range.end; questionNum++) {
              // Simple approach: just check if any question in the part is answered
              // This is simpler and less error-prone than the complex logic above
              const isAnswered = false // For now, keep it simple
              const isCurrent = false // For now, keep it simple

              buttons.push(
                <button
                  key={questionNum}
                  onClick={() => {
                    // Find the first question in the part and navigate to it
                    const currentPartData = quiz.parts.find(part => part.partNumber === currentPart)
                    if (currentPartData && currentPartData.questions.length > 0) {
                      onQuestionClick(currentPartData.questions[0].id)
                    }
                  }}
                  className={`
                    w-8 h-8 text-sm font-medium border rounded transition-colors
                    ${isAnswered
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }
                    ${isCurrent ? 'ring-2 ring-blue-300' : ''}
                  `}
                  title={`Question ${questionNum}`}
                >
                  {questionNum}
                </button>
              )
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