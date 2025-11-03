import { useState, RefObject, type MouseEvent as ReactMouseEvent } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import { DesktopFileImage } from "../DesktopFileImage";
import { FileIconLabel } from "./FileIconLabel";
import { FileIconRenameInput } from "./FileIconRenameInput";
import { FileIconUploadStatus } from "./FileIconUploadStatus";
import { useDragAndDrop } from "./useDragAndDrop";
import { useRename } from "./useRename";
import { useOpenFileInPreview } from "../../processes/useOpenFileInPreview";

export type DesktopFileDoc = Doc<"files">;

export interface DesktopFileIconProps {
  file: DesktopFileDoc;
  selectedFiles: DesktopFileDoc[];
  allFiles: DesktopFileDoc[];
  containerRef: RefObject<HTMLDivElement | null>;
  registerNode: (element: HTMLDivElement | null) => void;
  isSelected: boolean;
  onMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
  onClickWithoutDrag?: () => void;
}

export function DesktopFileIcon({
  file,
  selectedFiles,
  allFiles,
  containerRef,
  registerNode,
  isSelected,
  onMouseDown,
  onClickWithoutDrag,
}: DesktopFileIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const openFileInPreview = useOpenFileInPreview();
  const onError = useErrorHandler();

  const {
    isRenaming,
    nameDraft,
    inputRef,
    setNameDraft,
    handleRenameSubmit,
    startRename,
    cancelRename,
  } = useRename(file);

  const { handleDragStart, handleDragEnd, dragStartedRef } = useDragAndDrop(
    file,
    selectedFiles,
    allFiles,
    isSelected,
    containerRef,
    isRenaming,
  );

  return (
    <div
      ref={registerNode}
      draggable={!isRenaming}
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.button !== 0) return;
        event.currentTarget.focus();
        if (isRenaming) return;
        dragStartedRef.current = false;
        onMouseDown(event);
      }}
      onMouseUp={(event) => {
        if (event.button !== 0) return;
        if (isRenaming) return;
        // If this was a click (not a drag) on a selected file, select only this file
        if (isSelected && !dragStartedRef.current && onClickWithoutDrag)
          onClickWithoutDrag();
      }}
      onDragStart={(event) => {
        setIsDragging(true);
        handleDragStart(event);
      }}
      onDragEnd={(event) => {
        setIsDragging(false);
        void handleDragEnd(event);
      }}
      onDoubleClick={() => {
        openFileInPreview(file, {
          x: file.position.x,
          y: file.position.y,
        });
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isRenaming) {
          event.preventDefault();
          cancelRename();
          return;
        }
        if (event.key !== "F2") return;
        if (!isSelected) return;
        if (isRenaming) return;
        event.preventDefault();
        startRename();
      }}
      tabIndex={0}
      style={{
        position: "absolute",
        left: `${file.position.x}px`,
        top: `${file.position.y}px`,
        width: "96px",
        minHeight: "112px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        cursor: isRenaming ? "text" : isDragging ? "grabbing" : "pointer",
        userSelect: "none",
        textAlign: "center",
        color: "white",
        textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
        borderRadius: "8px",
        padding: "6px",
        boxSizing: "border-box",
        border: isSelected
          ? "1px solid rgba(255,255,255,0.8)"
          : "1px solid transparent",
        backgroundColor: isSelected
          ? "rgba(59,130,246,0.35)"
          : "rgba(0,0,0,0.0)",
      }}
    >
      <DesktopFileImage file={file} />
      {isRenaming ? (
        <FileIconRenameInput
          inputRef={inputRef}
          value={nameDraft}
          onChange={setNameDraft}
          onSubmit={() => void handleRenameSubmit()}
          onCancel={cancelRename}
        />
      ) : (
        <FileIconLabel name={file.name} />
      )}
      <FileIconUploadStatus uploadState={file.uploadState} />
    </div>
  );
}
