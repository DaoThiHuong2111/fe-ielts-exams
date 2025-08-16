'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { addQuizToStorage, clearQuizData, loadQuizData, saveQuizData } from '@/lib/quiz-storage'
import type { BlankPosition, FillInBlanksData, MultipleChoiceData, QuizData, QuizOption } from '@/types/quiz'
import { Trash2, Plus, X, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Sample data để import
const sampleMultipleChoiceQuizzes: MultipleChoiceData[] = [
  {
    id: 'sample-mc-1',
    type: 'multiple-choice',
    title: 'IELTS Reading Comprehension',
    instruction: 'Choose the correct answers based on the passage.',
    passage: {
      title: 'The Impact of Social Media on Modern Communication',
      content: `Social media has fundamentally transformed how people communicate in the 21st century. Platforms like Facebook, Twitter, Instagram, and TikTok have created new forms of interaction that were unimaginable just two decades ago.

While these platforms have made it easier to connect with people across the globe, they have also introduced new challenges. The speed of communication has increased dramatically, but some argue that the quality of communication has decreased. Messages are often shorter, more informal, and sometimes lack the nuance of face-to-face conversation.

Research shows that social media can both enhance and hinder meaningful relationships. On one hand, it allows people to maintain connections with friends and family who live far away. On the other hand, excessive use of social media has been linked to feelings of loneliness and social isolation, particularly among young people.`
    },
    options: [
      { id: 'A', label: 'A', text: 'Social media has only positive effects on communication' },
      { id: 'B', label: 'B', text: 'The quality of communication has improved with social media' },
      { id: 'C', label: 'C', text: 'Social media can both enhance and hinder relationships' },
      { id: 'D', label: 'D', text: 'Digital natives prefer phone calls over text messages' }
    ],
    maxSelections: 2,
    correctAnswers: ['C'],
    estimatedTime: 10,
    category: 'reading'
  },
  {
    id: 'sample-mc-2',
    type: 'multiple-choice',
    title: 'English Grammar - Present Perfect',
    instruction: 'Choose the correct form of the present perfect tense.',
    options: [
      { id: 'A', label: 'A', text: 'I have went to the store yesterday.' },
      { id: 'B', label: 'B', text: 'I have gone to the store yesterday.' },
      { id: 'C', label: 'C', text: 'I have been to the store many times.' },
      { id: 'D', label: 'D', text: 'I have go to the store regularly.' }
    ],
    maxSelections: 1,
    correctAnswers: ['C'],
    estimatedTime: 3,
    category: 'writing'
  },
  {
    id: 'sample-mc-3',
    type: 'multiple-choice',
    title: 'Advanced Vocabulary',
    instruction: 'Choose the words that best complete the sentence. (Select 2 answers)',
    options: [
      { id: 'A', label: 'A', text: 'Ubiquitous - present everywhere' },
      { id: 'B', label: 'B', text: 'Ephemeral - lasting for a very short time' },
      { id: 'C', label: 'C', text: 'Perpetual - never ending or changing' },
      { id: 'D', label: 'D', text: 'Transient - lasting only for a short time' },
      { id: 'E', label: 'E', text: 'Permanent - lasting or intended to last indefinitely' }
    ],
    maxSelections: 2,
    correctAnswers: ['B', 'D'],
    estimatedTime: 5,
    category: 'reading'
  },
  {
    id: 'sample-mc-4',
    type: 'multiple-choice',
    title: 'Business English',
    instruction: 'Select the most appropriate business term.',
    passage: {
      title: 'Corporate Communication',
      content: `Effective communication in the corporate world requires understanding of both formal and informal channels. Stakeholders expect transparency and timely updates, while maintaining professional boundaries.`
    },
    options: [
      { id: 'A', label: 'A', text: 'Stakeholders are only company employees' },
      { id: 'B', label: 'B', text: 'Transparency means sharing all information' },
      { id: 'C', label: 'C', text: 'Professional boundaries should be maintained' },
      { id: 'D', label: 'D', text: 'Informal channels are not important' }
    ],
    maxSelections: 1,
    correctAnswers: ['C'],
    estimatedTime: 4,
    category: 'reading'
  }
]

const sampleFillInBlanksQuizzes: FillInBlanksData[] = [
  {
    id: "sample-fib-1",
    type: "fill-in-blanks",
    title: "Climate Change Facts",
    instruction: "Fill in the missing words based on the context.",
    estimatedTime: 8,
    text: "The effects of climate change include floods, extreme weather events, and changes in precipitation patterns. Scientists agree that urgent action is needed to reduce greenhouse gas emissions and limit global warming to 1.5 degrees Celsius above pre-industrial levels.",
    blanks: [
      {
        id: "blank-1",
        startIndex: 42,
        endIndex: 48,
        correctAnswer: "floods"
      },
      {
        id: "blank-2",
        startIndex: 50,
        endIndex: 73,
        correctAnswer: "extreme weather events"
      },
      {
        id: "blank-3",
        startIndex: 139,
        endIndex: 152,
        correctAnswer: "urgent action"
      },
      {
        id: "blank-4",
        startIndex: 225,
        endIndex: 228,
        correctAnswer: "1.5"
      }
    ]
  },
  {
    id: "sample-fib-2",
    type: "fill-in-blanks",
    title: "Conditional Sentences",
    instruction: "Complete the conditional sentences with correct verb forms.",
    estimatedTime: 6,
    text: "If I had studied harder, I would have passed the exam. If she has more time, she will finish the project. Unless we leave now, we'll be late for the meeting.",
    blanks: [
      {
        id: "blank-1",
        startIndex: 5,
        endIndex: 8,
        correctAnswer: "had"
      },
      {
        id: "blank-2",
        startIndex: 65,
        endIndex: 68,
        correctAnswer: "has"
      },
      {
        id: "blank-3",
        startIndex: 125,
        endIndex: 130,
        correctAnswer: "leave"
      }
    ]
  },
  {
    id: "sample-fib-3",
    type: "fill-in-blanks",
    title: "Academic Vocabulary",
    instruction: "Fill in the blanks with appropriate academic words.",
    estimatedTime: 5,
    text: "The research revealed significant findings about student performance. The study indicates that regular practice improves learning outcomes. These results confirm previous research in the field.",
    blanks: [
      {
        id: "blank-1",
        startIndex: 13,
        endIndex: 21,
        correctAnswer: "revealed"
      },
      {
        id: "blank-2",
        startIndex: 75,
        endIndex: 84,
        correctAnswer: "indicates"
      },
      {
        id: "blank-3",
        startIndex: 145,
        endIndex: 152,
        correctAnswer: "confirm"
      }
    ]
  }
]

export default function QuizGeneratePage() {
  const router = useRouter()
  const [quizType, setQuizType] = useState<'multiple-choice' | 'fill-in-blanks'>('multiple-choice')
  const [existingQuizzes, setExistingQuizzes] = useState<QuizData[]>([])

  // Common fields
  const [title, setTitle] = useState('')
  const [instruction, setInstruction] = useState('')
  const [passageTitle, setPassageTitle] = useState('')
  const [passageContent, setPassageContent] = useState('')
  const [estimatedTime, setEstimatedTime] = useState(5)

  // Multiple Choice fields
  const [options, setOptions] = useState<QuizOption[]>([
    { id: 'A', label: 'A', text: '' },
    { id: 'B', label: 'B', text: '' }
  ])
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([])
  const [maxSelections, setMaxSelections] = useState(1)

  // Fill in the Blanks fields
  const [fillText, setFillText] = useState('')
  const [blanks, setBlanks] = useState<BlankPosition[]>([])
  const [newBlankStart, setNewBlankStart] = useState('')
  const [newBlankEnd, setNewBlankEnd] = useState('')
  const [newBlankAnswer, setNewBlankAnswer] = useState('')

  // Load existing quizzes on mount
  useEffect(() => {
    const loaded = loadQuizData()
    setExistingQuizzes(loaded)
  }, [])

  // Add new option for multiple choice
  const addOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length) // A, B, C, D...
    setOptions([...options, { id: nextLabel, label: nextLabel, text: '' }])
  }

  // Remove option
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error('Cần ít nhất 2 lựa chọn')
      return
    }
    setOptions(options.filter(opt => opt.id !== id))
    setCorrectAnswers(correctAnswers.filter(ans => ans !== id))
  }

  // Update option text
  const updateOption = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt))
  }

  // Toggle correct answer
  const toggleCorrectAnswer = (id: string) => {
    if (maxSelections === 1) {
      setCorrectAnswers([id])
    } else {
      if (correctAnswers.includes(id)) {
        setCorrectAnswers(correctAnswers.filter(ans => ans !== id))
      } else {
        if (correctAnswers.length < maxSelections) {
          setCorrectAnswers([...correctAnswers, id])
        } else {
          toast.error(`Chỉ được chọn tối đa ${maxSelections} đáp án đúng`)
        }
      }
    }
  }

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
    const hasOverlap = blanks.some(blank => 
      (start >= blank.startIndex && start < blank.endIndex) ||
      (end > blank.startIndex && end <= blank.endIndex) ||
      (start <= blank.startIndex && end >= blank.endIndex)
    )
    
    if (hasOverlap) {
      toast.error('Vị trí bị trùng với blank khác')
      return
    }

    const newBlank: BlankPosition = {
      id: `blank-${blanks.length + 1}`,
      startIndex: start,
      endIndex: end,
      correctAnswer: newBlankAnswer,
      placeholder: 'answer'
    }

    setBlanks([...blanks, newBlank])
    setNewBlankStart('')
    setNewBlankEnd('')
    setNewBlankAnswer('')
    toast.success('Đã thêm blank mới')
  }

  // Remove blank
  const removeBlank = (id: string) => {
    setBlanks(blanks.filter(b => b.id !== id))
  }

  // Generate unique ID
  const generateId = () => {
    // Use crypto.randomUUID if available, fallback to timestamp + random
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return `quiz-${window.crypto.randomUUID()}`
    }
    return `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!title.trim()) {
      toast.error('Tiêu đề không được để trống')
      return
    }

    if (!instruction.trim()) {
      toast.error('Hướng dẫn không được để trống')
      return
    }

    let newQuiz: QuizData

    if (quizType === 'multiple-choice') {
      // Validate multiple choice
      const validOptions = options.filter(opt => opt.text.trim())
      if (validOptions.length < 2) {
        toast.error('Cần ít nhất 2 lựa chọn có nội dung')
        return
      }

      if (correctAnswers.length === 0) {
        toast.error('Phải chọn ít nhất 1 đáp án đúng')
        return
      }

      newQuiz = {
        id: generateId(),
        type: 'multiple-choice',
        title,
        instruction,
        passage: passageContent.trim() ? {
          title: passageTitle.trim() || undefined,
          content: passageContent
        } : undefined,
        options: validOptions,
        correctAnswers,
        maxSelections,
        estimatedTime,
        category: 'reading'
      } as MultipleChoiceData

    } else {
      // Validate fill in blanks
      if (!fillText.trim()) {
        toast.error('Nội dung câu hỏi không được để trống')
        return
      }

      if (blanks.length === 0) {
        toast.error('Phải có ít nhất 1 chỗ trống')
        return
      }

      newQuiz = {
        id: generateId(),
        type: 'fill-in-blanks',
        title,
        instruction,
        passage: passageContent.trim() ? {
          title: passageTitle.trim() || undefined,
          content: passageContent
        } : undefined,
        text: fillText,
        blanks,
        estimatedTime,
        category: 'reading'
      } as FillInBlanksData
    }

    // Save to localStorage
    addQuizToStorage(newQuiz)
    
    // Update local state
    setExistingQuizzes([...existingQuizzes, newQuiz])
    
    toast.success('Đã tạo câu hỏi thành công!')
    
    // Reset form
    resetForm()
  }

  // Reset form
  const resetForm = () => {
    setTitle('')
    setInstruction('')
    setPassageTitle('')
    setPassageContent('')
    setEstimatedTime(5)
    setOptions([
      { id: 'A', label: 'A', text: '' },
      { id: 'B', label: 'B', text: '' }
    ])
    setCorrectAnswers([])
    setMaxSelections(1)
    setFillText('')
    setBlanks([])
  }

  // Import sample data - append to existing data
  const handleImportSampleData = () => {
    const existingData = loadQuizData()
    if (existingData.length > 0) {
      const confirmImport = window.confirm(
        `Bạn đã có ${existingData.length} câu hỏi. Bạn muốn:\n\n` +
        `OK - Thêm câu hỏi mẫu vào danh sách hiện tại\n` +
        `Cancel - Hủy bỏ`
      )
      if (!confirmImport) return
    }
    
    const allSampleQuizzes: QuizData[] = [
      ...sampleMultipleChoiceQuizzes,
      ...sampleFillInBlanksQuizzes
    ]
    
    // Append sample quizzes to existing data
    const combinedQuizzes = [...existingData, ...allSampleQuizzes]
    saveQuizData(combinedQuizzes)
    setExistingQuizzes(combinedQuizzes)
    toast.success(`Đã thêm ${allSampleQuizzes.length} câu hỏi mẫu!`)
  }

  // Clear all quizzes
  const handleClearAll = () => {
    if (confirm('Xóa tất cả câu hỏi đã tạo?')) {
      clearQuizData()
      setExistingQuizzes([])
      toast.success('Đã xóa tất cả câu hỏi')
    }
  }

  // Navigate to demo pages
  const navigateToDemo = (type: 'multiple-choice' | 'fill-in-blanks') => {
    if (type === 'multiple-choice') {
      router.push('/quiz-demo/multi-choice')
    } else {
      router.push('/quiz-demo/fill-in-blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Tạo Câu Hỏi Quiz</CardTitle>
            <CardDescription>
              Tạo câu hỏi tùy chỉnh cho hệ thống quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quiz Type Selection */}
              <div className="space-y-2">
                <Label>Loại câu hỏi</Label>
                <RadioGroup value={quizType} onValueChange={(value) => {
                  if (value === 'multiple-choice' || value === 'fill-in-blanks') {
                    setQuizType(value)
                  }
                }}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple-choice" id="mc" />
                    <Label htmlFor="mc">Trắc nghiệm (Multiple Choice)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fill-in-blanks" id="fib" />
                    <Label htmlFor="fib">Điền từ (Fill in the Blanks)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Common Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề câu hỏi"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instruction">Hướng dẫn *</Label>
                  <Input
                    id="instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
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
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 5)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Đoạn văn đọc hiểu (tùy chọn)</Label>
                  <Input
                    placeholder="Tiêu đề đoạn văn"
                    value={passageTitle}
                    onChange={(e) => setPassageTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Nội dung đoạn văn"
                    value={passageContent}
                    onChange={(e) => setPassageContent(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Multiple Choice Specific Fields */}
              {quizType === 'multiple-choice' && (
                <div className="space-y-4">
                  <div>
                    <Label>Số đáp án tối đa được chọn</Label>
                    <Select value={maxSelections.toString()} onValueChange={(v) => setMaxSelections(parseInt(v))}>
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
                    {options.map((option) => (
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
                          checked={correctAnswers.includes(option.id)}
                          onChange={() => toggleCorrectAnswer(option.id)}
                          className="w-4 h-4"
                        />
                        <Label className="text-sm">Đúng</Label>
                        {options.length > 2 && (
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
              )}

              {/* Fill in the Blanks Specific Fields */}
              {quizType === 'fill-in-blanks' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fillText">Nội dung câu hỏi *</Label>
                    <Textarea
                      id="fillText"
                      value={fillText}
                      onChange={(e) => setFillText(e.target.value)}
                      placeholder="Nhập nội dung với các chỗ trống"
                      rows={4}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Độ dài văn bản: {fillText.length} ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Các chỗ trống</Label>
                    <div className="space-y-2">
                      {blanks.map((blank) => (
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
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Tạo câu hỏi
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Import Sample Data Card - Show when no data */}
        {existingQuizzes.length === 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bắt Đầu Nhanh</CardTitle>
              <CardDescription>
                Import dữ liệu mẫu để test hoặc tạo câu hỏi mới
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleImportSampleData}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Import Câu Hỏi Mẫu (7 câu)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Quizzes */}
        {existingQuizzes.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Câu hỏi đã tạo ({existingQuizzes.length})</CardTitle>
              <CardDescription>
                Các câu hỏi sẽ được hiển thị trong trang demo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {existingQuizzes.map((quiz, index) => (
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
                  onClick={() => navigateToDemo('multiple-choice')}
                  className="flex-1"
                >
                  Xem Demo Trắc Nghiệm
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigateToDemo('fill-in-blanks')}
                  className="flex-1"
                >
                  Xem Demo Điền Từ
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearAll}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tất cả
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
