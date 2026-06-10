import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { decodeList, dollars } from "@/lib/orders";

export default async function OrderDetailPage({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const user = await requireUser();
  const order = await prisma.order.findFirst({ where: { id: params.id, userId: user.id }, include: { product: true, certificate: true } });
  if (!order) notFound();
  const sanEntries = decodeList(order.sanEntries);

  return (
    <DashboardLayout user={user}>
      <section className="card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="eyebrow">SSL order</p>
            <span className="order-number-display">{order.orderNumber}</span>
            <h1 style={{ color: "var(--navy)", fontSize: 38 }}>{order.product.name}</h1>
            <p>{order.primaryDomain}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div className="grid two">
          <div className="card">
            <h3>Order Details</h3>
            <div className="stat-row"><span>Total</span><strong>{dollars(order.totalAmount)}</strong></div>
            <div className="stat-row"><span>Validation</span><strong>{order.validationMethod}</strong></div>
            <div className="stat-row"><span>SAN entries</span><strong>{sanEntries.length ? sanEntries.join(", ") : "None"}</strong></div>
            <div className="stat-row"><span>CSR</span><strong>{order.csr ? "Submitted" : "Not submitted"}</strong></div>
            <div className="stat-row"><span>Created</span><strong>{order.createdAt.toLocaleDateString()}</strong></div>
            <div className="stat-row"><span>Expires</span><strong>{order.expiresAt?.toLocaleDateString() || "Not issued"}</strong></div>
          </div>
          <div className="card">
            <h3>Manual PayPal Instructions</h3>
            <p>Send <strong>{dollars(order.totalAmount)}</strong> to <strong>{process.env.PAYPAL_PAYMENT_EMAIL || "billing@trustshieldssl.example"}</strong>. Include order number <strong>{order.orderNumber}</strong> in the PayPal note.</p>
          </div>
        </div>
      </section>
      {order.verificationNotes && (
        <section className="verification-note">
          <h2>SSL Verification Instructions</h2>
          <p>{order.verificationNotes}</p>
        </section>
      )}
      {order.certificatePem && (
        <section className="card">
          <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Issued Certificate</h2>
          <textarea className="textarea" readOnly value={order.certificatePem} />
          <div className="actions" style={{ marginTop: 12 }}>
            <a className="button primary" href={`/api/orders/${order.id}/download`}>Download Certificate</a>
          </div>
        </section>
      )}
      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>{order.csr ? "Update CSR" : "Submit CSR"}</h2>
        <p>Paste your Certificate Signing Request after placing the order. Support will continue validation after CSR review.</p>
        {searchParams.error && <p className="field-error">{searchParams.error}</p>}
        <form className="form" action={`/api/orders/${order.id}/csr`} method="post">
          <div className="field">
            <label htmlFor="csr-current">Certificate Signing Request</label>
            <textarea className="textarea" id="csr-current" name="csr" defaultValue={order.csr || ""} required />
          </div>
          <button className="button primary" type="submit">Save CSR</button>
        </form>
      </section>
      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Request Reissue</h2>
        <form className="form" action={`/api/orders/${order.id}/reissue`} method="post">
          <div className="field">
            <label htmlFor="csr">New CSR</label>
            <textarea className="textarea" id="csr" name="csr" required />
          </div>
          <button className="button secondary" type="submit">Submit Reissue Request</button>
        </form>
      </section>
    </DashboardLayout>
  );
}
