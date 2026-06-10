import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { routes, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ShieldxSSL | SSL Certificates Made Simple",
  description: "Modern SSL certificate reseller platform with manual PayPal ordering, customer portal, and admin management.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "ShieldxSSL | SSL Certificates Made Simple",
    description: "Buy and manage affordable RapidSSL certificates with guided ordering, customer support, and clear status tracking.",
    url: "/",
    siteName: "ShieldxSSL",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ShieldxSSL | SSL Certificates Made Simple",
    description: "Buy and manage affordable RapidSSL certificates with guided ordering, customer support, and clear status tracking."
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="container nav">
            <a className="brand" href={routes.home}>
              <span className="brand-mark">
                <ShieldCheck size={22} />
              </span>
              ShieldxSSL
            </a>
            <nav className="nav-links">
              <a href={routes.home}>Home</a>
              <a href={routes.sslCertificates}>SSL Plans</a>
              <a href={routes.orderSslCertificate}>Order Certificate</a>
              <a href={routes.portalOrders}>Check Status</a>
              {session ? (
                <>
                  <a href={session.role === "ADMIN" ? routes.admin : routes.portal}>{session.role === "ADMIN" ? "Admin" : "Dashboard"}</a>
                  <a href="/logout">Logout</a>
                </>
              ) : (
                <a href={routes.login}>Login</a>
              )}
              <a className="button primary accent" href={routes.orderSslCertificate}>Get Protected</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
