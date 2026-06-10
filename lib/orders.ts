import { prisma } from "@/lib/db";

export function dollars(centsOrDollars: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(centsOrDollars);
}

export async function nextOrderNumber() {
  const count = await prisma.order.count();
  return `TS-${String(10001 + count).padStart(5, "0")}`;
}

export function linesToArray(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function encodeList(values: string[]) {
  return JSON.stringify(values);
}

export function decodeList(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return linesToArray(value);
  }
}

export function encodeData(value: unknown) {
  return JSON.stringify(value);
}

export function decodeData<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function calculateOrderTotal(basePrice: number, additionalSanPrice: number, sanEntries: string[]) {
  if (!additionalSanPrice) return basePrice;
  const additionalCount = Math.max(0, sanEntries.length - 3);
  return basePrice + additionalCount * additionalSanPrice;
}

export const orderStatusLabels: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_RECEIVED: "Payment Received",
  AWAITING_CSR: "Awaiting CSR",
  AWAITING_VALIDATION: "Awaiting Validation",
  VALIDATION_IN_PROGRESS: "Validation In Progress",
  PROCESSING: "Processing",
  ISSUED: "Issued",
  REISSUED: "Reissued",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled"
};
