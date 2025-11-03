import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  EXTENSION_ICON_MAP,
  MIME_ICON_MAP,
  DEFAULT_ICON,
  isImageFile,
  isVideoFile,
  isTextFile,
} from "../../../../../shared/fileTypes";
import {
  startImagePreview,
  startVideoPlayer,
  startTextPreview,
} from "../../startProcessHelpers";
import { useStartCenteredApp } from "../../useStartCenteredApp";

export function AttachmentChip({ fileId }: { fileId: Id<"files"> }) {
  const file = useQuery(api.my.files.get, { fileId });
  const startCenteredApp = useStartCenteredApp();

  if (!file) return null;

  const getFileIcon = () => {
    const nameExtension = file.name.split(".").pop()?.toLowerCase();
    if (nameExtension && EXTENSION_ICON_MAP[nameExtension])
      return EXTENSION_ICON_MAP[nameExtension];

    if (file.type && MIME_ICON_MAP[file.type]) return MIME_ICON_MAP[file.type];

    return DEFAULT_ICON;
  };

  const handleClick = () => {
    if (isImageFile(file)) {
      void startCenteredApp(
        startImagePreview({
          fileId: file._id,
          fileName: file.name,
        }),
      );
    } else if (isVideoFile(file)) {
      void startCenteredApp(
        startVideoPlayer({
          fileId: file._id,
          fileName: file.name,
        }),
      );
    } else if (isTextFile(file)) {
      void startCenteredApp(
        startTextPreview({
          fileId: file._id,
          fileName: file.name,
        }),
      );
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 8px",
        backgroundColor: "#e0e7ff",
        border: "1px solid #c7d2fe",
        borderRadius: "4px",
        fontSize: "13px",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#c7d2fe";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#e0e7ff";
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
    </div>
  );
}
