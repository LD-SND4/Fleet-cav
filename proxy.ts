import { NextRequest, NextResponse } from "next/server";

import { getPermissionForPath, parseSerializedPermissions } from "@/lib/auth/permissions";

const protectedPrefixes = ["/admin", "/dispatcher", "/driver", "/viewer"];
const authCookieNames = [
  "fleetcav_access_token",
  "fleetcav_permission_requests",
  "fleetcav_refresh_token",
  "fleetcav_permissions",
  "fleetcav_role",
  "fleetcav_user_id",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    const response = NextResponse.next();

    authCookieNames.forEach((cookieName) => {
      response.cookies.set(cookieName, "", {
        maxAge: 0,
        path: "/",
      });
    });

    return response;
  }

  const protectedRoute = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const accessTokenCookie = request.cookies.get("fleetcav_access_token");
  const permissionsCookie = request.cookies.get("fleetcav_permissions");
  const roleCookie = request.cookies.get("fleetcav_role");
  const userIdCookie = request.cookies.get("fleetcav_user_id");

  if (accessTokenCookie && permissionsCookie && roleCookie && userIdCookie) {
    const requiredPermission = getPermissionForPath(pathname);
    const sessionPermissions = parseSerializedPermissions(permissionsCookie.value);

    if (!requiredPermission || sessionPermissions.includes(requiredPermission)) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("permissionDenied", requiredPermission);

    return NextResponse.redirect(loginUrl);
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/dispatcher/:path*", "/driver/:path*", "/viewer/:path*"],
};
