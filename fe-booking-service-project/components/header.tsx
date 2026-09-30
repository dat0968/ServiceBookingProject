import Link from "next/link";
import { cookies } from "next/headers";

import { logoutAction } from "@/app/actions/auth";

export default async function Header() {
    const cookieStore = await cookies();

    const token = cookieStore.get("accessToken")?.value;

    const isLoggedIn = !!token;

    return (
        <header
            className="d-flex justify-content-between align-items-center px-3 px-md-4 py-3"
            style={{ background: "#0f766e" }}
        >
            <Link
                href="/"
                className="text-white text-decoration-none fw-bold fs-5"
            >
                Service Booking
            </Link>

            <nav className="d-flex align-items-center gap-3 flex-wrap">
                <Link
                    href="/services"
                    className="text-white text-decoration-none small fw-semibold"
                >
                    Dịch vụ
                </Link>

                {isLoggedIn && (
                    <>
                        <Link
                            href="/booking"
                            className="text-white text-decoration-none small fw-semibold"
                        >
                            Đặt lịch
                        </Link>

                        <Link
                            href="/my-bookings"
                            className="text-white text-decoration-none small fw-semibold"
                        >
                            Lịch của tôi
                        </Link>

                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="btn btn-link text-white text-decoration-none p-0 small fw-semibold"
                            >
                                Đăng xuất
                            </button>
                        </form>
                    </>
                )}

                {!isLoggedIn && (
                    <Link
                        href="/login"
                        className="btn btn-light btn-sm fw-semibold"
                    >
                        Đăng nhập
                    </Link>
                )}
            </nav>
        </header>
    );
}