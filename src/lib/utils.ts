import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a cryptographically secure random ID
 * Falls back to a high-quality pseudo-random ID if crypto.randomUUID is not available
 */
export function generateId(prefix?: string): string {
  let id: string
  
  // Try to use crypto.randomUUID if available (most secure)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    id = crypto.randomUUID()
  } else {
    // Fallback: Generate a high-quality pseudo-random ID
    // Using timestamp + multiple random components to reduce collision risk
    const timestamp = Date.now().toString(36)
    const randomPart1 = Math.random().toString(36).substring(2, 11)
    const randomPart2 = Math.random().toString(36).substring(2, 7)
    id = `${timestamp}-${randomPart1}-${randomPart2}`
  }
  
  return prefix ? `${prefix}-${id}` : id
}
