import { orderStatusLabels } from "@/lib/orders";

export function StatusBadge({ status }: { status: string }) {
  const variant = status === "ISSUED" || status === "PAYMENT_RECEIVED" ? "success" : status === "PENDING_PAYMENT" ? "warning" : "";
  return <span className={`badge ${variant}`}>{orderStatusLabels[status] || status.replaceAll("_", " ")}</span>;
}
