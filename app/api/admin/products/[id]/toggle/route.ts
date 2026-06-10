import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const product = await prisma.product.findUniqueOrThrow({ where: { id: params.id } });
  await prisma.product.update({ where: { id: params.id }, data: { enabled: !product.enabled } });
  await prisma.activityLog.create({ data: { userId: admin.id, action: product.enabled ? "disabled product" : "enabled product", entity: "product", entityId: params.id } });
  return NextResponse.redirect(new URL("/admin/products", request.url));
}
