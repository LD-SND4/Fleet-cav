import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/admin", "/dispatcher", "/driver", "/viewer"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    const response = NextResponse.next();
    response.cookies.set("fleetcav_role", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  const protectedRoute = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!protectedRoute) {
    return NextResponse.next();
  }

  const roleCookie = request.cookies.get("fleetcav_role");

  if (roleCookie) {
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
