'use client'

import { QuizContainer } from '@/components/quiz'
import { useQuiz } from '@/contexts/quiz-context'
import type { MultipleChoiceData } from '@/types/quiz'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// Sample Multiple Choice Quizzes
const sampleQuizzes: MultipleChoiceData[] = [
  {
    id: 'ielts-reading-1',
    type: 'multiple-choice',
    title: 'IELTS Reading Comprehension',
    instruction: 'Choose the correct answers based on the passage.',
    passageTitle: 'The Impact of Social Media on Modern Communication',
    passage: `Social media has fundamentally transformed how people communicate in the 21st century. Platforms like Facebook, Twitter, Instagram, and TikTok have created new forms of interaction that were unimaginable just two decades ago.

While these platforms have made it easier to connect with people across the globe, they have also introduced new challenges. The speed of communication has increased dramatically, but some argue that the quality of communication has decreased. Messages are often shorter, more informal, and sometimes lack the nuance of face-to-face conversation.

Research shows that social media can both enhance and hinder meaningful relationships. On one hand, it allows people to maintain connections with friends and family who live far away. On the other hand, excessive use of social media has been linked to feelings of loneliness and social isolation, particularly among young people.

The phenomenon of "digital natives" - people who have grown up with technology - demonstrates how communication patterns are evolving. These individuals often prefer text-based communication over phone calls and are comfortable expressing themselves through emojis, memes, and other digital formats.`,
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
    id: 'grammar-quiz-1',
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
    id: 'vocabulary-quiz-1',
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
  }
]

export default function MultipleChoiceDemoPage() {
  const searchParams = useSearchParams()
  const { setQuizProgress } = useQuiz()
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)

  // Global state to store selections for all quizzes
  const [allQuizSelections, setAllQuizSelections] = useState<Record<number, string[]>>({})

  // Get quiz index from URL params and sync with layout
  useEffect(() => {
    const urlQuizIndex = parseInt(searchParams.get('quiz') || '0', 10)
    if (urlQuizIndex !== currentQuizIndex) {
      setCurrentQuizIndex(urlQuizIndex)
    }
  }, [searchParams, currentQuizIndex])

  // Get current quiz based on URL params
  const currentQuiz = sampleQuizzes[currentQuizIndex] || sampleQuizzes[0]

  // Get selections for current quiz
  const currentSelections = allQuizSelections[currentQuizIndex] || []

  // Update selections for current quiz
  const handleSelectionChange = (newSelections: string[]) => {
    setAllQuizSelections(prev => ({
      ...prev,
      [currentQuizIndex]: newSelections
    }))

    // Update progress tracking
    const hasSelections = newSelections.length > 0
    setQuizProgress(currentQuizIndex, hasSelections)
  }

  return (
    <QuizContainer
      quiz={currentQuiz}
      selectedOptions={currentSelections}
      onSelectionChange={handleSelectionChange}
      showResults={false}
      className="p-6"
    />
  )
}
