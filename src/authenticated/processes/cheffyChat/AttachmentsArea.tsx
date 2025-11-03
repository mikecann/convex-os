import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  EXTENSION_ICON_MAP,
  MIME_ICON_MAP,
  DEFAULT_ICON,
} from "../../../../shared/fileTypes";
import { useCheffyChatContext } from "./useCheffyChatContext";
import { useMutation } from "convex/react";

export function AttachmentsArea() {
  const { process } = useCheffyChatContext();
  const removeAttachment = useMutation(api.my.cheffy.removeAttachment);
  const attachmentIds = process.props.input?.attachments ?? [];

  if (attachmentIds.length === 0) return null;

  return (
    <div
      style={{
        padding: "4px 8px 14px 8px",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      {attachmentIds.map((fileId) => (
        <AttachmentChip
          key={fileId}
          fileId={fileId}
          onRemove={() => {
            void removeAttachment({
              processId: process._id,
              fileId,
            });
          }}
        />
      ))}
    </div>
  );
}

function AttachmentChip({
  fileId,
  onRemove,
}: {
  fileId: Id<"files">;
  onRemove: () => void;
}) {
  const file = useQuery(api.my.files.get, { fileId });

  if (!file) return null;

  // Get file icon based on extension or MIME type
  const getFileIcon = () => {
    const nameExtension = file.name.split(".").pop()?.toLowerCase();
    if (nameExtension && EXTENSION_ICON_MAP[nameExtension])
      return EXTENSION_ICON_MAP[nameExtension];

    if (file.type && MIME_ICON_MAP[file.type]) return MIME_ICON_MAP[file.type];

    return DEFAULT_ICON;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        backgroundColor: "#e0e7ff",
        border: "1px solid #c7d2fe",
        borderRadius: "4px",
        fontSize: "13px",
      }}
    >
      <img
        src={getFileIcon()}
        alt=""
        style={{
          width: "16px",
          height: "16px",
          objectFit: "contain",
        }}
      />
      <span
        style={{
          maxWidth: "150px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {file.name}
      </span>
      <button
        onClick={onRemove}
        style={{
          width: "auto",
          height: "auto",
          minWidth: "0",
          minHeight: "0",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          margin: "0",
          fontSize: "16px",
          lineHeight: "1",
          color: "#6366f1",
          boxShadow: "none",
          outline: "none",
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
        title="Remove attachment"
      >
        ×
      </button>
    </div>
  );
}
