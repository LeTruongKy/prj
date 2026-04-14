import { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Tạo Tài Khoản | LCHSVCT-CTU',
  description: 'Tạo tài khoản LCHSVCT mới',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* LEFT SIDE - HERO SECTION */}
      <div className="hidden lg:flex lg:w-[50%] flex-col justify-between p-10 text-white relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(37, 99, 235, 0.75) 40%, rgba(124, 58, 237, 0.8) 100%)',
            }}
          ></div>
        </div>

        {/* Decorative blur circles */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          {/* Logo */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">LCHSVCT</h2>
          </div>

          {/* Main Heading */}
          <div className="space-y-5 max-w-md">
            <h1 className="text-5xl font-extrabold leading-tight">
              Tham gia LCHSVCT ngay hôm nay
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Tạo tài khoản của bạn để khám phá và tham gia các hoạt động sinh
              viên. Nâng cao trải nghiệm đại học của bạn thông qua sự hợp tác
              không gián đoạn.
            </p>
          </div>

          {/* Bottom Floating Card */}
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">
                  5,000+ Sinh viên đã tham gia
                </p>
                <p className="text-sm text-blue-100 mt-1">
                  Truy cập hơn 200+ tổ chức trên campus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - REGISTER FORM */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center px-6 py-10 sm:px-8 lg:px-14 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Logo for Mobile */}
          <div className="flex lg:hidden justify-center mb-8">
            <div
              className="text-3xl font-bold"
              style={{
                background:
                  'linear-gradient(90deg, rgb(37, 99, 235) 0%, rgb(147, 51, 234) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LCHSVCT
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              Tạo Tài Khoản
            </h2>
            <p className="text-gray-500">
              Bắt đầu hành trình sinh viên của bạn.
            </p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8 border border-gray-100">
            {/* Register Form - preserves all original functionality */}
            <RegisterForm />
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-7">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Footer */}
          {/* <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
              <Link
                href="#"
                className="hover:text-blue-600 transition-colors font-medium tracking-widest uppercase"
              >
                Trợ giúp
              </Link>
              <Link
                href="#"
                className="hover:text-blue-600 transition-colors font-medium tracking-widest uppercase"
              >
                Quyền riêng tư
              </Link>
              <Link
                href="#"
                className="hover:text-blue-600 transition-colors font-medium tracking-widest uppercase"
              >
                Liên hệ
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
