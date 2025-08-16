'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import FooterApp from "@/components/footer"
import HeaderApp from "@/components/header"

interface ConditionalLayoutProps {
  children: ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Show header/footer on main quiz-demo page, but hide on sub-pages
  const isQuizDemoSubPage = pathname.includes('/quiz-demo/') // Sub-pages have slash after quiz-demo
  const shouldShowHeader = !isQuizDemoSubPage // Show header unless it's a sub-page
  
  return (
    <>
      {shouldShowHeader && <HeaderApp />}
      {children}
      {shouldShowHeader && <FooterApp />}
    </>
  )
}
