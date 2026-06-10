import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TicketAttachmentField } from "@/components/TicketAttachmentField";
import { Clock3, MessageSquarePlus, Paperclip } from "lucide-react";

export default async function TicketsPage({ searchParams }: { searchParams?: { created?: string; error?: string } }) {
  const user = await requireUser();
  const tickets = await prisma.ticket.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
  const orders = await prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  const createdTicket = tickets.find((ticket) => ticket.id === searchParams?.created);
  return (
    <DashboardLayout user={user}>
      <section className="ticket-hero card">
        <div>
          <p className="eyebrow dark"><MessageSquarePlus size={16} /> Support desk</p>
          <h1>Support Tickets</h1>
          <p>Ask for help with CSR creation, validation, installation, reissues, and renewals.</p>
        </div>
        <a className="button secondary" href="#ticket-history"><Clock3 size={17} /> View history</a>
      </section>

      <section className="ticket-layout">
        <form className="ticket-form card form" action="/api/tickets" method="post" encType="multipart/form-data">
          <div className="section-title">
            <span className="icon-box compact"><MessageSquarePlus size={20} /></span>
            <div>
              <h2>Create Ticket</h2>
              <p>Include screenshots or TXT notes when they help explain the issue.</p>
            </div>
          </div>
          <div className="grid two">
            <div className="field"><label>Subject</label><input className="input" name="subject" required /></div>
            <div className="field">
              <label>Priority</label>
              <select className="select" name="priority" defaultValue="NORMAL">
                <option value="LOW">Low</option><option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Related order</label>
            <select className="select" name="orderId" defaultValue="">
              <option value="">None</option>
              {orders.map((order) => <option key={order.id} value={order.id}>{order.orderNumber} - {order.primaryDomain}</option>)}
            </select>
          </div>
          <div className="field"><label>Message</label><textarea className="textarea" name="message" required /></div>
          <TicketAttachmentField />
          <button className="button primary" type="submit"><Paperclip size={17} /> Submit Ticket</button>
        </form>

        <section className="card ticket-list-panel" id="ticket-history">
          <div className="section-title">
            <span className="icon-box compact"><Clock3 size={20} /></span>
            <div>
              <h2>Ticket History</h2>
              <p>Newest activity appears first.</p>
            </div>
          </div>
          <div className="ticket-card-list">
            {searchParams?.error && <div className="error-state">{searchParams.error}</div>}
            {createdTicket && (
              <div className="success-state">
                Ticket submitted successfully. <a href={`/portal/tickets/${createdTicket.id}`}>Open ticket</a>
              </div>
            )}
            {tickets.length === 0 && <div className="empty-state">No support tickets yet.</div>}
            {tickets.map((ticket) => (
              <article className="ticket-row-card" key={ticket.id}>
                <div>
                  <strong>{ticket.subject}</strong>
                  <span className="muted">{ticket.priority} priority - Updated {ticket.updatedAt.toLocaleString()}</span>
                </div>
                <span className="badge">{ticket.status.replaceAll("_", " ")}</span>
                <a className="button secondary" href={`/portal/tickets/${ticket.id}`}>Open</a>
              </article>
            ))}
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}
