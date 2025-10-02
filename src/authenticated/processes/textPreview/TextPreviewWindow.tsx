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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { isTextFile } from "../../../../shared/fileTypes";

function getLanguageFromFilename(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    py: "python",
    rb: "ruby",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    go: "go",
    rs: "rust",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    sql: "sql",
    html: "markup",
    xml: "markup",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    markdown: "markdown",
    graphql: "graphql",
    diff: "diff",
    docker: "docker",
    dockerfile: "docker",
  };

  return languageMap[extension] || "text";
}

export function TextPreviewWindow({
  process,
  window,
}: {
  process: Process<"text_preview">;
  window: Doc<"windows">;
}) {
  const file = useQuery(
    api.my.files.get,
    process.props.fileId ? { fileId: process.props.fileId } : "skip",
  );
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const onError = useErrorHandler();
  const [textContent, setTextContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setIsLoading(false);
      return;
    }
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

          const fileType = getDragData(
            event,
            "application/x-desktop-file-type",
          ) as string;
          const fileName = getDragData(
            event,
            "application/x-desktop-file-name",
          ) as string;

          if (!isTextFile({ name: fileName, type: fileType })) {
            onError("Invalid file type. Only text files are supported.");
            return;
          }

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
                  Drop a text file here to preview it.
                </p>
              </div>
            );
          }

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

          const language = getLanguageFromFilename(file.name);

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#1e1e1e",
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
            >
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: "16px",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  backgroundColor: "#1e1e1e",
                  height: "100%",
                }}
                lineNumberStyle={{
                  minWidth: "3em",
                  paddingRight: "1em",
                  color: "#858585",
                  userSelect: "none",
                }}
              >
                {textContent}
              </SyntaxHighlighter>
            </div>
          );
        })}
      </DropZone>
    </ConnectedWindow>
  );
}
