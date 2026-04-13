import { ActivityTypesTable } from "@/components/admin/activity-types/table/ActivityTypesTable";

export default function ActivityTypesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý loại hoạt động</h1>
                <p className="text-gray-500 mt-1 text-sm">Quản lý các loại hoạt động và danh mục trong hệ thống.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <ActivityTypesTable />
            </div>
        </div>
    );
}
