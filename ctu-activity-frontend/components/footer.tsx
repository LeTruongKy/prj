import Link from 'next/link'
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="text-white"
      style={{ background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%), linear-gradient(to bottom, #ffffff 0%, #f0f9ff 100%)' }}
    >
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand Column */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="LCHSVCT Logo" 
                className="w-11 h-11 rounded-xl object-cover shadow-lg shrink-0"
              />
              <div>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">LCHSVCT</span>
                <p className="text-xs text-blue-600 font-medium">Liên Chi Hội Sinh Viên CTU</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Nền tảng quản lý hoạt động sinh viên hiện đại — kết nối, phát triển, và trao quyền
              cho sinh viên Đại học Cần Thơ.
            </p>
            {/* Social media placeholder */}
            <div className="flex gap-3">
              {['f', 'in', 'yt'].map((s, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg border border-transparent hover:shadow-blue-500/20 flex items-center justify-center cursor-pointer transition-all duration-200 text-xs font-bold text-white"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
              Liên Kết Nhanh
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/activities', label: 'Hoạt Động' },
                { href: '/progress', label: 'Tiến Độ Của Tôi' },
                { href: '/calendar', label: 'Lịch Hoạt Động' },
                { href: '/profile', label: 'Hồ Sơ' },
                { href: '/login', label: 'Đăng Nhập' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
              Tài Nguyên
            </h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Hướng Dẫn Sử Dụng' },
                { href: '#', label: 'Câu Hỏi Thường Gặp' },
                { href: '#', label: 'Liên Hệ Hỗ Trợ' },
                { href: '#', label: 'Phản Hồi & Góp Ý' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">
              Liên Hệ
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600 leading-relaxed">
                  Khu II, Đường 3/2, P. Xuân Khánh,<br />Q. Ninh Kiều, TP. Cần Thơ
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <a
                  href="mailto:support@ctu.edu.vn"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  support@ctu.edu.vn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <a
                  href="tel:+84292373075"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  +84 (0) 292 3730 075
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-xs text-gray-600 text-center sm:text-left">
            © {currentYear}{' '}
            <span className="text-gray-700 font-medium">Liên Chi Hội Sinh Viên CTU</span>
            . Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6">
            {['Chính Sách Bảo Mật', 'Điều Khoản Sử Dụng', 'Liên Hệ'].map((item, i) => (
              <Link
                key={i}
                href="#"
                className="text-xs text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
