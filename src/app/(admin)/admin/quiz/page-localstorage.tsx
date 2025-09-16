'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, FileText, Headphones, Upload, Download } from 'lucide-react'
import quizApiService, { MultiPartQuiz } from '@/services/quiz-api.service'
import Link from 'next/link'
import ImportQuizDialog from '@/components/admin/import-quiz-dialog'

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<MultiPartQuiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load all quizzes from API (ADMIN ONLY)
    const loadQuizzes = async () => {
      try {
        const response = await quizApiService.getQuizzes()
        const quizzesData = response?.data || response || []
        setQuizzes(quizzesData)
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
  const handleExportAll = async () => {
    try {
      const response = await quizApiService.getQuizzes()
      const allQuizzes = response?.data || response || []

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


  // Delete quiz (ADMIN ONLY)
  const handleDeleteQuiz = async (quiz: MultiPartQuiz) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa quiz "${quiz.title}"?`)) {
      try {
        await quizApiService.deleteQuiz(quiz.id)

        // Refresh quiz list
        const response = await quizApiService.getQuizzes()
        const quizzesData = response?.data || response || []
        setQuizzes(quizzesData)
        alert('Quiz đã được xóa thành công!')
      } catch (error) {
        console.error('Delete error:', error)
        alert('Failed to delete quiz.')
      }
    }
  }

  // Handle import success from dialog
  const handleImportSuccess = async (quiz: MultiPartQuiz) => {
    try {
      await quizApiService.importQuiz(quiz as any)

      // Refresh quiz list
      const response = await quizApiService.getQuizzes()
      const quizzesData = response?.data || response || []
      setQuizzes(quizzesData)
    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import quiz.')
    }
  }

  // Create new quiz (ADMIN ONLY)
  const handleCreateNewQuiz = async () => {
    // Ask user to choose quiz type
    const quizType = prompt("Chọn loại quiz:\n1. Reading\n2. Listening\n\nNhập 1 hoặc 2:", "1")
    const testType = quizType === "2" ? "LISTENING" : "READING"

    try {
      // Create minimal quiz structure
      const newQuiz = {
        title: `New ${testType} Quiz`,
        testType,
        totalTimeLimit: 60,
        metadata: { totalQuestions: 0 },
        parts: [],
        isPublished: false,
        isPublic: false
      }

      const createdQuiz = await quizApiService.createQuiz(newQuiz)

      // Redirect to edit page
      window.location.href = `/admin/quiz/${createdQuiz.id}/edit`
    } catch (error) {
      console.error('Create error:', error)
      alert('Failed to create quiz.')
    }
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
          <ImportQuizDialog onImportSuccess={handleImportSuccess} />
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200">
                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link 
                    href={`/quiz/${quiz.testType}/${quiz.id}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button size="default" variant="default" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Xem trước
                    </Button>
                  </Link>
                  <Link href={`/admin/quiz/${quiz.id}/edit`} className="flex-1">
                    <Button size="default" variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </Link>
                </div>
                
                {/* Secondary Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    size="default"
                    variant="ghost"
                    onClick={() => handleExportQuiz(quiz)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button 
                    size="default"
                    variant="destructive"
                    onClick={() => handleDeleteQuiz(quiz)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}