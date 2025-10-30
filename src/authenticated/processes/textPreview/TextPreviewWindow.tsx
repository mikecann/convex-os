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
import { MenuBar } from "../../../common/components/MenuBar";
import { CommonWindowShell } from "../../../common/components/CommonWindowShell";
import { useStartCenteredApp } from "../useStartCenteredApp";

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

function CenteredMessage({
  children,
  color = "white",
}: {
  children: React.ReactNode;
  color?: string;
}) {
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
          color,
          textShadow:
            color === "white" ? "0 1px 2px rgba(0,0,0,0.6)" : undefined,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function TextContent({
  content,
  filename,
}: {
  content: string;
  filename: string;
}) {
  const language = getLanguageFromFilename(filename);

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
        {content}
      </SyntaxHighlighter>
    </div>
  );
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
  const updateWindowTitle = useMutation(api.my.windows.updateTitle);
  const onError = useErrorHandler();
  const startCenteredApp = useStartCenteredApp();
  const [textContent, setTextContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    if (file.uploadState.kind !== "uploaded") return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setLoadError(null);

    const controller = new AbortController();
    fetch(file.uploadState.url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to load file: ${response.statusText}`);

        return response.text();
      })
      .then((text) => {
        setTextContent(text);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load file",
          );
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [file]);

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
                          fileTypeFilter: "text",
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

          await updateWindowTitle({
            windowId: window._id,
            title: `${fileName} - Text Preview`,
          }).catch(onError);
        }}
      >
        {iife(() => {
          if (!file)
            return (
              <CenteredMessage>
                Drop a text file here to preview it.
              </CenteredMessage>
            );

          if (file.uploadState.kind !== "uploaded")
            return (
              <CenteredMessage>
                Text preview is not available yet. Please wait for the upload to
                finish.
              </CenteredMessage>
            );

          if (isLoading) return <CenteredMessage>Loading...</CenteredMessage>;

          if (loadError)
            return (
              <CenteredMessage color="#ffb4b4">{loadError}</CenteredMessage>
            );

          return <TextContent content={textContent} filename={file.name} />;
        })}
      </DropZone>
      </CommonWindowShell>
    </ConnectedWindow>
  );
}
