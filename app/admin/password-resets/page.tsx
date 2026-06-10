import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";

export const dynamic = "force-dynamic";

export default async function AdminPasswordResetsPage() {
  const admin = await requireAdmin();
  const requests = await prisma.passwordResetRequest.findMany({
    include: { user: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });

  const pendingCount = requests.filter((request) => request.status === "PENDING").length;

  return (
    <DashboardLayout user={admin} admin>
      <section className="card admin-page-head">
        <p className="eyebrow">Account recovery</p>
        <h1>Password Reset Requests</h1>
        <p>Review reset requests, update customer login details, and mark completed requests as resolved.</p>
      </section>

      <div className="stat-grid">
        <div className="stat"><span>Pending requests</span><strong>{pendingCount}</strong></div>
        <div className="stat"><span>Total requests</span><strong>{requests.length}</strong></div>
      </div>

      <section className="password-reset-list">
        {requests.length === 0 && (
          <article className="card">
            <h2>No password reset requests</h2>
            <p>New customer reset requests will appear here automatically.</p>
          </article>
        )}
        {requests.map((request) => (
          <article className="password-reset-card" key={request.id}>
            <div className="reset-card-head">
              <div>
                <span className={`badge ${request.status === "RESOLVED" ? "success" : "warning"}`}>{request.status}</span>
                <h2>{request.name}</h2>
                <p>{request.email}</p>
              </div>
              <div className="reset-meta">
                <span>Requested</span>
                <strong>{request.createdAt.toLocaleString()}</strong>
              </div>
            </div>

            <div className="reset-detail-grid">
              <div><span>Matched account</span><strong>{request.user ? request.user.email : "No matching account"}</strong></div>
              <div><span>Ticket</span><strong>{request.ticketId ? <a href={`/admin/tickets/${request.ticketId}`}>Open ticket</a> : "Not created"}</strong></div>
              <div><span>Resolved</span><strong>{request.resolvedAt ? request.resolvedAt.toLocaleString() : "Pending"}</strong></div>
            </div>

            <form className="reset-actions-grid" action={`/api/admin/password-resets/${request.id}`} method="post">
              <input type="hidden" name="action" value="update-account" />
              <div className="field">
                <label htmlFor={`email-${request.id}`}>New email</label>
                <input className="input" id={`email-${request.id}`} name="email" type="email" defaultValue={request.user?.email || request.email} />
              </div>
              <div className="field">
                <label htmlFor={`password-${request.id}`}>New password</label>
                <input className="input" id={`password-${request.id}`} name="password" type="password" minLength={10} placeholder="At least 10 characters" />
              </div>
              <button className="button primary" type="submit">Update Account</button>
            </form>

            <form className="actions" action={`/api/admin/password-resets/${request.id}`} method="post">
              <input type="hidden" name="action" value="resolve" />
              <button className="button secondary" type="submit" disabled={request.status === "RESOLVED"}>Mark Resolved</button>
              {request.user && <a className="button secondary" href={`/admin/customers/${request.user.id}`}>View Customer</a>}
            </form>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}
