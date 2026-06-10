import { FileText, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { routes, seoMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = seoMetadata({
  title: "Privacy Policy | ShieldxSSL",
  description: "Read how ShieldxSSL collects and uses information needed to process SSL certificate orders and support requests.",
  path: routes.privacyPolicy
});

const sections = [
  {
    id: "information",
    title: "Information We Collect",
    body: "We collect account details, contact information, domain names, CSR data, validation preferences, support messages, and order history needed to provide SSL services.",
    items: ["Account name, email, company, and contact details", "Domain names and certificate order information", "CSR details and validation preferences", "Support ticket messages and service history"]
  },
  {
    id: "use",
    title: "How We Use Information",
    body: "Information is used to process SSL orders, provide support, manage validation, send service notifications, and maintain account security.",
    items: ["Create and manage SSL certificate orders", "Coordinate validation, issuance, reissue, and renewal steps", "Provide customer support and order updates", "Maintain account safety and service records"]
  },
  {
    id: "payments",
    title: "Payments",
    body: "Payments are handled manually outside the website through PayPal. No online card payment gateway is integrated into this platform.",
    items: ["Payment instructions are shared during order processing", "No card payment gateway is stored or processed by this website", "Order records may include payment status and administrative notes"]
  },
  {
    id: "contact",
    title: "Contact",
    body: "Contact support if you need account, order, or privacy assistance.",
    items: ["Email support for account and privacy questions", "Open a customer portal ticket for order-specific requests", "Request correction of outdated account or contact details"]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <main className="corporate-page">
      <section className="corporate-hero legal-hero">
        <div className="container corporate-hero-grid">
          <div>
            <p className="eyebrow"><FileText size={16} /> Privacy Policy</p>
            <h1>We collect only what is needed to process and support SSL orders.</h1>
            <p>This sample privacy policy should be reviewed and customized before production use.</p>
          </div>
          <aside className="hero-support-card">
            <ShieldCheck size={30} />
            <strong>Service-focused data</strong>
            <span>Account, domain, validation, order, and support details.</span>
          </aside>
        </div>
      </section>

      <section className="corporate-section">
        <div className="container legal-layout">
          <aside className="policy-toc" aria-label="Privacy policy sections">
            <strong>Policy sections</strong>
            {sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.title}</a>
            ))}
          </aside>

          <article className="legal-document">
            <div className="legal-intro">
              <LockKeyhole size={24} />
              <div>
                <h2>Privacy at a glance</h2>
                <p>ShieldxSSL uses customer and domain information to operate SSL certificate services, support requests, validation workflows, and account management.</p>
              </div>
            </div>

            {sections.map((section) => (
              <section className="policy-section" id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                <ul>
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            ))}

            <section className="policy-contact-box">
              <Mail size={22} />
              <div>
                <h2>Privacy assistance</h2>
                <p>Contact support if you need account, order, or privacy assistance.</p>
                <a className="button secondary" href={routes.contactUs}>Contact Us</a>
              </div>
            </section>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
