import { IActivity, ActivityStatus } from "@/types/activity.type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, MapPin, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/formateDate";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<ActivityStatus, { bg: string; text: string; dot: string; label: string }> = {
    DRAFT: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400", label: "Bản nháp" },
    PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "Chờ duyệt" },
    APPROVED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", label: "Đã duyệt" },
    PUBLISHED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Đang hoạt động" },
    COMPLETED: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-400", label: "Hoàn thành" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400", label: "Đã hủy" },
};

// ✅ Placeholder image for activities without poster
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100' rx='8'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

export const activityColumns = (
    onEdit: (activity: IActivity) => void,
    onDelete: (id: number) => void,
    onUpdateStatus: (id: number, status: ActivityStatus) => void,
): ColumnDef<IActivity>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
        },
        // ✅ NEW: Poster column at the beginning
        {
            accessorKey: "poster_url",
            header: "Poster",
            cell: ({ row }) => {
                const activity = row.original;
                const posterUrl = activity.poster_url || activity.posterUrl;

                return (
                    <div className="flex items-center justify-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                            <img
                                src={posterUrl || PLACEHOLDER_IMAGE}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                }}
                                loading="lazy"
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                    Tên hoạt động <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const activity = row.original;
                return (
                    <div className="flex flex-col max-w-[300px]">
                        <span className="font-semibold text-gray-900 truncate">{activity.title}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{activity.location || "Chưa xác định"}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Loại",
            cell: ({ row }) => {
                const category = row.original.category;
                return category ? (
                    <Badge variant="outline" className="font-normal rounded-full text-xs" style={{ color: category.color || "#374151", borderColor: category.color || "#e5e7eb" }}>
                        {category.name}
                    </Badge>
                ) : "/";
            },
        },
        {
            accessorKey: "unit",
            header: "Đơn vị tổ chức",
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">{row.original.unit?.name || "/"}</span>
            ),
        },
        {
            accessorKey: "start_time",
            header: "Thời gian",
            cell: ({ row }) => {
                const start = row.original.start_time || row.original.startTime;
                return start ? (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {formatDate(start)}
                    </div>
                ) : "/";
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as ActivityStatus;
                const style = statusStyles[status] || statusStyles.DRAFT;
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
                        {style.label}
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const activity = row.original;
                const activityId = activity.activity_id || activity.id;
                return (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(activity)}>Chi tiết / Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onUpdateStatus(activityId as number, "PUBLISHED")} disabled={activity.status === "PUBLISHED"}>
                                Duyệt & Đăng tải
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(activityId as number, "COMPLETED")} disabled={activity.status === "COMPLETED"}>
                                Hoàn thành
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(activityId as number, "CANCELLED")} className="text-red-600" disabled={activity.status === "CANCELLED"}>
                                Hủy hoạt động
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete(activityId as number)} className="text-red-600">
                                Xóa (Gỡ bỏ)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
