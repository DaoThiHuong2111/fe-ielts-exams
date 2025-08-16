'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export interface CommonQuizFieldsData {
  title: string
  instruction: string
  passageTitle: string
  passageContent: string
  estimatedTime: number
}

interface CommonQuizFieldsProps {
  values: CommonQuizFieldsData
  onChange: (field: keyof CommonQuizFieldsData, value: string | number) => void
}

export function CommonQuizFields({ values, onChange }: CommonQuizFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Nhập tiêu đề câu hỏi"
          required
        />
      </div>

      <div>
        <Label htmlFor="instruction">Hướng dẫn *</Label>
        <Input
          id="instruction"
          value={values.instruction}
          onChange={(e) => onChange('instruction', e.target.value)}
          placeholder="Nhập hướng dẫn làm bài"
          required
        />
      </div>

      <div>
        <Label htmlFor="time">Thời gian ước tính (phút)</Label>
        <Input
          id="time"
          type="number"
          min="1"
          value={values.estimatedTime}
          onChange={(e) => onChange('estimatedTime', parseInt(e.target.value) || 5)}
        />
      </div>

      <div className="space-y-2">
        <Label>Đoạn văn đọc hiểu (tùy chọn)</Label>
        <Input
          placeholder="Tiêu đề đoạn văn"
          value={values.passageTitle}
          onChange={(e) => onChange('passageTitle', e.target.value)}
        />
        <Textarea
          placeholder="Nội dung đoạn văn"
          value={values.passageContent}
          onChange={(e) => onChange('passageContent', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  )
}
