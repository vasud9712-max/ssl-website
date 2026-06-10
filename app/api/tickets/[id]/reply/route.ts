import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ticketReplySchema } from "@/lib/validators";
import { encodeTicketAttachments, saveTicketAttachments } from "@/lib/ticketAttachments";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireUser();
  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!ticket || (user.role !== "ADMIN" && ticket.userId !== user.id)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const form = await request.formData();
  const data = Object.fromEntries(form.entries());
  const parsed = ticketReplySchema.safeParse(data);
  if (parsed.success) {
    let attachments = [];
    try {
      attachments = await saveTicketAttachments(form);
    } catch (error) {
      return new NextResponse(error instanceof Error ? error.message : "Attachment upload failed.", { status: 400 });
    }
    await prisma.ticketReply.create({
      data: {
        ticketId: params.id,
        userId: user.id,
        message: parsed.data.message,
        attachments: encodeTicketAttachments(attachments)
      }
    });
    await prisma.ticket.update({ where: { id: params.id }, data: { status: user.role === "ADMIN" ? "WAITING_CUSTOMER" : "WAITING_ADMIN" } });
  }
  return NextResponse.redirect(new URL(user.role === "ADMIN" ? `/admin/tickets/${params.id}` : `/portal/tickets/${params.id}`, request.url));
}
