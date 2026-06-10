import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const data = Object.fromEntries((await request.formData()).entries());
  const parsed = profileSchema.safeParse(data);
  if (parsed.success) {
    await prisma.user.update({ where: { id: user.id }, data: parsed.data });
  }
  return NextResponse.redirect(new URL("/portal/profile", request.url));
}
