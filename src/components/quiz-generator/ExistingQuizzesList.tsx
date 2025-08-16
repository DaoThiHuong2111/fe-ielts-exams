'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { QuizData } from '@/types/quiz'
import { Trash2 } from 'lucide-react'

interface ExistingQuizzesListProps {
  quizzes: QuizData[]
  onClearAll: () => void
  onNavigateToDemo: (type: 'multiple-choice' | 'fill-in-blanks') => void
}

export function ExistingQuizzesList({ quizzes, onClearAll, onNavigateToDemo }: ExistingQuizzesListProps) {
  if (quizzes.length === 0) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Câu hỏi đã tạo ({quizzes.length})</CardTitle>
        <CardDescription>
          Các câu hỏi sẽ được hiển thị trong trang demo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{index + 1}. {quiz.title}</span>
                <span className="ml-2 text-sm text-gray-500">
                  ({quiz.type === 'multiple-choice' ? 'Trắc nghiệm' : 'Điền từ'})
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="default"
            onClick={() => onNavigateToDemo('multiple-choice')}
            className="flex-1"
          >
            Xem Demo Trắc Nghiệm
          </Button>
          <Button
            variant="default"
            onClick={() => onNavigateToDemo('fill-in-blanks')}
            className="flex-1"
          >
            Xem Demo Điền Từ
          </Button>
          <Button
            variant="destructive"
            onClick={onClearAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
