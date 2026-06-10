import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const form = await request.formData();
  await prisma.emailTemplate.update({
    where: { id: params.id },
    data: { subject: String(form.get("subject") || ""), body: String(form.get("body") || "") }
  });
  await prisma.activityLog.create({ data: { userId: admin.id, action: "updated email template", entity: "emailTemplate", entityId: params.id } });
  return NextResponse.redirect(new URL("/admin/email-templates", request.url));
}
