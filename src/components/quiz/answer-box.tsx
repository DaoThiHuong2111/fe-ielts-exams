'use client'

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AnswerBoxProps {
  boxNumber: number
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function AnswerBox({ 
  boxNumber, 
  value = "", 
  onChange,
  className,
  placeholder = "",
  disabled = false
}: AnswerBoxProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-gray-600 min-w-[20px]">
        {boxNumber}
      </span>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "w-16 h-10 text-center text-sm font-medium uppercase",
          "focus:border-yellow-400 focus:ring-yellow-400/20"
        )}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={1}
      />
    </div>
  )
}
