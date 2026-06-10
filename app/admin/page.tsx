import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { dollars } from "@/lib/orders";

export default async function AdminPage() {
  const user = await requireAdmin();
  const [totalOrders, activeCertificates, pendingOrders, expiringCertificates, revenue, newCustomers, recentOrders, activities] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["ISSUED", "REISSUED"] } } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.count({ where: { expiresAt: { lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } } }),
    prisma.order.findMany({ include: { product: true, user: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: true } })
  ]);

  return (
    <DashboardLayout user={user} admin>
      <div className="stat-grid">
        <div className="stat"><span>Total orders</span><strong>{totalOrders}</strong></div>
        <div className="stat"><span>Active certificates</span><strong>{activeCertificates}</strong></div>
        <div className="stat"><span>Pending orders</span><strong>{pendingOrders}</strong></div>
        <div className="stat"><span>Expiring certificates</span><strong>{expiringCertificates}</strong></div>
      </div>
      <div className="stat-grid">
        <div className="stat"><span>Revenue statistics</span><strong>{dollars(revenue._sum.totalAmount || 0)}</strong></div>
        <div className="stat"><span>New customers</span><strong>{newCustomers}</strong></div>
      </div>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Recent SSL Orders</h1>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Domain</th><th>Status</th><th /></tr></thead>
            <tbody>
              {recentOrders.length === 0 && <tr><td colSpan={5}>No SSL orders yet.</td></tr>}
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td><a className="order-number-pill" href={`/admin/orders/${order.id}`}>{order.orderNumber}</a><br /><span className="muted">{order.product.name}</span></td>
                  <td><a href={`/admin/customers/${order.user.id}`}>{order.user.email}</a></td>
                  <td>{order.primaryDomain}</td>
                  <td>{order.status.replaceAll("_", " ")}</td>
                  <td><a className="button secondary" href={`/admin/orders/${order.id}`}>Manage</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Recent Activity</h1>
        <table>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td><strong>{activity.action}</strong><br /><span className="muted">{activity.entity}</span></td>
                <td>{activity.user?.email || "System"}</td>
                <td>{activity.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
