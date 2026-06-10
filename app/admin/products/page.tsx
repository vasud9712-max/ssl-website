import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { dollars } from "@/lib/orders";

export default async function AdminProductsPage() {
  const user = await requireAdmin();
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { price: "asc" } });
  return (
    <DashboardLayout user={user} admin>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Product Management</h1>
        <p>Create and edit SSL products, set pricing, configure features, and enable or disable plans.</p>
        <form className="form" action="/api/admin/products" method="post">
          <div className="grid two">
            <div className="field"><label>Name</label><input className="input" name="name" required /></div>
            <div className="field"><label>Slug</label><input className="input" name="slug" required /></div>
            <div className="field"><label>Validation type</label><input className="input" name="validationType" defaultValue="Domain Validation (DV)" required /></div>
            <div className="field"><label>Domains covered</label><input className="input" name="domainsCovered" required /></div>
            <div className="field"><label>Issuance time</label><input className="input" name="issuanceTime" defaultValue="15 Minutes" required /></div>
            <div className="field"><label>Price</label><input className="input" name="price" type="number" required /></div>
            <div className="field"><label>Additional SAN price</label><input className="input" name="additionalSanPrice" type="number" defaultValue="0" /></div>
          </div>
          <div className="field"><label>Features</label><textarea className="textarea" name="features" placeholder="One feature per line" required /></div>
          <input type="hidden" name="enabled" value="true" />
          <button className="button primary" type="submit">Create Product</button>
        </form>
      </section>
      <section className="card">
        <h2 style={{ color: "var(--navy)", fontSize: 30 }}>Current Products</h2>
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Enabled</th><th /></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{dollars(product.price)}</td>
                <td>{product.enabled ? "Yes" : "No"}</td>
                <td>
                  <form action={`/api/admin/products/${product.id}/toggle`} method="post">
                    <button className="button secondary" type="submit">{product.enabled ? "Disable" : "Enable"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
