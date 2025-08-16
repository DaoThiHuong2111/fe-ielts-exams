'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { QuizOption } from '@/types/quiz'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

export interface MultipleChoiceFormData {
  options: QuizOption[]
  correctAnswers: string[]
  maxSelections: number
}

interface MultipleChoiceFormProps {
  values: MultipleChoiceFormData
  onChange: (field: keyof MultipleChoiceFormData, value: any) => void
}

export function MultipleChoiceForm({ values, onChange }: MultipleChoiceFormProps) {
  // Add new option
  const addOption = () => {
    const nextLabel = String.fromCharCode(65 + values.options.length) // A, B, C, D...
    const newOptions = [...values.options, { id: nextLabel, label: nextLabel, text: '' }]
    onChange('options', newOptions)
  }

  // Remove option
  const removeOption = (id: string) => {
    if (values.options.length <= 2) {
      toast.error('Cần ít nhất 2 lựa chọn')
      return
    }
    const newOptions = values.options.filter(opt => opt.id !== id)
    onChange('options', newOptions)
    
    // Remove from correct answers if it was selected
    const newCorrectAnswers = values.correctAnswers.filter(ans => ans !== id)
    onChange('correctAnswers', newCorrectAnswers)
  }

  // Update option text
  const updateOption = (id: string, text: string) => {
    const newOptions = values.options.map(opt => opt.id === id ? { ...opt, text } : opt)
    onChange('options', newOptions)
  }

  // Toggle correct answer
  const toggleCorrectAnswer = (id: string) => {
    if (values.maxSelections === 1) {
      onChange('correctAnswers', [id])
    } else {
      if (values.correctAnswers.includes(id)) {
        const newCorrectAnswers = values.correctAnswers.filter(ans => ans !== id)
        onChange('correctAnswers', newCorrectAnswers)
      } else {
        if (values.correctAnswers.length < values.maxSelections) {
          const newCorrectAnswers = [...values.correctAnswers, id]
          onChange('correctAnswers', newCorrectAnswers)
        } else {
          toast.error(`Chỉ được chọn tối đa ${values.maxSelections} đáp án đúng`)
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Số đáp án tối đa được chọn</Label>
        <Select 
          value={values.maxSelections.toString()} 
          onValueChange={(v) => onChange('maxSelections', parseInt(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(n => (
              <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Các lựa chọn *</Label>
        {values.options.map((option) => (
          <div key={option.id} className="flex gap-2 items-center">
            <span className="font-medium w-8">{option.label}.</span>
            <Input
              value={option.text}
              onChange={(e) => updateOption(option.id, e.target.value)}
              placeholder={`Lựa chọn ${option.label}`}
              className="flex-1"
            />
            <input
              type="checkbox"
              checked={values.correctAnswers.includes(option.id)}
              onChange={() => toggleCorrectAnswer(option.id)}
              className="w-4 h-4"
            />
            <Label className="text-sm">Đúng</Label>
            {values.options.length > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(option.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm lựa chọn
        </Button>
      </div>
    </div>
  )
}
