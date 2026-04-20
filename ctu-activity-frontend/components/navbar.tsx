'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, LogOut, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/auth-store'

export default function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof initializeAuth === 'function') {
      initializeAuth().then(() => setIsHydrated(true))
    } else {
      console.error("initializeAuth is not a function in useAuthStore");
      setIsHydrated(true); // Tránh bị kẹt trạng thái loading
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="LCHSVCT Logo" 
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-white hidden sm:inline">
              LCHSVCT
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/activities"
              className="text-white hover:text-blue-100 transition-colors font-semibold text-sm"
            >
              Hoạt Động
            </Link>
            <Link
              href="/calendar"
              className="text-white hover:text-blue-100 transition-colors font-semibold text-sm"
            >
              Lịch trình
            </Link>
            <Link
              href="/progress"
              className="text-white hover:text-blue-100 transition-colors font-semibold text-sm"
            >
              Tiến Độ Của Tôi
            </Link>
            <Link
              href="/ai-recommendations"
              className="text-white hover:text-blue-100 transition-colors font-semibold text-sm flex items-center gap-2 relative group"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-spin" />
              <span className="relative">
                Gợi ý AI
                <span className="absolute -top-2 -right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-semibold animate-pulse border border-white/40">
                  New
                </span>
              </span>
            </Link>
          </div>

          {/* User Profile Dropdown (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isHydrated && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-10 px-2 text-white hover:bg-white/20">
                    <Avatar className="h-8 w-8">
                      {(user?.user?.avatarUrl || user?.avatarUrl) && (
                        <AvatarImage 
                          src={user?.user?.avatarUrl || user?.avatarUrl}
                          alt={user?.user?.fullName || user?.fullName || 'User avatar'}
                        />
                      )}
                      <AvatarFallback className="bg-white/20 text-white">{(user?.user?.fullName || user?.fullName)?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="text-sm font-medium">{user?.user?.fullName || user?.fullName}</div>
                    <div className="text-xs text-muted-foreground">{user?.user?.email || user?.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Hồ Sơ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Cài Đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="border-white bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:bg-white/20">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-white text-blue-600  hover:bg-blue-50">Đăng Ký</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-10 w-10 text-white hover:bg-white/20"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-gradient-to-b from-blue-600/95 to-purple-600/95 rounded-b-lg">
            <Link
              href="/activities"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Hoạt Động
            </Link>
            <Link
              href="/calendar"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Lịch trình
            </Link>
            <Link
              href="/progress"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              Tiến Độ Của Tôi
            </Link>
            <Link
              href="/ai-recommendations"
              className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-2 relative"
            >
              <Sparkles className="w-4 h-4" />
              <span className="flex items-center gap-2">
                Gợi ý AI
                <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded font-semibold animate-pulse border border-white/40">
                  New
                </span>
              </span>
            </Link>
            <hr className="my-2 border-white/20" />
            {isHydrated && isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Hồ Sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
