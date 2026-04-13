import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IPermission } from "@/types/permission.type";

export const PermmissionService = {
  CallFetchPermissionList: (): Promise<IBackendRes<IPermission[]>> => {
    return privateAxios.get(`/permissions`);
  },

  CallCreatePermission: (permissionData: any): Promise<IBackendRes<IPermission>> => {
    return privateAxios.post("/permissions", permissionData);
  },

  CallGetPermissionDetail: (id: number): Promise<IBackendRes<IPermission>> => {
    return privateAxios.get(`/permissions/${id}`);
  },

  CallUpdatePermission: (id: number, payload: any): Promise<IBackendRes<IPermission>> => {
    return privateAxios.put(`/permissions/${id}`, payload);
  },

  CallDeletePermission: (id: number): Promise<IBackendRes<any>> => {
    return privateAxios.delete(`/permissions/${id}`);
  },
};
