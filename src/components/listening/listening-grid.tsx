import { cn, typography } from '@/lib/design-tokens'
import QuizCard from '../quiz/quiz-card'

// Sample data for listening tests
const listeningTests = [
  {
    id: '1',
    title: 'IELTS Listening Test 1',
    description: 'Bài thi mẫu với chủ đề cuộc sống hàng ngày và học tập. Bao gồm các tình huống thực tế như đặt phòng khách sạn, thảo luận học thuật.',
    duration: '30 phút',
    difficulty: 'Dễ' as const,
    sections: 4,
    questions: 40,
    isCompleted: true
  },
  {
    id: '2',
    title: 'IELTS Listening Test 2',
    description: 'Bài thi tập trung vào chủ đề công việc và môi trường làm việc. Các tình huống bao gồm phỏng vấn xin việc và thảo luận dự án.',
    duration: '30 phút',
    difficulty: 'Trung bình' as const,
    sections: 4,
    questions: 40,
    isCompleted: false
  },
  {
    id: '3',
    title: 'IELTS Listening Test 3',
    description: 'Bài thi nâng cao với chủ đề khoa học và công nghệ. Bao gồm các bài giảng học thuật và thảo luận chuyên sâu.',
    duration: '30 phút',
    difficulty: 'Khó' as const,
    sections: 4,
    questions: 40,
    isCompleted: false
  },
  {
    id: '4',
    title: 'IELTS Listening Test 4',
    description: 'Bài thi với chủ đề văn hóa và xã hội. Các tình huống bao gồm tour du lịch, thảo luận về lịch sử và truyền thống.',
    duration: '30 phút',
    difficulty: 'Trung bình' as const,
    sections: 4,
    questions: 40,
    isCompleted: false
  },
  {
    id: '5',
    title: 'IELTS Listening Test 5',
    description: 'Bài thi tổng hợp với nhiều chủ đề đa dạng. Thích hợp cho việc ôn tập tổng thể trước kỳ thi chính thức.',
    duration: '30 phút',
    difficulty: 'Dễ' as const,
    sections: 4,
    questions: 40,
    isCompleted: false
  },
  {
    id: '6',
    title: 'IELTS Listening Test 6',
    description: 'Bài thi mô phỏng kỳ thi thực tế với độ khó cao. Bao gồm các accent khác nhau và tốc độ nói nhanh.',
    duration: '30 phút',
    difficulty: 'Khó' as const,
    sections: 4,
    questions: 40,
    isCompleted: false
  }
]

export default function ListeningGrid() {
  return (
    <div className="mb-8">
      <h2 className={cn(typography.heading2, "text-gray-800 mb-6")}>
        Danh sách bài thi
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeningTests.map((test) => (
          <QuizCard
            key={test.id}
            id={test.id}
            title={test.title}
            description={test.description}
            duration={test.duration}
            difficulty={test.difficulty}
            questions={test.questions}
            isCompleted={test.isCompleted}
            type="listening"
            thirdStat={{
              value: test.sections,
              label: 'Sections',
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}