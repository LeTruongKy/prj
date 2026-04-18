import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IUser } from "@/types/user.type";

export const UserService = {
    CallFetchUsersList: (params?: any): Promise<IBackendRes<IUser[]>> => {
        return privateAxios.get(`/users`, { params });
    },

    CallCreateUser: (data: any): Promise<IBackendRes<IUser>> => {
        return privateAxios.post("/users", data);
    },

    CallGetUserDetail: (id: string): Promise<IBackendRes<IUser>> => {
        return privateAxios.get(`/users/${id}`);
    },

    CallUpdateUser: (id: string, payload: any): Promise<IBackendRes<IUser>> => {
        return privateAxios.patch(`/users/${id}`, payload);
    },

    CallDeleteUser: (id: string): Promise<IBackendRes<any>> => {
        return privateAxios.delete(`/users/${id}`);
    },

    CallUpdateUserStatus: (id: string, status: "ACTIVE" | "BANNED"): Promise<IBackendRes<IUser>> => {
        return privateAxios.patch(`/users/${id}/status`, { status });
    },

    CallLockUser: (id: string, reason?: string): Promise<IBackendRes<any>> => {
        return privateAxios.patch(`/users/${id}/lock`, { reason: reason || "" });
    },

    CallUnlockUser: (id: string): Promise<IBackendRes<any>> => {
        return privateAxios.patch(`/users/${id}/unlock`);
    },
};
