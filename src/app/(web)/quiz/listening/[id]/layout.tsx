'use client'

import { useEffect } from 'react'

export default function ListeningTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Hide header and footer
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')
    
    if (header) header.style.display = 'none'
    if (footer) footer.style.display = 'none'
    
    // Cleanup on unmount
    return () => {
      if (header) header.style.display = ''
      if (footer) footer.style.display = ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}