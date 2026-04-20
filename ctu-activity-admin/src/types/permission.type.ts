export interface IPermission {
  id: number;
  slug: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPermissionData {
  permissions: IPermission[];
}

export interface PermissionModule {
  module: string;
  permissions: IPermission[];
}
