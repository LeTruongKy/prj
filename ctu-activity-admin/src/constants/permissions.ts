export const ALL_MODULES = {
  USERS: "USERS",
  AUTH: "AUTH",
  ACTIVITIES: "ACTIVITIES",
  PERMISSIONS: "PERMISSIONS",
  ROLES: "ROLES",
};

export const ALL_PERMISSIONS = {
  USERS: {
    GET_PAGINATE: { method: "GET", apiPath: "/users", module: "USERS" },
  },
  ACTIVITIES: {
    GET_PAGINATE: { method: "GET", apiPath: "/activities", module: "ACTIVITIES" },
  },
  ROLES: {
    GET_PAGINATE: { method: "GET", apiPath: "/roles", module: "ROLES" },
  },
  PERMISSIONS: {
    GET_PAGINATE: { method: "GET", apiPath: "/permissions", module: "PERMISSIONS" },
  },
};
