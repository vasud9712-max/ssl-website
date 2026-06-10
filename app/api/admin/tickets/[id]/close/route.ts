import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  await prisma.ticket.update({ where: { id: params.id }, data: { status: "CLOSED" } });
  await prisma.activityLog.create({ data: { userId: admin.id, action: "closed ticket", entity: "ticket", entityId: params.id } });
  return NextResponse.redirect(new URL(`/admin/tickets/${params.id}`, request.url));
}
