import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function EmailTemplatesPage() {
  const user = await requireAdmin();
  const templates = await prisma.emailTemplate.findMany({ orderBy: { key: "asc" } });
  return (
    <DashboardLayout user={user} admin>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Email Templates</h1>
        <p>Edit automated email copy for registration, orders, payments, validation, issuance, expiry, renewal, and support updates.</p>
      </section>
      {templates.map((template) => (
        <section className="card" key={template.id}>
          <form className="form" action={`/api/admin/email-templates/${template.id}`} method="post">
            <h3>{template.name}</h3>
            <div className="field"><label>Subject</label><input className="input" name="subject" defaultValue={template.subject} required /></div>
            <div className="field"><label>Body</label><textarea className="textarea" name="body" defaultValue={template.body} required /></div>
            <button className="button secondary" type="submit">Save Template</button>
          </form>
        </section>
      ))}
    </DashboardLayout>
  );
}
