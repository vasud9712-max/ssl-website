import { Inbox, MailCheck, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  status: string;
  createdAt: Date;
};

export default async function AdminContactMessagesPage() {
  const user = await requireAdmin();
  const messages = await prisma.$queryRaw<ContactMessageRow[]>`
    SELECT "id", "name", "email", "phone", "topic", "message", "status", "createdAt"
    FROM "ContactMessage"
    ORDER BY "createdAt" DESC
  `;
  const unreadCount = messages.filter((message) => message.status === "NEW").length;

  return (
    <DashboardLayout user={user} admin>
      <section className="ticket-hero card">
        <div>
          <p className="eyebrow dark"><Inbox size={16} /> Contact inbox</p>
          <h1>Contact Messages</h1>
          <p>{unreadCount} new message{unreadCount === 1 ? "" : "s"} from the public contact form.</p>
        </div>
      </section>

      <section className="card ticket-list-panel">
        <div className="ticket-card-list">
          {messages.length === 0 && <div className="empty-state">No contact messages yet.</div>}
          {messages.map((message) => (
            <article className="contact-message-card" key={message.id}>
              <div className="message-head">
                <div>
                  <strong>{message.name}</strong>
                  <span className="muted">{message.email}{message.phone ? ` - ${message.phone}` : ""}</span>
                </div>
                <span className="badge">{message.status}</span>
              </div>
              <div>
                <h2>{message.topic}</h2>
                <p>{message.message}</p>
                <span className="muted">Submitted {message.createdAt.toLocaleString()}</span>
              </div>
              <div className="actions compact-actions">
                <a className="button secondary" href={`mailto:${message.email}`}>Reply</a>
                <form action={`/api/admin/contact-messages/${message.id}`} method="post">
                  <input type="hidden" name="action" value={message.status === "NEW" ? "read" : "new"} />
                  <button className="button secondary" type="submit"><MailCheck size={17} /> {message.status === "NEW" ? "Mark Read" : "Mark New"}</button>
                </form>
                <form action={`/api/admin/contact-messages/${message.id}`} method="post">
                  <input type="hidden" name="action" value="delete" />
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
