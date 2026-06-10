import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const order = await prisma.order.findFirst({ where: { id: params.id, userId: user.id } });
  if (!order?.certificatePem) return new NextResponse("Certificate not available", { status: 404 });
  return new NextResponse(order.certificatePem, {
    headers: {
      "Content-Type": "application/x-pem-file",
      "Content-Disposition": `attachment; filename="${order.primaryDomain}.crt"`
    }
  });
}
