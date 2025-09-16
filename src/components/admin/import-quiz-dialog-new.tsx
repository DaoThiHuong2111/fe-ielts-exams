'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Upload, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { MultiPartQuiz } from '@/types/multi-part-quiz'

interface ImportQuizDialogProps {
  onImportSuccess: (file: File) => void
}

export default function ImportQuizDialog({ onImportSuccess }: ImportQuizDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const jsonFileInputRef = useRef<HTMLInputElement>(null)
  const excelFileInputRef = useRef<HTMLInputElement>(null)
  const csvFileInputRef = useRef<HTMLInputElement>(null)

  // Import từ JSON
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file is JSON
    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file')
      return
    }

    // Pass file to parent for API upload
    onImportSuccess(file)
    setIsOpen(false)
    event.target.value = ''
  }

  // Import từ Excel - Convert to JSON first
  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

        const quiz = parseSpreadsheetData(jsonData, file.name)
        if (quiz) {
          // Convert quiz object to JSON file
          const jsonString = JSON.stringify(quiz, null, 2)
          const jsonFile = new File([jsonString], file.name.replace(/\.(xlsx?|csv)$/i, '.json'), {
            type: 'application/json'
          })
          
          onImportSuccess(jsonFile)
          setIsOpen(false)
        }
      } catch (error) {
        console.error('Excel import error:', error)
        alert('Failed to import Excel file. Please check the format.')
      } finally {
        setImporting(false)
      }
    }
    
    reader.readAsArrayBuffer(file)
    event.target.value = ''
  }

  // Import từ CSV - Convert to JSON first
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    Papa.parse(file, {
      complete: (results) => {
        try {
          const quiz = parseSpreadsheetData(results.data as any[][], file.name)
          if (quiz) {
            // Convert quiz object to JSON file
            const jsonString = JSON.stringify(quiz, null, 2)
            const jsonFile = new File([jsonString], file.name.replace(/\.(xlsx?|csv)$/i, '.json'), {
              type: 'application/json'
            })
            
            onImportSuccess(jsonFile)
            setIsOpen(false)
          }
        } catch (error) {
          console.error('CSV import error:', error)
          alert('Failed to import CSV file. Please check the format.')
        } finally {
          setImporting(false)
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error)
        alert('Failed to parse CSV file.')
        setImporting(false)
      }
    })
    
    event.target.value = ''
  }

  // Parse spreadsheet data to quiz format
  const parseSpreadsheetData = (data: any[][], fileName: string): MultiPartQuiz | null => {
    if (!data || data.length < 2) {
      alert('File không có dữ liệu hợp lệ!')
      return null
    }

    // Simple parsing - you can expand this based on your spreadsheet format
    const headers = data[0]
    const rows = data.slice(1)

    // Group questions by part
    const parts = new Map<number, any[]>()
    
    rows.forEach(row => {
      if (!row || row.length === 0) return
      
      const partNumber = parseInt(row[0]) || 1
      if (!parts.has(partNumber)) {
        parts.set(partNumber, [])
      }
      
      // Create question from row data
      const question = {
        id: row[1] || `p${partNumber}q${parts.get(partNumber)!.length + 1}`,
        type: row[2] || 'MULTIPLE_CHOICE',
        prompt: row[3] || '',
        options: row[4] ? JSON.parse(row[4]) : [],
        correctAnswer: row[5] || ''
      }
      
      parts.get(partNumber)!.push(question)
    })

    // Create quiz structure
    const quiz: MultiPartQuiz = {
      title: fileName.replace(/\.(xlsx?|csv)$/i, ''),
      totalTimeLimit: 60,
      testType: 'reading',
      parts: Array.from(parts.entries()).map(([partNumber, questions]) => ({
        partNumber,
        title: `Part ${partNumber}`,
        content: {
          title: `Reading Passage ${partNumber}`,
          subtitle: '',
          paragraphs: []
        },
        questions
      })),
      metadata: {
        totalQuestions: rows.length
      }
    }

    return quiz
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Quiz</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">Lưu ý:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>JSON: Format chuẩn từ export</li>
                  <li>Excel/CSV: Sẽ được chuyển đổi sang JSON</li>
                  <li>Quiz import sẽ được lưu vào database</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {/* Import JSON */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Import từ JSON</p>
                    <p className="text-sm text-gray-500">Format chuẩn từ export</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={importing}
                  onClick={() => jsonFileInputRef.current?.click()}
                >
                  Chọn file
                </Button>
              </div>
              <input
                ref={jsonFileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
            </div>

            {/* Import Excel */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">Import từ Excel</p>
                    <p className="text-sm text-gray-500">File .xlsx hoặc .xls</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={importing}
                  onClick={() => excelFileInputRef.current?.click()}
                >
                  Chọn file
                </Button>
              </div>
              <input
                ref={excelFileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportExcel}
              />
            </div>

            {/* Import CSV */}
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="font-medium">Import từ CSV</p>
                    <p className="text-sm text-gray-500">File .csv với headers</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={importing}
                  onClick={() => csvFileInputRef.current?.click()}
                >
                  Chọn file
                </Button>
              </div>
              <input
                ref={csvFileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportCSV}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}