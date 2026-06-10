import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.redirect(new URL("/admin/orders", request.url));

  await prisma.certificate.deleteMany({ where: { orderId: params.id } });
  await prisma.order.delete({ where: { id: params.id } });
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: `deleted order ${order.orderNumber}`,
      entity: "order",
      entityId: params.id
    }
  });

  return NextResponse.redirect(new URL("/admin/orders", request.url));
}
