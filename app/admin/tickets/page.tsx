import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Inbox, MessageSquareReply, Trash2 } from "lucide-react";

export default async function AdminTicketsPage() {
  const user = await requireAdmin();
  const tickets = await prisma.ticket.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } });
  return (
    <DashboardLayout user={user} admin>
      <section className="ticket-hero card">
        <div>
          <p className="eyebrow dark"><Inbox size={16} /> Newest received first</p>
          <h1>Support Ticket Management</h1>
          <p>Review customer requests, prioritize active issues, and respond with supporting files.</p>
        </div>
      </section>
      <section className="card ticket-list-panel">
        <div className="ticket-card-list">
          {tickets.length === 0 && <div className="empty-state">No support tickets received yet.</div>}
          {tickets.map((ticket) => (
            <article className="ticket-row-card admin-ticket-row" key={ticket.id}>
              <div>
                <strong>{ticket.subject}</strong>
                <span className="muted">{ticket.user.email} - Received {ticket.createdAt.toLocaleString()}</span>
              </div>
              <span className="priority-pill">{ticket.priority}</span>
              <span className="badge">{ticket.status.replaceAll("_", " ")}</span>
              <div className="actions compact-actions">
                <a className="button secondary" href={`/admin/tickets/${ticket.id}`}><MessageSquareReply size={17} /> Reply</a>
                <form action={`/api/admin/tickets/${ticket.id}/delete`} method="post">
                  <button className="button danger" type="submit"><Trash2 size={17} /> Delete</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
