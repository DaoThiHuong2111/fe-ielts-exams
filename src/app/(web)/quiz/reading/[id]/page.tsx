import { cn, typography } from '@/lib/design-tokens'

interface ReadingQuizDetailPageProps {
  params: {
    id: string
  }
}

export default function ReadingQuizDetailPage({ params }: ReadingQuizDetailPageProps) {
  const { id } = params

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className={cn(typography.heading1, "text-gray-800 mb-4")}>
          IELTS Reading Test #{id}
        </h1>
        <p className={cn(typography.bodyLarge, "text-gray-600 max-w-2xl mx-auto")}>
          Bài thi Reading với 3 passages và 40 câu hỏi
        </p>
      </div>

      {/* Test Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>
          
          <h2 className={cn(typography.heading3, "text-gray-800 mb-4")}>
            Bài thi Reading #{id} đang được phát triển
          </h2>
          
          <p className={cn(typography.body, "text-gray-600 mb-6 max-w-md mx-auto")}>
            Nội dung bài thi sẽ được cập nhật tại đây. Vui lòng quay lại sau!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="text-sm font-medium">Đang cập nhật</span>
          </div>
        </div>
      </div>
    </div>
  )
}
