export const appPath = {
  HOME: "/",
  ADMIN: "/admin",
  LOGIN: "/auth/login",
};

export const adminPath = {
  DASHBOARD: "/admin",
  ROLES: "/admin/roles",
  STUDENTS: "/admin/students",
  PERMISSIONS: "/admin/permissions",
  ACTIVITIES: "/admin/activities",
  ORGANIZING_UNITS: "/admin/organizing-units",
  ACTIVITY_TYPES: "/admin/activity-types",
};

export const TabHeaderName: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/students": "Quản Lý Sinh Viên",
  "/admin/activities": "Quản Lý Hoạt Động",
  "/admin/permissions": "Quản Lý Quyền Hạn",
  "/admin/roles": "Quản Lý Vai Trò",
  "/admin/organizing-units": "Quản Lý Đơn Vị Tổ Chức",
  "/admin/activity-types": "Quản Lý Loại Hoạt Động",
};
