import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { decodeList, dollars, orderStatusLabels } from "@/lib/orders";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { product: true, user: true } });
  if (!order) notFound();
  const statuses = Object.keys(orderStatusLabels);
  const sanEntries = decodeList(order.sanEntries);
  const domains = decodeList(order.domains);

  return (
    <DashboardLayout user={user} admin>
      <section className="card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="eyebrow">SSL order</p>
            <span className="order-number-display">{order.orderNumber}</span>
            <h1 style={{ color: "var(--navy)", fontSize: 38 }}>{order.primaryDomain}</h1>
            <p>{order.user.email} · {order.product.name} · {dollars(order.totalAmount)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        {order.verificationNotes && (
          <div className="verification-note" style={{ marginTop: 18 }}>
            <h2>Customer Verification Instructions</h2>
            <p>{order.verificationNotes}</p>
          </div>
        )}
      </section>

      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Customer Selected Details</h2>
        <div className="grid two">
          <div className="stat-row"><span>Validation Method</span><strong>{order.validationMethod}</strong></div>
          <div className="stat-row"><span>SAN Entries</span><strong>{sanEntries.length ? sanEntries.join(", ") : "None"}</strong></div>
          <div className="stat-row"><span>CSR</span><strong>{order.csr ? "Submitted" : "Not submitted"}</strong></div>
          <div className="stat-row"><span>Organization</span><strong>{order.organizationName || "Not supplied"}</strong></div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Edit SSL Order</h2>
        <form className="form" action={`/api/admin/orders/${order.id}`} method="post">
          <div className="grid two">
            <div className="field"><label>Primary domain</label><input className="input" name="primaryDomain" defaultValue={order.primaryDomain} required /></div>
            <div className="field"><label>Total amount</label><input className="input" name="totalAmount" type="number" defaultValue={order.totalAmount} required /></div>
          </div>
          <div className="field"><label>Domain names</label><textarea className="textarea" name="domains" defaultValue={domains.join("\n") || order.primaryDomain} required /></div>
          <div className="field"><label>SAN entries</label><textarea className="textarea" name="sanEntries" defaultValue={sanEntries.join("\n")} /></div>
          <div className="grid two">
            <div className="field"><label>Validation method</label><select className="select" name="validationMethod" defaultValue={order.validationMethod}><option value="EMAIL">Email</option><option value="DNS">DNS</option><option value="FILE">File Upload</option></select></div>
            <div className="field"><label>Organization</label><input className="input" name="organizationName" defaultValue={order.organizationName || ""} /></div>
          </div>
          <div className="grid two">
            <div className="field">
              <label>Status</label>
              <select className="select" name="status" defaultValue={order.status}>
                {statuses.map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}
              </select>
            </div>
            <div className="field"><label>Expiry date</label><input className="input" name="expiresAt" type="date" defaultValue={order.expiresAt?.toISOString().slice(0, 10)} /></div>
          </div>
          <div className="field"><label>CSR</label><textarea className="textarea" name="csr" defaultValue={order.csr || ""} /></div>
          <div className="field"><label>Highlighted verification notes for customer</label><textarea className="textarea" name="verificationNotes" defaultValue={order.verificationNotes || ""} placeholder="Add DNS TXT record, approval email, or file validation instructions." /></div>
          <div className="field"><label>Issued certificate PEM</label><textarea className="textarea" name="certificatePem" defaultValue={order.certificatePem || ""} /></div>
          <div className="field"><label>CA bundle</label><textarea className="textarea" name="caBundle" defaultValue={order.caBundle || ""} /></div>
          <div className="field"><label>Private admin notes</label><textarea className="textarea" name="adminNotes" defaultValue={order.adminNotes || ""} /></div>
          <button className="button primary" type="submit">Save Order Update</button>
        </form>
      </section>

      <section className="card danger-zone">
        <h2>Delete SSL Order</h2>
        <p>This permanently removes the order and any issued certificate record. Use only when the order was created by mistake.</p>
        <form action={`/api/admin/orders/${order.id}/delete`} method="post">
          <button className="button danger" type="submit">Delete Order</button>
        </form>
      </section>
    </DashboardLayout>
  );
}
