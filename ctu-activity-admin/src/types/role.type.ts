export interface IRole {
  id: number;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: any[];
}

export interface IRoleData {
  roles: IRole[];
}

export interface ModalRoleData {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface IReturnRole {
  id: number;
  name: string;
}

export interface CheckRole {
  userCount: number;
  alternativeRoles: IReturnRole[];
}

export interface IAssignData {
  roleId: number;
  targetRoleId: number;
}

export type FilterType = "all" | "active" | "deleted";
