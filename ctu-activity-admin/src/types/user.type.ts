export interface IUser {
  id: string;
  email: string;
  fullName: string;
  studentCode: string | null;
  major?: string | null;
  status: "ACTIVE" | "BANNED" | "LOCKED";
  avatarUrl: string | null;
  unitId: number | null;
  role: string;
  lockedReason?: string | null;
  lockedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  permissions?: {
    name: string;
    apiPath: string;
    method: string;
    module: string;
  }[];
}

