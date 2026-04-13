import { StudentsTable } from "@/components/admin/students/table/StudentsTable";

export default function StudentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý sinh viên</h1>
                <p className="text-gray-500 mt-1 text-sm">Quản lý danh sách sinh viên, MSSV và trạng thái tài khoản.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <StudentsTable />
            </div>
        </div>
    );
}
