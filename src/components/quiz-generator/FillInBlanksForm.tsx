'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { BlankPosition } from '@/types/quiz'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export interface FillInBlanksFormData {
  text: string
  blanks: BlankPosition[]
}

interface FillInBlanksFormProps {
  values: FillInBlanksFormData
  onChange: (field: keyof FillInBlanksFormData, value: any) => void
}

export function FillInBlanksForm({ values, onChange }: FillInBlanksFormProps) {
  // State for new blank form
  const [newBlankStart, setNewBlankStart] = useState('')
  const [newBlankEnd, setNewBlankEnd] = useState('')
  const [newBlankAnswer, setNewBlankAnswer] = useState('')

  // Add blank position
  const addBlank = () => {
    const start = parseInt(newBlankStart)
    const end = parseInt(newBlankEnd)
    
    if (isNaN(start) || isNaN(end)) {
      toast.error('Vị trí phải là số')
      return
    }
    
    if (start >= end) {
      toast.error('Vị trí kết thúc phải lớn hơn vị trí bắt đầu')
      return
    }
    
    if (!newBlankAnswer.trim()) {
      toast.error('Đáp án không được để trống')
      return
    }

    // Check for overlapping
    const hasOverlap = values.blanks.some(blank => 
      (start >= blank.startIndex && start < blank.endIndex) ||
      (end > blank.startIndex && end <= blank.endIndex) ||
      (start <= blank.startIndex && end >= blank.endIndex)
    )
    
    if (hasOverlap) {
      toast.error('Vị trí bị trùng với blank khác')
      return
    }

    const newBlank: BlankPosition = {
      id: `blank-${values.blanks.length + 1}`,
      startIndex: start,
      endIndex: end,
      correctAnswer: newBlankAnswer,
      placeholder: 'answer'
    }

    onChange('blanks', [...values.blanks, newBlank])
    setNewBlankStart('')
    setNewBlankEnd('')
    setNewBlankAnswer('')
    toast.success('Đã thêm blank mới')
  }

  // Remove blank
  const removeBlank = (id: string) => {
    const newBlanks = values.blanks.filter(b => b.id !== id)
    onChange('blanks', newBlanks)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fillText">Nội dung câu hỏi *</Label>
        <Textarea
          id="fillText"
          value={values.text}
          onChange={(e) => onChange('text', e.target.value)}
          placeholder="Nhập nội dung với các chỗ trống"
          rows={4}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Độ dài văn bản: {values.text.length} ký tự
        </p>
      </div>

      <div className="space-y-2">
        <Label>Các chỗ trống</Label>
        <div className="space-y-2">
          {values.blanks.map((blank) => (
            <div key={blank.id} className="flex gap-2 items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">
                Vị trí: {blank.startIndex}-{blank.endIndex}
              </span>
              <span className="text-sm font-medium">
                Đáp án: {blank.correctAnswer}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBlank(blank.id)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Label>Vị trí bắt đầu</Label>
            <Input
              type="number"
              min="0"
              value={newBlankStart}
              onChange={(e) => setNewBlankStart(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <Label>Vị trí kết thúc</Label>
            <Input
              type="number"
              min="0"
              value={newBlankEnd}
              onChange={(e) => setNewBlankEnd(e.target.value)}
              placeholder="5"
            />
          </div>
          <div className="flex-1">
            <Label>Đáp án đúng</Label>
            <Input
              value={newBlankAnswer}
              onChange={(e) => setNewBlankAnswer(e.target.value)}
              placeholder="answer"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addBlank}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
