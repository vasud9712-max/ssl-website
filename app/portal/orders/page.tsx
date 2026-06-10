import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { dollars } from "@/lib/orders";
import { routes } from "@/lib/seo";

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({ where: { userId: user.id }, include: { product: true }, orderBy: { createdAt: "desc" } });
  return (
    <DashboardLayout user={user}>
      <section className="card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div><h1 style={{ color: "var(--navy)", fontSize: 38 }}>Order History</h1><p>View SSL progress, expiry dates, reissues, and certificates.</p></div>
          <a className="button primary" href={routes.orderSslCertificate}>New Order</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Product</th><th>Domain</th><th>Total</th><th>Status</th><th /></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td><a className="order-number-pill" href={`/portal/orders/${order.id}`}>{order.orderNumber}</a></td>
                  <td>{order.product.name}</td>
                  <td>{order.primaryDomain}</td>
                  <td>{dollars(order.totalAmount)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td><a className="button secondary" href={`/portal/orders/${order.id}`}>Open</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
