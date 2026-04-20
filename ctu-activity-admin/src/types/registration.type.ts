import { IActivity } from "./activity.type";
import { IUser } from "./user.type";

export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface IRegistration {
  id: number;
  activityId: number;
  activity?: IActivity;
  userId: string;
  user?: IUser;
  status: RegistrationStatus;
  checkedInAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRegistrationData {
  data: IRegistration[];
  total: number;
}

export interface ModalRegistrationData {
  status: RegistrationStatus;
  checkedInAt?: string;
}
