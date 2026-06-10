import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

type TemplateVars = Record<string, string | number | null | undefined>;

function render(input: string, vars: TemplateVars) {
  return input.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ""));
}

export async function sendTemplateEmail(key: string, to: string, vars: TemplateVars) {
  const template = await prisma.emailTemplate.findUnique({ where: { key } });
  if (!template?.enabled) return;

  const subject = render(template.subject, vars);
  const text = render(template.body, vars);

  if (!process.env.SMTP_HOST) {
    await prisma.activityLog.create({
      data: {
        action: `email queued: ${key}`,
        entity: "email",
        metadata: JSON.stringify({ to, subject })
      }
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });

  await transporter.sendMail({
    to,
    from: process.env.SMTP_FROM,
    subject,
    text
  });
}
