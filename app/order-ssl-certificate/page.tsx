import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { routes, seoMetadata } from "@/lib/seo";
import { OrderWizard } from "@/components/OrderWizard";

export const metadata = seoMetadata({
  title: "Order SSL Certificate | ShieldxSSL",
  description: "Order a RapidSSL certificate for your domain with guided validation details and manual PayPal payment.",
  path: routes.orderSslCertificate
});

export default async function OrderSslCertificatePage({ searchParams }: { searchParams: { product?: string; error?: string } }) {
  const user = await getSession();
  const products = await prisma.product.findMany({ where: { enabled: true }, orderBy: { price: "asc" } });

  return (
    <main className="order-page">
      <div className="container">
        {searchParams.error && <p className="form-error">{searchParams.error}</p>}
        <OrderWizard products={products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          domainsCovered: product.domainsCovered,
          additionalSanPrice: product.additionalSanPrice
        }))} selectedSlug={searchParams.product} userEmail={user?.email || ""} isAuthenticated={Boolean(user)} />
      </div>
    </main>
  );
}
