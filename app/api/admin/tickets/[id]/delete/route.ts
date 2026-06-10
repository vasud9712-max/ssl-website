import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deleteTicketAttachmentFiles } from "@/lib/ticketAttachments";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { replies: true }
  });

  if (!ticket) return NextResponse.redirect(new URL("/admin/tickets", request.url));

  await deleteTicketAttachmentFiles([
    ticket.attachments,
    ...ticket.replies.map((reply) => reply.attachments)
  ]);

  await prisma.$transaction([
    prisma.passwordResetRequest.updateMany({ where: { ticketId: ticket.id }, data: { ticketId: null } }),
    prisma.ticketReply.deleteMany({ where: { ticketId: ticket.id } }),
    prisma.ticket.delete({ where: { id: ticket.id } }),
    prisma.activityLog.create({ data: { userId: admin.id, action: "deleted ticket", entity: "ticket", entityId: ticket.id } })
  ]);

  return NextResponse.redirect(new URL("/admin/tickets", request.url));
}
