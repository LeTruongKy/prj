"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Calendar, Users, LayoutGrid, ShieldCheck, UserCheck, School, GraduationCap, LogOut, Settings, PlusCircle } from "lucide-react";
import { adminPath } from "@/constants/path";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";
import { AuthMessage } from "@/constants/messages/authMessage";
import { toast } from "sonner";
import { useAppRouter } from "@/hooks/useAppRouter";

export function AppSidebar() {
  const pathname = usePathname();
  const { isAuthenticated, authUser, logOutAction } = useAuthStore();
  const { goLogin } = useAppRouter();

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: adminPath.DASHBOARD },
    { title: "Hoạt Động", icon: Calendar, href: adminPath.ACTIVITIES },
    { title: "Đơn Vị Tổ Chức", icon: School, href: adminPath.ORGANIZING_UNITS },
    { title: "Loại Hoạt Động", icon: LayoutGrid, href: adminPath.ACTIVITY_TYPES },
    { title: "Sinh Viên", icon: Users, href: adminPath.STUDENTS },
    { title: "Vai trò", icon: UserCheck, href: adminPath.ROLES },
  ];

  const handleLogOut = async () => {
    try {
      const res = await authService.callLogout();
      if (res && res.statusCode === 200) {
        goLogin();
        toast.success(AuthMessage.logoutSuccess);
        logOutAction();
      }
    } catch (error) {
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Sidebar className="border-r-0">
      {/* Header */}
      <SidebarHeader className="bg-[#0a1628] border-b border-white/10">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-blue-400 opacity-30 animate-pulse"></div>
            <div
              className="relative flex h-11 w-11 items-center justify-center rounded-xl 
                      bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 
                      shadow-lg shadow-blue-500/30"
                      style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))' }}
            >
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white tracking-tight">
              LCHSVCT Admin
            </h1>
            <p className="text-[10px] tracking-widest text-blue-300/70 font-semibold uppercase">Quản trị hệ thống</p>
          </div>
        </div>

        {/* Create Activity Button */}
        <div className="px-4 pb-4">
          <Link
            href={adminPath.ACTIVITIES}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))', boxShadow: '0 8px 16px -2px rgba(37, 99, 235, 0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <PlusCircle className="h-4 w-4" />
            Tạo Hoạt Động
          </Link>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-[#0a1628]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-5 mb-1">
            Quản lý
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        rounded-lg h-10 px-3 transition-all duration-200
                        ${isActive
                          ? "text-white shadow-lg hover:text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                        }
                      `}
                      style={isActive ? { background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(147, 51, 234))', boxShadow: '0 8px 16px -2px rgba(37, 99, 235, 0.3)', color: 'white' } : undefined}
                    >
                      <Link href={item.href}>
                        <item.icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-[#0a1628] border-t border-white/10 p-4">
        {isAuthenticated === true ? (
          <div className="space-y-2">
            <Link
              href="#"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
            </Link>
            <button
              onClick={handleLogOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors text-sm cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
