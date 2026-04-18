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
import { Settings2, Search, Filter, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateActivitySheet } from "../sheets/CreateActivitySheet";
import { DetailActivitySheet } from "../sheets/DetailActivitySheet";
import { EditActivitySheet } from "../sheets/EditActivitySheet";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { toast } from "sonner";
import { IActivity, ActivityStatus } from "@/types/activity.type";
import { ActivityService } from "@/services/activityService";
import { activityColumns } from "./ActivityColumns";

export function ActivitiesTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [activityList, setActivityList] = React.useState<IActivity[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Detail Sheet State
    const [detailSheetOpen, setDetailSheetOpen] = React.useState(false);
    const [selectedActivity, setSelectedActivity] = React.useState<IActivity | null>(null);
    const [loadingDetail, setLoadingDetail] = React.useState(false);

    // Edit Sheet State
    const [editSheetOpen, setEditSheetOpen] = React.useState(false);
    const [activityToEdit, setActivityToEdit] = React.useState<IActivity | null>(null);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await ActivityService.CallFetchActivitiesList();
            console.log("Fetched activities list response:", res);
            if (res?.statusCode === 200 && Array.isArray(res.data.data)) {
                setActivityList(res.data.data);
            }
        } catch (error) {
            console.error("Error loading activities:", error);
            toast.error("Không thể tải danh sách hoạt động");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (activity: IActivity) => {
        setSelectedActivity(activity);
        setLoadingDetail(false);
        setDetailSheetOpen(true);
    };

    const handleEditActivity = (activity: IActivity) => {
        setActivityToEdit(activity);
        setEditSheetOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Bạn có chắc chắn muốn gỡ bỏ hoàn toàn hoạt động này?")) {
            try {
                const res = await ActivityService.CallDeleteActivity(id);
                if (res?.statusCode === 200) {
                    toast.success("Gỡ bỏ hoạt động thành công");
                    fetchActivities();
                } else {
                    toast.error(res?.message || "Thao tác thất bại");
                }
            } catch (error) {
                console.error("Error deleting activity:", error);
                toast.error("Đã có lỗi xảy ra");
            }
        }
    };

    const handleUpdateStatus = async (id: number, status: ActivityStatus) => {
        try {
            const res = await ActivityService.CallUpdateActivityStatus(id, status);
            if (res?.statusCode === 200) {
                toast.success(`Cập nhật trạng thái thành ${status} thành công`);
                fetchActivities();
            } else {
                toast.error(res?.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating activity status:", error);
            toast.error("Đã có lỗi xảy ra");
        }
    };

    const table = useReactTable({
        data: activityList,
        columns: activityColumns(handleEdit, handleDelete, handleUpdateStatus, handleEditActivity),
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
        fetchActivities();
    }, []);

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            placeholder="Tìm tên hoạt động..."
                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>
                    <CreateActivitySheet onActivityCreated={fetchActivities} />
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-600 hover:bg-gray-50">
                                <Filter className="h-4 w-4 mr-2" />
                                Bộ lọc
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
                                        title: "Hoạt động",
                                        category: "Loại",
                                        unit: "Đơn vị",
                                        startTime: "Thời gian",
                                        status: "Trạng thái",
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

                    <Button variant="outline" size="sm" className="h-9 border-gray-200 text-gray-600 hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-50/80 border-b border-gray-100 hover:bg-gray-50/80">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
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
                                    <div className="flex items-center justify-center gap-2 text-gray-400">
                                        <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                                        Đang tải dữ liệu...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : activityList.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="bg-white hover:bg-blue-50/30 border-b border-gray-50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3.5">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-gray-400">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-100 p-4">
                <DataTablePagination table={table} />
            </div>

            {/* Detail Activity Sheet */}
            <DetailActivitySheet
                open={detailSheetOpen}
                onOpenChange={setDetailSheetOpen}
                activity={selectedActivity}
                loading={loadingDetail}
            />

            {/* Edit Activity Sheet */}
            <EditActivitySheet
                open={editSheetOpen}
                onOpenChange={setEditSheetOpen}
                activity={activityToEdit}
                onActivityUpdated={fetchActivities}
            />
        </div>
    );
}
