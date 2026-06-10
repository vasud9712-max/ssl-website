import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const form = await request.formData();
  const action = String(form.get("action") || "");
  const resetRequest = await prisma.passwordResetRequest.findUnique({ where: { id: params.id }, include: { user: true } });

  if (!resetRequest) {
    return NextResponse.redirect(new URL("/admin/password-resets", request.url));
  }

  const user = resetRequest.user || await prisma.user.findUnique({ where: { email: resetRequest.email } });

  if (action === "update-account" && user) {
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const data: { email?: string; passwordHash?: string } = {};

    if (email && email !== user.email) data.email = email;
    if (password.length >= 10) data.passwordHash = await hashPassword(password);

    if (Object.keys(data).length > 0) {
      await prisma.user.update({ where: { id: user.id }, data });
      await prisma.passwordResetRequest.update({
        where: { id: resetRequest.id },
        data: {
          userId: user.id,
          email: data.email || resetRequest.email,
          status: "RESOLVED",
          resolvedAt: new Date()
        }
      });
      await prisma.activityLog.create({
        data: { userId: admin.id, action: "updated password reset account details", entity: "passwordResetRequest", entityId: resetRequest.id }
      });
    }
  }

  if (action === "resolve") {
    await prisma.passwordResetRequest.update({
      where: { id: resetRequest.id },
      data: { status: "RESOLVED", resolvedAt: resetRequest.resolvedAt || new Date() }
    });
    if (resetRequest.ticketId) {
      await prisma.ticket.update({ where: { id: resetRequest.ticketId }, data: { status: "CLOSED" } }).catch(() => null);
    }
    await prisma.activityLog.create({
      data: { userId: admin.id, action: "resolved password reset request", entity: "passwordResetRequest", entityId: resetRequest.id }
    });
  }

  return NextResponse.redirect(new URL("/admin/password-resets", request.url));
}
