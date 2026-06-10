import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { dollars } from "@/lib/orders";

export default async function AdminOrdersPage({ searchParams }: { searchParams: { q?: string } }) {
  const user = await requireAdmin();
  const q = searchParams.q?.trim() || "";
  const orders = await prisma.order.findMany({
    where: q
      ? {
          OR: [
            { orderNumber: { contains: q } },
            { user: { email: { contains: q } } }
          ]
        }
      : undefined,
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" }
  });
  return (
    <DashboardLayout user={user} admin>
      <section className="card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div><h1 style={{ color: "var(--navy)", fontSize: 38 }}>SSL Order Management</h1><p>Create, approve, update status, upload issued certificates, and cancel orders.</p></div>
          <a className="button primary" href="/admin/orders/new">Create Manual Order</a>
        </div>
        <form className="search-bar" action="/admin/orders">
          <input className="input" name="q" defaultValue={q} placeholder="Search by order number or user email" />
          <button className="button primary" type="submit">Search</button>
          {q && <a className="button secondary" href="/admin/orders">Clear</a>}
        </form>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Domain</th><th>Total</th><th>Status</th><th /></tr></thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={6}>No orders found.</td></tr>}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><a className="order-number-pill" href={`/admin/orders/${order.id}`}>{order.orderNumber}</a><br /><span className="muted">{order.product.name}</span></td>
                  <td><a href={`/admin/customers/${order.user.id}`}>{order.user.email}</a></td>
                  <td>{order.primaryDomain}</td>
                  <td>{dollars(order.totalAmount)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td><a className="button secondary" href={`/admin/orders/${order.id}`}>Manage</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
