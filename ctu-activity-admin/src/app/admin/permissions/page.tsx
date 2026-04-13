"use client";

import { PermissionsTable } from "@/components/admin/permissions/table/PermisisonTable";

const PermissionsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý quyền hạn</h1>
        <p className="text-gray-500 mt-1 text-sm">Thiết lập và quản lý các quyền hạn truy cập hệ thống.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <PermissionsTable />
      </div>
    </div>
  );
};

export default PermissionsPage;
