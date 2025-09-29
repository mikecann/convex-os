import React from "react";
import { useWindow } from "./WindowContext";

const handleStyle: React.CSSProperties = {
  position: "absolute",
  width: "12px",
  height: "12px",
  background: "transparent",
};

export function ResizeHandles() {
  const { startResize, resizable, isMaximized } = useWindow();

  if (!resizable || isMaximized) return null;

  return (
    <>
      <div
        onMouseDown={(event) => startResize("bottom-right", event)}
        style={{
          ...handleStyle,
          right: "0",
          bottom: "0",
          cursor: "nwse-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("bottom-left", event)}
        style={{
          ...handleStyle,
          left: "0",
          bottom: "0",
          cursor: "nesw-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("top-right", event)}
        style={{
          ...handleStyle,
          right: "0",
          top: "0",
          cursor: "nesw-resize",
        }}
      />
      <div
        onMouseDown={(event) => startResize("top-left", event)}
        style={{
          ...handleStyle,
          left: "0",
          top: "0",
          cursor: "nwse-resize",
        }}
      />
    </>
  );
}
