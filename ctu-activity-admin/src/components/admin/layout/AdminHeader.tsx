"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { LogOut, Bell, HelpCircle, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { TabHeaderName } from "@/constants/path";
import { authService } from "@/services/authService";
import { AuthMessage } from "@/constants/messages/authMessage";
import { toast } from "sonner";
import { useAppRouter } from "@/hooks/useAppRouter";

export default function AdminHeader() {
  const { authUser, logOutAction } = useAuthStore();
  const { goLogin } = useAppRouter();
  const pathName = usePathname();
  const tabHeaderName = TabHeaderName[pathName];

  const haneleLogOut = async () => {
    try {
      const res = await authService.callLogout();
      if (res) {
        goLogin();
        toast.success(AuthMessage.logoutSuccess);
        logOutAction();
      }
    } catch (error) {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <SidebarTrigger className="text-gray-500 hover:text-gray-800 transition-colors" />

      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          /> */}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 ml-auto">
        {/* <button className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <button className="p-2.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button> */}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{authUser.fullName ?? "Tài khoản"}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">Quản trị viên</p>
              </div>
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md" style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)' }}>
                {authUser.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 mr-2">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                haneleLogOut();
              }}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
