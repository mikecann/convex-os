import { useQuery, useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { iife } from "../../../../shared/misc";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import {
  createDataTypeFilter,
  getDragData,
} from "../../../common/dragDrop/helpers";
import { DropZone } from "../../../common/dragDrop/DropZone";

export function VideoPlayerWindow({
  process,
  window,
}: {
  process: Process<"video_player">;
  window: Doc<"windows">;
}) {
  const file = useQuery(
    api.my.files.get,
    process.props.fileId ? { fileId: process.props.fileId } : "skip",
  );
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const onError = useErrorHandler();

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
    >
      <DropZone
        dropMessage="Drop video here"
        shouldAcceptDrag={createDataTypeFilter("application/x-desktop-file-id")}
        getDropEffect={() => "copy"}
        onDrop={async (event) => {
          const fileId = getDragData(
            event,
            "application/x-desktop-file-id",
          ) as Id<"files">;
          if (!fileId) return;

          await updateProcessProps({
            processId: process._id,
            props: { fileId },
          }).catch(onError);
        }}
      >
        {iife(() => {
          if (!file) {
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
                  backgroundColor: "#1a1a1a",
                }}
              >
                <p
                  style={{
                    color: "white",
                    textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                  }}
                >
                  Drop a video file here to play it.
                </p>
              </div>
            );
          }

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
      </DropZone>
    </ConnectedWindow>
  );
}
