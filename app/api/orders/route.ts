import { NextRequest, NextResponse } from "next/server";
import { createSession, getSession, hashPassword, sessionRole, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateOrderTotal, encodeList, linesToArray, nextOrderNumber } from "@/lib/orders";
import { orderUrl } from "@/lib/seo";
import { orderSchema } from "@/lib/validators";
import { sendTemplateEmail } from "@/lib/mail";

const domainPattern = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const session = await getSession();
  const form = await request.formData();
  const data = Object.fromEntries(form.entries());
  const parsed = orderSchema.safeParse(data);
  const orderToken = String(form.get("orderToken") || "");
  const contactEmail = String(form.get("contactEmail") || "");
  const accountMode = String(form.get("accountMode") || "session");
  const accountName = String(form.get("accountName") || "");
  const accountEmail = String(form.get("accountEmail") || contactEmail);
  const accountPassword = String(form.get("accountPassword") || "");
  const redirectWithError = (message: string) => NextResponse.redirect(new URL(`${orderUrl()}?error=${encodeURIComponent(message)}`, request.url));

  if (!parsed.success) {
    await prisma.activityLog.create({
      data: { action: "order validation failed", entity: "order", metadata: JSON.stringify(parsed.error.flatten()) }
    });
    return redirectWithError("Please check your order details.");
  }

  const product = await prisma.product.findUniqueOrThrow({ where: { id: parsed.data.productId } });
  const domains = linesToArray(parsed.data.domains);
  const sanEntries = linesToArray(parsed.data.sanEntries || "");
  if (!domainPattern.test(parsed.data.primaryDomain.trim())) return redirectWithError("Enter a valid primary domain such as example.com.");
  if (!contactEmail || !emailPattern.test(contactEmail)) return redirectWithError("Enter a valid certificate contact email.");
  if (!domains.length || domains.some((domain) => !domainPattern.test(domain))) return redirectWithError("Enter valid domain names only.");
  if (product.slug.includes("multi") && (!sanEntries.length || sanEntries.some((domain) => !domainPattern.test(domain)))) {
    return redirectWithError("Enter at least one valid SAN hostname for Multi-Domain SSL.");
  }
  if (product.slug.includes("multi") && sanEntries.length > 2) {
    return redirectWithError("Enter up to 2 SAN domains during checkout. Support can help add more later.");
  }
  if (!orderToken || orderToken.length < 12) return redirectWithError("Order session expired. Please review and submit again.");

  let user = session ? await prisma.user.findUnique({ where: { id: session.id } }) : null;
  if (!user) {
    if (!accountEmail || !emailPattern.test(accountEmail)) return redirectWithError("Enter a valid account email before submitting.");
    if (accountMode === "login") {
      const existing = await prisma.user.findUnique({ where: { email: accountEmail } });
      if (!existing || !(await verifyPassword(accountPassword, existing.passwordHash)) || existing.status !== "ACTIVE") {
        return redirectWithError("Login failed. Check your email and password, then submit again.");
      }
      user = existing;
    } else {
      if (!accountName.trim()) return redirectWithError("Enter your name to create an account.");
      if (accountPassword.length < 10) return redirectWithError("Use a password with at least 10 characters.");
      const existing = await prisma.user.findUnique({ where: { email: accountEmail } });
      if (existing) return redirectWithError("An account already exists with that email. Choose Log In at the review step.");
      user = await prisma.user.create({
        data: {
          name: accountName.trim(),
          email: accountEmail.trim(),
          passwordHash: await hashPassword(accountPassword),
          role: "CUSTOMER"
        }
      });
      await sendTemplateEmail("account_registration", user.email, { name: user.name });
    }
    await createSession({ id: user.id, name: user.name, email: user.email, role: sessionRole(user.role) });
  }

  const tokenNote = `orderToken:${orderToken}`;
  const existingOrder = await prisma.order.findFirst({
    where: { userId: user.id, privateNotes: tokenNote },
    orderBy: { createdAt: "desc" }
  });
  if (existingOrder) {
    return NextResponse.redirect(new URL(`/portal/orders/${existingOrder.id}`, request.url));
  }

  const order = await prisma.order.create({
    data: {
      orderNumber: await nextOrderNumber(),
      userId: user.id,
      productId: product.id,
      status: "PENDING_PAYMENT",
      validationMethod: parsed.data.validationMethod,
      primaryDomain: parsed.data.primaryDomain,
      domains: encodeList(domains),
      sanEntries: encodeList(sanEntries),
      csr: parsed.data.csr,
      organizationName: parsed.data.organizationName || user.name,
      address: parsed.data.address || "Not supplied",
      city: parsed.data.city || "Not supplied",
      state: parsed.data.state || "Not supplied",
      country: parsed.data.country || "Not supplied",
      zip: parsed.data.zip || "Not supplied",
      privateNotes: tokenNote,
      totalAmount: calculateOrderTotal(product.price, product.additionalSanPrice, sanEntries)
    }
  });

  await prisma.activityLog.create({ data: { userId: user.id, action: "created SSL order", entity: "order", entityId: order.id } });
  await sendTemplateEmail("order_created", user.email, {
    orderNumber: order.orderNumber,
    paypalEmail: process.env.PAYPAL_PAYMENT_EMAIL || "billing@trustshieldssl.example"
  });
  return NextResponse.redirect(new URL(`/portal/orders/${order.id}`, request.url));
}
