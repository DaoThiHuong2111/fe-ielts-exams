'use client'

interface Question {
  id: string
  questionNumber: number
  type: string
}

interface QuizFooterProps {
  questions: Question[]
  answeredQuestions: Set<string>
  currentQuestionId?: string
  onQuestionClick: (questionId: string) => void
}

export default function QuizFooter({
  questions,
  answeredQuestions,
  currentQuestionId,
  onQuestionClick
}: QuizFooterProps) {
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