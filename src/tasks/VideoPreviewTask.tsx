import { useEffect, useMemo } from "react";
import { DesktopFileDoc } from "../desktop/files/DesktopFileIcon";
import { useWindow } from "../common/components/window/WindowContext";

type VideoPreviewTaskProps = {
  file: DesktopFileDoc;
};

export function VideoPreviewTask({ file }: VideoPreviewTaskProps) {
  const {
    setTitle,
    setResizable,
    setShowMaximizeButton,
    setShowCloseButton,
    setBodyStyle,
    setStyle,
  } = useWindow();

  useEffect(() => {
    setTitle(file.name);
  }, [file.name, setTitle]);

  useEffect(() => {
    setResizable(true);
    setShowMaximizeButton(true);
    setShowCloseButton(true);
    setStyle({
      width: "640px",
      height: "480px",
      minWidth: "320px",
      minHeight: "240px",
    });
  }, [
    setResizable,
    setShowMaximizeButton,
    setShowCloseButton,
    setBodyStyle,
    setStyle,
  ]);

  const videoUrl = useMemo(() => {
    if (file.uploadState.kind === "uploaded") return file.uploadState.url;
    return undefined;
  }, [file]);

  if (videoUrl) {
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
          boxSizing: "border-box",
        }}
      >
        <video
          src={videoUrl}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: "4px",
          }}
          controls
        />
      </div>
    );
  }

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
        Video preview is not available yet. Please wait for the upload to
        finish.
      </p>
    </div>
  );
}
