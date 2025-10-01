import { useQuery } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { iife } from "../../../../shared/misc";

export function ImagePreviewWindow({
  process,
  window,
}: {
  process: Process<"image_preview">;
  window: Doc<"windows">;
}) {
  const file = useQuery(api.my.files.get, { fileId: process.props.fileId });

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
    >
      {iife(() => {
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
              <p
                style={{
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                }}
              >
                Image preview is not available yet. Please wait for the upload
                to finish.
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
      })}
    </ConnectedWindow>
  );
}
