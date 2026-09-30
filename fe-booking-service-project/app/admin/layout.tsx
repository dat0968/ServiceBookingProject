import AdminSidebar from "@/components/admin-sidebar";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <AdminSidebar />
      <main className="flex-grow-1 p-3 p-md-4">{children}</main>
    </div>
  );
}
