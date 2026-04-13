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
import { ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { RegistrationService, IParticipant, IVerifyProofPayload } from "@/services/registrationService";

interface ParticipantsTableProps {
    activityId: number;
}

export function ParticipantsTable({ activityId }: ParticipantsTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [participants, setParticipants] = React.useState<IParticipant[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [verifyDialogOpen, setVerifyDialogOpen] = React.useState(false);
    const [verifyingRegistration, setVerifyingRegistration] = React.useState<{
        id: string;
        action: 'VERIFIED' | 'REJECTED';
    } | null>(null);

    const fetchParticipants = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await RegistrationService.CallGetActivityParticipants(activityId);
            if (res?.statusCode === 200 && res.data) {
                setParticipants(res.data.data || []);
            }
        } catch (error) {
            console.error("Lỗi tải danh sách:", error);
            toast.error("Không thể tải danh sách sinh viên");
        } finally {
            setLoading(false);
        }
    }, [activityId]);

    const handleVerifyProof = async (registrationId: string, action: 'VERIFIED' | 'REJECTED') => {
        setVerifyingRegistration({ id: registrationId, action });
        setVerifyDialogOpen(true);
    };

    const confirmVerify = async () => {
        if (!verifyingRegistration) return;

        try {
            const payload: IVerifyProofPayload = {
                action: verifyingRegistration.action,
            };

            await RegistrationService.CallVerifyProof(verifyingRegistration.id, payload);

            toast.success(
                verifyingRegistration.action === 'VERIFIED'
                    ? 'Đã phê duyệt minh chứng'
                    : 'Đã từ chối minh chứng'
            );

            // Update the participant in the list
            setParticipants((prev) =>
                prev.map((p) =>
                    p.registrationId === verifyingRegistration.id
                        ? { ...p, proofStatus: verifyingRegistration.action }
                        : p
                )
            );
        } catch (error) {
            console.error('Lỗi xác thực:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Lỗi xác thực minh chứng';
            toast.error(errorMessage);
        } finally {
            setVerifyDialogOpen(false);
            setVerifyingRegistration(null);
        }
    };

    const getProofStatusBadge = (status: string) => {
        switch (status) {
            case 'VERIFIED':
                return (
                    <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Đã phê duyệt
                    </Badge>
                );
            case 'REJECTED':
                return (
                    <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Từ chối
                    </Badge>
                );
            case 'PENDING':
                return (
                    <Badge className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Chờ xác nhận
                    </Badge>
                );
            default:
                return <Badge variant="outline">Chưa xác định</Badge>;
        }
    };

    const table = useReactTable({
        data: participants,
        columns: [
            {
                id: "fullName",
                accessorKey: "fullName",
                header: "Họ tên",
                cell: ({ row }) => {
                    const participant = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={participant.avatarUrl} />
                                <AvatarFallback>{participant.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{participant.fullName}</span>
                                <span className="text-xs text-muted-foreground">{participant.email}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: "studentCode",
                accessorKey: "studentCode",
                header: "MSSV",
                cell: ({ row }) => (
                    <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {row.original.studentCode || "-"}
                    </div>
                ),
            },
            {
                id: "registrationStatus",
                accessorKey: "registrationStatus",
                header: "Trạng thái đăng ký",
                cell: ({ row }) => {
                    const status = row.original.registrationStatus;
                    const statusMap: Record<string, { label: string; className: string }> = {
                        REGISTERED: { label: "Đã đăng ký", className: "bg-blue-100 text-blue-800" },
                        CHECKED_IN: { label: "Đã check-in", className: "bg-green-100 text-green-800" },
                        CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
                    };
                    const statusInfo = statusMap[status] || { label: "-", className: "bg-gray-100 text-gray-800" };
                    return (
                        <Badge className={statusInfo.className} variant="outline">
                            {statusInfo.label}
                        </Badge>
                    );
                },
            },
            {
                id: "proofUrl",
                accessorKey: "proofUrl",
                header: "Minh chứng",
                cell: ({ row }) => {
                    const proofUrl = row.original.proofUrl;
                    return proofUrl ? (
                        <a
                            href={proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Xem <ExternalLink className="w-3 h-3" />
                        </a>
                    ) : (
                        <span className="text-muted-foreground text-sm">Chưa nộp</span>
                    );
                },
            },
            {
                id: "proofStatus",
                accessorKey: "proofStatus",
                header: "Trạng thái minh chứng",
                cell: ({ row }) => getProofStatusBadge(row.original.proofStatus),
            },
            {
                id: "actions",
                header: "Thao tác",
                cell: ({ row }) => {
                    const participant = row.original;
                    const hasProof = !!participant.proofUrl;
                    const isVerified = participant.proofStatus === 'VERIFIED';

                    return (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleVerifyProof(participant.registrationId, 'VERIFIED')}
                                disabled={!hasProof || isVerified}
                                title={!hasProof ? "Sinh viên chưa nộp minh chứng" : ""}
                            >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Phê duyệt
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                                onClick={() => handleVerifyProof(participant.registrationId, 'REJECTED')}
                                disabled={!hasProof || isVerified}
                                title={!hasProof ? "Sinh viên chưa nộp minh chứng" : ""}
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Từ chối
                            </Button>
                        </div>
                    );
                },
            },
        ],
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
        fetchParticipants();
    }, [fetchParticipants]);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Tìm theo tên hoặc MSSV..."
                    value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={fetchParticipants} variant="outline" size="sm">
                    Làm mới
                </Button>
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
                        ) : participants.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="bg-white hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Verify Confirmation Dialog */}
            <AlertDialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            {verifyingRegistration?.action === 'VERIFIED' ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Phê duyệt minh chứng?
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    Từ chối minh chứng?
                                </>
                            )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {verifyingRegistration?.action === 'VERIFIED'
                                ? 'Bạn sắp phê duyệt minh chứng của sinh viên này. Hành động này không thể hoàn tác.'
                                : 'Bạn sắp từ chối minh chứng của sinh viên này. Sinh viên sẽ cần nộp lại minh chứng.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmVerify}
                            className={verifyingRegistration?.action === 'VERIFIED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {verifyingRegistration?.action === 'VERIFIED' ? 'Phê duyệt' : 'Từ chối'}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
