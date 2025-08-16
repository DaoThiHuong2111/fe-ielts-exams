# 📊 Luồng Di Chuyển Dữ Liệu Quiz - IELTS Exams Platform

## 🎯 Tổng Quan
Hệ thống quiz sử dụng cấu trúc dữ liệu JSON được validate chặt chẽ với JSON Schema và AJV. Dữ liệu di chuyển từ tạo/nhập → validate → lưu trữ → render UI.

## 📁 1. Cấu Trúc Dữ Liệu (Data Structure)

### 1.1 JSON Schema Files
```
src/data/schemas/
├── quiz-schema.json       # Schema chính cho quiz set
└── question-types.json    # Schema cho từng loại câu hỏi
```

### 1.2 Sample Data Files  
```
src/data/quiz-sets/
├── ielts-reading-set-1.json  # IELTS reading questions
├── grammar-basics.json       # Grammar practice
└── vocabulary-practice.json  # Vocabulary questions
```

### 1.3 Cấu Trúc Quiz JSON
```json
{
  "id": "unique-id",
  "title": "Quiz Title",
  "category": "reading|listening|writing|speaking",
  "difficulty": "beginner|intermediate|advanced",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice|fill-in-blanks",
      "passage": {
        "title": "Passage Title",
        "content": "Passage content..."
      },
      "options": [...],      // For multiple-choice
      "blanks": [...],       // For fill-in-blanks
      "correctAnswers": [...]
    }
  ]
}
```

## 🔄 2. Luồng Di Chuyển Dữ Liệu

### 2.1 Tạo/Nhập Dữ Liệu (Data Creation)

```
[User Input] → [quiz-generate page]
     ↓
[Create Passage] → [Add Questions]
     ↓
[Form Data] → {title, content, questions[]}
     ↓
[Generate IDs] → generateId('passage')
```

### 2.2 Validation Flow

```
[Raw Data] → [schemaValidator.ts]
     ↓
[AJV Validator] ← [quiz-schema.json]
     ↓
validateQuizSet() → {valid: boolean, errors: []}
     ↓
[Valid] → Continue | [Invalid] → Show Errors
```

### 2.3 Storage Flow

```
[Validated Data] → [quiz-storage.ts]
     ↓
savePassageData() → localStorage
     ↓
Structure: {
  passages: PassageWithQuestions[],
  version: "2.0.0"
}
```

### 2.4 Loading & Display Flow

```
[Page Load] → loadPassageData()
     ↓
[Check Format] → New Format? | Legacy Format?
     ↓
[Convert if needed] → convertLegacyToPassages()
     ↓
getAllQuestionsFlat() → QuizData[]
     ↓
[Component Render] → <UniversalQuizContainer />
```

## 🗂️ 3. Type System & Interfaces

### 3.1 Core Types (src/types/quiz.ts)
```typescript
// Passage với Questions
interface PassageWithQuestions {
  id: string
  title?: string
  content: string
  questions: Question[]
  category?: QuizCategory
}

// Question Types
type Question = MultipleChoiceQuestion | FillInBlanksQuestion

// Multiple Choice
interface MultipleChoiceQuestion {
  type: 'multiple-choice'
  options: QuizOption[]
  correctAnswers?: string[]
  maxSelections?: number
}

// Fill in Blanks
interface FillInBlanksQuestion {
  type: 'fill-in-blanks'
  text: string
  blanks: BlankPosition[]
}
```

## 🛠️ 4. Key Functions & APIs

### 4.1 Validation Functions
```typescript
// Validate quiz set
validateQuizSet(data) → ValidationResult

// Validate single question
validateQuestion(question) → ValidationResult

// Format errors for display
formatErrors(errors) → string[]
```

### 4.2 Storage Functions
```typescript
// Save passages
savePassageData(passages: PassageWithQuestions[])

// Load passages
loadPassageData() → PassageWithQuestions[]

// Convert legacy format
convertLegacyToPassages(legacyQuizzes) → PassageWithQuestions[]

// Get all questions flat
getAllQuestionsFlat() → QuizData[]
```

### 4.3 Component Props Flow
```typescript
// Universal Container
<UniversalQuizContainer 
  quiz={quizData}
  onAnswerChange={handleChange}
  showResults={boolean}
/>
     ↓
// Auto-detect type and render
quiz.type === 'multiple-choice' ? 
  <QuizContainer /> : 
  <FillInBlanksContainer />
```

## 📊 5. Data Lifecycle Example

### Step 1: User Creates Quiz
```javascript
// User fills form in quiz-generate page
const newPassage = {
  id: generateId('passage'),
  title: "Climate Change",
  content: "Long passage text...",
  questions: []
}
```

### Step 2: Add Question
```javascript
const newQuestion = {
  id: generateId('question'),
  type: 'multiple-choice',
  title: 'Main Idea',
  options: [{id: 'A', text: '...'}],
  correctAnswers: ['A']
}
passage.questions.push(newQuestion)
```

### Step 3: Validate
```javascript
const validation = validateQuizSet(passage)
if (!validation.valid) {
  toast.error(validation.formattedErrors[0])
  return
}
```

### Step 4: Save to Storage
```javascript
savePassageData([...existingPassages, newPassage])
// Saved to localStorage with key 'custom-quiz-data'
```

### Step 5: Load & Display
```javascript
// In quiz-demo page
const passages = loadPassageData()
const questions = getAllQuestionsFlat()

// Render
<UniversalQuizContainer quiz={questions[0]} />
```

## 🔍 6. Data Validation Rules

### Required Fields
- **Quiz Set**: id, title, questions[]
- **Question**: id, type, order
- **Multiple Choice**: options[], correctAnswers[]
- **Fill in Blanks**: text, blanks[]

### Validation Constraints
- **ID Pattern**: `^[a-z0-9-]+$` (3-50 chars)
- **Title**: 3-200 characters
- **Options**: 2-10 items
- **Blanks**: At least 1 blank
- **Categories**: Enum validation
- **Difficulty**: Enum validation

## 🚀 7. Performance Optimizations

1. **LocalStorage Caching**: Data persisted locally
2. **Lazy Loading**: Questions loaded on demand
3. **Format Migration**: Auto-convert legacy data
4. **Validation Caching**: Compiled schemas reused

## 📝 8. Error Handling

```javascript
try {
  const data = loadPassageData()
  if (!data) throw new Error('No data')
} catch (error) {
  console.error('Failed to load:', error)
  return [] // Return empty array
}
```

## 🔗 9. Data Flow Summary

```
CREATE → VALIDATE → STORE → LOAD → RENDER
   ↓        ↓         ↓       ↓        ↓
Form → AJV+Schema → Local → Parse → React
Data    Validate   Storage   JSON   Component
```

## 💡 Best Practices

1. **Always validate** before saving
2. **Use TypeScript types** for compile-time safety
3. **Handle legacy format** for backwards compatibility
4. **Provide clear error messages** from validation
5. **Use generateId()** for unique identifiers
6. **Keep schemas updated** with new requirements

---

*Last Updated: August 2024*
*Version: 2.0.0*
