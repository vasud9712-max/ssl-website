"use client";

import { Menu, ShieldCheck, X } from "lucide-react";
import { routes } from "@/lib/seo";

type SiteHeaderProps = {
  session?: {
    role: string;
  } | null;
};

export function SiteHeader({ session }: SiteHeaderProps) {
  const dashboardHref = session?.role === "ADMIN" ? routes.admin : routes.portal;
  const dashboardLabel = session?.role === "ADMIN" ? "Admin" : "Dashboard";

  return (
    <header className="topbar">
      <div className="container nav">
        <a className="brand" href={routes.home} aria-label="ShieldxSSL home">
          <span className="brand-mark">
            <ShieldCheck size={22} />
          </span>
          <span>ShieldxSSL</span>
        </a>

        <input className="nav-toggle-input" id="site-menu-toggle" type="checkbox" aria-label="Toggle navigation menu" />
        <label className="nav-menu-button" htmlFor="site-menu-toggle" aria-hidden="true">
          <Menu className="nav-menu-open" size={22} />
          <X className="nav-menu-close" size={22} />
        </label>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href={routes.home}>Home</a>
          <a href={routes.sslCertificates}>SSL Certificates</a>
          <a href={routes.compareSslCertificates}>Pricing</a>
          <a href={routes.portalTickets}>Support</a>
          <a href={routes.contactUs}>Contact</a>
          {session ? (
            <>
              <a href={dashboardHref}>{dashboardLabel}</a>
              <a href="/logout">Logout</a>
            </>
          ) : (
            <a href={routes.login}>Login</a>
          )}
          <a className="button primary accent nav-cta" href={routes.orderSslCertificate}>Order Now</a>
        </nav>
      </div>
    </header>
  );
}
