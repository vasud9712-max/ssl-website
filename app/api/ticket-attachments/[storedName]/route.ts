import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTicketAttachmentPath, parseTicketAttachments } from "@/lib/ticketAttachments";

export async function GET(request: NextRequest, { params }: { params: { storedName: string } }) {
  const user = await requireUser();
  const storedName = decodeURIComponent(params.storedName);
  const ticket = await prisma.ticket.findFirst({
    where: {
      OR: [
        { attachments: { contains: storedName } },
        { replies: { some: { attachments: { contains: storedName } } } }
      ]
    },
    include: { replies: true }
  });

  if (!ticket || (user.role !== "ADMIN" && ticket.userId !== user.id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const attachments = [
    ...parseTicketAttachments(ticket.attachments),
    ...ticket.replies.flatMap((reply) => parseTicketAttachments(reply.attachments))
  ];
  const attachment = attachments.find((item) => item.storedName === storedName);
  if (!attachment) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await readFile(getTicketAttachmentPath(storedName));
    const disposition = request.nextUrl.searchParams.get("download") === "1" ? "attachment" : "inline";
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": attachment.mimeType,
        "Content-Length": String(attachment.size),
        "Content-Disposition": `${disposition}; filename="${attachment.originalName.replaceAll('"', "")}"`,
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new NextResponse("Attachment missing", { status: 404 });
  }
}
