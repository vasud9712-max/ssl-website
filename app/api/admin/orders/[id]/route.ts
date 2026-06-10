import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encodeList, linesToArray } from "@/lib/orders";
import { adminOrderUpdateSchema } from "@/lib/validators";
import { sendTemplateEmail } from "@/lib/mail";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const data = Object.fromEntries((await request.formData()).entries());
  const parsed = adminOrderUpdateSchema.safeParse(data);
  if (!parsed.success) return NextResponse.redirect(new URL(`/admin/orders/${params.id}`, request.url));

  const existing = await prisma.order.findUniqueOrThrow({ where: { id: params.id }, include: { user: true } });
  const paidAt = parsed.data.status === "PAYMENT_RECEIVED" && !existing.paidAt ? new Date() : existing.paidAt;
  const issuedAt = ["ISSUED", "REISSUED"].includes(parsed.data.status) && !existing.issuedAt ? new Date() : existing.issuedAt;
  const expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : existing.expiresAt;

  await prisma.order.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      primaryDomain: parsed.data.primaryDomain,
      domains: encodeList(linesToArray(parsed.data.domains)),
      sanEntries: encodeList(linesToArray(parsed.data.sanEntries || "")),
      csr: parsed.data.csr,
      validationMethod: parsed.data.validationMethod,
      organizationName: parsed.data.organizationName,
      totalAmount: parsed.data.totalAmount,
      certificatePem: parsed.data.certificatePem,
      caBundle: parsed.data.caBundle,
      adminNotes: parsed.data.adminNotes,
      verificationNotes: parsed.data.verificationNotes,
      paidAt,
      issuedAt,
      expiresAt
    }
  });

  if (parsed.data.certificatePem && issuedAt && expiresAt) {
    await prisma.certificate.upsert({
      where: { orderId: params.id },
      update: { commonName: parsed.data.primaryDomain, pem: parsed.data.certificatePem, caBundle: parsed.data.caBundle, issuedAt, expiresAt },
      create: { orderId: params.id, commonName: parsed.data.primaryDomain, pem: parsed.data.certificatePem, caBundle: parsed.data.caBundle, issuedAt, expiresAt }
    });
  }

  await prisma.activityLog.create({ data: { userId: admin.id, action: `updated order to ${parsed.data.status}`, entity: "order", entityId: params.id } });

  if (parsed.data.status === "PAYMENT_RECEIVED") await sendTemplateEmail("payment_received", existing.user.email, { orderNumber: existing.orderNumber });
  if (parsed.data.status === "AWAITING_VALIDATION") await sendTemplateEmail("validation_required", existing.user.email, { primaryDomain: existing.primaryDomain, validationMethod: existing.validationMethod });
  if (parsed.data.status === "ISSUED") await sendTemplateEmail("ssl_issued", existing.user.email, { primaryDomain: existing.primaryDomain });

  return NextResponse.redirect(new URL(`/admin/orders/${params.id}`, request.url));
}
