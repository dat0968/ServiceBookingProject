import Link from "next/link";
export default function header() {
    return (
        <header
            className="d-flex justify-content-between align-items-center px-3 px-md-4 py-3"
            style={{ background: "#0f766e" }}
        >
            <Link href="/" className="text-white text-decoration-none fw-bold fs-5">
                Service Booking
            </Link>
            <nav className="d-flex align-items-center gap-3">
                <Link href="/login" className="btn btn-light btn-sm fw-semibold">
                    Đăng nhập
                </Link>
            </nav>
        </header>
    )
}