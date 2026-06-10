import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const form = await request.formData();
  const csr = String(form.get("csr") || "");
  await prisma.order.updateMany({
    where: { id: params.id, userId: user.id },
    data: { csr, status: "REISSUED" }
  });
  await prisma.activityLog.create({ data: { userId: user.id, action: "requested reissue", entity: "order", entityId: params.id } });
  return NextResponse.redirect(new URL(`/portal/orders/${params.id}`, request.url));
}
