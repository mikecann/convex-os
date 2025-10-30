import { useQuery, useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ConnectedWindow } from "../../../os/windowing/ConnectedWindow";
import { iife } from "../../../../shared/misc";
import {
  createDataTypeFilter,
  getDragData,
} from "../../../common/dragDrop/helpers";
import { DropZone } from "../../../common/dragDrop/DropZone";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { isImageFile } from "../../../../shared/fileTypes";
import { MenuBar } from "../../../common/components/MenuBar";
import { CommonWindowShell } from "../../../common/components/CommonWindowShell";
import { useStartCenteredApp } from "../useStartCenteredApp";

export function ImagePreviewWindow({
  process,
  window,
}: {
  process: Process<"image_preview">;
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
        height: "100%",
        overflow: "hidden",
      }}
    >
      <CommonWindowShell
        menubar={
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
                          fileTypeFilter: "image",
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
        }
      >
        <DropZone
        dropMessage="Drop image here"
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

          if (!isImageFile({ name: fileName, type: fileType })) {
            onError("Invalid file type. Only image files are supported.");
            return;
          }

          await updateProcessProps({
            processId: process._id,
            props: { fileId },
          }).catch(onError);

          await updateWindowTitle({
            windowId: window._id,
            title: `${fileName} - Image Preview`,
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
                  Drop an image file here to preview it.
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
      </DropZone>
      </CommonWindowShell>
    </ConnectedWindow>
  );
}
