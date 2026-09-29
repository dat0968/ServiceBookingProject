import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/services/authService";
import axios from "axios";
console.log("🔥 MIDDLEWARE LOADED");
const createLoginRedirect = (request: NextRequest) => {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
        "returnUrl",
        request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
};
export async function proxy(request: NextRequest) {
    console.log("🔥 MIDDLEWARE RUN:", request.nextUrl.pathname);
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("accessToken")?.value;

    const isLoginPage = pathname === "/login";
    const isProtectedRoute = pathname.startsWith("/admin");
    console.log("My token: " + token);
    if (!token) {
        if (isProtectedRoute) {
            return createLoginRedirect(request);
        }
        return NextResponse.next();
    }
    try {
        const isValid = await validateToken(token);
        if (!isValid) {
            const response = isProtectedRoute
                ? createLoginRedirect(request)
                : NextResponse.next();

            response.cookies.delete("accessToken");
            return response;
        }

        if (isLoginPage) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.log("VALIDATE ERROR:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            const response = isProtectedRoute
                ? createLoginRedirect(request)
                : NextResponse.next();

            response.cookies.delete("accessToken");
            return response;
        }

        if (isProtectedRoute) {
            return new NextResponse("Authentication service unavailable", {
                status: 503,
            });
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/login", "/admin/:path*"],
};