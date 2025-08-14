'use client'

import { useEffect, useCallback, useRef } from 'react'

export interface QuizSaveData {
  quizSelections: Record<number, string[]>
  currentQuizIndex: number
  timestamp: number
  sessionId: string
}

export interface UseQuizAutoSaveOptions {
  data: Omit<QuizSaveData, 'timestamp' | 'sessionId'>
  interval?: number // milliseconds, default 30000 (30 seconds)
  storageKey?: string
  onSave?: (data: QuizSaveData) => void
  onLoad?: (data: QuizSaveData | null) => void
  enabled?: boolean
}

export interface UseQuizAutoSaveReturn {
  saveNow: () => void
  clearSaved: () => void
  loadSaved: () => QuizSaveData | null
  lastSaved: number | null
  sessionId: string
}

export function useQuizAutoSave({
  data,
  interval = 30000,
  storageKey = 'quiz-auto-save',
  onSave,
  onLoad,
  enabled = true
}: UseQuizAutoSaveOptions): UseQuizAutoSaveReturn {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<number | null>(null)
  const sessionIdRef = useRef<string>('')

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `quiz-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }, [])

  const saveToStorage = useCallback((saveData: QuizSaveData) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(saveData))
      lastSavedRef.current = saveData.timestamp
      onSave?.(saveData)
    } catch (error) {
      console.warn('Failed to save quiz data to localStorage:', error)
    }
  }, [storageKey, onSave])

  const loadFromStorage = useCallback((): QuizSaveData | null => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsedData = JSON.parse(saved) as QuizSaveData
        onLoad?.(parsedData)
        return parsedData
      }
    } catch (error) {
      console.warn('Failed to load quiz data from localStorage:', error)
    }
    onLoad?.(null)
    return null
  }, [storageKey, onLoad])

  const saveNow = useCallback(() => {
    if (!enabled) return

    const saveData: QuizSaveData = {
      ...data,
      timestamp: Date.now(),
      sessionId: sessionIdRef.current
    }
    
    saveToStorage(saveData)
  }, [data, enabled, saveToStorage])

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
      lastSavedRef.current = null
    } catch (error) {
      console.warn('Failed to clear saved quiz data:', error)
    }
  }, [storageKey])

  // Auto-save effect
  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Set up new interval
    intervalRef.current = setInterval(() => {
      saveNow()
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, saveNow])

  // Save on data change (debounced)
  useEffect(() => {
    if (!enabled) return

    const timeoutId = setTimeout(() => {
      saveNow()
    }, 1000) // Debounce for 1 second

    return () => clearTimeout(timeoutId)
  }, [data.quizSelections, data.currentQuizIndex, enabled, saveNow])

  // Save on page unload
  useEffect(() => {
    if (!enabled) return

    const handleBeforeUnload = () => {
      saveNow()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveNow()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, saveNow])

  return {
    saveNow,
    clearSaved,
    loadSaved: loadFromStorage,
    lastSaved: lastSavedRef.current,
    sessionId: sessionIdRef.current
  }
}
