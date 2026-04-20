import { IActivityCategory } from "./activityCategory.type";
import { IUnit } from "./unit.type";
import { IUser } from "./user.type";

export type ActivityStatus = "DRAFT" | "PENDING" | "APPROVED" | "PUBLISHED" | "COMPLETED" | "CANCELLED";

export interface IActivity {
    id?: number;
    activity_id?: number;
    title: string;
    description: string | null;
    categoryId?: number;
    category?: IActivityCategory;
    unitId?: number;
    unit?: IUnit;
    createdBy?: string;
    creator?: IUser;
    location: string | null;
    // âœ… Supports both camelCase (Cloudinary) and snake_case (API fallback)
    posterUrl?: string | null;
    poster_url?: string | null;
    startTime?: string | null;
    start_time?: string | null;
    endTime?: string | null;
    end_time?: string | null;
    maxParticipants?: number | null;
    max_participants?: number | null;
    status: ActivityStatus;
    approvedBy?: string | null;
    approved_by?: string | null;
    approver?: IUser | null;
    approvedAt?: string | null;
    approved_at?: string | null;
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
    deletedAt?: string | null;
    registration_count?: number;
    similarity_score?: number;
    tags?: any[];
    tagIds?: number[];
    criteriaIds?: number[];
    // âœ… QR Code URL for check-in
    qrCodeUrl?: string | null;
    qr_code_url?: string | null;
}

export interface IActivityData {
    activities: IActivity[];
}

export interface ModalActivityData {
    title: string;
    description?: string;
    categoryId: number;
    unitId: number;
    location?: string;
    posterUrl?: string;
    startTime?: string;
    endTime?: string;
    maxParticipants?: number;
}
