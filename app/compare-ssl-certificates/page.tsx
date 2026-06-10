import { BadgeCheck, CheckCircle2, Globe2, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { decodeList, dollars } from "@/lib/orders";
import { orderUrl, productUrl, routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata = seoMetadata({
  title: "Compare SSL Certificates | Single Domain, Multi-Domain and Wildcard",
  description: "Compare RapidSSL certificate types, validation options, coverage, issuance speed, and pricing before ordering.",
  path: routes.compareSslCertificates
});

const guidance = [
  [Globe2, "Single Domain", "Best for one website where www and non-www protection is enough."],
  [Layers3, "Multi-Domain", "Best for teams managing multiple specific hostnames in one certificate."],
  [Sparkles, "Wildcard", "Best for businesses with many first-level subdomains."]
];

export default async function CompareSslCertificatesPage() {
  const products = await prisma.product.findMany({ where: { enabled: true }, orderBy: { price: "asc" } });
  return (
    <main className="compare-page">
      <section className="compare-hero">
        <div className="container">
          <p className="eyebrow"><ShieldCheck size={16} /> SSL comparison</p>
          <h1>Compare SSL Certificate Types</h1>
          <p>Select the right RapidSSL certificate for your domain structure, validation workflow, and growth plans.</p>
        </div>
      </section>

      <section className="section">
        <div className="container compare-layout">
          <div className="compare-main">
            <div className="compare-table">
              <table>
                <thead>
                  <tr>
                    <th>Certificate</th>
                    <th>Validation</th>
                    <th>Coverage</th>
                    <th>Issuance</th>
                    <th>Price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td><strong>{product.name}</strong><br /><span>{product.issuanceTime} issuance</span></td>
                      <td>{product.validationType}</td>
                      <td>{product.domainsCovered}</td>
                      <td>{product.issuanceTime}</td>
                      <td><strong>{dollars(product.price)}/year</strong></td>
                      <td><a className="button primary" href={orderUrl(product.slug)}>Order</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="compare-cards">
              {products.map((product) => (
                <article className="compare-product-card" key={product.id}>
                  <div className="icon-box"><BadgeCheck size={22} /></div>
                  <h3>{product.name}</h3>
                  <p>{product.domainsCovered}</p>
                  <strong>{dollars(product.price)}<small>/year</small></strong>
                  <ul className="feature-list">
                    {decodeList(product.features).slice(0, 5).map((feature) => <li key={feature}>{feature}</li>)}
                  </ul>
                  <a className="button secondary" href={productUrl(product.slug)}>View Details</a>
                </article>
              ))}
            </div>
          </div>

          <aside className="compare-guide">
            <h2>Which SSL should you choose?</h2>
            {guidance.map(([Icon, title, body]) => (
              <div className="guide-item" key={title as string}>
                <Icon size={22} />
                <span><strong>{title as string}</strong><small>{body as string}</small></span>
              </div>
            ))}
            <div className="notice"><CheckCircle2 size={18} /><span><strong>Need help?</strong><br />Start with Single Domain for one site, Multi-Domain for separate hostnames, or Wildcard for subdomains.</span></div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
