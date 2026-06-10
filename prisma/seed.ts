import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const sslCategory = await prisma.category.upsert({
    where: { slug: "rapidssl" },
    update: {},
    create: { name: "RapidSSL Certificates", slug: "rapidssl" }
  });

  const products = [
    {
      name: "Single Domain SSL",
      slug: "single-domain-ssl",
      validationType: "Domain Validation (DV)",
      domainsCovered: "Single domain with www and non-www",
      issuanceTime: "15 Minutes",
      price: 30,
      additionalSanPrice: 0,
      features: [
        "Protects one domain",
        "Supports both www and non-www versions",
        "Domain Validation (DV)",
        "Fast issuance",
        "99.9%+ browser compatibility",
        "Trust seal",
        "Unlimited reissues"
      ],
      details: {
        overview: "Cost-effective RapidSSL protection for one website.",
        specs: [
          ["Domains Secured", "Single Domain"],
          ["Validation Type", "Domain Validation (DV)"],
          ["Issuance Time", "15 Minutes"],
          ["WWW & Non-WWW Support", "Included"],
          ["Browser Compatibility", "99.9%+ Compatible"],
          ["Unlimited Reissuance", "Yes"],
          ["Trust Seal", "Included"]
        ],
        idealFor: ["Business websites", "Blogs", "Landing pages", "Corporate portals", "Small ecommerce stores", "Customer login areas"]
      }
    },
    {
      name: "Multi-Domain SSL",
      slug: "multi-domain-ssl",
      validationType: "Domain Validation (DV)",
      domainsCovered: "Up to 201 hostnames, first 3 included",
      issuanceTime: "15 Minutes",
      price: 50,
      additionalSanPrice: 15,
      features: [
        "Supports multiple hostnames",
        "First 3 hostnames included",
        "Additional SAN support",
        "Domain Validation",
        "Centralized certificate management",
        "Unlimited reissues"
      ],
      details: {
        overview: "Secure multiple websites and hostnames with one certificate.",
        specs: [
          ["Domains Secured", "Up to 201 Domains (Includes 3 Domains by Default)"],
          ["Validation Level", "Domain Validation (DV)"],
          ["Issuance Time", "15 Minutes"],
          ["SAN Support", "Yes"],
          ["WWW & Non-WWW Support", "Supported When Added"],
          ["Browser Compatibility", "99.9%"],
          ["Unlimited Reissuance", "Yes"]
        ],
        note: "Root domains are not automatically included for each www hostname and must be added separately."
      }
    },
    {
      name: "Wildcard SSL",
      slug: "wildcard-ssl",
      validationType: "Domain Validation (DV)",
      domainsCovered: "Primary domain and unlimited first-level subdomains",
      issuanceTime: "15 Minutes",
      price: 125,
      additionalSanPrice: 0,
      features: [
        "Protects primary domain",
        "Protects unlimited first-level subdomains",
        "Supports www and non-www",
        "Easy certificate management",
        "Unlimited server licensing",
        "Unlimited reissues"
      ],
      details: {
        overview: "Protect your primary domain and all first-level subdomains.",
        specs: [
          ["Domains Secured", "Single Domain & Unlimited First-Level Subdomains"],
          ["Validation Level", "Domain Validation (DV)"],
          ["Issuance Time", "15 Minutes"],
          ["Wildcard Support", "Yes"],
          ["SAN Support", "No"],
          ["WWW & Non-WWW Support", "Yes"],
          ["Browser Compatibility", "99.9%"]
        ],
        idealFor: ["SaaS platforms", "E-commerce businesses", "Hosting providers", "Agencies", "Expanding web infrastructure"]
      }
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...product, features: JSON.stringify(product.features), details: JSON.stringify(product.details), categoryId: sslCategory.id },
      create: { ...product, features: JSON.stringify(product.features), details: JSON.stringify(product.details), categoryId: sslCategory.id }
    });
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@trustshieldssl.example" },
    update: {},
    create: {
      name: "ShieldxSSL Admin",
      email: "admin@trustshieldssl.example",
      passwordHash: await bcrypt.hash("Admin123!ChangeMe", 12),
      role: "ADMIN",
      company: "ShieldxSSL"
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@example.com",
      passwordHash: await bcrypt.hash("Customer123!ChangeMe", 12),
      company: "Example Co",
      country: "United States"
    }
  });

  const single = await prisma.product.findUniqueOrThrow({ where: { slug: "single-domain-ssl" } });
  await prisma.order.upsert({
    where: { orderNumber: "TS-10001" },
    update: {},
    create: {
      orderNumber: "TS-10001",
      userId: customer.id,
      productId: single.id,
      status: "PENDING_PAYMENT",
      validationMethod: "DNS",
      primaryDomain: "example.com",
      domains: JSON.stringify(["example.com", "www.example.com"]),
      organizationName: "Example Co",
      address: "100 Market Street",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      zip: "94105",
      totalAmount: 30
    }
  });

  const ticket = await prisma.ticket.upsert({
    where: { id: "seed-ticket" },
    update: {},
    create: {
      id: "seed-ticket",
      userId: customer.id,
      subject: "Need help with DNS validation",
      status: "WAITING_ADMIN"
    }
  });

  await prisma.ticketReply.create({
    data: {
      ticketId: ticket.id,
      userId: customer.id,
      message: "Can you confirm the DNS TXT record format for my RapidSSL validation?"
    }
  });

  const templates = [
    ["account_registration", "Account registration", "Welcome to ShieldxSSL", "Hi {{name}}, your ShieldxSSL account is ready."],
    ["order_created", "Order created", "SSL order {{orderNumber}} created", "Your order was created with Pending Payment status. Please send PayPal payment to {{paypalEmail}}."],
    ["payment_reminder", "Payment reminder", "Payment reminder for {{orderNumber}}", "Your SSL order is awaiting manual PayPal payment."],
    ["payment_received", "Payment received", "Payment received for {{orderNumber}}", "We received your payment and will continue SSL processing."],
    ["validation_required", "Validation required", "Domain validation required", "Please complete {{validationMethod}} validation for {{primaryDomain}}."],
    ["ssl_issued", "SSL issued", "Your SSL certificate is issued", "Your certificate for {{primaryDomain}} is available in your portal."],
    ["ssl_expiring", "SSL expiring", "SSL certificate expiring soon", "Your certificate expires on {{expiresAt}}."],
    ["ssl_renewed", "SSL renewed", "SSL certificate renewed", "Your renewed SSL certificate is ready."],
    ["ticket_update", "Support ticket update", "Ticket update: {{subject}}", "A new reply has been added to your support ticket."]
  ];

  for (const [key, name, subject, body] of templates) {
    await prisma.emailTemplate.upsert({
      where: { key },
      update: { name, subject, body },
      create: { key, name, subject, body }
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: "seeded demo platform",
      entity: "system",
      metadata: JSON.stringify({ products: products.length })
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
