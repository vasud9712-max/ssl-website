import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

type ContactMessageRow = {
  id: string;
};

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const form = await request.formData();
  const action = String(form.get("action") || "read");

  const messages = await prisma.$queryRaw<ContactMessageRow[]>`
    SELECT "id" FROM "ContactMessage" WHERE "id" = ${params.id} LIMIT 1
  `;
  const message = messages[0];
  if (!message) return NextResponse.redirect(new URL("/admin/contact-messages", request.url));

  if (action === "delete") {
    await prisma.$transaction([
      prisma.$executeRaw`DELETE FROM "ContactMessage" WHERE "id" = ${message.id}`,
      prisma.activityLog.create({ data: { userId: admin.id, action: "deleted contact message", entity: "contactMessage", entityId: message.id } })
    ]);
    return NextResponse.redirect(new URL("/admin/contact-messages", request.url));
  }

  const status = action === "new" ? "NEW" : "READ";
  await prisma.$transaction([
    prisma.$executeRaw`UPDATE "ContactMessage" SET "status" = ${status}, "updatedAt" = ${new Date()} WHERE "id" = ${message.id}`,
    prisma.activityLog.create({ data: { userId: admin.id, action: `marked contact message ${status.toLowerCase()}`, entity: "contactMessage", entityId: message.id } })
  ]);

  return NextResponse.redirect(new URL("/admin/contact-messages", request.url));
}
