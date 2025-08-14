'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class QuizErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Quiz Error Boundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-red-50 rounded-xl border border-red-200">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-red-900">
                Oops! Có lỗi xảy ra
              </h2>
              <p className="text-red-700 max-w-md">
                Đã xảy ra lỗi không mong muốn trong quiz. Vui lòng thử lại hoặc tải lại trang.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700"
              >
                Tải lại trang
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Chi tiết lỗi (Development only)
                </summary>
                <pre className="mt-2 text-xs bg-red-100 p-3 rounded border overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component wrapper
export function withQuizErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <QuizErrorBoundary fallback={fallback}>
        <Component {...props} />
      </QuizErrorBoundary>
    )
  }
}
