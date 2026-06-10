import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/seo";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";

export default async function PortalPage() {
  const user = await requireUser();
  const [orders, orderCounts, tickets] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.order.groupBy({ by: ["status"], where: { userId: user.id }, _count: true }),
    prisma.ticket.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 4 })
  ]);
  const total = orderCounts.reduce((sum, item) => sum + item._count, 0);
  const active = orderCounts.filter((item) => ["ISSUED", "REISSUED"].includes(item.status)).reduce((sum, item) => sum + item._count, 0);
  const pending = orderCounts.find((item) => item.status === "PENDING_PAYMENT")?._count || 0;

  return (
    <DashboardLayout user={user}>
      <div className="stat-grid">
        <div className="stat"><span>Total orders</span><strong>{total}</strong></div>
        <div className="stat"><span>Active certificates</span><strong>{active}</strong></div>
        <div className="stat"><span>Pending payment</span><strong>{pending}</strong></div>
        <div className="stat"><span>Open tickets</span><strong>{tickets.filter((ticket) => ticket.status !== "CLOSED").length}</strong></div>
      </div>
      <section className="card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div><h2 style={{ color: "var(--navy)", fontSize: 30 }}>Recent SSL Orders</h2><p>Track payment, CSR, validation, issuance, and expiry.</p></div>
          <a className="button primary" href={routes.orderSslCertificate}>Order SSL</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Domain</th><th>Status</th><th /></tr></thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={4}>No SSL orders yet.</td></tr>
              )}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><a className="order-number-pill" href={`/portal/orders/${order.id}`}>{order.orderNumber}</a><br /><span className="muted">{order.product.name}</span></td>
                  <td>{order.primaryDomain}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td><a className="button secondary" href={`/portal/orders/${order.id}`}>View</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Manual PayPal Payment</h2>
        <p>New orders are created as Pending Payment. Send PayPal payment to <strong>{process.env.PAYPAL_PAYMENT_EMAIL || "billing@trustshieldssl.example"}</strong> and include your order number in the note.</p>
      </section>
    </DashboardLayout>
  );
}
