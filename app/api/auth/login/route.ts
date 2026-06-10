import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, sessionRole, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const data = Object.fromEntries((await request.formData()).entries());
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) return NextResponse.redirect(new URL("/login?error=Invalid login", request.url));

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || user.status !== "ACTIVE") return NextResponse.redirect(new URL("/login?error=Invalid login", request.url));

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.redirect(new URL("/login?error=Invalid login", request.url));

  await createSession({ id: user.id, name: user.name, email: user.email, role: sessionRole(user.role) });
  return NextResponse.redirect(new URL(user.role === "ADMIN" ? "/admin" : "/portal", request.url));
}
