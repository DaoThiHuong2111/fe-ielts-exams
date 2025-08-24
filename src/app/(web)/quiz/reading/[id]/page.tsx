'use client'

import { QuizContentWithSelection, QuizLayoutWrapper } from '@/components/quiz'
import { use, useLayoutEffect, useState } from 'react'

interface ReadingQuizDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const sampleData = {
  "id": "reading-001",
  "title": "The Development of the Silk Industry",
  "timeLimit": 20,
  "totalQuestions": 9,
  "difficulty": "medium",
  "content": `THE DEVELOPMENT OF THE SILK INDUSTRY

Silk, a natural fibre produced by a particular worm called a silkworm, has been used in clothing for many centuries.

When silk was first discovered in China over 4,500 years ago, it was reserved exclusively for the use of the emperor, his close relations and the very highest of his dignitaries. Within the palace, the emperor is believed to have worn a robe of white silk; outside, he, his principal wife, and the heir to the throne wore yellow, the colour of the earth.

Gradually silk came into more general use, and the various classes of Chinese society began wearing tunics of silk. As well as being used for clothing and decoration, silk was quite quickly put to industrial use, and rapidly became one of the principal elements of the Chinese economy. It was used in the production of musical instruments, as string for fishing, and even as the world's first luxury paper. Eventually even the common people were able to wear garments of silk.

During the Han dynasty (206 BC-220 AD), silk ceased to be a mere fabric and became a form of currency. Farmers paid their taxes in grain and silk, and silk was used to pay civil servants and to reward subjects for outstanding services. Values were calculated in lengths of silk as they had previously been calculated in weight of gold. Before long, silk became a currency used in trade with foreign countries, which continued into the Tang dynasty (616-907 AD). It is possible that this added importance was the result of a major increase in production. Silk also found its way so thoroughly into the Chinese language that 230 of the 5,000 most common Chinese characters contain the silk radical.`,
  "questions": [
    {
      "id": "q1",
      "type": "MULTIPLE_CHOICE",
      "questionNumber": 1,
      "prompt": "According to the passage, what was silk initially used for in ancient China?",
      "options": [
        {"id": "a", "text": "Trading with foreign countries", "isCorrect": false},
        {"id": "b", "text": "Exclusive use by the emperor and high dignitaries", "isCorrect": true},
        {"id": "c", "text": "Making musical instruments", "isCorrect": false},
        {"id": "d", "text": "General clothing for all social classes", "isCorrect": false}
      ]
    },
    {
      "id": "q2",
      "type": "TRUE_FALSE_NOTGIVEN",
      "questionNumber": 2,
      "prompt": "Do the following statements agree with the information given in the passage?",
      "instruction": "Write TRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
      "questions": [
        {
          "id": "q2-1",
          "text": "The emperor wore white silk robes inside the palace.",
          "correctAnswer": "TRUE"
        },
        {
          "id": "q2-2", 
          "text": "Silk production was limited to the royal family only.",
          "correctAnswer": "FALSE"
        },
        {
          "id": "q2-3",
          "text": "The Chinese government subsidized silk production.",
          "correctAnswer": "NOT GIVEN"
        }
      ]
    },
    {
      "id": "q3",
      "type": "MATCHING_HEADINGS",
      "questionNumber": 3,
      "prompt": "Choose the correct heading for each paragraph.",
      "headings": [
        {"id": "i", "text": "Silk as currency and trade"},
        {"id": "ii", "text": "Early exclusive use of silk"},
        {"id": "iii", "text": "Industrial applications of silk"},
        {"id": "iv", "text": "Silk in Chinese language"}
      ],
      "questions": [
        {"id": "q3-a", "paragraph": "Paragraph A", "correctAnswer": "ii"},
        {"id": "q3-b", "paragraph": "Paragraph B", "correctAnswer": "iii"}
      ]
    },
    {
      "id": "q4",
      "type": "MATCHING_FEATURES",
      "questionNumber": 4,
      "prompt": "Match each period with its characteristic use of silk.",
      "features": [
        {"id": "A", "text": "Early discovery period"},
        {"id": "B", "text": "Han dynasty"},
        {"id": "C", "text": "Tang dynasty"},
        {"id": "D", "text": "Modern period"}
      ],
      "questions": [
        {
          "id": "q4-1",
          "text": "Silk used as payment for taxes",
          "correctAnswer": "B"
        },
        {
          "id": "q4-2",
          "text": "Exclusive use by emperor and dignitaries",
          "correctAnswer": "A"
        }
      ]
    },
    {
      "id": "q5",
      "type": "MATCHING_INFORMATION",
      "questionNumber": 5,
      "prompt": "Which paragraph contains the following information?",
      "questions": [
        {
          "id": "q5-1",
          "text": "Information about silk influence on Chinese language",
          "correctAnswer": "D"
        },
        {
          "id": "q5-2",
          "text": "Description of silk's industrial uses",
          "correctAnswer": "B"
        }
      ]
    },
    {
      "id": "q6",
      "type": "MATCHING_SENTENCE_ENDINGS",
      "questionNumber": 6,
      "prompt": "Complete each sentence with the correct ending.",
      "endings": [
        {"id": "A", "text": "became a form of currency."},
        {"id": "B", "text": "was reserved for the emperor."},
        {"id": "C", "text": "contained the silk radical."},
        {"id": "D", "text": "were paid in grain and silk."}
      ],
      "questions": [
        {
          "id": "q6-1",
          "text": "During the Han dynasty, silk",
          "correctAnswer": "A"
        },
        {
          "id": "q6-2",
          "text": "230 Chinese characters",
          "correctAnswer": "C"
        }
      ]
    },
    {
      "id": "q7",
      "type": "SENTENCE_COMPLETION",
      "questionNumber": 7,
      "prompt": "Complete the sentences below.",
      "instruction": "Choose NO MORE THAN TWO WORDS from the passage for each answer.",
      "questions": [
        {
          "id": "q7-1",
          "text": "Silk was first discovered in China over __________ years ago.",
          "correctAnswer": "4,500"
        },
        {
          "id": "q7-2",
          "text": "The emperor wore __________ silk robes inside the palace.",
          "correctAnswer": "white"
        }
      ]
    },
    {
      "id": "q8",
      "type": "SHORT_ANSWER",
      "questionNumber": 8,
      "prompt": "Answer the questions below.",
      "instruction": "Choose NO MORE THAN THREE WORDS from the passage for each answer.",
      "questions": [
        {
          "id": "q8-1",
          "text": "What color did the emperor wear outside the palace?",
          "correctAnswer": "yellow"
        },
        {
          "id": "q8-2",
          "text": "How many Chinese characters contain the silk radical?",
          "correctAnswer": "230"
        }
      ]
    },
    {
      "id": "q9",
      "type": "DIAGRAM_LABEL",
      "questionNumber": 9,
      "prompt": "Complete the diagram showing the uses of silk.",
      "instruction": "Choose NO MORE THAN TWO WORDS from the passage for each answer.",
      "labels": [
        {"id": "l1", "text": "Clothing and __________", "correctAnswer": "decoration"},
        {"id": "l2", "text": "__________ instruments", "correctAnswer": "musical"},
        {"id": "l3", "text": "String for __________", "correctAnswer": "fishing"}
      ]
    }
  ]
}

export default function ReadingQuizDetailPage({ params }: ReadingQuizDetailPageProps) {
  use(params) // Use params to avoid unused variable warning
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration errors by ensuring client-side only rendering
  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = () => {
    console.log('Submitted answers:', answers)
    alert('Bài thi đã được nộp!')
  }

  // Convert questions to format expected by QuizFooter
  const footerQuestions = sampleData.questions.map(q => ({
    id: q.id,
    questionNumber: q.questionNumber,
    type: q.type
  }))

  // Get answered questions - handle both main questions and sub-questions
  const getAnsweredQuestions = () => {
    const answered = new Set<string>()
    
    sampleData.questions.forEach(question => {
      if (question.type === 'MULTIPLE_CHOICE') {
        if (answers[question.id]) {
          answered.add(question.id)
        }
      } else if (question.type === 'TRUE_FALSE_NOTGIVEN') {
        // Check if all sub-questions are answered
        const allSubQuestionsAnswered = question.questions?.every((subQ: any) => answers[subQ.id])
        if (allSubQuestionsAnswered && question.questions && question.questions.length > 0) {
          answered.add(question.id)
        }
      } else if (question.type === 'MATCHING_HEADINGS' || question.type === 'MATCHING_FEATURES' || question.type === 'MATCHING_SENTENCE_ENDINGS') {
        // Check if all sub-questions are answered
        const allSubQuestionsAnswered = question.questions?.every((subQ: any) => answers[subQ.id])
        if (allSubQuestionsAnswered && question.questions && question.questions.length > 0) {
          answered.add(question.id)
        }
      } else if (question.type === 'MATCHING_INFORMATION') {
        // Check if all sub-questions are answered
        const allSubQuestionsAnswered = question.questions?.every((subQ: any) => answers[subQ.id])
        if (allSubQuestionsAnswered && question.questions && question.questions.length > 0) {
          answered.add(question.id)
        }
      } else if (question.type === 'SENTENCE_COMPLETION' || question.type === 'SHORT_ANSWER') {
        // Check if all sub-questions are answered
        const allSubQuestionsAnswered = question.questions?.every((subQ: any) => answers[subQ.id])
        if (allSubQuestionsAnswered && question.questions && question.questions.length > 0) {
          answered.add(question.id)
        }
      } else if (question.type === 'DIAGRAM_LABEL') {
        // Check if all labels are answered
        const allLabelsAnswered = question.labels?.every((label: any) => answers[label.id])
        if (allLabelsAnswered && question.labels && question.labels.length > 0) {
          answered.add(question.id)
        }
      }
    })
    
    return answered
  }

  const answeredQuestions = getAnsweredQuestions()

  const handleQuestionClick = (questionId: string) => {
    // Scroll to question
    const element = document.getElementById(`question-${questionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            <p className="font-medium">{question.prompt}</p>
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  {isClient ? (
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-4 h-4"
                    />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded" />
                  )}
                  <span>{option.id.toUpperCase()}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'TRUE_FALSE_NOTGIVEN':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <p className="text-sm text-gray-600">{question.instruction}</p>
            {question.questions.map((subQ: any) => (
              <div key={subQ.id} className="border-l-2 border-gray-200 pl-4">
                <p className="mb-2">{subQ.text}</p>
                <div className="flex space-x-4">
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                    <label key={option} className="flex items-center space-x-1 cursor-pointer">
                      {isClient ? (
                        <input
                          type="radio"
                          name={subQ.id}
                          value={option}
                          onChange={(e) => handleAnswerChange(subQ.id, e.target.value)}
                          className="w-4 h-4"
                        />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case 'MATCHING_HEADINGS':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium mb-2">List of Headings:</p>
              {question.headings.map((heading: any) => (
                <p key={heading.id} className="text-sm">
                  {heading.id}. {heading.text}
                </p>
              ))}
            </div>
            {question.questions.map((q: any) => (
              <div key={q.id} className="flex items-center space-x-2">
                <span className="min-w-0 flex-1">{q.paragraph}:</span>
                {isClient ? (
                  <select
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select...</option>
                    {question.headings.map((heading: any) => (
                      <option key={heading.id} value={heading.id}>
                        {heading.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="border border-gray-300 rounded px-2 py-1 w-20 h-8 bg-gray-50" />
                )}
              </div>
            ))}
          </div>
        )

      case 'MATCHING_FEATURES':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium mb-2">Features:</p>
              {question.features.map((feature: any) => (
                <p key={feature.id} className="text-sm">
                  {feature.id}. {feature.text}
                </p>
              ))}
            </div>
            {question.questions.map((q: any) => (
              <div key={q.id} className="flex items-center space-x-2">
                <span className="min-w-0 flex-1">{q.text}:</span>
                {isClient ? (
                  <select
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select...</option>
                    {question.features.map((feature: any) => (
                      <option key={feature.id} value={feature.id}>
                        {feature.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="border border-gray-300 rounded px-2 py-1 w-20 h-8 bg-gray-50" />
                )}
              </div>
            ))}
          </div>
        )

      case 'MATCHING_INFORMATION':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            {question.questions.map((q: any) => (
              <div key={q.id} className="flex items-center space-x-2">
                <span className="min-w-0 flex-1">{q.text}:</span>
                {isClient ? (
                  <input
                    type="text"
                    placeholder="A-G"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-16 text-center"
                  />
                ) : (
                  <div className="border border-gray-300 rounded px-2 py-1 w-16 h-8 bg-gray-50" />
                )}
              </div>
            ))}
          </div>
        )

      case 'MATCHING_SENTENCE_ENDINGS':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-medium mb-2">Sentence Endings:</p>
              {question.endings.map((ending: any) => (
                <p key={ending.id} className="text-sm">
                  {ending.id}. {ending.text}
                </p>
              ))}
            </div>
            {question.questions.map((q: any) => (
              <div key={q.id} className="flex items-center space-x-2">
                <span className="min-w-0 flex-1">{q.text}:</span>
                {isClient ? (
                  <select
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Select...</option>
                    {question.endings.map((ending: any) => (
                      <option key={ending.id} value={ending.id}>
                        {ending.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="border border-gray-300 rounded px-2 py-1 w-20 h-8 bg-gray-50" />
                )}
              </div>
            ))}
          </div>
        )

      case 'SENTENCE_COMPLETION':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <p className="text-sm text-gray-600">{question.instruction}</p>
            {question.questions.map((q: any) => {
              // Split text by underscores and replace them with input boxes
              const parts = q.text.split(/_{2,}/g) // Split by 2 or more underscores
              
              return (
                <div key={q.id} className="flex flex-wrap items-center gap-1">
                  {parts.map((part: string, index: number) => (
                    <span key={index} className="inline-flex items-center">
                      <span>{part}</span>
                      {index < parts.length - 1 && (
                        isClient ? (
                          <input
                            type="text"
                            placeholder=""
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 mx-1 w-24 text-center inline-block"
                          />
                        ) : (
                          <div className="border border-gray-300 rounded px-2 py-1 mx-1 w-24 h-8 bg-gray-50 inline-block" />
                        )
                      )}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        )

      case 'SHORT_ANSWER':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <p className="text-sm text-gray-600">{question.instruction}</p>
            {question.questions.map((q: any) => (
              <div key={q.id} className="space-y-2">
                <p>{q.text}</p>
                {isClient ? (
                  <input
                    type="text"
                    placeholder="Your answer..."
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs"
                  />
                ) : (
                  <div className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs h-10 bg-gray-50" />
                )}
              </div>
            ))}
          </div>
        )

      case 'DIAGRAM_LABEL':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.prompt}</p>
            <p className="text-sm text-gray-600">{question.instruction}</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium mb-3">Diagram: Uses of Silk</p>
              {question.labels.map((label: any) => (
                <div key={label.id} className="flex items-center space-x-2 mb-2">
                  <span className="min-w-0 flex-1">{label.text}:</span>
                  {isClient ? (
                    <input
                      type="text"
                      placeholder="Answer..."
                      onChange={(e) => handleAnswerChange(label.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-32"
                    />
                  ) : (
                    <div className="border border-gray-300 rounded px-2 py-1 w-32 h-8 bg-gray-50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Unsupported question type: {question.type}</div>
    }
  }

  return (
    <QuizLayoutWrapper
      title={sampleData.title}
      timeLimit={sampleData.timeLimit}
      questions={footerQuestions}
      answeredQuestions={answeredQuestions}
      onSubmit={handleSubmit}
      onQuestionClick={handleQuestionClick}
    >
      {/* Main Content - 2 cột scroll riêng biệt */}
      <div className="flex h-full">
        {/* Left Side - Reading Passage */}
        <div className="w-1/2 border-r border-gray-200 bg-white h-full">
          <div className="h-full overflow-y-auto p-6">
            <QuizContentWithSelection 
              containerId="reading-passage"
              className="prose prose-sm max-w-none"
            >
              <div className="whitespace-pre-line text-black leading-relaxed">
                {sampleData.content}
              </div>
            </QuizContentWithSelection>
          </div>
        </div>

        {/* Right Side - Questions */}
        <div className="w-1/2 bg-white h-full">
          <div className="h-full overflow-y-auto p-6">
            <QuizContentWithSelection 
              containerId="quiz-questions"
              className="space-y-8"
            >
              {sampleData.questions.map((question) => (
                <div 
                  key={question.id} 
                  id={`question-${question.id}`}
                  className="border-b border-gray-100 pb-6 last:border-b-0"
                >
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      Question {question.questionNumber} ({question.type.replace(/_/g, ' ')})
                    </span>
                  </div>
                  {renderQuestion(question)}
                </div>
              ))}
            </QuizContentWithSelection>
          </div>
        </div>
      </div>
    </QuizLayoutWrapper>
  )
}