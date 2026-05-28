import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/admin", "/dispatcher", "/driver", "/viewer"];
const authCookieNames = [
  "fleetcav_access_token",
  "fleetcav_refresh_token",
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
  const roleCookie = request.cookies.get("fleetcav_role");
  const userIdCookie = request.cookies.get("fleetcav_user_id");

  if (accessTokenCookie && roleCookie && userIdCookie) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/dispatcher/:path*", "/driver/:path*", "/viewer/:path*"],
};
