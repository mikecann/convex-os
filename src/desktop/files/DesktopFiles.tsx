import { DesktopFileIcon, type DesktopFileDoc } from "./DesktopFileIcon";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  useDesktopFileUploader,
  DesktopFileUpload,
} from "./useDesktopFileUploader";
import { useErrorHandler } from "../../common/errors/useErrorHandler";
import { Id } from "../../../convex/_generated/dataModel";
import { ConfirmationDialog } from "../../common/confirmation/ConfirmationDialog";

const IMAGE_EXTENSIONS: ReadonlySet<string> = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "svg",
  "webp",
]);

const VIDEO_EXTENSIONS: ReadonlySet<string> = new Set(["mp4", "webm", "ogg"]);

function isImageFile(file: DesktopFileDoc) {
  if (file.type?.startsWith("image/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return false;
  return IMAGE_EXTENSIONS.has(extension);
}

function isVideoFile(file: DesktopFileDoc) {
  if (file.type?.startsWith("video/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return false;
  return VIDEO_EXTENSIONS.has(extension);
}

export function DesktopFiles() {
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const files = useQuery(api.my.files.list) ?? [];
  const deleteFiles = useMutation(api.my.files.deleteAll);
  const { uploadFiles } = useDesktopFileUploader();
  const onError = useErrorHandler();
  const [selectedIds, setSelectedIds] = useState<Array<Id<"files">>>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const [selectionRect, setSelectionRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const iconNodesRef = useRef(
    new Map<Id<"files">, { element: HTMLDivElement; file: DesktopFileDoc }>(),
  );
  const hasDraggedRef = useRef(false);
  const startApp = useMutation(api.my.apps.start);

  // useEffect(() => {
  //   syncFiles(files);
  // }, [files, syncFiles]);

  const openFile = (file: DesktopFileDoc) => {
    if (isImageFile(file)) {
      startApp({
        app: {
          kind: "image_preview",
          props: { fileId: file._id },
          windowCreationParams: {
            x: file.position.x,
            y: file.position.y,
            width: 480,
            height: 320,
            title: file.name,
          },
        },
      });
      return;
    }
    // if (isVideoFile(file)) {
    //   startApp({
    //     process: {
    //       kind: "video_player",
    //       props: { fileId: file._id },
    //     },
    //   });
    //   return;
    // }
  };

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragOver(false);
    };

    window.addEventListener("dragend", handleGlobalDragEnd);
    window.addEventListener("drop", handleGlobalDragEnd);

    return () => {
      window.removeEventListener("dragend", handleGlobalDragEnd);
      window.removeEventListener("drop", handleGlobalDragEnd);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          if (!containerRef.current) return;

          const rect = containerRef.current.getBoundingClientRect();
          const startX = event.clientX - rect.left;
          const startY = event.clientY - rect.top;
          selectionStartRef.current = { x: startX, y: startY };
          setSelectionRect({ left: startX, top: startY, width: 0, height: 0 });
          hasDraggedRef.current = false;
          setSelectedIds([]);

          const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!selectionStartRef.current || !containerRef.current) return;
            moveEvent.preventDefault();
            hasDraggedRef.current = true;

            const currentX = moveEvent.clientX - rect.left;
            const currentY = moveEvent.clientY - rect.top;
            const width = currentX - selectionStartRef.current.x;
            const height = currentY - selectionStartRef.current.y;
            const normalized = {
              left:
                width >= 0
                  ? selectionStartRef.current.x
                  : selectionStartRef.current.x + width,
              top:
                height >= 0
                  ? selectionStartRef.current.y
                  : selectionStartRef.current.y + height,
              width: Math.abs(width),
              height: Math.abs(height),
            };
            setSelectionRect(normalized);

            const selected: Array<Id<"files">> = [];
            iconNodesRef.current.forEach(({ element, file }) => {
              const iconRect = element.getBoundingClientRect();
              const containerRect =
                containerRef.current?.getBoundingClientRect();
              if (!containerRect) return;

              const iconLeft = iconRect.left - containerRect.left;
              const iconTop = iconRect.top - containerRect.top;
              const iconWidth = iconRect.width;
              const iconHeight = iconRect.height;
              const intersects =
                normalized.left < iconLeft + iconWidth &&
                normalized.left + normalized.width > iconLeft &&
                normalized.top < iconTop + iconHeight &&
                normalized.top + normalized.height > iconTop;
              if (intersects) selected.push(file._id);
            });
            setSelectedIds(selected);
          };

          const handleMouseUp = () => {
            selectionStartRef.current = null;
            setSelectionRect(null);
            if (!hasDraggedRef.current) setSelectedIds([]);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
          };

          window.addEventListener("mousemove", handleMouseMove);
          window.addEventListener("mouseup", handleMouseUp);
        }}
        onDrop={async (event) => {
          event.preventDefault();
          event.stopPropagation();

          setIsDragOver(false);

          if (
            event.dataTransfer.types.includes("application/x-desktop-file-id")
          ) {
            return;
          }

          if (event.dataTransfer.files.length === 0) return;

          const deskRect = containerRef.current?.getBoundingClientRect();
          const dropX = event.clientX - (deskRect?.left ?? 0);
          const dropY = event.clientY - (deskRect?.top ?? 0);

          const uploads: Array<DesktopFileUpload> = Array.from(
            event.dataTransfer.files,
          ).map((file, index) => ({
            file,
            position: {
              x: dropX + index * 80,
              y: dropY,
            },
          }));

          await uploadFiles(uploads);
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (
            event.dataTransfer.types.includes("application/x-desktop-file-id")
          ) {
            event.dataTransfer.dropEffect = "move";
            return;
          }
          setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!containerRef.current) {
            setIsDragOver(false);
            return;
          }
          const nextTarget = event.relatedTarget as Node | null;
          if (nextTarget && containerRef.current.contains(nextTarget)) return;
          const rect = containerRef.current.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right) {
            setIsDragOver(false);
            return;
          }
          if (event.clientY < rect.top || event.clientY > rect.bottom) {
            setIsDragOver(false);
            return;
          }
          setIsDragOver(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (
            event.dataTransfer.types.includes("application/x-desktop-file-id")
          ) {
            event.dataTransfer.dropEffect = "move";
            return;
          }
          event.dataTransfer.dropEffect = "copy";
        }}
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
        {files.map((file) => (
          <DesktopFileIcon
            key={file._id}
            file={file}
            containerRef={containerRef}
            isSelected={selectedIds.includes(file._id)}
            registerNode={(element) => {
              if (!element) {
                iconNodesRef.current.delete(file._id);
                return;
              }
              iconNodesRef.current.set(file._id, { element, file });
            }}
            onMouseDown={(event) => {
              if (!event.shiftKey) {
                setSelectedIds([file._id]);
                return;
              }
              setSelectedIds((current) => {
                if (current.includes(file._id)) return current;
                return [...current, file._id];
              });
            }}
            onOpen={openFile}
          />
        ))}
        {isDragOver ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px dashed rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.1)",
            }}
          />
        ) : null}
        {selectionRect ? (
          <div
            style={{
              position: "absolute",
              left: `${selectionRect.left}px`,
              top: `${selectionRect.top}px`,
              width: `${selectionRect.width}px`,
              height: `${selectionRect.height}px`,
              border: "1px solid rgba(96, 165, 250, 0.9)",
              background: "rgba(59, 130, 246, 0.3)",
            }}
          />
        ) : null}
      </div>
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Delete Files"
        message={`Are you sure you want to delete ${selectedIds.length} item${selectedIds.length === 1 ? "" : "s"}?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onCancel={() => {
          setIsConfirmOpen(false);
        }}
        onConfirm={async () => {
          await deleteFiles({ fileIds: selectedIds })
            .then(() => setSelectedIds([]))
            .catch(onError)
            .finally(() => setIsConfirmOpen(false));
        }}
      />
    </>
  );
}
