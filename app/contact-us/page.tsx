import { Clock3, Headphones, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = seoMetadata({
  title: "Contact Us | SSL Certificate Support",
  description: "Contact ShieldxSSL for help choosing, ordering, validating, installing, or renewing SSL certificates.",
  path: routes.contactUs
});

const contactMethods = [
  [Mail, "Email support", "support@shieldxssl.example", "For ordering, validation, and renewal questions."],
  [Phone, "Phone assistance", "+1 (555) 018-2048", "Available for urgent certificate and account support."],
  [MessageCircle, "Customer portal", "Open a support ticket", "Track replies, order status, CSR details, and reissues."]
];

export default function ContactUsPage({ searchParams }: { searchParams?: { success?: string; error?: string } }) {
  const sent = searchParams?.success === "1";

  return (
    <main className="corporate-page">
      <section className="corporate-hero">
        <div className="container corporate-hero-grid">
          <div>
            <p className="eyebrow"><Headphones size={16} /> Contact ShieldxSSL</p>
            <h1>SSL support from people who understand validation, reissues, and renewals.</h1>
            <p>Reach out for ordering, CSR, DNS validation, file validation, certificate installation, or renewal support.</p>
          </div>
          <aside className="hero-support-card" aria-label="Support availability">
            <ShieldCheck size={30} />
            <strong>Priority SSL help</strong>
            <span>Typical first response within one business day.</span>
          </aside>
        </div>
      </section>

      <section className="corporate-section">
        <div className="container contact-layout">
          <div className="contact-main">
            <div className="section-head">
              <p className="eyebrow dark">Send a message</p>
              <h2>Tell us what you need help with.</h2>
              <p>Use the form for pre-sales questions or general support. Customers can also open a ticket from the portal for order-specific help.</p>
            </div>
            {sent && <div className="success-state">Message sent successfully. Our support team will review it shortly.</div>}
            {searchParams?.error && <div className="error-state">{searchParams.error}</div>}
            <form className="contact-form" aria-label="Contact form" action="/api/contact" method="post">
              <div className="grid two">
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input className="input" id="contact-name" name="name" autoComplete="name" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input className="input" id="contact-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
                  <span className="field-hint">Use the email tied to your order when possible.</span>
                </div>
              </div>
              <div className="grid two">
                <div className="field">
                  <label htmlFor="contact-phone">Phone</label>
                  <input className="input" id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="field">
                  <label htmlFor="contact-topic">Topic</label>
                  <select className="select" id="contact-topic" name="topic" required defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    <option>Choose an SSL certificate</option>
                    <option>Domain validation help</option>
                    <option>CSR or installation support</option>
                    <option>Billing or renewal question</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea className="textarea" id="contact-message" name="message" required minLength={20} placeholder="Share the domain, order number if available, and what you need help with." />
                <span className="field-hint">Minimum 20 characters. Never paste private keys into support forms.</span>
              </div>
              <div className="form-actions">
                <button className="button primary accent" type="submit">Send Message</button>
                <a className="button secondary" href={routes.portalTickets}>Open Portal Ticket</a>
              </div>
            </form>
          </div>

          <aside className="contact-sidebar">
            <section className="info-panel">
              <h2>Contact information</h2>
              <div className="contact-method-list">
                {contactMethods.map(([Icon, title, value, body]) => (
                  <article className="contact-method" key={title as string}>
                    <span><Icon size={20} /></span>
                    <div>
                      <h3>{title as string}</h3>
                      {title === "Customer portal" ? <a href={routes.portalTickets}>{value as string}</a> : <strong>{value as string}</strong>}
                      <p>{body as string}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="info-panel">
              <h2>Business address</h2>
              <div className="address-block">
                <MapPin size={22} />
                <p><strong>ShieldxSSL Support Desk</strong><br />100 Secure Commerce Way<br />Suite 204<br />Austin, TX 78701</p>
              </div>
              <div className="address-block">
                <Clock3 size={22} />
                <p><strong>Support hours</strong><br />Monday to Friday<br />9:00 AM - 6:00 PM Central Time</p>
              </div>
            </section>

            <section className="map-panel" aria-label="Map placeholder">
              <MapPin size={28} />
              <strong>Austin, Texas</strong>
              <span>Remote SSL support for customers worldwide.</span>
            </section>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
