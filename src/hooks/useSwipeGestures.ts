'use client'

import { useEffect, useRef, useCallback } from 'react'

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  minSwipeDistance?: number // pixels
  maxSwipeTime?: number // milliseconds
  preventDefaultTouchmove?: boolean
  disabled?: boolean
}

export interface TouchPoint {
  x: number
  y: number
  time: number
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
  maxSwipeTime = 300,
  preventDefaultTouchmove = true,
  disabled = false
}: SwipeGestureOptions) {
  const touchStartRef = useRef<TouchPoint | null>(null)
  const touchEndRef = useRef<TouchPoint | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return
    
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    touchEndRef.current = null
  }, [disabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled) return
    
    if (preventDefaultTouchmove) {
      e.preventDefault()
    }
  }, [disabled, preventDefaultTouchmove])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (disabled || !touchStartRef.current) return
    
    const touch = e.changedTouches[0]
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    const touchStart = touchStartRef.current
    const touchEnd = touchEndRef.current
    
    // Calculate distance and time
    const deltaX = touchEnd.x - touchStart.x
    const deltaY = touchEnd.y - touchStart.y
    const deltaTime = touchEnd.time - touchStart.time
    
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    // Check if swipe is valid (distance and time)
    if (deltaTime > maxSwipeTime) return
    
    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > minSwipeDistance) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > minSwipeDistance) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }
    
    // Reset
    touchStartRef.current = null
    touchEndRef.current = null
  }, [disabled, maxSwipeTime, minSwipeDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current
    if (!element || disabled) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd])

  return elementRef
}

// Hook for mouse swipe support (for testing on desktop)
export function useMouseSwipeGestures(options: SwipeGestureOptions) {
  const mouseStartRef = useRef<TouchPoint | null>(null)
  const mouseEndRef = useRef<TouchPoint | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)
  const isDraggingRef = useRef(false)

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    disabled = false
  } = options

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (disabled) return
    
    isDraggingRef.current = true
    mouseStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    }
    mouseEndRef.current = null
    
    e.preventDefault()
  }, [disabled])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (disabled || !isDraggingRef.current) return
    
    e.preventDefault()
  }, [disabled])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (disabled || !isDraggingRef.current || !mouseStartRef.current) return
    
    isDraggingRef.current = false
    mouseEndRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    }

    const mouseStart = mouseStartRef.current
    const mouseEnd = mouseEndRef.current
    
    // Calculate distance and time
    const deltaX = mouseEnd.x - mouseStart.x
    const deltaY = mouseEnd.y - mouseStart.y
    const deltaTime = mouseEnd.time - mouseStart.time
    
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    // Check if swipe is valid (distance and time)
    if (deltaTime > maxSwipeTime) return
    
    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > minSwipeDistance) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > minSwipeDistance) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }
    
    // Reset
    mouseStartRef.current = null
    mouseEndRef.current = null
  }, [disabled, maxSwipeTime, minSwipeDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current
    if (!element || disabled) return

    element.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [disabled, handleMouseDown, handleMouseMove, handleMouseUp])

  return elementRef
}

// Combined hook for both touch and mouse
export function useSwipeGesturesCombined(options: SwipeGestureOptions) {
  const touchRef = useSwipeGestures(options)
  const mouseRef = useMouseSwipeGestures(options)

  // Return a ref that can be used for both
  const combinedRef = useCallback((element: HTMLElement | null) => {
    if (touchRef.current) touchRef.current = element
    if (mouseRef.current) mouseRef.current = element
  }, [touchRef, mouseRef])

  return combinedRef
}
