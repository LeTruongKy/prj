"use client";

import * as React from "react";
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { toast } from "sonner";
import { IUser } from "@/types/user.type";
import { UserService } from "@/services/userService";
import { studentColumns } from "./StudentColumns";
import { CreateUserSheet } from "../sheets/CreateUserSheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StudentsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [studentList, setStudentList] = React.useState<IUser[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Lock/Unlock Dialog state
    const [lockDialogOpen, setLockDialogOpen] = React.useState(false);
    const [lockTarget, setLockTarget] = React.useState<IUser | null>(null);
    const [lockReason, setLockReason] = React.useState("");
    const [lockLoading, setLockLoading] = React.useState(false);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await UserService.CallFetchUsersList();
            if (res?.statusCode === 200 && Array.isArray(res.data)) {
                setStudentList(res.data);
            }
        } catch (error) {
            console.error("Error loading students:", error);
            toast.error("Không thể tải danh sách sinh viên");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: IUser) => {
        toast.info("Tính năng chỉnh sửa đang được phát triển");
    };

    const handleToggleStatus = (user: IUser) => {
        setLockTarget(user);
        setLockReason("");
        setLockDialogOpen(true);
    };

    const confirmLockUnlock = async () => {
        if (!lockTarget) return;

        setLockLoading(true);
        try {
            const isLocking = lockTarget.status === "ACTIVE";

            let res;
            if (isLocking) {
                res = await UserService.CallLockUser(lockTarget.id, lockReason);
            } else {
                res = await UserService.CallUnlockUser(lockTarget.id);
            }

            if (res?.statusCode === 200) {
                toast.success(
                    isLocking
                        ? `Đã khóa tài khoản ${lockTarget.fullName}`
                        : `Đã mở khóa tài khoản ${lockTarget.fullName}`
                );
                fetchStudents();
            } else {
                toast.error(res?.message || "Thao tác thất bại");
            }
        } catch (error) {
            console.error("Error toggling user status:", error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setLockLoading(false);
            setLockDialogOpen(false);
            setLockTarget(null);
        }
    };

    const table = useReactTable({
        data: studentList,
        columns: studentColumns(handleEdit, handleToggleStatus),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    React.useEffect(() => {
        fetchStudents();
    }, []);

    const isLocking = lockTarget?.status === "ACTIVE";

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Tìm sinh viên (tên, MSSV...)"
                    value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <CreateUserSheet onUserCreated={fetchStudents} />
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Settings2 className="h-4 w-4 mr-2" /> Xem
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Cột hiển thị</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                const columnNames: Record<string, string> = {
                                    fullName: "Họ và tên",
                                    studentCode: "MSSV",
                                    major: "Ngành học",
                                    status: "Trạng thái",
                                    createdAt: "Ngày tạo",
                                };
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {columnNames[column.id] || column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : studentList.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50 bg-white">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Không tìm thấy sinh viên nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />

            {/* Lock/Unlock Confirmation Dialog */}
            <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isLocking ? "🔒 Khóa tài khoản" : "🔓 Mở khóa tài khoản"}
                        </DialogTitle>
                        <DialogDescription>
                            {isLocking
                                ? `Bạn có chắc chắn muốn khóa tài khoản "${lockTarget?.fullName}"? Người dùng sẽ không thể đăng nhập.`
                                : `Bạn có chắc chắn muốn mở khóa tài khoản "${lockTarget?.fullName}"? Người dùng sẽ có thể đăng nhập lại.`}
                        </DialogDescription>
                    </DialogHeader>

                    {isLocking && (
                        <div className="space-y-2">
                            <Label htmlFor="lockReason">Lý do khóa</Label>
                            <Textarea
                                id="lockReason"
                                value={lockReason}
                                onChange={(e) => setLockReason(e.target.value)}
                                placeholder="Nhập lý do khóa tài khoản (không bắt buộc)..."
                                rows={3}
                            />
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setLockDialogOpen(false)}
                            disabled={lockLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={confirmLockUnlock}
                            disabled={lockLoading}
                            className={isLocking ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                        >
                            {lockLoading ? "Đang xử lý..." : isLocking ? "Khóa tài khoản" : "Mở khóa"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
