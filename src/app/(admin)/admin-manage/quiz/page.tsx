'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, FileText, Headphones, Upload, Download } from 'lucide-react'
import { MultiPartQuiz } from '@/types/multi-part-quiz'
import Link from 'next/link'
import { getAllQuizzes, createNewQuiz, deleteQuizById, saveQuizById } from '@/lib/simple-quiz-storage'

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<MultiPartQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load all quizzes from localStorage (ADMIN ONLY)
    const loadQuizzes = async () => {
      try {
        const allQuizzes = getAllQuizzes()
        setQuizzes(allQuizzes)
      } catch (error) {
        console.error('Failed to load quizzes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuizzes()
  }, [])

  const getQuizTypeIcon = (testType: string) => {
    return testType === 'reading' ? <FileText className="h-4 w-4" /> : <Headphones className="h-4 w-4" />
  }

  const getQuizTypeBadge = (testType: string) => {
    return (
      <Badge variant={testType === 'reading' ? 'default' : 'secondary'}>
        {testType === 'reading' ? 'Reading' : 'Listening'}
      </Badge>
    )
  }

  // Import quiz from JSON (ADMIN ONLY)
  const handleImportQuiz = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string)
        
        // Validate required fields
        if (!jsonData.title || !jsonData.testType || !jsonData.parts) {
          alert('Invalid quiz format! Missing required fields.')
          return
        }

        // Generate new ID and save
        const newId = Date.now().toString()
        const newQuiz: MultiPartQuiz = {
          id: newId,
          title: jsonData.title,
          totalTimeLimit: jsonData.totalTimeLimit || 60,
          testType: jsonData.testType,
          parts: jsonData.parts,
          metadata: jsonData.metadata || { totalQuestions: 0 }
        }

        saveQuizById(newId, newQuiz)
        
        // Refresh quiz list
        const allQuizzes = getAllQuizzes()
        setQuizzes(allQuizzes)
        alert('Quiz imported successfully!')
        
      } catch (error) {
        console.error('Import error:', error)
        alert('Failed to import quiz. Please check your JSON format.')
      }
    }
    
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  // Export quiz to JSON (ADMIN ONLY)
  const handleExportQuiz = (quiz: MultiPartQuiz) => {
    try {
      // Export quiz without ID for clean JSON
      const { id, ...exportData } = quiz
      const jsonString = JSON.stringify(exportData, null, 2)
      
      // Create download
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${quiz.testType}-quiz-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export quiz.')
    }
  }

  // Export all quizzes (ADMIN ONLY)
  const handleExportAll = () => {
    try {
      const allQuizzes = getAllQuizzes()
      // Export without IDs for clean JSON
      const exportData = allQuizzes.map(({ id, ...quiz }) => quiz)
      const jsonString = JSON.stringify(exportData, null, 2)
      
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `all-quizzes-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export quizzes.')
    }
  }


  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Delete quiz (ADMIN ONLY)
  const handleDeleteQuiz = (quiz: MultiPartQuiz) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa quiz "${quiz.title}"?`)) {
      deleteQuizById(quiz.id!)
      const allQuizzes = getAllQuizzes()
      setQuizzes(allQuizzes)
      alert('Quiz đã được xóa thành công!')
    }
  }

  // Create new quiz (ADMIN ONLY)
  const handleCreateNewQuiz = () => {
    // Ask user to choose quiz type
    const quizType = prompt("Chọn loại quiz:\n1. Reading\n2. Listening\n\nNhập 1 hoặc 2:", "1")
    const testType = quizType === "2" ? "listening" : "reading"
    
    // Create new quiz
    const newQuiz = createNewQuiz(testType)
    
    // Refresh quiz list
    const allQuizzes = getAllQuizzes()
    setQuizzes(allQuizzes)
    
    // Redirect to edit page
    window.location.href = `/admin-manage/quiz/${newQuiz.id}/edit`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Đang tải dữ liệu quiz...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Quiz</h1>
          <p className="text-gray-600 mt-2">Quản lý các bài thi IELTS Reading và Listening</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={triggerFileInput}>
            <Upload className="h-4 w-4 mr-2" />
            Import JSON
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={handleCreateNewQuiz}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo Quiz
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportQuiz}
        style={{ display: 'none' }}
      />

      {/* Quiz Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Quiz</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizzes.filter(q => q.testType === 'reading').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listening Tests</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizzes.filter(q => q.testType === 'listening').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getQuizTypeIcon(quiz.testType)}
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </div>
                {getQuizTypeBadge(quiz.testType)}
              </div>
              <CardDescription>
                {quiz.parts.length} phần • {quiz.metadata.totalQuestions} câu hỏi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span>{quiz.totalTimeLimit} phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số phần:</span>
                  <span>{quiz.parts.length} phần</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <div className="flex space-x-2">
                  <Link 
                    href={`/quiz/${quiz.testType}/${quiz.id}`}
                    target="_blank"
                  >
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      Xem trước
                    </Button>
                  </Link>
                  <Link href={`/admin-manage/quiz/${quiz.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleExportQuiz(quiz)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteQuiz(quiz)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}