import { BadgeCheck, BadgeDollarSign, CheckCircle2, FileCheck2, GlobeLock, Headphones, KeyRound, LockKeyhole, Rocket, SearchCheck, ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import { prisma } from "@/lib/db";
import { decodeList, dollars } from "@/lib/orders";
import { orderUrl, productUrl, routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata = seoMetadata({
  title: "SSL Certificates | RapidSSL Plans and Pricing",
  description: "Browse affordable RapidSSL certificate plans for single domain, multi-domain, and wildcard HTTPS protection.",
  path: routes.sslCertificates
});

const sslBenefits = [
  [LockKeyhole, "Data Encryption", "Protect logins, forms, payment details, and private customer information in transit."],
  [BadgeCheck, "Customer Trust", "Show visitors a secure HTTPS experience that supports credibility and conversion."],
  [SearchCheck, "Improved SEO Rankings", "HTTPS is expected by search engines and modern browsers for reputable websites."],
  [FileCheck2, "PCI Compliance", "Support common security requirements for payment and customer data workflows."],
  [ShieldCheck, "Website Authentication", "Help visitors confirm they are communicating with the right website."],
  [ShoppingCart, "Secure Online Transactions", "Create a safer environment for checkout, account access, and customer portals."]
];

const whyShield = [
  [BadgeDollarSign, "Up to 45% Savings", "Reduce SSL certificate costs while keeping trusted CA-backed protection."],
  [ShieldCheck, "Trusted Certificate Authorities", "Choose SSL options powered by globally recognized certificate authority infrastructure."],
  [Zap, "Fast Certificate Issuance", "DV validation workflows help eligible certificates issue quickly after verification."],
  [Rocket, "Free SSL Installation Support", "Get practical help for activation, CSR details, installation, and reissues."],
  [Headphones, "Expert Technical Assistance", "Our SSL specialists can help with pre-sales, billing, selection, and support."],
  [GlobeLock, "Enterprise-Grade Security Solutions", "Secure single websites, multiple domains, subdomains, and business-critical services."]
];

const supportItems = ["Pre-sales inquiries", "Billing questions", "SSL certificate selection", "Installation assistance", "Technical support"];

export default async function SslCertificatesPage() {
  const products = await prisma.product.findMany({ where: { enabled: true }, orderBy: { price: "asc" } });

  return (
    <main className="ssl-sales-page">
      <section className="ssl-sales-hero">
        <div className="container ssl-sales-hero-grid">
          <div>
            <p className="eyebrow"><ShieldCheck size={16} /> SSL certificates</p>
            <h1>Buy SSL certificates from ShieldxSSL and save up to 45%.</h1>
            <p>Protect your website, customer data, and online reputation with cost-effective SSL solutions tailored to businesses of all sizes.</p>
            <div className="hero-actions">
              <a className="button primary accent" href={routes.orderSslCertificate}>Order SSL Certificate</a>
              <a className="button secondary hero-secondary" href={routes.compareSslCertificates}>Compare Plans</a>
            </div>
          </div>
          <aside className="ssl-hero-card">
            <ShieldCheck size={34} />
            <strong>Trusted HTTPS protection</strong>
            <span>Single Domain, Multi-Domain, and Wildcard SSL options with expert support.</span>
          </aside>
        </div>
      </section>

      <section className="section ssl-plan-section" id="certificates">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow dark">Choose your certificate</p>
            <h2>SSL plans for every domain structure.</h2>
            <p>Select a certificate plan, Review the details, and Place SSL order..</p>
          </div>
          <div className="ssl-plan-grid">
            {products.map((product, index) => (
              <article className={`pricing-card ssl-page-plan ${index === 1 ? "featured" : ""}`} key={product.id}>
                {index === 1 && <span className="popular-ribbon">Most Popular</span>}
                <h3>{product.name}</h3>
                <p className="pricing-summary">{product.domainsCovered}</p>
                <div className="price">{dollars(product.price)}<span className="muted" style={{ fontSize: 16 }}>/year</span></div>
                <ul className="feature-list">
                  {decodeList(product.features).slice(0, 6).map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="plan-action-row">
                  <a className={`button ${index === 1 ? "primary" : "secondary"}`} href={orderUrl(product.slug)}>Get Started</a>
                  <a className="button secondary" href={productUrl(product.slug)}>Details</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section ssl-benefits-section">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow dark">Benefits of SSL Certificate</p>
            <h2>Security signals that protect visitors and support growth.</h2>
          </div>
          <div className="ssl-benefit-grid">
            {sslBenefits.map(([Icon, title, body]) => (
              <article className="ssl-benefit-card" key={title as string}>
                <div className="icon-box"><Icon size={22} /></div>
                <h3>{title as string}</h3>
                <p>{body as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ssl-copy-band">
        <div className="container ssl-copy-layout">
          <div>
            <p className="eyebrow">Buy SSL Certificates from ShieldxSSL</p>
            <h2>Save Up to 45% on SSL Certificate Costs</h2>
            <p>At ShieldxSSL, we make website security affordable without compromising quality. As one of the leading providers of cost-effective SSL certificates, we offer savings of up to 45% on certificates from trusted and globally recognized Certificate Authorities (CAs).</p>
            <p>Protect your website, customer data, and online reputation with SSL solutions tailored to businesses of all sizes at prices that fit your budget.</p>
          </div>
          <div className="ssl-copy-card">
            <h3>Dedicated SSL Experts at Your Service</h3>
            <p>Whether securing a single website or managing multiple domains, we ensure a smooth and secure experience.</p>
            <ul className="feature-list">
              {supportItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section why-shield-section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Why ShieldxSSL?</p>
            <h2>Fast, trusted, and affordable SSL provider.</h2>
            <p>We dedicatedly strive to offer our clients the best deals on SSL certificates from trustworthy CAs through hassle-free services.</p>
          </div>
          <div className="why-shield-grid">
            {whyShield.map(([Icon, title, body]) => (
              <article className="why-shield-card" key={title as string}>
                <div className="icon-box"><Icon size={24} /></div>
                <h3>{title as string}</h3>
                <p>{body as string}</p>
              </article>
            ))}
          </div>
          <div className="ssl-final-cta">
            <CheckCircle2 size={22} />
            <p>Choose the right SSL certificate at the best price and secure your website with confidence only at ShieldxSSL.</p>
            <a className="button primary accent" href={routes.orderSslCertificate}>Secure Your Website</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
