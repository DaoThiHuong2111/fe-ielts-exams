'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { MobileProgressBar, useMobileProgressBar } from './mobile-progress-bar'
import { useSwipeGesturesCombined } from '@/hooks/useSwipeGestures'

interface MobileQuizLayoutProps {
  children: ReactNode
  currentQuestionIndex: number
  totalQuestions: number
  answeredCount: number
  onPrevious?: () => void
  onNext?: () => void
  timeLeft?: number
  className?: string
  showTimer?: boolean
  enableSwipeGestures?: boolean
  showMobileProgressBar?: boolean
}

export const MobileQuizLayout = React.memo(function MobileQuizLayout({
  children,
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  onPrevious,
  onNext,
  timeLeft,
  className,
  showTimer = true,
  enableSwipeGestures = true,
  showMobileProgressBar = true
}: MobileQuizLayoutProps) {
  const isMobile = useMobileProgressBar()
  
  // Swipe gesture handlers
  const swipeRef = useSwipeGesturesCombined({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    minSwipeDistance: 50,
    maxSwipeTime: 300,
    disabled: !enableSwipeGestures
  })

  return (
    <div className={cn('relative min-h-screen', className)}>
      {/* Mobile Progress Bar */}
      {isMobile && showMobileProgressBar && (
        <MobileProgressBar
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          onPrevious={onPrevious}
          onNext={onNext}
          timeLeft={timeLeft}
          showTimer={showTimer}
        />
      )}

      {/* Main Content */}
      <div 
        ref={swipeRef}
        className={cn(
          'w-full',
          isMobile && showMobileProgressBar ? 'pt-16' : '', // Account for mobile progress bar
          'pb-safe' // Safe area for iOS
        )}
      >
        {/* Content with touch-friendly spacing */}
        <div className="px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </div>

        {/* Swipe Indicators (only on mobile) */}
        {isMobile && enableSwipeGestures && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className="flex items-center gap-2 px-3 py-2 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
              <span>←</span>
              <span>Vuốt để chuyển câu</span>
              <span>→</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

// Responsive Quiz Container that adapts to screen size
export const ResponsiveQuizContainer = React.memo(function ResponsiveQuizContainer({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      // Base styles
      'w-full max-w-4xl mx-auto',
      
      // Mobile styles
      'px-4 py-6',
      
      // Tablet styles
      'sm:px-6 sm:py-8',
      
      // Desktop styles
      'lg:px-8 lg:py-12',
      
      // Background and borders
      'bg-white rounded-none sm:rounded-xl',
      'border-0 sm:border sm:border-gray-200',
      'shadow-none sm:shadow-lg',
      
      className
    )}>
      {children}
    </div>
  )
})

// Mobile-optimized button group
export const MobileButtonGroup = React.memo(function MobileButtonGroup({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      // Base layout
      'flex flex-col gap-3',
      
      // Mobile: Stack vertically with full width
      'sm:flex-row sm:justify-center sm:gap-4',
      
      // Tablet and up: Horizontal layout
      'lg:gap-6',
      
      className
    )}>
      {children}
    </div>
  )
})

// Touch-friendly spacing component
export const TouchFriendlySpacing = React.memo(function TouchFriendlySpacing({
  children,
  size = 'md',
  className
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'space-y-3 sm:space-y-4',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8'
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  )
})

// Hook for mobile-specific behaviors
export function useMobileQuizBehaviors() {
  const [isMobile, setIsMobile] = React.useState(false)
  const [isLandscape, setIsLandscape] = React.useState(false)
  const [viewportHeight, setViewportHeight] = React.useState(0)

  React.useEffect(() => {
    const updateMobileState = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < 768)
      setIsLandscape(width > height)
      setViewportHeight(height)
    }

    updateMobileState()
    window.addEventListener('resize', updateMobileState)
    window.addEventListener('orientationchange', updateMobileState)
    
    return () => {
      window.removeEventListener('resize', updateMobileState)
      window.removeEventListener('orientationchange', updateMobileState)
    }
  }, [])

  // Prevent zoom on double tap (iOS Safari)
  React.useEffect(() => {
    if (!isMobile) return

    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    document.addEventListener('touchend', preventZoom, { passive: false })
    
    return () => {
      document.removeEventListener('touchend', preventZoom)
    }
  }, [isMobile])

  return {
    isMobile,
    isLandscape,
    viewportHeight,
    isSmallScreen: viewportHeight < 600,
    shouldUseCompactLayout: isMobile && isLandscape
  }
}
