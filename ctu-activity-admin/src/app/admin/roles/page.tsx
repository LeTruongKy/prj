"use client";

import { RolesTable } from "@/components/admin/roles/table/RolesTable";

const RolesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý vai trò</h1>
        <p className="text-gray-500 mt-1 text-sm">Thiết lập và phân quyền các vai trò trong hệ thống.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <RolesTable />
      </div>
    </div>
  );
};

export default RolesPage;
