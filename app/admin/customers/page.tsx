import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Trash2 } from "lucide-react";

export default async function AdminCustomersPage() {
  const user = await requireAdmin();
  const customers = await prisma.user.findMany({ where: { role: "CUSTOMER" }, include: { orders: true }, orderBy: { createdAt: "desc" } });
  return (
    <DashboardLayout user={user} admin>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Customer Management</h1>
        <p>View customers, suspend accounts, and inspect order history.</p>
        <table>
          <thead><tr><th>Customer</th><th>Company</th><th>Status</th><th>Orders</th><th>Actions</th></tr></thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td><a href={`/admin/customers/${customer.id}`}><strong>{customer.name}</strong></a><br /><span className="muted">{customer.email}</span></td>
                <td>{customer.company || "-"}</td>
                <td><span className="badge">{customer.status}</span></td>
                <td>{customer.orders.length}</td>
                <td>
                  <div className="actions compact-actions">
                    <form action={`/api/admin/customers/${customer.id}`} method="post">
                      <input type="hidden" name="status" value={customer.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"} />
                      <button className="button secondary" type="submit">{customer.status === "ACTIVE" ? "Suspend" : "Activate"}</button>
                    </form>
                    <form action={`/api/admin/customers/${customer.id}`} method="post">
                      <input type="hidden" name="action" value="delete" />
                      <button className="button danger" type="submit"><Trash2 size={17} /> Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
