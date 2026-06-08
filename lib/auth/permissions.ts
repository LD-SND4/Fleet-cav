export const permissionRoles = ["admin", "dispatcher", "viewer", "driver"] as const;

export type PermissionRole = (typeof permissionRoles)[number];

export const disabledPermissionRoles: readonly PermissionRole[] = ["driver"];

export const permissionRoutes: Record<PermissionRole, string> = {
  admin: "/admin",
  dispatcher: "/dispatcher",
  driver: "/driver",
  viewer: "/viewer",
};

export const profileRoleCookies: Record<PermissionRole, string> = {
  admin: "admin_user",
  dispatcher: "dispatcher_user",
  driver: "driver_user",
  viewer: "viewer_user",
};

const permissionRoutePrefixes: Record<PermissionRole, string> = {
  admin: "/admin",
  dispatcher: "/dispatcher",
  driver: "/driver",
  viewer: "/viewer",
};

const roleGrants: Record<PermissionRole, PermissionRole[]> = {
  admin: ["admin", "dispatcher", "viewer", "driver"],
  dispatcher: ["dispatcher", "viewer"],
  driver: ["driver"],
  viewer: ["viewer"],
};

export function getGrantedPermissions(role: PermissionRole) {
  return roleGrants[role];
}

export function getEffectivePermissions(roles: PermissionRole[]) {
  const grantedPermissions = roles.flatMap((role) => getGrantedPermissions(role));

  return permissionRoles.filter((permission) => grantedPermissions.includes(permission));
}

export function getPrimaryPermission(permissions: PermissionRole[]) {
  return permissionRoles.find((permission) => permissions.includes(permission)) ?? "viewer";
}

export function getDefaultPermissionRoute(permissions: PermissionRole[]) {
  const defaultPermission = permissionRoles.find((permission) => permissions.includes(permission));

  return defaultPermission ? permissionRoutes[defaultPermission] : null;
}

export function isPermissionRole(value: unknown): value is PermissionRole {
  return typeof value === "string" && permissionRoles.includes(value as PermissionRole);
}

export function isPermissionDisabled(permission: PermissionRole) {
  return disabledPermissionRoles.includes(permission);
}

export function normalizePermissions(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return permissionRoles.filter((permission) => value.includes(permission));
}

export function serializePermissions(permissions: PermissionRole[]) {
  return permissionRoles.filter((permission) => permissions.includes(permission)).join(",");
}

export function parseSerializedPermissions(value: string | undefined) {
  if (!value) {
    return [];
  }

  const values = value.split(",").map((permission) => permission.trim());

  return permissionRoles.filter((permission) => values.includes(permission));
}

export function getPermissionForPath(pathname: string) {
  return permissionRoles.find((permission) => {
    const prefix = permissionRoutePrefixes[permission];

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
