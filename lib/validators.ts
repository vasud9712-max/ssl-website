import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10),
  company: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const profileSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional()
});

export const orderSchema = z.object({
  productId: z.string().min(1),
  primaryDomain: z.string().min(3),
  domains: z.string().min(3),
  sanEntries: z.string().optional(),
  csr: z.string().optional(),
  validationMethod: z.enum(["EMAIL", "DNS", "FILE"]),
  organizationName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional()
});

export const ticketSchema = z.object({
  subject: z.string().min(4),
  message: z.string().min(8),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  orderId: z.string().optional()
});

export const ticketReplySchema = z.object({
  message: z.string().min(2)
});

export const contactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  topic: z.string().min(2),
  message: z.string().min(20)
});

export const adminOrderUpdateSchema = z.object({
  primaryDomain: z.string().min(3),
  domains: z.string().min(3),
  sanEntries: z.string().optional(),
  csr: z.string().optional(),
  validationMethod: z.enum(["EMAIL", "DNS", "FILE"]),
  organizationName: z.string().optional(),
  totalAmount: z.coerce.number().int().min(1),
  status: z.enum([
    "PENDING_PAYMENT",
    "PAYMENT_RECEIVED",
    "AWAITING_CSR",
    "AWAITING_VALIDATION",
    "VALIDATION_IN_PROGRESS",
    "PROCESSING",
    "ISSUED",
    "REISSUED",
    "EXPIRED",
    "CANCELLED"
  ]),
  certificatePem: z.string().optional(),
  caBundle: z.string().optional(),
  adminNotes: z.string().optional(),
  verificationNotes: z.string().optional(),
  expiresAt: z.string().optional()
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  validationType: z.string().min(2),
  domainsCovered: z.string().min(2),
  issuanceTime: z.string().min(2),
  price: z.coerce.number().int().min(1),
  additionalSanPrice: z.coerce.number().int().min(0),
  enabled: z.coerce.boolean().default(true),
  features: z.string().min(2)
});
