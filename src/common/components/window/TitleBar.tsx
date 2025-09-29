import React from "react";
import { WindowControls } from "./WindowControls";
import { useWindow } from "./WindowContext";

export function TitleBar() {
  const { title, draggable, handleMouseDown, titleBarStyle, toggleMaximize } =
    useWindow();
  return (
    <div
      className="title-bar"
      style={{
        userSelect: "none",
        cursor: draggable ? "move" : "default",
        ...titleBarStyle,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={toggleMaximize}
    >
      <div className="title-bar-text" style={{ flex: 1 }}>
        {title}
      </div>
      <WindowControls />
    </div>
  );
}
