import { useEffect, useMemo } from "react";
import { useWindow } from "../../common/components/window/WindowContext";
import { Process } from "../../../convex/processes/schema";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { ConnectedWindow } from "../../windowing/ConnectedWindow";

export function ImagePreviewWindow({
  process,
  window,
}: {
  process: Process<"image_preview">;
  window: Doc<"windows">;
}) {
  return (
    <ConnectedWindow
      window={window}
      style={{ width: "640px", height: "480px" }}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
    >
      <ImagePreviewWindowInner process={process} />
    </ConnectedWindow>
  );
}

function ImagePreviewWindowInner({
  process,
}: {
  process: Process<"image_preview">;
}) {
  const file = useQuery(api.my.files.get, { fileId: process.props.fileId });

  if (!file) return null;

  if (file.uploadState.kind != "uploaded")
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
      <img
        src={file.uploadState.url}
        alt={file.name}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
