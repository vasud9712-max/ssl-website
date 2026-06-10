import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function ProfilePage() {
  const session = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: session.id } });
  return (
    <DashboardLayout user={session}>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Profile</h1>
        <p>Keep billing and certificate organization details current.</p>
        <form className="form" action="/api/profile" method="post">
          <div className="grid two">
            <div className="field"><label>Name</label><input className="input" name="name" defaultValue={user.name} required /></div>
            <div className="field"><label>Company</label><input className="input" name="company" defaultValue={user.company || ""} /></div>
            <div className="field"><label>Phone</label><input className="input" name="phone" defaultValue={user.phone || ""} /></div>
            <div className="field"><label>Address</label><input className="input" name="address" defaultValue={user.address || ""} /></div>
            <div className="field"><label>City</label><input className="input" name="city" defaultValue={user.city || ""} /></div>
            <div className="field"><label>State</label><input className="input" name="state" defaultValue={user.state || ""} /></div>
            <div className="field"><label>Country</label><input className="input" name="country" defaultValue={user.country || ""} /></div>
            <div className="field"><label>Zipcode</label><input className="input" name="zip" defaultValue={user.zip || ""} /></div>
          </div>
          <button className="button primary" type="submit">Update Profile</button>
        </form>
      </section>
    </DashboardLayout>
  );
}
