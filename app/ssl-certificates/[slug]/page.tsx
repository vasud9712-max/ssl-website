import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock3, Download, GlobeLock, Headphones, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { decodeData, decodeList, dollars } from "@/lib/orders";
import { orderUrl, productUrl, routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) {
    return seoMetadata({
      title: "SSL Certificate Not Found | ShieldxSSL",
      description: "The requested SSL certificate page could not be found.",
      path: routes.sslCertificates
    });
  }
  const details = decodeData<{ overview?: string }>(product.details, {});
  return seoMetadata({
    title: `${product.name} | SSL Certificate Details`,
    description: details.overview || `Review ${product.name} pricing, validation, coverage, issuance time, and SSL certificate features.`,
    path: productUrl(product.slug)
  });
}

export default async function SslCertificateDetailPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();
  const details = decodeData<{ overview?: string; specs?: string[][]; idealFor?: string[]; note?: string }>(product.details, {});
  const specs = details.specs || [];
  const features = decodeList(product.features);

  return (
    <main className="product-detail-page">
      <section className="product-hero">
        <div className="container product-hero-grid">
          <div>
            <p className="eyebrow"><LockKeyhole size={16} /> RapidSSL certificate</p>
            <h1>{product.name}</h1>
            <p>{details.overview || product.domainsCovered}</p>
            <div className="product-hero-actions">
              <a className="button primary accent" href={orderUrl(product.slug)}>Start Order</a>
              <a className="button secondary hero-secondary" href={routes.compareSslCertificates}>Compare Plans</a>
            </div>
            <div className="hero-trust-row">
              <span><ShieldCheck size={15} /> DV validation</span>
              <span><RefreshCw size={15} /> Unlimited reissues</span>
              <span><Headphones size={15} /> Expert support</span>
            </div>
          </div>
          <aside className="product-price-card">
            <span className="badge">1 Year Certificate</span>
            <strong>{dollars(product.price)}<small>/year</small></strong>
            <p>{product.domainsCovered}</p>
            <a className="button primary" href={orderUrl(product.slug)}>Order {product.name}</a>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container product-detail-grid">
          <div>
            <div className="section-head">
              <p className="eyebrow dark">Features and benefits</p>
              <h2>Built for fast, trusted HTTPS protection</h2>
              <p>{details.note || "RapidSSL certificates are simple to validate, easy to reissue, and trusted by major browsers and devices."}</p>
            </div>
            <div className="detail-feature-grid">
              {features.map((feature, index) => {
                const icons = [GlobeLock, Clock3, BadgeCheck, ShieldCheck, RefreshCw, Download];
                const Icon = icons[index % icons.length];
                return (
                  <article className="need-card" key={feature}>
                    <div className="icon-box"><Icon size={22} /></div>
                    <h3>{feature}</h3>
                    <p>Included with your {product.name} plan for practical certificate management.</p>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="spec-card">
            <h2>Certificate Specifications</h2>
            {specs.map(([label, value]) => (
              <div className="stat-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="section soft">
        <div className="container product-detail-grid">
          <div className="card">
            <h2>Ideal For</h2>
            <ul className="feature-list">
              {(details.idealFor || ["Business websites", "E-commerce", "Customer login areas", "Hosting providers"]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="cta-panel">
            <h2>Ready to secure your domain?</h2>
            <p>Create the SSL order as a guest, then create an account or log in at review before submitting.</p>
            <a className="button primary accent" href={orderUrl(product.slug)}>Order Now</a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
