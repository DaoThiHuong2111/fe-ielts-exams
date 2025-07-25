'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

const navItems = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Phòng trọ', href: '/rooms' },
  { name: 'Giới thiệu', href: '#about-us' },
  { name: 'Liên hệ', href: '#contact-us' },
]

export default function HeaderApp() {
  return (
    <header className="w-full border-b bg-slate-50 text-slate-700 sticky top-0 z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          🏠 Nhà Trọ Xịn Sò
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Button asChild className="ml-4">
            <Link href="/booking">Tìm phòng ngay</Link>
          </Button>
        </nav>

        {/* Mobile nav */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px]">
            <nav className="mt-8 flex flex-col gap-4 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="mt-4">
                <Link href="/booking">Đặt phòng ngay</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
