'use client'

import Link from 'next/link'

export function QuizDemoIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Component Library</h1>
            <p className="text-gray-600">Interactive quiz components with multiple question types</p>
          </div>
        </div>
      </header>

      {/* Demo Type Selection */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Choose Demo Type
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Multiple Choice Demo */}
            <Link href="/quiz-demo/multi-choice" className="group">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-blue-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Choice</h3>
                  <p className="text-gray-600 mb-4">Trắc nghiệm nhiều lựa chọn với các tính năng:</p>
                  <ul className="text-sm text-gray-500 space-y-1 text-left">
                    <li>• Single & multiple selection</li>
                    <li>• Reading passages</li>
                    <li>• Results validation</li>
                    <li>• Progress tracking</li>
                    <li>• Accessibility support</li>
                  </ul>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg group-hover:bg-blue-600 transition-colors">
                      Try Demo →
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Fill in the Blanks Demo */}
            <Link href="/quiz-demo/fill-in-blank" className="group">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-green-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fill in the Blanks</h3>
                  <p className="text-gray-600 mb-4">Điền vào chỗ trống với các tính năng:</p>
                  <ul className="text-sm text-gray-500 space-y-1 text-left">
                    <li>• Smart blank positioning</li>
                    <li>• Auto-resize inputs</li>
                    <li>• Real-time validation</li>
                    <li>• Detailed scoring</li>
                    <li>• Keyboard navigation</li>
                  </ul>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg group-hover:bg-green-600 transition-colors">
                      Try Demo →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Component Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance Optimized</h3>
              <p className="text-sm text-gray-600">React.memo, optimized re-renders, and efficient state management</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility First</h3>
              <p className="text-sm text-gray-600">WCAG compliant, keyboard navigation, and screen reader support</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-sm text-gray-600">Touch gestures, responsive design, and mobile-first approach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Quiz Component Library - Built with React, TypeScript & Tailwind CSS</p>
            <p className="mt-2">
              <Link href="/quiz-demo" className="text-blue-600 hover:text-blue-800">
                View Legacy Demo
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
