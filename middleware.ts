import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Guard /admin/* — require admin role cookie
  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("a5_role")?.value;
    const user = request.cookies.get("a5_user")?.value;

    if (!user || role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      loginUrl.searchParams.set("error", "admin_only");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Guard /dashboard, /discover, etc. — require any login
  const protectedPrefixes = ["/dashboard", "/discover", "/opportunities", "/profile", "/my-profile"];
  if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const user = request.cookies.get("a5_user")?.value;
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/discover/:path*", "/opportunities/:path*", "/profile/:path*", "/my-profile/:path*"],
};