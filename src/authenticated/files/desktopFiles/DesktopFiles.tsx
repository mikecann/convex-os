import { useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useDesktopFileUploader } from "../useDesktopFileUploader";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { DesktopFileIcon } from "../desktopFileIcon/DesktopFileIcon";
import { SelectionRectangle } from "./SelectionRectangle";
import { DragOverlay } from "./DragOverlay";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useFileSelection } from "./useFileSelection";
import { useFileDrop } from "./useFileDrop";
import { useOptimisticDeactivateActive } from "../../../common/hooks/optimistic";

export function DesktopFiles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const files = useQuery(api.my.files.list) ?? [];
  const deleteFiles = useMutation(api.my.files.deleteAll);
  const deactivateActiveWindow = useOptimisticDeactivateActive();
  const { uploadFiles } = useDesktopFileUploader();
  const onError = useErrorHandler();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const {
    selectedIds,
    setSelectedIds,
    selectionRect,
    iconNodesRef,
    handleMouseDown,
  } = useFileSelection(containerRef, () => {
    void deactivateActiveWindow();
  });

  const {
    isDragOver,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  } = useFileDrop(containerRef, files, uploadFiles);

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onKeyDown={(event) => {
          if (event.key !== "Delete") return;
          if (selectedIds.length === 0) return;
          event.preventDefault();
          setIsConfirmOpen(true);
        }}
        tabIndex={0}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
          backgroundImage: "url(/bliss.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {files.map((file) => {
          const selectedFiles = files.filter((f) =>
            selectedIds.includes(f._id),
          );
          const isSelected = selectedIds.includes(file._id);
          return (
            <DesktopFileIcon
              key={file._id}
              file={file}
              selectedFiles={selectedFiles}
              allFiles={files}
              containerRef={containerRef}
              isSelected={isSelected}
              registerNode={(element) => {
                if (!element) {
                  iconNodesRef.current.delete(file._id);
                  return;
                }
                iconNodesRef.current.set(file._id, { element, file });
              }}
              onMouseDown={(event) => {
                // Shift+click to add/toggle selection
                if (event.shiftKey) {
                  setSelectedIds((current) => {
                    if (current.includes(file._id)) return current;
                    return [...current, file._id];
                  });
                  return;
                }

                // If clicking on an already-selected file, don't change selection
                // (allows dragging multiple files)
                if (isSelected) 
                  return;
                

                // Otherwise, select only this file
                setSelectedIds([file._id]);
              }}
              onClickWithoutDrag={() => {
                // When clicking on a selected file without dragging, select only that file
                setSelectedIds([file._id]);
              }}
            />
          );
        })}
        {isDragOver && <DragOverlay />}
        {selectionRect && <SelectionRectangle rect={selectionRect} />}
      </div>
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        fileCount={selectedIds.length}
        onConfirm={async () => {
          await deleteFiles({ fileIds: selectedIds })
            .then(() => setSelectedIds([]))
            .catch(onError)
            .finally(() => setIsConfirmOpen(false));
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}
