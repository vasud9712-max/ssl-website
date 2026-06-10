/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false
  },
  async redirects() {
    return [
      {
        source: "/products/:slug",
        destination: "/ssl-certificates/:slug",
        permanent: true
      },
      {
        source: "/compare",
        destination: "/compare-ssl-certificates",
        permanent: true
      },
      {
        source: "/about",
        destination: "/about-us",
        permanent: true
      },
      {
        source: "/contact",
        destination: "/contact-us",
        permanent: true
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true
      },
      {
        source: "/portal/order/new",
        destination: "/order-ssl-certificate",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
