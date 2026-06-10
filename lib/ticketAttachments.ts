import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { ticketAttachmentConfig } from "@/lib/ticketAttachmentConfig";

export type TicketAttachment = {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
};

const uploadDir = path.join(process.cwd(), "uploads", "tickets");

function cleanFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "attachment";
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return typeof value === "object" && "arrayBuffer" in value && "size" in value && "type" in value;
}

export function isImageAttachment(attachment: TicketAttachment) {
  return attachment.mimeType.startsWith("image/");
}

export function formatAttachmentSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function parseTicketAttachments(value: string | null | undefined): TicketAttachment[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (typeof item === "string") {
        return [{
          id: item,
          originalName: item,
          storedName: item,
          mimeType: "text/plain",
          size: 0,
          uploadedAt: new Date(0).toISOString()
        }];
      }
      if (
        item &&
        typeof item.id === "string" &&
        typeof item.originalName === "string" &&
        typeof item.storedName === "string" &&
        typeof item.mimeType === "string"
      ) {
        return [item as TicketAttachment];
      }
      return [];
    });
  } catch {
    return [];
  }
}

export function encodeTicketAttachments(attachments: TicketAttachment[]) {
  return attachments.length ? JSON.stringify(attachments) : null;
}

export async function saveTicketAttachments(form: FormData, fieldName = "attachments") {
  const files = form.getAll(fieldName).filter(isUploadedFile).filter((file) => file.size > 0);
  if (files.length === 0) return [];

  await mkdir(uploadDir, { recursive: true });

  const saved: TicketAttachment[] = [];
  for (const file of files) {
    const fileName = "name" in file ? file.name : "attachment";
    const ext = path.extname(fileName).toLowerCase();
    if (!ticketAttachmentConfig.extensions.includes(ext) || !ticketAttachmentConfig.mimeTypes.includes(file.type)) {
      throw new Error("Only TXT, JPG, PNG, GIF, and WebP attachments are supported.");
    }
    if (file.size > ticketAttachmentConfig.maxSize) {
      throw new Error("Attachments must be 5 MB or smaller.");
    }

    const id = crypto.randomUUID();
    const storedName = `${id}${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, storedName), bytes);
    saved.push({
      id,
      originalName: cleanFilename(fileName),
      storedName,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString()
    });
  }
  return saved;
}

export function getTicketAttachmentPath(storedName: string) {
  return path.join(uploadDir, path.basename(storedName));
}

export async function deleteTicketAttachmentFiles(values: Array<string | null | undefined>) {
  const attachments = values.flatMap((value) => parseTicketAttachments(value));
  await Promise.all(
    attachments.map(async (attachment) => {
      try {
        await unlink(getTicketAttachmentPath(attachment.storedName));
      } catch {
        // Missing files should not block deleting the ticket or account record.
      }
    })
  );
}
