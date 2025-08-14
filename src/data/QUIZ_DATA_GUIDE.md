# Quiz Data Management Guide

## 📋 Overview

This guide explains how to create and manage quiz data using our simplified JSON-based system. The system supports two question types: **Multiple Choice** and **Fill-in-the-Blanks** with flexible reading passage formats.

## 🏗️ File Structure

```
src/data/
├── quiz-sets/              # Quiz data files
│   ├── ielts-reading-set-1.json
│   ├── grammar-basics.json
│   ├── vocabulary-practice.json
│   └── your-quiz-set.json
├── index.ts                # Data loader
└── QUIZ_DATA_GUIDE.md     # This guide
```

## 📝 Creating a New Quiz Set

### Step 1: Create JSON File

Create a new file in `src/data/quiz-sets/` with this **simplified structure**:

```json
{
  "id": "your-quiz-id",
  "title": "Your Quiz Title",
  "questions": [
    // Your questions here
  ]
}
```

**Note:** We've simplified the structure by removing unnecessary metadata like `description`, `version`, `createdAt`, `updatedAt`, and the `metadata` object. This makes the JSON cleaner and easier to manage.

### Step 2: Add to Data Loader

Update `src/data/index.ts`:

1. Add your quiz set to `AVAILABLE_QUIZ_SETS`:
```typescript
export const AVAILABLE_QUIZ_SETS = {
  // ... existing sets
  'your-quiz-id': {
    id: 'your-quiz-id',
    title: 'Your Quiz Title'
  }
}
```

2. Add import case in `loadQuizSet()`:
```typescript
case 'your-quiz-id':
  quizData = await import('./quiz-sets/your-quiz-set.json').then(m => m.default)
  break
```

## 📖 Reading Passage Formats

The system supports two formats for reading passages:

### Format 1: Object Format (Recommended)
```json
{
  "passage": {
    "title": "Understanding Climate Change",
    "content": "Climate change refers to long-term shifts..."
  }
}
```

### Format 2: String Format (Legacy)
```json
{
  "passage": "Climate change refers to long-term shifts...",
  "passageTitle": "Understanding Climate Change"
}
```

**Note:** Both formats work, but the object format is cleaner and more organized.

## 🎯 Question Types

### Multiple Choice Questions

```json
{
  "id": "q1",
  "type": "multiple-choice",
  "order": 1,
  "title": "Question Title",
  "instruction": "Choose the correct answer.",
  "points": 1,
  "estimatedTime": 5,
  "passage": {
    "title": "Reading Passage Title",
    "content": "Passage text here..."
  },
  // Alternative: Simple string format
  // "passage": "Passage text here...",
  // "passageTitle": "Reading Passage Title",
  "options": [
    {
      "id": "A",
      "label": "A",
      "text": "First option"
    },
    {
      "id": "B", 
      "label": "B",
      "text": "Second option"
    }
  ],
  "correctAnswers": ["A"],
  "maxSelections": 1,
  "explanation": "Why A is correct..."
}
```

### Fill-in-the-Blanks Questions

```json
{
  "id": "q2",
  "type": "fill-in-blanks",
  "order": 2,
  "title": "Complete the Sentence",
  "instruction": "Fill in the missing words.",
  "points": 3,
  "estimatedTime": 8,
  "text": "The quick brown fox jumps over the lazy dog.",
  "blanks": [
    {
      "id": "blank-1",
      "startIndex": 4,
      "endIndex": 9,
      "correctAnswer": "quick",
      "acceptableAnswers": ["quick", "fast"],
      "caseSensitive": false,
      "placeholder": "adjective",
      "maxLength": 20,
      "hint": "Describes speed"
    }
  ]
}
```

## ⚠️ Common Pitfalls & Solutions

### 1. Question Ordering Issues

**❌ Problem:** Duplicate or missing order numbers
```json
{
  "questions": [
    {"id": "q1", "order": 1},
    {"id": "q2", "order": 1},  // ❌ Duplicate!
    {"id": "q3", "order": 3}   // ❌ Missing order 2!
  ]
}
```

**✅ Solution:** Use sequential, unique order numbers
```json
{
  "questions": [
    {"id": "q1", "order": 1},
    {"id": "q2", "order": 2},
    {"id": "q3", "order": 3}
  ]
}
```

### 2. Fill-in-Blanks Position Errors

**❌ Problem:** Invalid or overlapping positions
```json
{
  "text": "Hello world",
  "blanks": [
    {
      "id": "blank-1",
      "startIndex": 0,
      "endIndex": 5,
      "correctAnswer": "Hello"
    },
    {
      "id": "blank-2", 
      "startIndex": 3,    // ❌ Overlaps with blank-1!
      "endIndex": 8,
      "correctAnswer": "lo wo"
    }
  ]
}
```

**✅ Solution:** Non-overlapping positions
```json
{
  "text": "Hello world",
  "blanks": [
    {
      "id": "blank-1",
      "startIndex": 0,
      "endIndex": 5,
      "correctAnswer": "Hello"
    },
    {
      "id": "blank-2",
      "startIndex": 6,    // ✅ After blank-1 ends
      "endIndex": 11,
      "correctAnswer": "world"
    }
  ]
}
```

### 3. Multiple Choice Validation Errors

**❌ Problem:** Correct answers don't match option IDs
```json
{
  "options": [
    {"id": "A", "text": "Option A"},
    {"id": "B", "text": "Option B"}
  ],
  "correctAnswers": ["C"]  // ❌ No option with ID "C"!
}
```

**✅ Solution:** Match correct answers to option IDs
```json
{
  "options": [
    {"id": "A", "text": "Option A"},
    {"id": "B", "text": "Option B"}
  ],
  "correctAnswers": ["A"]  // ✅ Matches option ID
}
```

### 4. Passage Format Issues

**❌ Problem:** Mixing passage formats incorrectly
```json
{
  "passage": {
    "title": "Title",
    "content": "Content"
  },
  "passageTitle": "Another Title"  // ❌ Redundant!
}
```

**✅ Solution:** Use one format consistently
```json
{
  "passage": {
    "title": "Title",
    "content": "Content"
  }
  // ✅ No passageTitle needed
}
```

## 🔍 Testing

### Basic Validation

The system provides basic validation for:
- ✅ JSON syntax checking
- ✅ Required fields presence
- ✅ Question ordering
- ✅ TypeScript type safety

### Manual Testing Checklist

Before deploying your quiz:

1. **Load Test:** Can the quiz set load without errors?
2. **Order Test:** Do questions appear in correct order?
3. **UI Test:** Do all questions render properly?
4. **Answer Test:** Do correct answers validate properly?
5. **Navigation Test:** Can users navigate between questions?

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `[object Object]` displayed | Passage format mismatch | Use object format: `{"title": "...", "content": "..."}` |
| Questions out of order | Incorrect `order` values | Use sequential numbers: 1, 2, 3... |
| Quiz won't load | JSON syntax error | Validate JSON syntax |
| Missing options | Empty `options` array | Add at least 2 options for multiple choice |
| No correct answers | Missing `correctAnswers` | Add `correctAnswers` array |
| Blanks not working | Missing `blanks` array | Add `blanks` array for fill-in-blanks |

## 📊 Best Practices

### 1. Question Design
- ✅ Use clear, concise titles
- ✅ Provide helpful instructions
- ✅ Set realistic time estimates
- ✅ Include explanations for learning

### 2. Data Organization
- ✅ Group related questions in sets
- ✅ Use consistent naming conventions
- ✅ Keep file sizes reasonable (<100KB)
- ✅ Version your quiz sets

### 3. Fill-in-Blanks Tips
- ✅ Use `acceptableAnswers` for variations
- ✅ Set `caseSensitive: false` for flexibility
- ✅ Provide helpful placeholders
- ✅ Add hints when appropriate

### 4. Multiple Choice Tips
- ✅ Use 3-5 options per question
- ✅ Make distractors plausible
- ✅ Avoid "all of the above" options
- ✅ Balance correct answer positions

## 🚀 Advanced Features

### Conditional Logic (Future)
```json
{
  "conditions": {
    "showIf": {
      "questionId": "q1",
      "selectedOptions": ["A"]
    }
  }
}
```

### Adaptive Difficulty (Future)
```json
{
  "adaptiveDifficulty": {
    "enabled": true,
    "adjustmentFactor": 0.1
  }
}
```

## 🔧 Troubleshooting

### Quiz Won't Load
1. Check JSON syntax with a validator
2. Verify all required fields are present (`id`, `title`, `questions`)
3. Check browser console for errors
4. Ensure file is in correct directory (`src/data/quiz-sets/`)
5. Verify file is added to `AVAILABLE_QUIZ_SETS` in `index.ts`

### Questions Out of Order
1. Check `order` field values
2. Ensure no duplicates
3. Use sequential numbering (1, 2, 3...)

### Blanks Not Working
1. Verify `startIndex` < `endIndex`
2. Check positions are within text bounds
3. Ensure no overlapping blanks
4. Test with simple examples first

## 📞 Support

For additional help:
1. Check browser console for errors
2. Review example quiz sets in `src/data/quiz-sets/`
3. Test with minimal examples first
4. Verify JSON syntax and structure

---

**Happy Quiz Creating! 🎯**
