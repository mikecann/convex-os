import React from "react";
import { ResizeCorner } from "./Window";

const handleStyle: React.CSSProperties = {
  position: "absolute",
  background: "transparent",
};

const cornerHandleStyle: React.CSSProperties = {
  ...handleStyle,
  width: "12px",
  height: "12px",
};

const edgeHandleStyle: React.CSSProperties = {
  ...handleStyle,
};

interface ResizeHandlesProps {
  startResize: (corner: ResizeCorner, event: React.MouseEvent) => void;
  resizable?: boolean;
  isMaximized?: boolean;
}

export function ResizeHandles({
  startResize,
  resizable,
  isMaximized,
}: ResizeHandlesProps) {
  if (!resizable || isMaximized) return null;

  return (
    <>
      {/* Edges */}
      <div
        onMouseDown={(event) => startResize("top", event)}
        style={{
          ...edgeHandleStyle,
          top: 0,
          left: "6px",
          right: "6px",
          height: "8px",
          cursor: "ns-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("bottom", event)}
        style={{
          ...edgeHandleStyle,
          bottom: 0,
          left: "6px",
          right: "6px",
          height: "8px",
          cursor: "ns-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("left", event)}
        style={{
          ...edgeHandleStyle,
          left: 0,
          top: "6px",
          bottom: "6px",
          width: "8px",
          cursor: "ew-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("right", event)}
        style={{
          ...edgeHandleStyle,
          right: 0,
          top: "6px",
          bottom: "6px",
          width: "8px",
          cursor: "ew-resize",
        }}
      />
      {/* Corners */}
      <div
        onMouseDown={(event) => startResize("bottom-right", event)}
        style={{
          ...cornerHandleStyle,
          right: "0",
          bottom: "0",
          cursor: "nwse-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("bottom-left", event)}
        style={{
          ...cornerHandleStyle,
          left: "0",
          bottom: "0",
          cursor: "nesw-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("top-right", event)}
        style={{
          ...cornerHandleStyle,
          right: "0",
          top: "0",
          cursor: "nesw-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("top-left", event)}
        style={{
          ...cornerHandleStyle,
          left: "0",
          top: "0",
          cursor: "nwse-resize",
        }}
      />
    </>
  );
}
