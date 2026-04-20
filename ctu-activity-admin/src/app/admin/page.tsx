"use client";

import { useEffect, useState } from "react";
import { ActivityService } from "@/services/activityService";
import { UserService } from "@/services/userService";
import { UnitService } from "@/services/unitService";
import { ActivityCategoryService } from "@/services/activityCategoryService";
import {
  Calendar,
  Users,
  School,
  LayoutGrid,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { IActivity } from "@/types/activity.type";
import { formatDate } from "@/utils/formateDate";
import Link from "next/link";
import { adminPath } from "@/constants/path";

interface Stats {
  totalActivities: number;
  pendingActivities: number;
  totalStudents: number;
  totalUnits: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalActivities: 0,
    pendingActivities: 0,
    totalStudents: 0,
    totalUnits: 0
  });
  const [recentActivities, setRecentActivities] = useState<IActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [actRes, userRes, unitRes, catRes] = await Promise.all([
          ActivityService.CallFetchActivitiesList(),
          UserService.CallFetchUsersList(),
          UnitService.CallFetchUnitsList(),
          ActivityCategoryService.CallFetchCategoriesList()
        ]);
        console.log("Dashboard data:", { actRes, userRes, unitRes, catRes });
        const activities = Array.isArray(actRes?.data.data) ? actRes?.data.data : [];

        setStats({
          totalActivities: activities.length,
          pendingActivities: activities.filter(a => a.status === "PENDING").length,
          totalStudents: Array.isArray(userRes?.data) ? userRes.data.length : 0,
          totalUnits: Array.isArray(unitRes?.data) ? unitRes.data.length : 0
        });

        // Get latest 5 activities
        const sorted = [...activities].sort((a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        ).slice(0, 5);
        setRecentActivities(sorted);

      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "TỔNG HOẠT ĐỘNG",
      value: stats.totalActivities,
      icon: Calendar,
      description: "Hoạt động đã đăng ký",
      gradient: "from-blue-600 to-purple-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "CHỜ PHÊ DUYỆT",
      value: stats.pendingActivities,
      icon: AlertCircle,
      description: "Yêu cầu cần xử lý gấp",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "TỔNG SINH VIÊN",
      value: stats.totalStudents,
      icon: Users,
      description: "Tài khoản người dùng",
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "ĐƠN VỊ TỔ CHỨC",
      value: stats.totalUnits,
      icon: School,
      description: "Đã xác minh hệ thống",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    }
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "Đã duyệt";
      case "PENDING": return "Chờ duyệt";
      case "DRAFT": return "Bản nháp";
      case "APPROVED": return "Đã phê duyệt";
      case "COMPLETED": return "Hoàn thành";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PUBLISHED":
      case "APPROVED":
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";
      case "PENDING":
        return "bg-amber-50 text-amber-700";
      case "CANCELLED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Chào mừng trở lại, quản trị viên. Dưới đây là tóm tắt hoạt động hôm nay.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm
                       hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {card.title}
              </p>
              <div className={`${card.iconBg} p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? (
                <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse" />
              ) : (
                card.value.toLocaleString()
              )}
            </div>
            <p className="text-xs text-gray-400">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Recent Activities */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Hoạt động gần đây
            </h3>
            <Link
              href={adminPath.ACTIVITIES}
              className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              Xem tất cả <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            <div className="space-y-1">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div
                    key={activity.activity_id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                        <p className="text-xs text-gray-400">
                          {activity.location && `${activity.location} • `}{formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ml-3 ${getStatusStyle(activity.status)}`}
                    >
                      {getStatusLabel(activity.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Chưa có hoạt động nào được tạo.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions + System Status */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Phím tắt nhanh
              </h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={adminPath.ACTIVITIES}
                  className="flex flex-col items-center justify-center p-5 rounded-xl bg-blue-50 border border-blue-100 
                           hover:bg-blue-100 hover:border-blue-200 transition-all group"
                >
                  <Calendar className="h-7 w-7 text-blue-500 mb-2.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700">Tạo hoạt động</span>
                </Link>
                <Link
                  href={adminPath.STUDENTS}
                  className="flex flex-col items-center justify-center p-5 rounded-xl bg-emerald-50 border border-emerald-100 
                           hover:bg-emerald-100 hover:border-emerald-200 transition-all group"
                >
                  <Users className="h-7 w-7 text-emerald-500 mb-2.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700">Quản lý SV</span>
                </Link>
                <Link
                  href={adminPath.ROLES}
                  className="flex flex-col items-center justify-center p-5 rounded-xl bg-purple-50 border border-purple-100 
                           hover:bg-purple-100 hover:border-purple-200 transition-all group"
                >
                  <ShieldCheck className="h-7 w-7 text-purple-500 mb-2.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700">Phân quyền</span>
                </Link>
                <Link
                  href={adminPath.ORGANIZING_UNITS}
                  className="flex flex-col items-center justify-center p-5 rounded-xl bg-cyan-50 border border-cyan-100 
                           hover:bg-cyan-100 hover:border-cyan-200 transition-all group"
                >
                  <School className="h-7 w-7 text-cyan-500 mb-2.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-700">Đơn vị</span>
                </Link>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 relative overflow-hidden shadow-lg shadow-purple-600/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
            <div className="relative">
              <h4 className="text-base font-bold text-white mb-1.5">Hệ thống đang ổn định</h4>
              <p className="text-sm text-blue-100/70 leading-relaxed">
                Tất cả các dịch vụ đang hoạt động bình thường với hiệu suất tối ưu.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">UPTIME: 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons for the quick actions
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
