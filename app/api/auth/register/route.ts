import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword, sessionRole } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { sendTemplateEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  const data = Object.fromEntries((await request.formData()).entries());
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) return NextResponse.redirect(new URL("/register?error=Please check your details", request.url));

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.redirect(new URL("/register?error=Email already registered", request.url));

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      passwordHash: await hashPassword(parsed.data.password),
      role: "CUSTOMER"
    }
  });

  await sendTemplateEmail("account_registration", user.email, { name: user.name });
  await createSession({ id: user.id, name: user.name, email: user.email, role: sessionRole(user.role) });
  return NextResponse.redirect(new URL("/portal", request.url));
}
