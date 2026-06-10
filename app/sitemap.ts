import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { canonicalUrl, productUrl, routes } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({ where: { enabled: true }, select: { slug: true, updatedAt: true } });
  const now = new Date();
  const staticRoutes = [
    routes.home,
    routes.sslCertificates,
    routes.compareSslCertificates,
    routes.orderSslCertificate,
    routes.aboutUs,
    routes.contactUs,
    routes.privacyPolicy,
    routes.login,
    routes.register
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: canonicalUrl(route),
      lastModified: now
    })),
    ...products.map((product) => ({
      url: canonicalUrl(productUrl(product.slug)),
      lastModified: product.updatedAt
    }))
  ];
}
