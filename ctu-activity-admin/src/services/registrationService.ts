import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IRegistration, ModalRegistrationData } from "@/types/registration.type";

export interface IParticipant {
  registrationId: string;
  userId: string;
  fullName: string;
  studentCode: string;
  email: string;
  avatarUrl?: string;
  major?: string;
  registrationStatus: 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED';
  proofStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  proofUrl?: string | null;
  checkInAt?: Date;
  registeredAt: Date;
  verifiedAt?: Date;
  rating?: number;
  feedback?: string;
}

export interface IVerifyProofPayload {
  action: 'VERIFIED' | 'REJECTED';
  rating?: number;
  feedback?: string;
}

export const RegistrationService = {
  CallFetchRegistrationsList: (params?: any): Promise<IBackendRes<{ data: IRegistration[]; total: number }>> => {
    return privateAxios.get(`/registrations`, { params });
  },

  CallFetchActivityRegistrations: (activityId: number, params?: any): Promise<IBackendRes<{ data: IRegistration[]; total: number }>> => {
    return privateAxios.get(`/activities/${activityId}/registrations`, { params });
  },

  CallGetRegistrationDetail: (id: number): Promise<IBackendRes<IRegistration>> => {
    return privateAxios.get(`/registrations/${id}`);
  },

  CallUpdateRegistrationStatus: (id: number, status: string): Promise<IBackendRes<IRegistration>> => {
    return privateAxios.patch(`/registrations/${id}/status`, { status });
  },

  CallCheckInRegistration: (id: number): Promise<IBackendRes<IRegistration>> => {
    return privateAxios.patch(`/registrations/${id}/check-in`, {});
  },

  CallDeleteRegistration: (id: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/registrations/${id}`);
  },

  /**
   * Get all participants registered for an activity
   */
  CallGetActivityParticipants: (
    activityId: number
  ): Promise<IBackendRes<{ data: IParticipant[]; count: number }>> => {
    return privateAxios.get(`/registrations/activity/${activityId}`);
  },

  /**
   * Verify or reject proof of participation
   */
  CallVerifyProof: (
    registrationId: string,
    payload: IVerifyProofPayload
  ): Promise<IBackendRes<IParticipant>> => {
    return privateAxios.patch(`/registrations/${registrationId}/verify`, payload);
  },
};
