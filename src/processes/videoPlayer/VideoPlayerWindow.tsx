import { useEffect, useMemo } from "react";
import { DesktopFileDoc } from "../../desktop/files/DesktopFileIcon";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ConnectedWindow } from "../../windowing/ConnectedWindow";
import { iife } from "../../../shared/misc";
import { Process } from "../../../convex/processes/schema";
import { Doc } from "../../../convex/_generated/dataModel";

export function VideoPlayerWindow({
  process,
  window,
}: {
  process: Process<"video_player">;
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
                Video preview is not available yet. Please wait for the upload
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
            <video
              src={file.uploadState.url}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                borderRadius: "4px",
              }}
              controls
            />
          </div>
        );
      })}
    </ConnectedWindow>
  );
}
