import {
  CSSProperties,
  RefObject,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useErrorHandler } from "../../common/errors/useErrorHandler";

export type DesktopFileDoc = Doc<"files">;

type DesktopFileIconProps = {
  file: DesktopFileDoc;
  onOpen?: (file: DesktopFileDoc) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  registerNode: (element: HTMLDivElement | null) => void;
  isSelected: boolean;
  onMouseDown: (event: ReactMouseEvent<HTMLDivElement>) => void;
};

export function DesktopFileIcon({
  file,
  onOpen,
  containerRef,
  registerNode,
  isSelected,
  onMouseDown,
}: DesktopFileIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const updatePosition = useMutation(api.files.updateDesktopFilePosition);
  const handleError = useErrorHandler();
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const style: CSSProperties = {
    position: "absolute",
    left: `${file.position.x}px`,
    top: `${file.position.y}px`,
    minWidth: "70px",
    minHeight: "82px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    cursor: isDragging ? "grabbing" : "pointer",
    userSelect: "none",
    textAlign: "center",
    color: "white",
    textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
    borderRadius: "8px",
    padding: "6px",
    border: isSelected
      ? "1px solid rgba(255,255,255,0.8)"
      : "1px solid transparent",
    backgroundColor: isSelected ? "rgba(59,130,246,0.35)" : "rgba(0,0,0,0.05)",
  };

  return (
    <div
      ref={registerNode}
      draggable
      onMouseDown={(event) => {
        event.stopPropagation();
        if (event.button !== 0) return;
        onMouseDown(event);
      }}
      onDragStart={(event) => {
        setIsDragging(true);
        const rect = containerRef.current?.getBoundingClientRect();
        const containerLeft = rect?.left ?? 0;
        const containerTop = rect?.top ?? 0;
        dragOffsetRef.current = {
          x: event.clientX - (containerLeft + file.position.x),
          y: event.clientY - (containerTop + file.position.y),
        };
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-desktop-file-id", file._id);
      }}
      onDragEnd={async (event) => {
        setIsDragging(false);
        const rect = containerRef.current?.getBoundingClientRect();
        const containerLeft = rect?.left ?? 0;
        const containerTop = rect?.top ?? 0;
        const newX = event.clientX - containerLeft - dragOffsetRef.current.x;
        const newY = event.clientY - containerTop - dragOffsetRef.current.y;

        if (Number.isNaN(newX) || Number.isNaN(newY)) return;

        try {
          await updatePosition({
            fileId: file._id,
            position: { x: newX, y: newY },
          });
        } catch (error) {
          handleError(error);
        }
      }}
      onDoubleClick={() => {
        if (onOpen) onOpen(file);
      }}
      style={style}
    >
      <img
        src="/xp/doc.png"
        alt={file.name}
        style={{ width: "48px", height: "48px" }}
      />
      <span style={{ fontSize: "12px", lineHeight: "1.2" }}>{file.name}</span>
      {file.uploadState.kind === "uploading" ? (
        <span style={{ fontSize: "10px" }}>{file.uploadState.progress}%</span>
      ) : null}
      {file.uploadState.kind === "errored" ? (
        <span style={{ fontSize: "10px", color: "#ffb4b4" }}>
          {file.uploadState.message}
        </span>
      ) : null}
    </div>
  );
}
