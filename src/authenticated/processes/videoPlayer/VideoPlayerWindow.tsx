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
import { isVideoFile } from "../../../../shared/fileTypes";
import { MenuBar } from "../../../common/components/MenuBar";
import { useStartCenteredApp } from "../useStartCenteredApp";

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
  const updateWindowTitle = useMutation(api.my.windows.updateTitle);
  const onError = useErrorHandler();
  const startCenteredApp = useStartCenteredApp();

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
      bodyStyle={{
        marginTop: 0,
      }}
    >
      <MenuBar
        items={[
          {
            label: "File",
            items: [
              {
                label: "Open...",
                onClick: () => {
                  startCenteredApp({
                    kind: "file_browser",
                    props: {
                      parentProcessId: process._id,
                      fileTypeFilter: "video",
                    },
                    windowCreationParams: {
                      x: 0,
                      y: 0,
                      width: 600,
                      height: 500,
                      title: "Open",
                      icon: "/xp/folder.png",
                    },
                  });
                },
              },
            ],
          },
        ]}
      />
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

          const fileType = getDragData(
            event,
            "application/x-desktop-file-type",
          ) as string;
          const fileName = getDragData(
            event,
            "application/x-desktop-file-name",
          ) as string;

          if (!isVideoFile({ name: fileName, type: fileType })) {
            onError("Invalid file type. Only video files are supported.");
            return;
          }

          await updateProcessProps({
            processId: process._id,
            props: { fileId },
          }).catch(onError);

          await updateWindowTitle({
            windowId: window._id,
            title: `${fileName} - Video Player`,
          }).catch(onError);
        }}
      >
        {iife(() => {
          if (!file)
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
