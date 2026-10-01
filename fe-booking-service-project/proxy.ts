import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/services/authService";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes
    if (
        pathname === "/" ||
        pathname === "/login" ||
        pathname.startsWith("/services")
    ) {
        const token = request.cookies.get("accessToken")?.value;

        // Chưa đăng nhập → vẫn cho vào
        if (!token) {
            return NextResponse.next();
        }

        // Có token → kiểm tra role
        const result = await validateToken(token);

        if (result.isAuthenticated && result.role === "Admin") {
            return NextResponse.redirect(
                new URL("/admin/services", request.url)
            );
        }

        return NextResponse.next();
    }

    // /admin → bắt buộc đăng nhập
    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get("accessToken")?.value;

        if (!token) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        const result = await validateToken(token);

        if (!result.isAuthenticated) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        // Không phải Admin
        if (result.role !== "Admin") {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/services/:path*",
        "/admin/:path*",
    ],
};