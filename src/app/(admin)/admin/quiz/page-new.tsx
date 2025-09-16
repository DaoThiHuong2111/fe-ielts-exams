'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, FileText, Headphones, Upload, Download, Lock, Globe, UserPlus } from 'lucide-react'
import { MultiPartQuiz } from '@/types/multi-part-quiz'
import Link from 'next/link'
import toast from 'react-hot-toast'
import quizApiService, { PaginatedResponse } from '@/services/quiz-api.service'
import ImportQuizDialog from '@/components/admin/import-quiz-dialog'

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<MultiPartQuiz[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState<{ testType?: string; search?: string }>({})

  useEffect(() => {
    loadQuizzes()
  }, [page, filter])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      const response: PaginatedResponse<MultiPartQuiz> = await quizApiService.getQuizzes({
        page,
        limit: 12,
        ...filter,
      })
      setQuizzes(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (error) {
      console.error('Failed to load quizzes:', error)
      toast.error('Không thể tải danh sách quiz')
    } finally {
      setLoading(false)
    }
  }

  const getQuizTypeIcon = (testType: string) => {
    return testType === 'reading' || testType === 'READING' 
      ? <FileText className="h-4 w-4" /> 
      : <Headphones className="h-4 w-4" />
  }

  const getQuizTypeBadge = (testType: string) => {
    const isReading = testType === 'reading' || testType === 'READING'
    return (
      <Badge variant={isReading ? 'default' : 'secondary'}>
        {isReading ? 'Reading' : 'Listening'}
      </Badge>
    )
  }

  // Export quiz to JSON using API
  const handleExportQuiz = async (quiz: MultiPartQuiz) => {
    try {
      const blob = await quizApiService.exportQuiz(quiz.id!)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${quiz.title.replace(/[^a-z0-9]/gi, '_')}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Quiz đã được xuất thành công')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Không thể xuất quiz')
    }
  }

  // Delete quiz using API
  const handleDeleteQuiz = async (quiz: MultiPartQuiz) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa quiz "${quiz.title}"?`)) {
      try {
        await quizApiService.deleteQuiz(quiz.id!)
        toast.success('Quiz đã được xóa thành công')
        loadQuizzes() // Reload the list
      } catch (error) {
        console.error('Delete error:', error)
        toast.error('Không thể xóa quiz')
      }
    }
  }

  // Handle import from dialog
  const handleImportSuccess = async (file: File) => {
    try {
      await quizApiService.importQuiz(file)
      toast.success('Quiz đã được import thành công')
      loadQuizzes() // Reload the list
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Không thể import quiz')
    }
  }

  // Create new quiz using API
  const handleCreateNewQuiz = async () => {
    const quizType = prompt("Chọn loại quiz:\n1. Reading\n2. Listening\n\nNhập 1 hoặc 2:", "1")
    const testType = quizType === "2" ? "LISTENING" : "READING"
    
    try {
      const newQuiz = await quizApiService.createQuiz({
        title: testType === 'READING' ? "Quiz Reading Mới" : "Quiz Listening Mới",
        totalTimeLimit: testType === 'READING' ? 60 : 30,
        testType,
        parts: [
          {
            partNumber: 1,
            title: "Part 1",
            content: {
              title: testType === 'READING' ? 'Reading Passage 1' : 'Listening Section 1',
              subtitle: 'Nội dung của bạn ở đây...',
              ...(testType === 'READING' 
                ? {
                    paragraphs: [
                      {
                        label: 'A',
                        text: 'Passage text của bạn ở đây...'
                      }
                    ]
                  }
                : {
                    audioUrl: `/audio/listening-section-1.mp3`
                  })
            },
            questions: [
              {
                questionIndex: 0,
                questionId: "p1q1",
                type: "MULTIPLE_CHOICE",
                data: {
                  prompt: "Câu hỏi mẫu?",
                  options: [
                    { id: "a", text: "Lựa chọn A" },
                    { id: "b", text: "Lựa chọn B" },
                    { id: "c", text: "Lựa chọn C" },
                    { id: "d", text: "Lựa chọn D" }
                  ]
                }
              }
            ]
          }
        ],
        metadata: {
          totalQuestions: 1
        }
      })
      
      toast.success('Quiz mới đã được tạo')
      // Redirect to edit page
      window.location.href = `/admin/quiz/${newQuiz.id}/edit`
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Không thể tạo quiz mới')
    }
  }

  // Toggle publish status
  const handleTogglePublish = async (quiz: MultiPartQuiz) => {
    try {
      const updated = await quizApiService.togglePublish(quiz.id!, !quiz.isPublished)
      toast.success(`Quiz đã được ${updated.isPublished ? 'xuất bản' : 'gỡ xuất bản'}`)
      loadQuizzes()
    } catch (error) {
      console.error('Toggle publish error:', error)
      toast.error('Không thể thay đổi trạng thái xuất bản')
    }
  }

  // Toggle public access
  const handleTogglePublic = async (quiz: MultiPartQuiz) => {
    try {
      const updated = await quizApiService.togglePublic(quiz.id!, !quiz.isPublic)
      toast.success(`Quiz đã được đặt ở chế độ ${updated.isPublic ? 'công khai' : 'riêng tư'}`)
      loadQuizzes()
    } catch (error) {
      console.error('Toggle public error:', error)
      toast.error('Không thể thay đổi quyền truy cập')
    }
  }

  if (loading && quizzes.length === 0) {
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
              {quizzes.filter(q => q.testType === 'READING' || q.testType === 'reading').length}
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
              {quizzes.filter(q => q.testType === 'LISTENING' || q.testType === 'listening').length}
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
                <div className="flex items-center space-x-2">
                  {getQuizTypeBadge(quiz.testType)}
                  {quiz.isPublic ? (
                    <Globe className="h-4 w-4 text-green-500" title="Công khai" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-500" title="Riêng tư" />
                  )}
                </div>
              </div>
              <CardDescription>
                {quiz.parts?.length || 0} phần • {quiz.metadata?.totalQuestions || 0} câu hỏi
                {quiz.isPublished ? (
                  <Badge variant="outline" className="ml-2">Đã xuất bản</Badge>
                ) : (
                  <Badge variant="secondary" className="ml-2">Nháp</Badge>
                )}
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
                  <span>{quiz.parts?.length || 0} phần</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200">
                {/* Primary Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link 
                    href={`/quiz/${quiz.testType.toLowerCase()}/${quiz.id}`}
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
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePublish(quiz)}
                    className="flex-1"
                  >
                    {quiz.isPublished ? 'Gỡ xuất bản' : 'Xuất bản'}
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePublic(quiz)}
                    className="flex-1"
                  >
                    {quiz.isPublic ? <Lock className="h-3 w-3 mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
                    {quiz.isPublic ? 'Đặt riêng tư' : 'Đặt công khai'}
                  </Button>
                </div>
                
                {/* Management Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href={`/admin/quiz/${quiz.id}/users`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Quản lý truy cập
                    </Button>
                  </Link>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => handleExportQuiz(quiz)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
                
                {/* Delete Action */}
                <Button 
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteQuiz(quiz)}
                  className="w-full"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Xóa quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Trang trước
          </Button>
          <span className="flex items-center px-4">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  )
}