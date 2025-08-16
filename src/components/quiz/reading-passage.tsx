'use client'

import { cn, generateId } from "@/lib/utils"
import React from 'react'

interface ReadingPassageProps {
  title?: string
  passage: string
  className?: string
  highlightedText?: string[]
}

export const ReadingPassage = React.memo(function ReadingPassage({
  title,
  passage,
  className,
  highlightedText = []
}: ReadingPassageProps) {
  const passageId = generateId('passage')
  const titleId = title ? generateId('passage-title') : undefined
  // Highlight text function
  const highlightPassage = (text: string) => {
    if (highlightedText.length === 0) return text

    let highlightedText_copy = text
    highlightedText.forEach((highlight, index) => {
      const regex = new RegExp(`(${highlight})`, 'gi')
      highlightedText_copy = highlightedText_copy.replace(
        regex,
        `<mark class="bg-yellow-200 px-1 rounded" aria-label="Highlighted text">$1</mark>`
      )
    })
    return highlightedText_copy
  }

  return (
    <section
      className={cn("bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-200", className)}
      role="article"
      aria-labelledby={titleId}
    >
      {title && (
        <h3
          id={titleId}
          className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2 text-center"
        >
          {title}
        </h3>
      )}
      <div className="prose prose-sm max-w-none">
        <div
          id={passageId}
          className="text-gray-700 leading-relaxed whitespace-pre-line text-justify text-xs sm:text-sm"
          role="document"
          aria-label={title ? `Reading passage: ${title}` : 'Reading passage'}
          tabIndex={0}
          dangerouslySetInnerHTML={{
            __html: highlightPassage(passage)
          }}
        />
      </div>

      {/* Screen reader helper */}
      <div className="sr-only">
        Đây là đoạn văn để đọc. Sử dụng phím Tab để điều hướng qua các câu hỏi bên dưới.
      </div>
    </section>
  )
})
