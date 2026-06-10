import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const form = await request.formData();
  const csr = String(form.get("csr") || "").trim();
  if (!csr || !csr.includes("BEGIN CERTIFICATE REQUEST")) {
    return NextResponse.redirect(new URL(`/portal/orders/${params.id}?error=Enter a valid CSR block.`, request.url));
  }

  const order = await prisma.order.findFirst({ where: { id: params.id, userId: user.id } });
  if (!order) return new NextResponse("Not found", { status: 404 });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      csr,
      status: order.status === "AWAITING_CSR" ? "AWAITING_VALIDATION" : order.status
    }
  });
  await prisma.activityLog.create({ data: { userId: user.id, action: "submitted CSR", entity: "order", entityId: order.id } });
  return NextResponse.redirect(new URL(`/portal/orders/${params.id}`, request.url));
}
