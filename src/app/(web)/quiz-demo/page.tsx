'use client'

import styles from './quiz-demo.module.css'

export default function QuizDemoPage() {
  return (
    <div className={styles['quiz-demo']}>
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          IELTS Quiz Demo
        </h1>
        <p className="text-gray-600 mb-8">
          Choose a quiz type to get started
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/quiz-demo/fill-in-blank"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Fill in the Blanks
          </a>
          <a
            href="/quiz-demo/multi-choice"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Multiple Choice
          </a>
        </div>
      </div>
    </div>
  )
}
