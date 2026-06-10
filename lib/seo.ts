import type { Metadata } from "next";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shieldxssl.com";

export const routes = {
  home: "/",
  sslCertificates: "/ssl-certificates",
  compareSslCertificates: "/compare-ssl-certificates",
  orderSslCertificate: "/order-ssl-certificate",
  aboutUs: "/about-us",
  contactUs: "/contact-us",
  privacyPolicy: "/privacy-policy",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  portal: "/portal",
  portalProducts: "/portal/products",
  portalOrders: "/portal/orders",
  portalTickets: "/portal/tickets",
  admin: "/admin"
} as const;

export function canonicalUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function productUrl(slug: string) {
  return `${routes.sslCertificates}/${slug}`;
}

export function orderUrl(slug?: string) {
  return slug ? `${routes.orderSslCertificate}?product=${slug}` : routes.orderSslCertificate;
}

export function seoMetadata({
  title,
  description,
  path,
  type = "website"
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = canonicalUrl(path);
  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "ShieldxSSL",
      type
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
