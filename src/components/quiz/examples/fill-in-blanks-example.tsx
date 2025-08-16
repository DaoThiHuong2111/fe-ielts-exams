'use client'

import type { FillInBlanksData } from '@/types/quiz'
import { useState } from 'react'
import { FillInBlanksContainer } from '../fill-in-blanks'
import { createBlanksFromMarkers } from '../utils/quiz-helpers'

/**
 * Example usage of Fill in the Blanks component
 */

// Example 1: Using markers to create blanks
const exampleText1 = "The [quick] brown fox [jumps] over the [lazy] dog. This sentence contains [all] the letters of the alphabet."

const { processedText: text1, blanks: blanks1 } = createBlanksFromMarkers(exampleText1)

const exampleQuiz1: FillInBlanksData = {
  id: 'fill-example-1',
  type: 'fill-in-blanks',
  title: 'Complete the Famous Sentence',
  instruction: 'Fill in the missing words to complete this well-known English sentence.',
  text: text1,
  blanks: blanks1,

  estimatedTime: 5,
  category: 'reading'
}

// Example 2: Manual blank creation with specific indices
const text2 = "In 1969, Neil Armstrong became the first person to walk on the Moon. He famously said, 'That's one small step for man, one giant leap for mankind.'"

const exampleQuiz2: FillInBlanksData = {
  id: 'fill-example-2',
  type: 'fill-in-blanks',
  title: 'Historical Facts',
  instruction: 'Fill in the missing information about this historical event.',
  text: text2,
  blanks: [
    {
      id: 'year',
      startIndex: 3,
      endIndex: 7,
      correctAnswer: '1969',
      placeholder: 'năm',
      maxLength: 4
    },
    {
      id: 'person',
      startIndex: 9,
      endIndex: 23,
      correctAnswer: 'Neil Armstrong',
      placeholder: 'tên người',
      maxLength: 20
    },
    {
      id: 'celestial-body',
      startIndex: 71,
      endIndex: 75,
      correctAnswer: 'Moon',
      placeholder: 'thiên thể',
      maxLength: 10
    }
  ],

  estimatedTime: 8,
  category: 'reading'
}

// Example 3: With reading passage
const exampleQuiz3: FillInBlanksData = {
  id: 'fill-example-3',
  type: 'fill-in-blanks',
  title: 'Climate Change Effects',
  instruction: 'Read the passage and fill in the missing words.',
  passage: `Climate change refers to long-term shifts in global temperatures and weather patterns. While climate change is natural, scientific evidence shows that human activities have been the main driver of climate change since the 1800s.

The primary cause is the burning of fossil fuels like coal, oil, and gas, which releases greenhouse gases into the atmosphere. These gases trap heat from the sun, causing global temperatures to rise.`,
  passageTitle: 'Understanding Climate Change',
  text: "The effects of climate change include rising sea levels, more frequent extreme weather events, and changes in precipitation patterns. Scientists agree that immediate action is needed to reduce greenhouse gas emissions and limit global warming to 1.5 degrees Celsius above pre-industrial levels.",
  blanks: [
    {
      id: 'effect1',
      startIndex: 37,
      endIndex: 54,
      correctAnswer: 'rising sea levels',
      placeholder: 'hiệu ứng 1',
      maxLength: 25
    },
    {
      id: 'effect2',
      startIndex: 56,
      endIndex: 89,
      correctAnswer: 'more frequent extreme weather events',
      placeholder: 'hiệu ứng 2',
      maxLength: 40
    },
    {
      id: 'action',
      startIndex: 156,
      endIndex: 171,
      correctAnswer: 'immediate action',
      placeholder: 'hành động',
      maxLength: 20
    },
    {
      id: 'temperature',
      startIndex: 244,
      endIndex: 247,
      correctAnswer: '1.5',
      placeholder: 'số',
      maxLength: 5
    }
  ],

  estimatedTime: 12,
  category: 'reading'
}

export function FillInBlanksExample() {
  const [currentExample, setCurrentExample] = useState(1)
  const [answers1, setAnswers1] = useState<Record<string, string>>({})
  const [answers2, setAnswers2] = useState<Record<string, string>>({})
  const [answers3, setAnswers3] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const getCurrentQuiz = () => {
    switch (currentExample) {
      case 1: return exampleQuiz1
      case 2: return exampleQuiz2
      case 3: return exampleQuiz3
      default: return exampleQuiz1
    }
  }

  const getCurrentAnswers = () => {
    switch (currentExample) {
      case 1: return answers1
      case 2: return answers2
      case 3: return answers3
      default: return answers1
    }
  }

  const handleAnswerChange = (answers: Record<string, string>) => {
    switch (currentExample) {
      case 1: setAnswers1(answers); break
      case 2: setAnswers2(answers); break
      case 3: setAnswers3(answers); break
    }
  }

  const resetExample = () => {
    setAnswers1({})
    setAnswers2({})
    setAnswers3({})
    setShowResults(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Fill in the Blanks Examples
        </h1>
        
        {/* Example selector */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => setCurrentExample(num)}
              className={`px-4 py-2 rounded ${
                currentExample === num
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Example {num}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setShowResults(!showResults)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {showResults ? 'Hide Results' : 'Show Results'}
          </button>
          <button
            onClick={resetExample}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Quiz Container */}
      <FillInBlanksContainer
        quiz={getCurrentQuiz()}
        answers={getCurrentAnswers()}
        onAnswerChange={handleAnswerChange}
        showResults={showResults}
      />
    </div>
  )
}
