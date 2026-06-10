import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductTable } from "@/components/ProductTable";

export default async function PortalProductsPage() {
  const user = await requireUser();
  const products = await prisma.product.findMany({ where: { enabled: true }, orderBy: { price: "asc" } });
  return (
    <DashboardLayout user={user}>
      <section className="card">
        <h1 style={{ color: "var(--navy)", fontSize: 38 }}>Browse SSL Products</h1>
        <p>Compare RapidSSL certificate plans and place a manual-payment order.</p>
        <ProductTable products={products} />
      </section>
    </DashboardLayout>
  );
}
