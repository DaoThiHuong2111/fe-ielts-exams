'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, ShoppingCart } from 'lucide-react'
import { useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navItems = [
  { name: 'Giới thiệu', href: '/about' },
  { name: 'Tin tức', href: '/news' },
  { name: 'Liên hệ', href: '/contact' },
]

export default function HeaderApp() {
  useEffect(() => {
    const logoElement = document.getElementById('header-logo')
    
    const handleScroll = () => {
      if (!logoElement) return
      
      const scrollY = window.scrollY
      const maxScroll = 100
      const scrollProgress = Math.min(scrollY / maxScroll, 1)
      
      // Check if mobile or desktop
      const isMobile = window.innerWidth < 768 // md breakpoint
      
      if (isMobile) {
        // Mobile: Logo stays fixed on left side
        logoElement.style.top = '50%'
        logoElement.style.left = '20px'
        logoElement.style.transform = 'translateY(-50%)'
      } else {
        // Desktop: Header height is 80px, Logo is 80px (w-20 h-20)
        // Logo moves from bottom to center during scroll
        const startPosition = 80 // Logo center at bottom edge (80px from top)
        const endPosition = 40   // Logo center at middle of header (40px from top)
        const currentPosition = startPosition - (scrollProgress * (startPosition - endPosition))
        logoElement.style.top = `${currentPosition}px`
        logoElement.style.left = '50%'
        logoElement.style.transform = 'translate(-50%, -50%)'
      }
    }

    const handleResize = () => {
      handleScroll() // Re-calculate position on resize
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    handleScroll() // Initial position
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 h-20" style={{ transform: 'translate3d(0, 0, 0)' }}>
      <div className="container mx-auto px-4 md:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Fixed position on mobile, animated on desktop */}
          <div 
            id="header-logo"
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              // Initial position - will be updated by JavaScript based on screen size
              top: '40px', 
              left: '20px', // Mobile default
              transform: `translateY(-50%)`, // Mobile default
              willChange: 'transform' // Optimize for animations
            }}
          >
            <Link href="/" className="flex items-center">
              <div className="w-20 h-20 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <img 
                  src="/images/r_ielts_logo.png" 
                  alt="IELTS Logo" 
                  className="w-16 h-16 md:w-16 md:h-16 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Left navigation - Desktop only */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile actions - visible on mobile */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors hidden xs:block">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">0</span>
            </button>
            <Link href="/login" className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors hidden min-[480px]:block">
              Đăng nhập
            </Link>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-1.5 rounded-lg text-sm hidden min-[380px]:block">
              Thi thử ngay
            </Button>
            <Sheet>
              <SheetTrigger className="p-2">
                <Menu className="h-6 w-6 text-gray-700" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-6 mt-8">
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors py-2"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-3 pt-4 border-t">
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ShoppingCart className="h-5 w-5 text-gray-700" />
                      <span className="text-base font-medium text-gray-700">Giỏ hàng</span>
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">0</span>
                    </button>
                    <Link href="/login" className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors py-2">
                      Đăng nhập
                    </Link>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full rounded-lg flex items-center justify-center gap-2 py-3">
                      Thi thử ngay
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop actions - hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">0</span>
            </button>
            <Link href="/login" className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors">
              Đăng nhập
            </Link>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-md border border-yellow-500">
              Thi thử ngay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}