"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/services", label: "Dịch vụ" },
  { href: "/admin/schedules", label: "Lịch làm việc" },
  { href: "/admin/bookings", label: "Đặt lịch" },
  { href: "/admin/staffs", label: "Nhân viên" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="d-flex flex-column text-white p-3"
      style={{ minHeight: "100vh", width: 240, background: "#0f172a" }}
    >
      <Link href="/" className="text-white text-decoration-none fw-bold fs-5 mb-4">
        Admin Booking
      </Link>
      <nav className="d-flex flex-column gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="text-decoration-none px-3 py-2 rounded-3"
              style={{
                color: active ? "#0f766e" : "#e2e8f0",
                background: active ? "#fff" : "transparent",
                fontWeight: active ? 600 : 500,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
