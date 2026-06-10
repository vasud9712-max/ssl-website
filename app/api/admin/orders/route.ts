import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateOrderTotal, encodeList, linesToArray, nextOrderNumber } from "@/lib/orders";
import { orderSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  const data = Object.fromEntries((await request.formData()).entries());
  const parsed = orderSchema.extend({ userId: orderSchema.shape.productId }).safeParse(data);
  if (!parsed.success) return NextResponse.redirect(new URL("/admin/orders/new?error=Please check the order details", request.url));
  const product = await prisma.product.findUniqueOrThrow({ where: { id: parsed.data.productId } });
  const sanEntries = linesToArray(parsed.data.sanEntries || "");
  const order = await prisma.order.create({
    data: {
      orderNumber: await nextOrderNumber(),
      userId: parsed.data.userId,
      productId: product.id,
      status: "PENDING_PAYMENT",
      validationMethod: parsed.data.validationMethod,
      primaryDomain: parsed.data.primaryDomain,
      domains: encodeList(linesToArray(parsed.data.domains)),
      sanEntries: encodeList(sanEntries),
      organizationName: parsed.data.organizationName || "Manual Admin Order",
      address: parsed.data.address || "Not supplied",
      city: parsed.data.city || "Not supplied",
      state: parsed.data.state || "Not supplied",
      country: parsed.data.country || "Not supplied",
      zip: parsed.data.zip || "Not supplied",
      totalAmount: calculateOrderTotal(product.price, product.additionalSanPrice, sanEntries)
    }
  });
  await prisma.activityLog.create({ data: { userId: admin.id, action: "created manual order", entity: "order", entityId: order.id } });
  return NextResponse.redirect(new URL(`/admin/orders/${order.id}`, request.url));
}
