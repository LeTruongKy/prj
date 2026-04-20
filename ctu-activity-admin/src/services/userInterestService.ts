import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";

export interface IUserInterest {
  id: number;
  userId: string;
  tagId: number;
  weight: number;
  tag?: {
    id: number;
    name: string;
  };
}

export const UserInterestService = {
  // Update user interests (delete old, create new)
  CallUpdateUserInterests: (
    data: { tagIds: number[]; weight?: number },
  ): Promise<IBackendRes<IUserInterest[]>> => {
    return privateAxios.post(`/user-interests/me/update`, data);
  },

  // Get current user's interests
  CallGetMyInterests: (): Promise<IBackendRes<IUserInterest[]>> => {
    return privateAxios.get(`/user-interests/me/interests`);
  },

  // Get interests for a specific user
  CallGetUserInterests: (userId: string): Promise<IBackendRes<IUserInterest[]>> => {
    return privateAxios.get(`/user-interests/by-user/${userId}`);
  },

  // Create a single interest
  CallCreateInterest: (
    data: { userId: string; tagIds: number[]; weight?: number },
  ): Promise<IBackendRes<IUserInterest[]>> => {
    return privateAxios.post(`/user-interests`, data);
  },

  // Get all interests (admin)
  CallFetchAllInterests: (): Promise<IBackendRes<IUserInterest[]>> => {
    return privateAxios.get(`/user-interests`);
  },

  // Delete an interest
  CallDeleteInterest: (id: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/user-interests/${id}`);
  },
};
