import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteTicketAttachmentFiles } from "@/lib/ticketAttachments";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const form = await request.formData();
  const action = String(form.get("action") || "status");
  const customer = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      tickets: { include: { replies: true } },
      replies: true,
      orders: true
    }
  });

  if (!customer || customer.role !== "CUSTOMER") {
    return NextResponse.redirect(new URL("/admin/customers", request.url));
  }

  if (action === "delete") {
    const ticketIds = customer.tickets.map((ticket) => ticket.id);
    const orderIds = customer.orders.map((order) => order.id);

    await deleteTicketAttachmentFiles([
      ...customer.tickets.map((ticket) => ticket.attachments),
      ...customer.tickets.flatMap((ticket) => ticket.replies.map((reply) => reply.attachments)),
      ...customer.replies.map((reply) => reply.attachments)
    ]);

    await prisma.$transaction([
      prisma.passwordResetRequest.updateMany({ where: { OR: [{ userId: customer.id }, { ticketId: { in: ticketIds } }] }, data: { userId: null, ticketId: null } }),
      prisma.activityLog.updateMany({ where: { userId: customer.id }, data: { userId: null } }),
      prisma.ticketReply.deleteMany({ where: { OR: [{ userId: customer.id }, { ticketId: { in: ticketIds } }] } }),
      prisma.ticket.deleteMany({ where: { id: { in: ticketIds } } }),
      prisma.certificate.deleteMany({ where: { orderId: { in: orderIds } } }),
      prisma.order.deleteMany({ where: { id: { in: orderIds } } }),
      prisma.user.delete({ where: { id: customer.id } }),
      prisma.activityLog.create({ data: { userId: admin.id, action: "deleted customer account", entity: "user", entityId: customer.id } })
    ]);

    return NextResponse.redirect(new URL("/admin/customers", request.url));
  }

  if (action === "account") {
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const data: { email?: string; passwordHash?: string } = {};

    if (email) data.email = email;
    if (password.length >= 10) data.passwordHash = await hashPassword(password);

    if (Object.keys(data).length > 0) {
      await prisma.user.update({ where: { id: customer.id }, data });
      await prisma.activityLog.create({ data: { userId: admin.id, action: "updated customer login details", entity: "user", entityId: customer.id } });
    }

    return NextResponse.redirect(new URL(`/admin/customers/${customer.id}`, request.url));
  }

  const status = String(form.get("status")) === "SUSPENDED" ? "SUSPENDED" : "ACTIVE";
  await prisma.user.update({ where: { id: customer.id }, data: { status } });
  await prisma.activityLog.create({ data: { userId: admin.id, action: `customer ${status.toLowerCase()}`, entity: "user", entityId: customer.id } });
  return NextResponse.redirect(new URL("/admin/customers", request.url));
}
