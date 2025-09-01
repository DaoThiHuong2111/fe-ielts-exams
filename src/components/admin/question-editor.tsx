'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, Copy } from 'lucide-react'
import { Question, QuestionOption } from '@/types/multi-part-quiz'

interface QuestionEditorProps {
  question: Question
  questionIndex: number
  partIndex: number
  testType: string
  availableQuestionTypes: Array<{
    value: string
    label: string
    forReading: boolean
    forListening: boolean
  }>
  onUpdateQuestion: (partIndex: number, questionIndex: number, updates: Partial<Question>) => void
  onDeleteQuestion: (partIndex: number, questionIndex: number) => void
  onDuplicateQuestion: (partIndex: number, questionIndex: number) => void
}

export function QuestionEditor({
  question,
  questionIndex,
  partIndex,
  testType,
  availableQuestionTypes,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion
}: QuestionEditorProps) {

  const updateOption = (optionIndex: number, updates: Partial<QuestionOption>) => {
    if (!question.options) return
    
    const updatedOptions = [...question.options]
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], ...updates }
    onUpdateQuestion(partIndex, questionIndex, { options: updatedOptions })
  }

  const addOption = () => {
    const currentOptions = question.options || []
    const optionIds = ['a', 'b', 'c', 'd', 'e', 'f']
    const newOptionId = optionIds[currentOptions.length] || `option_${currentOptions.length + 1}`
    
    const newOption: QuestionOption = {
      id: newOptionId,
      text: `Lựa chọn ${newOptionId.toUpperCase()}`
    }
    
    onUpdateQuestion(partIndex, questionIndex, {
      options: [...currentOptions, newOption]
    })
  }

  const deleteOption = (optionIndex: number) => {
    if (!question.options || question.options.length <= 2) return
    
    const updatedOptions = question.options.filter((_, index) => index !== optionIndex)
    onUpdateQuestion(partIndex, questionIndex, { options: updatedOptions })
  }

  const renderQuestionTypeSpecificFields = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE_NOTGIVEN':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Lựa chọn</Label>
              {question.type === 'MULTIPLE_CHOICE' && (
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm lựa chọn
                </Button>
              )}
            </div>
            
            {question.options?.map((option, optionIndex) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Input
                  value={option.id}
                  onChange={(e) => updateOption(optionIndex, { id: e.target.value })}
                  className="w-16"
                  placeholder="ID"
                />
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(optionIndex, { text: e.target.value })}
                  placeholder="Nội dung lựa chọn"
                  className="flex-1"
                />
                {question.type === 'MULTIPLE_CHOICE' && (question.options?.length || 0) > 2 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteOption(optionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <div>
              <Label htmlFor={`correct-answer-${partIndex}-${questionIndex}`}>Đáp án đúng</Label>
              <Select
                value={question.correctAnswer || ''}
                onValueChange={(value) => onUpdateQuestion(partIndex, questionIndex, { correctAnswer: value })}
              >
                <SelectTrigger id={`correct-answer-${partIndex}-${questionIndex}`}>
                  <SelectValue placeholder="Chọn đáp án đúng" />
                </SelectTrigger>
                <SelectContent>
                  {question.options?.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.id.toUpperCase()}: {option.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'SENTENCE_COMPLETION':
        return (
          <div>
            <Label htmlFor={`correct-answer-${partIndex}-${questionIndex}`}>Đáp án đúng</Label>
            <Input
              id={`correct-answer-${partIndex}-${questionIndex}`}
              value={question.correctAnswer || ''}
              onChange={(e) => onUpdateQuestion(partIndex, questionIndex, { correctAnswer: e.target.value })}
              placeholder="Nhập đáp án đúng"
            />
          </div>
        )

      case 'PARAGRAPH_MATCHING_TABLE':
        return (
          <div className="space-y-4">
            <div>
              <Label>Bảng dữ liệu (JSON)</Label>
              <Textarea
                value={JSON.stringify(question.tableData || [], null, 2)}
                onChange={(e) => {
                  try {
                    const tableData = JSON.parse(e.target.value)
                    onUpdateQuestion(partIndex, questionIndex, { tableData })
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder="Nhập dữ liệu bảng dạng JSON"
                rows={8}
              />
            </div>
            <div>
              <Label htmlFor={`correct-answer-${partIndex}-${questionIndex}`}>Đáp án đúng</Label>
              <Input
                id={`correct-answer-${partIndex}-${questionIndex}`}
                value={question.correctAnswer || ''}
                onChange={(e) => onUpdateQuestion(partIndex, questionIndex, { correctAnswer: e.target.value })}
                placeholder="Nhập đáp án đúng"
              />
            </div>
          </div>
        )

      default:
        return (
          <div>
            <Label htmlFor={`correct-answer-${partIndex}-${questionIndex}`}>Đáp án đúng</Label>
            <Input
              id={`correct-answer-${partIndex}-${questionIndex}`}
              value={question.correctAnswer || ''}
              onChange={(e) => onUpdateQuestion(partIndex, questionIndex, { correctAnswer: e.target.value })}
              placeholder="Nhập đáp án đúng"
            />
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Câu hỏi {questionIndex + 1}: {question.id}
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDuplicateQuestion(partIndex, questionIndex)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Sao chép
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDeleteQuestion(partIndex, questionIndex)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Question Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`question-id-${partIndex}-${questionIndex}`}>ID câu hỏi</Label>
            <Input
              id={`question-id-${partIndex}-${questionIndex}`}
              value={question.id}
              onChange={(e) => onUpdateQuestion(partIndex, questionIndex, { id: e.target.value })}
              placeholder="p1q1"
            />
          </div>
          <div>
            <Label htmlFor={`question-type-${partIndex}-${questionIndex}`}>Loại câu hỏi</Label>
            <Select
              value={question.type}
              onValueChange={(value) => onUpdateQuestion(partIndex, questionIndex, { type: value })}
            >
              <SelectTrigger id={`question-type-${partIndex}-${questionIndex}`}>
                <SelectValue placeholder="Chọn loại câu hỏi" />
              </SelectTrigger>
              <SelectContent>
                {availableQuestionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Question Prompt */}
        <div>
          <Label htmlFor={`question-prompt-${partIndex}-${questionIndex}`}>Câu hỏi</Label>
          <Textarea
            id={`question-prompt-${partIndex}-${questionIndex}`}
            value={question.prompt}
            onChange={(e) => onUpdateQuestion(partIndex, questionIndex, { prompt: e.target.value })}
            placeholder="Nhập nội dung câu hỏi..."
            rows={3}
          />
        </div>

        {/* Type-specific fields */}
        {renderQuestionTypeSpecificFields()}
      </CardContent>
    </Card>
  )
}