import { Award, Clock3, Mail, ShieldCheck } from "lucide-react";
import { routes } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-topline">
        <div><ShieldCheck size={18} /> Trusted RapidSSL reseller experience</div>
        <div><Clock3 size={18} /> Fast DV validation workflows</div>
        <div><Award size={18} /> Customer portal and reissue support</div>
      </div>
      <div className="container footer-grid">
        <div className="footer-brand-panel">
          <a className="brand" href={routes.home}><span className="brand-mark"><ShieldCheck size={22} /></span>ShieldxSSL</a>
          <p>Protecting websites with affordable RapidSSL certificates, guided ordering, customer support, and clear certificate status tracking.</p>
          <a className="footer-contact" href={routes.contactUs}><Mail size={16} /> support@shieldxssl.example</a>
        </div>
        <nav aria-label="Footer products">
          <strong>Products</strong>
          <a href={routes.sslCertificates}>SSL Plans & Pricing</a>
          <a href={routes.compareSslCertificates}>Compare Certificates</a>
          <a href={routes.orderSslCertificate}>Order Certificate</a>
          <a href={routes.portalOrders}>Check Status</a>
        </nav>
        <nav aria-label="Footer support">
          <strong>Support</strong>
          <a href={routes.portalTickets}>Support Center</a>
          <a href={routes.contactUs}>Contact Us</a>
          <a href={routes.login}>Customer Login</a>
        </nav>
        <nav aria-label="Footer company">
          <strong>Company</strong>
          <a href={routes.aboutUs}>About Us</a>
          <a href={routes.privacyPolicy}>Privacy Policy</a>
          <a href={routes.home}>Home</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>(c) 2024 ShieldxSSL. All rights reserved.</span>
        <span>SSL certificate ordering, validation, reissue, and renewal support.</span>
      </div>
    </footer>
  );
}
