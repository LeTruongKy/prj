import { UnitsTable } from "@/components/admin/organizing-units/table/UnitsTable";

export default function OrganizingUnitsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý đơn vị tổ chức</h1>
                <p className="text-gray-500 mt-1 text-sm">Quản lý danh sách các đơn vị tổ chức trong hệ thống.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <UnitsTable />
            </div>
        </div>
    );
}
