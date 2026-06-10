import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encodeData, encodeList, linesToArray } from "@/lib/orders";
import { productSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  const data = Object.fromEntries((await request.formData()).entries());
  const parsed = productSchema.safeParse(data);
  if (parsed.success) {
    const category = await prisma.category.upsert({
      where: { slug: "rapidssl" },
      update: {},
      create: { name: "RapidSSL Certificates", slug: "rapidssl" }
    });
    const product = await prisma.product.create({
      data: {
        categoryId: category.id,
        name: parsed.data.name,
        slug: parsed.data.slug,
        validationType: parsed.data.validationType,
        domainsCovered: parsed.data.domainsCovered,
        issuanceTime: "15 Minutes",
        price: parsed.data.price,
        additionalSanPrice: parsed.data.additionalSanPrice,
        enabled: parsed.data.enabled,
        features: encodeList(linesToArray(parsed.data.features)),
        details: encodeData({ overview: parsed.data.domainsCovered, specs: [] })
      }
    });
    await prisma.activityLog.create({ data: { userId: admin.id, action: "created product", entity: "product", entityId: product.id } });
  }
  return NextResponse.redirect(new URL("/admin/products", request.url));
}
