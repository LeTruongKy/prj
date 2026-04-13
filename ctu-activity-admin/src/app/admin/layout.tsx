import { AppSidebar } from "@/components/admin/layout/AppSidebar";
import { ProtectedRoute } from "@/components/protect-route";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProtectedRoute>
        <SidebarProvider>
          <TooltipProvider>
            <div className="flex min-h-screen w-full bg-[#f0f2f5]">
              <AppSidebar />
              <SidebarInset className="flex-1 w-full min-w-0 flex flex-col">
                <AdminHeader />
                <main className="flex-1 overflow-auto p-6">{children}</main>
                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between text-sm text-gray-500">
                  <span>© 2024 CTU Activity Admin. Tất cả quyền được bảo lưu.</span>
                  <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-gray-700 transition-colors">Điều khoản</a>
                    <a href="#" className="hover:text-gray-700 transition-colors">Bảo mật</a>
                    <a href="#" className="hover:text-gray-700 transition-colors">Trợ giúp</a>
                  </div>
                </footer>
              </SidebarInset>
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </ProtectedRoute>
    </>
  );
}
