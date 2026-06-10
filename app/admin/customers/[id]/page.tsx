import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { dollars } from "@/lib/orders";
import { Trash2 } from "lucide-react";

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    include: { orders: { include: { product: true }, orderBy: { createdAt: "desc" } }, tickets: true }
  });
  if (!customer || customer.role !== "CUSTOMER") notFound();

  return (
    <DashboardLayout user={admin} admin>
      <section className="card admin-page-head">
        <p className="eyebrow">Customer profile</p>
        <h1>{customer.name}</h1>
        <p>{customer.email} | {customer.company || "No company"} | {customer.status}</p>
        <div className="actions">
          <a className="button secondary" href={`mailto:${customer.email}`}>Email Customer</a>
          <a className="button primary" href="/admin/orders/new">Create Order</a>
          <form action={`/api/admin/customers/${customer.id}`} method="post">
            <input type="hidden" name="action" value="delete" />
            <button className="button danger" type="submit"><Trash2 size={17} /> Delete Account</button>
          </form>
        </div>
      </section>

      <div className="stat-grid">
        <div className="stat"><span>Total SSL orders</span><strong>{customer.orders.length}</strong></div>
        <div className="stat"><span>Active certificates</span><strong>{customer.orders.filter((order) => ["ISSUED", "REISSUED"].includes(order.status)).length}</strong></div>
        <div className="stat"><span>Pending payment</span><strong>{customer.orders.filter((order) => order.status === "PENDING_PAYMENT").length}</strong></div>
        <div className="stat"><span>Support tickets</span><strong>{customer.tickets.length}</strong></div>
      </div>

      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Login Details</h2>
        <p>Update a customer email address or set a new password after account verification.</p>
        <form className="form account-admin-form" action={`/api/admin/customers/${customer.id}`} method="post">
          <input type="hidden" name="action" value="account" />
          <div className="grid two">
            <div className="field">
              <label htmlFor="customer-email">Email address</label>
              <input className="input" id="customer-email" name="email" type="email" defaultValue={customer.email} required />
            </div>
            <div className="field">
              <label htmlFor="customer-password">New password</label>
              <input className="input" id="customer-password" name="password" type="password" minLength={10} placeholder="Leave blank to keep current password" />
            </div>
          </div>
          <button className="button primary" type="submit">Update Login Details</button>
        </form>
      </section>

      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>SSL Orders</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Plan</th><th>Domain</th><th>Total</th><th>Status</th><th /></tr></thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.id}>
                  <td><a className="order-number-pill" href={`/admin/orders/${order.id}`}>{order.orderNumber}</a></td>
                  <td>{order.product.name}</td>
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
