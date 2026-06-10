import { notFound } from "next/navigation";
import { Lock, MessageCircle, Paperclip, Send, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TicketAttachmentField } from "@/components/TicketAttachmentField";
import { TicketAttachments } from "@/components/TicketAttachments";

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
  const user = await requireAdmin();
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { user: true, replies: { include: { user: true }, orderBy: { createdAt: "asc" } } }
  });
  if (!ticket) notFound();

  return (
    <DashboardLayout user={user} admin>
      <section className="ticket-hero card">
        <div>
          <p className="eyebrow dark">{ticket.user.email}</p>
          <h1>{ticket.subject}</h1>
          <p>{ticket.priority} - {ticket.status.replaceAll("_", " ")} - Received {ticket.createdAt.toLocaleString()}</p>
        </div>
        <div className="actions">
          <form action={`/api/admin/tickets/${ticket.id}/close`} method="post">
            <button className="button secondary" type="submit"><Lock size={17} /> Close Ticket</button>
          </form>
          <form action={`/api/admin/tickets/${ticket.id}/delete`} method="post">
            <button className="button danger" type="submit"><Trash2 size={17} /> Delete Ticket</button>
          </form>
        </div>
      </section>

      <section className="card">
        <div className="section-title">
          <span className="icon-box compact"><Paperclip size={20} /></span>
          <div>
            <h2>Original Attachments</h2>
            <p>Preview customer images or download the source files.</p>
          </div>
        </div>
        <TicketAttachments value={ticket.attachments} />
        {!ticket.attachments && <div className="empty-state compact">No attachments on the original ticket.</div>}
      </section>

      <section className="conversation-list">
        {ticket.replies.map((reply) => (
          <article className={`message-card ${reply.userId === user.id ? "mine" : ""}`} key={reply.id}>
            <div className="message-head">
              <strong>{reply.user.name}</strong>
              <span className="muted">{reply.createdAt.toLocaleString()}</span>
            </div>
            <p>{reply.message}</p>
            <TicketAttachments value={reply.attachments} />
          </article>
        ))}
      </section>

      <section className="card">
        <div className="section-title">
          <span className="icon-box compact"><MessageCircle size={20} /></span>
          <div>
            <h2>Admin Reply</h2>
            <p>Attach images or TXT files when they clarify the resolution.</p>
          </div>
        </div>
        <form className="form" action={`/api/tickets/${ticket.id}/reply`} method="post" encType="multipart/form-data">
          <div className="field"><label>Message</label><textarea className="textarea" name="message" required /></div>
          <TicketAttachmentField compact />
          <button className="button primary" type="submit"><Send size={17} /> Send Reply</button>
        </form>
      </section>
    </DashboardLayout>
  );
}
