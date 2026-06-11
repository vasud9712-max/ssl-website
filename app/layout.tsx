import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { siteUrl } from "@/lib/seo";
import { SiteHeader } from "@/components/SiteHeader";
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
        <SiteHeader session={session ? { role: session.role } : null} />
        {children}
      </body>
    </html>
  );
}
