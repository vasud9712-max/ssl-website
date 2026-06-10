import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const name = String(form.get("name") || "").trim() || "Password reset requester";
  const requestedAt = new Date();

  const existingUser = email ? await prisma.user.findUnique({ where: { email } }) : null;
  const fallbackAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
  const ticketOwner = existingUser || fallbackAdmin;

  const ticket = ticketOwner
    ? await prisma.ticket.create({
        data: {
          userId: ticketOwner.id,
          subject: `Password reset request - ${email || "unknown email"}`,
          status: "WAITING_ADMIN",
          priority: "HIGH"
        }
      })
    : null;

  if (ticket && ticketOwner) {
    await prisma.ticketReply.create({
      data: {
        ticketId: ticket.id,
        userId: ticketOwner.id,
        message: [
          "Password reset request created automatically.",
          `Name: ${name}`,
          `Email: ${email || "Not supplied"}`,
          `Request timestamp: ${requestedAt.toISOString()}`,
          "Status: Pending"
        ].join("\n")
      }
    });
  }

  await prisma.passwordResetRequest.create({
    data: {
      userId: existingUser?.id,
      ticketId: ticket?.id,
      name,
      email: email || "not-supplied",
      status: "PENDING",
      createdAt: requestedAt
    }
  });

  await prisma.activityLog.create({
    data: {
      userId: existingUser?.id || fallbackAdmin?.id,
      action: "new password reset request",
      entity: "passwordResetRequest",
      metadata: JSON.stringify({ name, email, requestedAt: requestedAt.toISOString(), status: "PENDING", ticketId: ticket?.id })
    }
  });

  return NextResponse.redirect(new URL("/login?error=Reset request recorded. Admin support will review it shortly.", request.url));
}
