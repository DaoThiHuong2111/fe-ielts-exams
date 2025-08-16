# Quiz Demo Page

Trang demo cho hệ thống Quiz Components IELTS được xây dựng với Next.js 14 và React.

## 🚀 Tính năng

- **Multi-Quiz Navigation**: Chuyển đổi giữa nhiều câu hỏi khác nhau
- **Interactive Components**: Sử dụng hệ thống quiz components tái sử dụng 
- **Real-time Results**: Kiểm tra đáp án và hiển thị kết quả ngay lập tức
- **Responsive Design**: Tối ưu cho mobile, tablet và desktop
- **IELTS-focused**: Thiết kế đặc biệt cho format bài thi IELTS

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Layout stack, navigation collapse
- **Tablet**: 768px - 1024px - Grid 2 columns, optimized touch
- **Desktop**: > 1024px - Full grid layout, hover effects

## 🎨 Design System

### Colors
- Primary: Yellow (#fbbf24) - IELTS brand color
- Secondary: Orange (#f59e0b) 
- Accent: Red (#dc2626)
- Success: Green (#10b981)
- Info: Blue (#3b82f6)

### Layout
- Container max-width: 4xl (896px) for quiz content
- Spacing: Consistent 4, 6, 8, 12, 16 scale
- Border radius: Consistent xl (12px) for modern look

## 📊 Quiz Data Structure

```typescript
interface QuizData {
  id: string                    // Unique identifier
  title?: string               // Quiz title
  instruction?: string         // Instructions for user
  maxSelections?: number       // Limit selected options
  answerBoxes: number         // Number of answer input boxes
  options: QuizOption[]       // Available options A, B, C...
  correctAnswers?: string[]   // Correct answers for validation
}
```

## 🔧 Implementation

### Page Structure
```
quiz-demo/
├── page.tsx           # Main component
├── quiz-demo.module.css  # Custom styles
└── README.md         # Documentation
```

### Key Components Used
- `QuizContainer` - Main quiz wrapper
- `QuizQuestion` - Question and options display  
- `AnswerBox` - Individual answer input
- `Button` - UI controls

### State Management
- React useState for local state
- No external state management needed
- Simple prop drilling for quiz data

## 🌐 Accessibility Features

- Keyboard navigation support
- Screen reader compatible
- High contrast color ratios
- Focus management
- ARIA labels where needed

## 📈 Performance

- Client-side rendering for interactivity
- Minimal re-renders with React keys
- CSS modules for scoped styling
- Optimized bundle size

## 🧪 Testing Scenarios

1. **Multi-selection**: Test max selection limits
2. **Input validation**: Test answer box character limits
3. **Navigation**: Test quiz switching
4. **Results**: Test score calculation
5. **Responsive**: Test on different screen sizes

## 🔗 Integration

Đường dẫn: `/quiz-demo`  
Navigation: Đã tích hợp vào header menu  
Footer: Có thể thêm vào footer links  

## 🚀 Deployment Notes

- Static generation compatible
- No server-side dependencies
- Works with Vercel, Netlify, etc.
- CSS modules auto-processed by Next.js
