'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'

interface ImportSampleDataProps {
  onImport: () => void
  show: boolean
  sampleCount?: number // Pass the actual count dynamically
  category?: string // Category name for the sample data
}

export function ImportSampleData({ onImport, show, sampleCount, category = 'IELTS' }: ImportSampleDataProps) {
  if (!show) {
    return null
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Bắt Đầu Nhanh</CardTitle>
        <CardDescription>
          Import {sampleCount ? `${sampleCount} câu hỏi mẫu ${category}` : 'dữ liệu mẫu'} để test hoặc tạo câu hỏi mới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          onClick={onImport}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Import Câu Hỏi Mẫu {sampleCount ? `(${sampleCount} câu)` : ''}
        </Button>
      </CardContent>
    </Card>
  )
}
