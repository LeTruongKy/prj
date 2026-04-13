import { ActivitiesTable } from "@/components/admin/activities/table/ActivitiesTable";

export default function ActivitiesPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý hoạt động</h1>
                    <p className="text-gray-500 mt-1 text-sm">Quản lý danh sách hoạt động, trạng thái và thông tin chi tiết.</p>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <ActivitiesTable />
            </div>
        </div>
    );
}
