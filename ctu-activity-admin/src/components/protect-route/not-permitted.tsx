"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAppRouter } from "@/hooks/useAppRouter";

export const NotPermitted = () => {
  const { goLogin } = useAppRouter();
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-12 w-12 text-blue-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>

        <p className="text-gray-600 mb-6">
          Bạn không đủ quyền để truy cập trang này. Hãy đăng nhập bằng tài khoản có quyền phù hợp.
        </p>

        <button
          onClick={goLogin}
          className="w-full text-white font-medium py-2.5 rounded-lg transition-all cursor-pointer hover:opacity-90"
          style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' }}
        >
          Quay về trang đăng nhập
        </button>
      </div>
    </div>
  );
};
