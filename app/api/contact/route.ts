import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { contactMessageSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const redirectUrl = new URL("/contact-us", request.nextUrl.origin);
  const form = await request.formData();
  const parsed = contactMessageSchema.safeParse(Object.fromEntries(form.entries()));

  if (!parsed.success) {
    redirectUrl.searchParams.set("error", "Please check your contact details and message.");
    return NextResponse.redirect(redirectUrl, 303);
  }

  try {
    const now = new Date();
    await prisma.$executeRaw`
      INSERT INTO "ContactMessage" ("id", "name", "email", "phone", "topic", "message", "status", "createdAt", "updatedAt")
      VALUES (
        ${crypto.randomUUID()},
        ${parsed.data.name.trim()},
        ${parsed.data.email.trim().toLowerCase()},
        ${parsed.data.phone?.trim() || null},
        ${parsed.data.topic.trim()},
        ${parsed.data.message.trim()},
        'NEW',
        ${now},
        ${now}
      )
    `;

    redirectUrl.searchParams.set("success", "1");
    return NextResponse.redirect(redirectUrl, 303);
  } catch {
    redirectUrl.searchParams.set("error", "Your message could not be sent. Please try again.");
    return NextResponse.redirect(redirectUrl, 303);
  }
}
