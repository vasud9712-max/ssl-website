import { BadgeCheck, Building2, Headphones, LockKeyhole, RefreshCw, ShieldCheck, Target, UsersRound, Zap } from "lucide-react";
import { routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = seoMetadata({
  title: "About Us | ShieldxSSL",
  description: "Learn how ShieldxSSL helps businesses, agencies, and website owners order and manage RapidSSL certificates.",
  path: routes.aboutUs
});

const values = [
  [ShieldCheck, "Trust first", "We design every order, validation, and support workflow around customer confidence."],
  [Zap, "Fast execution", "Clear forms and practical support help eligible SSL certificates move quickly to issuance."],
  [Headphones, "Human guidance", "Customers get help with CSR creation, DNS records, file validation, installs, and renewals."],
  [RefreshCw, "Lifecycle care", "Reissues, renewals, and certificate status tracking stay visible after the first order."]
];

const highlights = [
  ["4000+", "websites protected"],
  ["99.9%", "browser compatibility"],
  ["24/7", "ticket intake"],
  ["15 min", "typical DV issuance after validation"]
];


export default function AboutUsPage() {
  return (
    <main className="corporate-page">
      <section className="corporate-hero">
        <div className="container corporate-hero-grid">
          <div>
            <p className="eyebrow"><Building2 size={16} /> About ShieldxSSL</p>
            <h1>Practical SSL protection for businesses, agencies, and website owners.</h1>
            <p>ShieldxSSL helps customers order, validate, manage, reissue, and renew RapidSSL certificates with clear pricing and hands-on support.</p>
          </div>
          <aside className="hero-support-card">
            <LockKeyhole size={30} />
            <strong>Security made manageable</strong>
            <span>Simple workflows for everyday website teams.</span>
          </aside>
        </div>
      </section>

      <section className="corporate-section">
        <div className="container story-layout">
          <div className="story-copy">
            <p className="eyebrow dark">Company profile</p>
            <h2>We make certificate management less confusing and more accountable.</h2>
            <p>SSL is essential, but validation steps, CSR details, domain ownership checks, renewals, and reissues can slow teams down. ShieldxSSL brings those steps into a focused customer portal with clear support paths and transparent order status.</p>
            <p>Our service is built for small businesses, agencies, hosting consultants, and site owners who need trusted RapidSSL certificates without a complicated procurement process.</p>
          </div>
          <div className="highlight-grid">
            {highlights.map(([value, label]) => (
              <article className="highlight-card" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="corporate-section muted-section">
        <div className="container mission-grid">
          <article className="mission-card">
            <span className="icon-box"><Target size={22} /></span>
            <h2>Mission</h2>
            <p>Help customers secure websites faster by making SSL ordering, validation, reissue, and renewal workflows clear from start to finish.</p>
          </article>
          <article className="mission-card">
            <span className="icon-box"><UsersRound size={22} /></span>
            <h2>Vision</h2>
            <p>Become a trusted SSL operations partner for website owners and agencies that want reliable HTTPS without unnecessary complexity.</p>
          </article>
        </div>
      </section>

      <section className="corporate-section">
        <div className="container">
          <div className="section-head centered">
            <p className="eyebrow dark">Our values</p>
            <h2>Built around clarity, speed, and support.</h2>
          </div>
          <div className="value-grid">
            {values.map(([Icon, title, body]) => (
              <article className="value-card" key={title as string}>
                <div className="icon-box"><Icon size={22} /></div>
                <h3>{title as string}</h3>
                <p>{body as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="corporate-section final-band">
        <div className="container final-band-inner">
          <div>
            <p className="eyebrow"><BadgeCheck size={16} /> Customer-first SSL operations</p>
            <h2>Ready to protect your next website?</h2>
            <p>Compare plans, choose the right certificate type, and start a guided SSL order.</p>
          </div>
          <a className="button primary accent" href={routes.orderSslCertificate}>Order SSL Certificate</a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
