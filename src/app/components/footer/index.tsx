import Link from 'next/link'

export default function FooterApp() {
  return (
    <footer className="border-t bg-slate-50 text-slate-700">
      <div className="container py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo + Giới thiệu */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">🏠 Nhà Trọ Xịn Sò</h2>
          <p className="text-sm text-muted-foreground">
            Chúng tôi cung cấp giải pháp tìm phòng trọ đẹp, tiện nghi, an toàn và minh bạch nhất cho bạn.
          </p>
        </div>

        {/* Điều hướng */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Điều hướng</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
            <li><Link href="/rooms" className="hover:underline">Phòng trọ</Link></li>
            <li><Link href="#about-us" className="hover:underline">Giới thiệu</Link></li>
            <li><Link href="#contact-us" className="hover:underline">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Chính sách</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/terms" className="hover:underline">Điều khoản dịch vụ</Link></li>
            <li><Link href="/privacy" className="hover:underline">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* Liên hệ nhanh */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Liên hệ</h3>
          <p className="text-sm">Email: <a href="mailto:hotro@nhatroxinso.vn" className="hover:underline">hotro@nhatroxinso.vn</a></p>
          <p className="text-sm">Điện thoại: 0939 123 456</p>
          <p className="text-sm mt-2">© 2025 Nhà Trọ Xịn Sò</p>
        </div>
      </div>
    </footer>
  )
}
