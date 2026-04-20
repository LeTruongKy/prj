import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { ModalRoleData, IRole, CheckRole, IAssignData, IReturnRole } from "@/types/role.type";

export const RoleService = {
  CallFetchRolesList: (): Promise<IBackendRes<IRole[]>> => {
    return privateAxios.get(`/roles`);
  },

  CallCreateRole: (roleData: ModalRoleData): Promise<IBackendRes<IRole>> => {
    return privateAxios.post("/roles", roleData);
  },

  CallGetRoleDetail: (roleId: number): Promise<IBackendRes<IRole>> => {
    return privateAxios.get(`/roles/${roleId}`);
  },

  CallUpdateRole: (roleId: number, payload: ModalRoleData): Promise<IBackendRes<IRole>> => {
    return privateAxios.put(`/roles/${roleId}`, payload);
  },

  CallDeleteRole(roleId: number): Promise<IBackendRes<any>> {
    return privateAxios.delete(`/roles/${roleId}`);
  },

  // Note: The following might need backend support if not already implemented
  CallCheckRoleBeforeDelete(roleId: number): Promise<IBackendRes<CheckRole>> {
    return privateAxios.get(`/roles/${roleId}/check-delete`);
  },

  CallReassignAndDeleteRole(roleId: number, targetRoleId: number): Promise<IBackendRes<IAssignData>> {
    return privateAxios.post(`/roles/${roleId}/reassign-and-delete`, {
      targetRoleId,
    });
  },

  CallRestoreRole(roleId: number): Promise<IBackendRes<IReturnRole>> {
    return privateAxios.patch(`/roles/${roleId}/restore`);
  },
};
