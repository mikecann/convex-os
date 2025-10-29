import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Process } from "../../../../convex/processes/schema";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { ModalWindow } from "../../../os/windowing/ModalWindow";
import { isImageFile, getFileExtension } from "../../../../shared/fileTypes";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { FileGrid } from "./FileGrid";
import { FileBrowserControls, FileTypeFilter } from "./FileBrowserControls";

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

  const handleOpenFile = (fileId: Id<"files">) => {
    if (!process.props.parentProcessId || !parentWindow) return;

    const file = filteredFiles.find((f) => f._id === fileId);
    if (!file) return;

    updateProcessProps({
      processId: process.props.parentProcessId,
      props: { fileId },
    })
      .then(() =>
        updateWindowTitle({
          windowId: parentWindow._id,
          title: `${file.name} - Image Preview`,
        }),
      )
      .then(() => closeProcess({ processId: process._id }))
      .catch(onError);
  };

  return (
    <ModalWindow window={window} showCloseButton resizable>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#fff",
        }}
      >
        <FileGrid
          files={filteredFiles}
          selectedFileId={selectedFileId}
          onSelectFile={setSelectedFileId}
          onOpenFile={handleOpenFile}
        />
        <FileBrowserControls
          selectedFile={selectedFile}
          fileTypeFilter={fileTypeFilter}
          onFileTypeFilterChange={setFileTypeFilter}
          onOpen={() => {
            if (selectedFileId) handleOpenFile(selectedFileId);
          }}
          onCancel={() => {
            closeProcess({ processId: process._id }).catch(onError);
          }}
          isOpenDisabled={!selectedFileId}
        />
      </div>
    </ModalWindow>
  );
}
