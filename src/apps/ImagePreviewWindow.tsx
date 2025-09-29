import { useEffect, useMemo } from "react";
import { DesktopFileDoc } from "../desktop/files/DesktopFileIcon";
import { useWindow } from "../common/components/window/WindowContext";

type ImagePreviewWindowProps = {
  file: DesktopFileDoc;
};

export function ImagePreviewWindow({ file }: ImagePreviewWindowProps) {
  const { setTitle } = useWindow();

  useEffect(() => {
    setTitle(file.name);
  }, [file.name, setTitle]);

  const imageUrl = useMemo(() => {
    if (file.uploadState.kind === "uploaded") return file.uploadState.url;
    return undefined;
  }, [file]);

  if (imageUrl)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          width: "100%",
          height: "100%",
          padding: "12px",
          boxSizing: "border-box" as const,
        }}
      >
        <img
          src={imageUrl}
          alt={file.name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain" as const,
            borderRadius: "4px",
          }}
        />
      </div>
    );

  return (
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
      <p style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}>
        Image preview is not available yet. Please wait for the upload to
        finish.
      </p>
    </div>
  );
}
