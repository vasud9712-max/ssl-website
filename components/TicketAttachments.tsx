import { Download, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  formatAttachmentSize,
  isImageAttachment,
  parseTicketAttachments,
  TicketAttachment
} from "@/lib/ticketAttachments";

function attachmentUrl(attachment: TicketAttachment, download = false) {
  return `/api/ticket-attachments/${encodeURIComponent(attachment.storedName)}${download ? "?download=1" : ""}`;
}

export function TicketAttachments({ value }: { value: string | null | undefined }) {
  const attachments = parseTicketAttachments(value);
  if (attachments.length === 0) return null;

  return (
    <div className="attachment-grid">
      {attachments.map((attachment) => (
        <div className="attachment-card" key={attachment.id}>
          {isImageAttachment(attachment) ? (
            <a className="attachment-preview" href={attachmentUrl(attachment)} target="_blank" rel="noreferrer">
              <Image src={attachmentUrl(attachment)} alt={attachment.originalName} width={54} height={54} unoptimized />
            </a>
          ) : (
            <div className="attachment-file-icon"><FileText size={24} /></div>
          )}
          <div className="attachment-info">
            <span>{isImageAttachment(attachment) ? <ImageIcon size={14} /> : <FileText size={14} />}{attachment.originalName}</span>
            <small>{formatAttachmentSize(attachment.size)}</small>
          </div>
          <a className="icon-button" href={attachmentUrl(attachment, true)} title={`Download ${attachment.originalName}`}>
            <Download size={17} />
          </a>
        </div>
      ))}
    </div>
  );
}
