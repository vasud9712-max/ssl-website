import {
  BadgeCheck,
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GlobeLock,
  Headphones,
  KeyRound,
  Laptop,
  LifeBuoy,
  LockKeyhole,
  MonitorCheck,
  SearchCheck,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Zap
} from "lucide-react";
import { prisma } from "@/lib/db";
import { faqs } from "@/lib/content";
import { decodeList, dollars } from "@/lib/orders";
import { orderUrl, routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata = seoMetadata({
  title: "ShieldxSSL | SSL Certificates Made Simple",
  description: "Buy affordable RapidSSL certificates, compare SSL plans, and manage HTTPS orders through a customer portal.",
  path: routes.home
});

const rapidSslFeatures = [
  [BadgeDollarSign, "Low-Price Guarantee", "Cost-effective RapidSSL certificates powered by trusted DigiCert-backed infrastructure."],
  [MonitorCheck, "99.9% Browser Support", "Major browsers, smartphones, and operating systems trust RapidSSL certificates."],
  [Zap, "Instant Issuance", "Fast DV validation helps eligible certificates issue in minutes with no paperwork."],
  [GlobeLock, "Secure Site Seal", "Display a trusted site seal to reinforce confidence and show encrypted protection."],
  [ServerCog, "Unlimited Reissues", "Reissue certificates during the validity period for migrations and key changes."],
  [LifeBuoy, "Free Tech Support", "Get help with CSR, validation, installation, and renewals from SSL specialists."]
];

const needSsl = [
  [GlobeLock, "Data Protection", "Encrypt passwords, payment data, contact forms, and visitor details with modern HTTPS protection."],
  [BadgeCheck, "Build Customer Trust", "Show a secure browser experience so customers feel confident using your website."],
  [SearchCheck, "Boost SEO Rankings", "Search engines prefer secure websites, and HTTPS is now a standard ranking signal."],
  [ShieldAlert, "Avoid Browser Warnings", "Prevent Not Secure warnings that can reduce conversions and credibility."],
  [FileCheck2, "Compliance Requirements", "Support PCI DSS, GDPR, and common security requirements that expect encrypted data."],
  [KeyRound, "Verify Your Identity", "Show customers your website is professionally protected and actively maintained."]
];

const steps = [
  ["01", "Choose Your Plan", "Select Single Domain, Multi-Domain, or Wildcard SSL."],
  ["02", "Complete Order Form", "Provide domain, contact, validation, and optional CSR details."],
  ["03", "Verify Your Domain", "Complete email, DNS, or file-based domain validation."],
  ["04", "Get Protected", "Admin confirms payment and uploads your issued SSL certificate."]
];

export default async function HomePage() {
  const products = await prisma.product.findMany({ where: { enabled: true }, orderBy: { price: "asc" } });

  return (
    <main>
      <section className="hero homepage-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><ShieldCheck size={16} /> Trusted RapidSSL protection</p>
            <h1>SSL Security Made <em>Simple</em></h1>
            <p>Protect your website, improve visitor confidence, and launch HTTPS with affordable RapidSSL certificates backed by expert support.</p>
            <div className="hero-actions">
              <a className="button primary accent" href={routes.orderSslCertificate}>Get Protected Now</a>
              <a className="button secondary hero-secondary" href={routes.portalOrders}>Check SSL Status</a>
            </div>
            <div className="hero-proof-grid" aria-label="SSL service highlights">
              <span><strong>15 min</strong><small>DV issuance after validation</small></span>
              <span><strong>99.9%</strong><small>Browser compatibility</small></span>
              <span><strong>24/7</strong><small>Ticket intake and support</small></span>
            </div>
            <div className="hero-trust-row">
              <span><CheckCircle2 size={15} /> Trusted CA-backed SSL</span>
              <span><Clock3 size={15} /> Fast DV issuance</span>
              <span><Headphones size={15} /> Expert support</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="security-panel">
              <div className="browser-frame">
                <div className="browser-chrome">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="address">https://secured-domain.com</span>
                </div>
                <div className="cert-card">
                  <div className="hero-status-card"><ShieldCheck size={22} /><span><strong>SSL Encrypted</strong><small>256-bit protection</small></span></div>
                  <div className="hero-status-card success"><LockKeyhole size={22} /><span><strong>Trust Verified</strong><small>Domain validation ready</small></span></div>
                  <div className="hero-status-card"><Laptop size={22} /><span><strong>Browser Trust</strong><small>99.9% compatibility</small></span></div>
                  <div className="protection-status"><span>Protection Status</span><strong>Active</strong></div>
                </div>
              </div>
            </div>
            <div className="hero-floating-card">
              <ShieldCheck size={18} />
              <span><strong>RapidSSL Ready</strong><small>Single, multi-domain, and wildcard plans</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container metric-band">
          <div><span className="stat-icon"><ShieldCheck size={20} /></span><strong>4000+</strong><span>Websites Protected</span></div>
          <div><span className="stat-icon"><MonitorCheck size={20} /></span><strong>99.9%</strong><span>Browser Support</span></div>
          <div><span className="stat-icon"><LifeBuoy size={20} /></span><strong>24/7</strong><span>Expert Support</span></div>
          <div><span className="stat-icon"><Zap size={20} /></span><strong>15 Min</strong><span>Average Issuance</span></div>
        </div>
      </section>
      

      <section className="section feature-showcase">
        <div className="container">
          <div className="section-head centered">
            <h2>Cheap RapidSSL Certificates - Key Features</h2>
            <p>Buy RapidSSL certificates for quick and easy encryption with premium support.</p>
          </div>
          <div className="feature-card-grid">
            {rapidSslFeatures.map(([Icon, title, body]) => (
              <article className="feature-card raised-icon" key={title as string}>
                <div className="feature-illustration"><Icon size={54} /></div>
                <h3>{title as string}</h3>
                <p>{body as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="certificates">
        <div className="container">
          <div className="section-head centered">
            <h2>Choose Your Protection Plan</h2>
            <p>Simple, transparent pricing with no hidden fees. All plans include trusted RapidSSL protection.</p>
          </div>
          <div className="pricing-grid">
            {products.map((product, index) => (
              <article className={`pricing-card ${index === 1 ? "featured" : ""}`} key={product.id}>
                {index === 1 && <span className="popular-ribbon">Most Popular</span>}
                <h3>{product.name}</h3>
                <p className="pricing-summary">{product.domainsCovered}</p>
                <div className="price">{dollars(product.price)}<span className="muted" style={{ fontSize: 16 }}>/year</span></div>
                <ul className="feature-list">
                  {decodeList(product.features).slice(0, 6).map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <a className={`button ${index === 1 ? "primary" : "secondary"}`} href={orderUrl(product.slug)}>Get Started</a>
              </article>
            ))}
          </div>
          <p className="compare-link"><a href={routes.compareSslCertificates}>Compare all features in detail</a></p>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head centered">
            <h2>Why Your Website Needs SSL</h2>
            <p>SSL certificates are no longer optional. They are essential for security, trust, and business success in today&apos;s digital landscape.</p>
          </div>
          <div className="ssl-need-grid">
            {needSsl.map(([Icon, title, body]) => (
              <article className="need-card" key={title as string}>
                <div className="icon-box"><Icon size={22} /></div>
                <h3>{title as string}</h3>
                <p>{body as string}</p>
              </article>
            ))}
          </div>
          <div className="insight-card">
            <ShieldCheck size={20} color="var(--blue)" />
            <h3>Did You Know?</h3>
            <p>Most visitors abandon a purchase when they see a browser security warning. SSL helps protect both trust and transactions.</p>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head centered">
            <h2>Get Protected in 4 Simple Steps</h2>
            <p>Our streamlined process makes SSL certificate installation quick and painless.</p>
          </div>
          <div className="steps">
            {steps.map(([number, title, body]) => (
              <article className="card step-card" key={number}>
                <strong>{number}</strong>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="hero-actions centered-actions">
            <a className="button primary accent" href={routes.orderSslCertificate}>Start Your Order</a>
            <a className="button secondary" href={routes.portalTickets}>Contact Support</a>
          </div>
        </div>
      </section>

      <section className="section soft" style={{ paddingTop: 0 }}>
        <div className="container mini-trust">
          {["Money-back guarantee", "Multi-domain support", "DV SSL options", "Easy reissue", "Expert support", "Secure checkout"].map((item) => (
            <div className="card" key={item}><ShieldCheck size={18} color="var(--blue)" /><p>{item}</p></div>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <div className="section-head centered">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about SSL certificates and our service.</p>
          </div>
          <div className="faq modern-faq">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="hero final-cta" style={{ minHeight: "auto" }}>
        <div className="container section">
          <h2>Ready to Secure Your Website?</h2>
          <p>Join website owners who protect visitors with ShieldxSSL. Get your certificate in minutes and start building customer trust today.</p>
          <div className="hero-actions centered-actions">
            <a className="button primary accent" href={routes.orderSslCertificate}>Get Your SSL Certificate</a>
            <a className="button secondary hero-secondary" href={routes.compareSslCertificates}>Compare Plans</a>
          </div>
          <p style={{ fontSize: 13 }}>Instant activation | Free reissues | 24/7 expert support</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
