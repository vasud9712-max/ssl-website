import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function AdminNewOrderPage() {
  const user = await requireAdmin();
  const [products, customers] = await Promise.all([
    prisma.product.findMany({ where: { enabled: true } }),
    prisma.user.findMany({ where: { role: "CUSTOMER" }, orderBy: { email: "asc" } })
  ]);
  return (
    <DashboardLayout user={user} admin>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Create Manual Order</h1>
        <form className="form" action="/api/admin/orders" method="post">
          <div className="grid two">
            <div className="field"><label>Customer</label><select className="select" name="userId">{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.email}</option>)}</select></div>
            <div className="field"><label>Product</label><select className="select" name="productId">{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></div>
          </div>
          <div className="field"><label>Primary domain</label><input className="input" name="primaryDomain" required /></div>
          <div className="field"><label>Domain names</label><textarea className="textarea" name="domains" required /></div>
          <div className="field"><label>SAN entries</label><textarea className="textarea" name="sanEntries" /></div>
          <input type="hidden" name="validationMethod" value="DNS" />
          <input type="hidden" name="organizationName" value="Manual Admin Order" />
          <input type="hidden" name="address" value="Admin supplied" />
          <input type="hidden" name="city" value="Admin" />
          <input type="hidden" name="state" value="Admin" />
          <input type="hidden" name="country" value="Admin" />
          <input type="hidden" name="zip" value="00000" />
          <button className="button primary" type="submit">Create Pending Payment Order</button>
        </form>
      </section>
    </DashboardLayout>
  );
}
