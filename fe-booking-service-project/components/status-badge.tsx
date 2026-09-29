import { Badge } from "react-bootstrap";

const STATUS_MAP: Record<string, { label: string; bg: string }> = {
  Pending: { label: "Chờ xác nhận", bg: "warning" },
  Confirmed: { label: "Đã xác nhận", bg: "info" },
  Completed: { label: "Hoàn thành", bg: "success" },
  Cancelled: { label: "Đã hủy", bg: "secondary" },
};

export default function StatusBadge({ status }: { status: string }) {
  const mapped = STATUS_MAP[status] ?? { label: status, bg: "light" };
  return (
    <Badge bg={mapped.bg} text={mapped.bg === "warning" || mapped.bg === "light" ? "dark" : undefined}>
      {mapped.label}
    </Badge>
  );
}
