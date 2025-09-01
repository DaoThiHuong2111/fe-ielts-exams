import { cn, typography } from '@/lib/design-tokens'
import QuizCard from '../quiz/quiz-card'

// Sample data for reading tests
const readingTests = [
  {
    id: '1',
    title: 'IELTS Reading Test 1',
    description: 'Bài thi mẫu với chủ đề khoa học và công nghệ. Bao gồm các đoạn văn về biến đổi khí hậu và năng lượng tái tạo.',
    duration: '60 phút',
    difficulty: 'Dễ' as const,
    passages: 3,
    questions: 40,
    isCompleted: true
  },
  {
    id: '2',
    title: 'IELTS Reading Test 2',
    description: 'Bài thi tập trung vào chủ đề lịch sử và văn hóa. Các đoạn văn về phát triển nền văn minh và truyền thống.',
    duration: '60 phút',
    difficulty: 'Trung bình' as const,
    passages: 3,
    questions: 40,
    isCompleted: false
  },
  {
    id: '3',
    title: 'IELTS Reading Test 3',
    description: 'Bài thi nâng cao với chủ đề kinh tế và xã hội. Bao gồm các bài phân tích về thương mại và phát triển bền vững.',
    duration: '60 phút',
    difficulty: 'Khó' as const,
    passages: 3,
    questions: 40,
    isCompleted: false
  },
  {
    id: '4',
    title: 'IELTS Reading Test 4',
    description: 'Bài thi với chủ đề y học và sức khỏe. Các đoạn văn về nghiên cứu y tế và chăm sóc sức khỏe cộng đồng.',
    duration: '60 phút',
    difficulty: 'Trung bình' as const,
    passages: 3,
    questions: 40,
    isCompleted: false
  },
  {
    id: '5',
    title: 'IELTS Reading Test 5',
    description: 'Bài thi tổng hợp với nhiều chủ đề đa dạng. Thích hợp cho việc ôn tập tổng thể trước kỳ thi chính thức.',
    duration: '60 phút',
    difficulty: 'Dễ' as const,
    passages: 3,
    questions: 40,
    isCompleted: false
  },
  {
    id: '6',
    title: 'IELTS Reading Test 6',
    description: 'Bài thi mô phỏng kỳ thi thực tế với độ khó cao. Bao gồm các đoạn văn học thuật và từ vựng chuyên sâu.',
    duration: '60 phút',
    difficulty: 'Khó' as const,
    passages: 3,
    questions: 40,
    isCompleted: false
  }
]

export default function ReadingGrid() {
  return (
    <div className="mb-8">
      <h2 className={cn(typography.heading2, "text-gray-800 mb-6")}>
        Danh sách bài thi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readingTests.map((test) => (
          <QuizCard
            key={test.id}
            id={test.id}
            title={test.title}
            description={test.description}
            duration={test.duration}
            difficulty={test.difficulty}
            questions={test.questions}
            isCompleted={test.isCompleted}
            type="reading"
            thirdStat={{
              value: test.passages,
              label: 'Passages',
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}
