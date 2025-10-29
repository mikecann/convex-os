import { useState, useRef } from "react";

type DropZoneProps = {
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void | Promise<void>;
  shouldAcceptDrag?: (event: React.DragEvent<HTMLDivElement>) => boolean;
  getDropEffect?: (
    event: React.DragEvent<HTMLDivElement>,
  ) => "copy" | "move" | "link" | "none";
  dropMessage?: string;
  showOverlay?: boolean;
  children: React.ReactNode;
};

export function DropZone({
  onDrop,
  shouldAcceptDrag,
  getDropEffect,
  dropMessage,
  showOverlay = true,
  children,
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      onDragEnter={(event) => {
        if (shouldAcceptDrag && !shouldAcceptDrag(event)) return;
        event.preventDefault();
        event.stopPropagation();
        if (getDropEffect) event.dataTransfer.dropEffect = getDropEffect(event);
        setIsDragOver(true);
      }}
      onDragOver={(event) => {
        if (shouldAcceptDrag && !shouldAcceptDrag(event)) return;
        event.preventDefault();
        event.stopPropagation();
        if (getDropEffect) event.dataTransfer.dropEffect = getDropEffect(event);
      }}
      onDragLeave={(event) => {
        event.stopPropagation();
        if (!containerRef.current) {
          setIsDragOver(false);
          return;
        }
        const nextTarget = event.relatedTarget as Node | null;
        if (nextTarget && containerRef.current.contains(nextTarget)) return;
        setIsDragOver(false);
      }}
      onDrop={async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
        await onDrop(event);
      }}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {children}
      {showOverlay && isDragOver && dropMessage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            border: "2px dashed rgba(59, 130, 246, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {dropMessage}
          </p>
        </div>
      )}
    </div>
  );
}
