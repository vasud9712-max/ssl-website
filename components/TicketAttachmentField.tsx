"use client";

import { useState } from "react";
import { ticketAttachmentConfig } from "@/lib/ticketAttachmentConfig";

export function TicketAttachmentField({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState("");

  return (
    <div className="field">
      <label htmlFor={compact ? "reply-attachments" : "ticket-attachments"}>Attachments</label>
      <input
        id={compact ? "reply-attachments" : "ticket-attachments"}
        className="input file-input"
        name="attachments"
        type="file"
        accept={ticketAttachmentConfig.accept}
        multiple
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files || []);
          const invalid = files.find((file) => {
            const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
            return (
              file.size > ticketAttachmentConfig.maxSize ||
              !ticketAttachmentConfig.extensions.includes(extension) ||
              !ticketAttachmentConfig.mimeTypes.includes(file.type)
            );
          });
          if (invalid) {
            event.currentTarget.value = "";
            setMessage("Use TXT, JPG, PNG, GIF, or WebP files up to 5 MB each.");
            event.currentTarget.setCustomValidity("Unsupported attachment");
            return;
          }
          event.currentTarget.setCustomValidity("");
          setMessage(files.length ? `${files.length} file${files.length === 1 ? "" : "s"} selected.` : "");
        }}
      />
      <p className={message.includes("Use ") ? "field-error" : "field-hint"}>
        {message || "TXT, JPG, PNG, GIF, or WebP. Maximum 5 MB per file."}
      </p>
    </div>
  );
}
