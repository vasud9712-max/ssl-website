import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TicketAttachmentField } from "@/components/TicketAttachmentField";
import { TicketAttachments } from "@/components/TicketAttachments";
import { MessageCircle, Paperclip, Send } from "lucide-react";

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const ticket = await prisma.ticket.findFirst({
    where: { id: params.id, userId: user.id },
    include: { replies: { include: { user: true }, orderBy: { createdAt: "asc" } } }
  });
  if (!ticket) notFound();

  return (
    <DashboardLayout user={user}>
      <section className="ticket-hero card">
        <div>
          <p className="eyebrow dark">{ticket.status.replaceAll("_", " ")}</p>
          <h1>{ticket.subject}</h1>
          <p>Priority: {ticket.priority} - Created {ticket.createdAt.toLocaleString()}</p>
        </div>
        <a className="button secondary" href="/portal/tickets">Back to Tickets</a>
      </section>
      <section className="card">
        <div className="section-title">
          <span className="icon-box compact"><Paperclip size={20} /></span>
          <div>
            <h2>Original Attachments</h2>
            <p>Preview images or download files attached to this ticket.</p>
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
            <h2>Reply</h2>
            <p>Add details or attach a screenshot for the support team.</p>
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
