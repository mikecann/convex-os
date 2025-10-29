import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { LocalModalWindow } from "../../../os/windowing/LocalModalWindow";
import { isImageFile, getFileExtension } from "../../../../shared/fileTypes";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";

type FileTypeFilter = "all" | "png" | "jpeg" | "gif" | "webp";

export function FileBrowserWindow({
  process,
  window,
}: {
  process: Process<"file_browser">;
  window: Doc<"windows">;
}) {
  const files = useQuery(api.my.files.list) ?? [];
  const parentWindows = useQuery(
    api.my.windows.listForProcess,
    process.props.parentProcessId
      ? { processId: process.props.parentProcessId }
      : "skip",
  );
  const updateProcessProps = useMutation(api.my.processes.updateProps);
  const updateWindowTitle = useMutation(api.my.windows.updateTitle);
  const closeProcess = useMutation(api.my.processes.close);
  const onError = useErrorHandler();

  const [selectedFileId, setSelectedFileId] = useState<Id<"files"> | null>(
    null,
  );
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>("all");

  const parentWindow = parentWindows?.[0];

  const imageFiles = files.filter((file) =>
    isImageFile({ name: file.name, type: file.type }),
  );

  const filteredFiles = imageFiles.filter((file) => {
    if (fileTypeFilter === "all") return true;
    const ext = getFileExtension(file.name);
    if (!ext) return false;
    if (fileTypeFilter === "jpeg") return ext === "jpg" || ext === "jpeg";
    return ext === fileTypeFilter;
  });

  const selectedFile = filteredFiles.find((f) => f._id === selectedFileId);

  return (
    <LocalModalWindow
      title="Open"
      icon="/xp/folder.png"
      showCloseButton
      width={600}
      height={500}
      viewState={{ kind: "open", viewStackOrder: 1000, isActive: true }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#fff",
        }}
      >
        {/* File list area */}
        <div
          style={{
            flex: 1,
            padding: "8px",
            overflowY: "auto",
            border: "2px inset #dfdfdf",
            margin: "8px",
            backgroundColor: "#fff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                onClick={() => setSelectedFileId(file._id)}
                onDoubleClick={() => {
                  if (!process.props.parentProcessId || !parentWindow) return;
                  updateProcessProps({
                    processId: process.props.parentProcessId,
                    props: { fileId: file._id },
                  })
                    .then(() =>
                      updateWindowTitle({
                        windowId: parentWindow._id,
                        title: `${file.name} - Image Preview`,
                      }),
                    )
                    .then(() => closeProcess({ processId: process._id }))
                    .catch(onError);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedFileId === file._id ? "#316AC5" : "transparent",
                  color: selectedFileId === file._id ? "#fff" : "#000",
                  borderRadius: "2px",
                }}
              >
                <img
                  src="/xp/image.png"
                  alt=""
                  style={{ width: "32px", height: "32px" }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    textAlign: "center",
                    wordBreak: "break-word",
                    marginTop: "4px",
                  }}
                >
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            padding: "8px",
            borderTop: "1px solid #dfdfdf",
            backgroundColor: "#ECE9D8",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <label
              style={{
                marginRight: "8px",
                fontSize: "11px",
                fontFamily: "Tahoma, sans-serif",
              }}
            >
              File name:
            </label>
            <input
              type="text"
              value={selectedFile?.name ?? ""}
              readOnly
              style={{
                flex: 1,
                padding: "2px 4px",
                fontSize: "11px",
                fontFamily: "Tahoma, sans-serif",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <label
                style={{
                  marginRight: "8px",
                  fontSize: "11px",
                  fontFamily: "Tahoma, sans-serif",
                }}
              >
                Files of type:
              </label>
              <select
                value={fileTypeFilter}
                onChange={(e) =>
                  setFileTypeFilter(e.target.value as FileTypeFilter)
                }
                style={{
                  padding: "2px 4px",
                  fontSize: "11px",
                  fontFamily: "Tahoma, sans-serif",
                }}
              >
                <option value="all">All Images</option>
                <option value="png">PNG Files (*.png)</option>
                <option value="jpeg">JPEG Files (*.jpg, *.jpeg)</option>
                <option value="gif">GIF Files (*.gif)</option>
                <option value="webp">WebP Files (*.webp)</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => {
                  if (
                    !selectedFileId ||
                    !process.props.parentProcessId ||
                    !parentWindow
                  )
                    return;
                  updateProcessProps({
                    processId: process.props.parentProcessId,
                    props: { fileId: selectedFileId },
                  })
                    .then(() => {
                      if (!selectedFile) return;
                      return updateWindowTitle({
                        windowId: parentWindow._id,
                        title: `${selectedFile.name} - Image Preview`,
                      });
                    })
                    .then(() => closeProcess({ processId: process._id }))
                    .catch(onError);
                }}
                disabled={!selectedFileId}
                style={{
                  padding: "4px 16px",
                  fontSize: "11px",
                  fontFamily: "Tahoma, sans-serif",
                }}
              >
                Open
              </button>
              <button
                onClick={() => {
                  closeProcess({ processId: process._id }).catch(onError);
                }}
                style={{
                  padding: "4px 16px",
                  fontSize: "11px",
                  fontFamily: "Tahoma, sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocalModalWindow>
  );
}
