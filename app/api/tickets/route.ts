import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ticketSchema } from "@/lib/validators";
import { encodeTicketAttachments, saveTicketAttachments } from "@/lib/ticketAttachments";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const ticketListUrl = new URL("/portal/tickets", request.nextUrl.origin);
  const form = await request.formData();
  const data = Object.fromEntries(form.entries());
  const parsed = ticketSchema.safeParse(data);
  if (!parsed.success) {
    ticketListUrl.searchParams.set("error", "Please check the ticket subject and message.");
    return NextResponse.redirect(ticketListUrl, 303);
  }
  let attachments = [];
  try {
    attachments = await saveTicketAttachments(form);
  } catch (error) {
    ticketListUrl.searchParams.set("error", error instanceof Error ? error.message : "Attachment upload failed.");
    return NextResponse.redirect(ticketListUrl, 303);
  }
  try {
    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
        subject: parsed.data.subject,
        priority: parsed.data.priority,
        orderId: parsed.data.orderId || null,
        attachments: encodeTicketAttachments(attachments),
        replies: { create: { userId: user.id, message: parsed.data.message } }
      }
    });
    ticketListUrl.searchParams.set("created", ticket.id);
    return NextResponse.redirect(ticketListUrl, 303);
  } catch {
    ticketListUrl.searchParams.set("error", "Ticket could not be submitted. Please try again.");
    return NextResponse.redirect(ticketListUrl, 303);
  }
}
