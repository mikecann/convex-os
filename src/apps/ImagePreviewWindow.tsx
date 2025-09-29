import { useMemo } from "react";
import { Window } from "../common/components/Window";
import { DesktopFileDoc } from "../desktop/files/DesktopFileIcon";

type ImagePreviewWindowProps = {
  file: DesktopFileDoc;
  onClose: () => void;
  onFocus?: () => void;
  onMinimize?: () => void;
  isActive?: boolean;
  isMinimized?: boolean; // Added for animation
  taskbarButtonRect?: DOMRect;
};

export function ImagePreviewWindow({
  file,
  onClose,
  onFocus,
  onMinimize,
  isActive = false,
  isMinimized = false,
  taskbarButtonRect,
}: ImagePreviewWindowProps) {
  const imageUrl = useMemo(() => {
    if (file.uploadState.kind === "uploaded") return file.uploadState.url;
    return undefined;
  }, [file]);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    width: "100%",
    height: "100%",
    padding: "12px",
    boxSizing: "border-box" as const,
  };

  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain" as const,
    borderRadius: "4px",
  };

  return (
    <Window
      title={file.name}
      onClose={onClose}
      showCloseButton
      showMaximizeButton
      bodyStyle={{ padding: 0, maxWidth: "80vw", maxHeight: "80vh" }}
      style={{ minWidth: "320px", minHeight: "240px" }}
      resizable
      onFocus={onFocus}
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      taskbarButtonRect={taskbarButtonRect}
    >
      {imageUrl ? (
        <div style={containerStyle}>
          <img src={imageUrl} alt={file.name} style={imageStyle} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
          >
            Image preview is not available yet. Please wait for the upload to
            finish.
          </p>
        </div>
      )}
    </Window>
  );
}
