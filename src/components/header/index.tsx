'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useApp } from '@/contexts/app-context'
import { cn, componentSizes, typography } from '@/lib/design-tokens'
import { logout } from '@services/client.service'
import { Menu, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const navItems = [
  { name: 'Giới thiệu', href: '/introduce' },
  { name: 'Tin tức', href: '/news' },
  { name: 'Liên hệ', href: '/contact' },
]

export default function HeaderApp() {
  const { user, setUser } = useApp()
  const handleLogout = async () => {
    try {
      await logout()
      setUser(undefined)
      toast.success('Đăng xuất thành công')
    } catch (error) {
      toast.error('Đăng xuất thất bại')
    }
  }

  useEffect(() => {
    const logoElement = document.getElementById('header-logo')
    let isScrolling = false
    let isMobile = window.innerWidth < 768 // md breakpoint

    const handleScroll = () => {
      if (isScrolling) return
      isScrolling = true
      requestAnimationFrame(() => {
        if (!logoElement) {
          isScrolling = false
          return
        }

        const scrollY = window.scrollY
        const maxScroll = 100
        const scrollProgress = Math.min(scrollY / maxScroll, 1)

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
        isScrolling = false
      })
    }

    const handleResize = () => {
      isMobile = window.innerWidth < 768 // Update mobile check on resize
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
              <div className={cn(componentSizes.logo.lg, "bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white")}>
                <img
                  src="/images/r_ielts_logo.png"
                  alt="IELTS Logo"
                  className={cn(componentSizes.logo.base, "object-contain")}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/fallback_logo.png';
                  }}
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
                className={typography.navItem}
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
            {
              user?.id ? (
                <div onClick={() => handleLogout()} className={cn(typography.navItem, "cursor-pointer hidden sm:block")}>Đăng xuất</div>
              ) : (
                <Link href="/login" className={cn(typography.navItem, "hidden sm:block")}>
                  Đăng nhập
                </Link>
              )
            }
            <Button className={cn(typography.buttonPrimary, "bg-yellow-400 hover:bg-yellow-500 px-3 py-1.5 rounded-lg hidden xs:block")}>
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
                    {
                      user?.id ? (
                        <div onClick={() => handleLogout()} className="cursor-pointer text-base font-medium text-gray-700 hover:text-orange-500 transition-colors py-2">Đăng xuất</div>
                      ) : (
                        <Link href="/login" className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors py-2">
                          Đăng nhập
                        </Link>
                      )
                    }
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
            {
              user?.id ? (
                <div onClick={() => handleLogout()} className={cn(typography.navItem, "cursor-pointer")}>Đăng xuất</div>
              ) : (
                <Link href="/login" className={typography.navItem}>
                  Đăng nhập
                </Link>
              )
            }
            <Button className={cn(typography.buttonPrimary, "bg-yellow-400 hover:bg-yellow-500 px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-md border border-yellow-500")}>
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