'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface DemoLayoutProps {
  children: React.ReactNode
}

export function DemoLayout({ children }: DemoLayoutProps) {
  const pathname = usePathname()

  const demoTypes = [
    {
      href: '/quiz-demo/multi-choice',
      label: 'Multiple Choice',
      description: 'Trắc nghiệm nhiều lựa chọn'
    },
    {
      href: '/quiz-demo/fill-in-blank',
      label: 'Fill in the Blanks',
      description: 'Điền vào chỗ trống'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quiz Demo</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Interactive quiz components showcase</p>
            </div>

            <Link
              href="/quiz-demo"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto"
            >
              ← Back to Main Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
            {demoTypes.map((demo) => (
              <Link
                key={demo.href}
                href={demo.href}
                className={cn(
                  'py-3 sm:py-4 px-2 border-b-2 font-medium text-sm transition-colors',
                  pathname === demo.href
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <div>
                  <div className="font-semibold">{demo.label}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{demo.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>


    </div>
  )
}
