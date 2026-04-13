import { IUser } from "@/types/user.type";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, UserCheck, UserX } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const studentColumns = (
    onEdit: (user: IUser) => void,
    onToggleStatus: (user: IUser) => void,
): ColumnDef<IUser>[] => [
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
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "fullName",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0"
                >
                    Họ và tên <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl || ""} alt={user.fullName || "User"} />
                            <AvatarFallback>{user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "studentCode",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent p-0"
                >
                    MSSV <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "major",
            header: "Ngành học",
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const colorMap: Record<string, string> = {
                    ACTIVE: "bg-green-100 text-green-800 border-green-200",
                    BANNED: "bg-red-100 text-red-800 border-red-200",
                    LOCKED: "bg-orange-100 text-orange-800 border-orange-200",
                };
                const labelMap: Record<string, string> = {
                    ACTIVE: "Hoạt động",
                    BANNED: "Đã khóa",
                    LOCKED: "Đã khóa",
                };
                return (
                    <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                    >
                        {labelMap[status] || status}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tham gia",
            cell: ({ row }) => formatDate(row.getValue("createdAt")),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy ID</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEdit(user)}>Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggleStatus(user)} className={user.status === "ACTIVE" ? "text-red-600" : "text-green-600"}>
                                {user.status === "ACTIVE" ? (
                                    <div className="flex items-center gap-2">
                                        <UserX className="h-4 w-4" /> Khóa tài khoản
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4" /> Kích hoạt
                                    </div>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
