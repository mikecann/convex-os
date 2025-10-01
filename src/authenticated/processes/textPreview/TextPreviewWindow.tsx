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
import { useEffect, useState } from "react";

export function TextPreviewWindow({
  process,
  window,
}: {
  process: Process<"text_preview">;
  window: Doc<"windows">;
}) {
  const file = useQuery(api.my.files.get, { fileId: process.props.fileId });
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const onError = useErrorHandler();
  const [textContent, setTextContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    if (file.uploadState.kind !== "uploaded") return;

    setIsLoading(true);
    setLoadError(null);

    fetch(file.uploadState.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        return response.text();
      })
      .then((text) => {
        setTextContent(text);
        setIsLoading(false);
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load file",
        );
        setIsLoading(false);
      });
  }, [file]);

  return (
    <ConnectedWindow
      window={window}
      showCloseButton
      showMaximizeButton
      showMinimiseButton
      resizable
    >
      <DropZone
        dropMessage="Drop text file here"
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
          if (!file) return null;

          if (file.uploadState.kind !== "uploaded")
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
                  Text preview is not available yet. Please wait for the upload
                  to finish.
                </p>
              </div>
            );

          if (isLoading)
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  padding: "16px",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <p style={{ color: "white" }}>Loading...</p>
              </div>
            );

          if (loadError)
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  padding: "16px",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <p style={{ color: "#ffb4b4" }}>{loadError}</p>
              </div>
            );

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#1a1a1a",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  padding: "16px",
                  color: "#e0e0e0",
                  fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  overflow: "auto",
                  flex: 1,
                }}
              >
                {textContent}
              </pre>
            </div>
          );
        })}
      </DropZone>
    </ConnectedWindow>
  );
}
