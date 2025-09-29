import React from "react";
import { useWindow } from "./WindowContext.tsx";

export function WindowControls() {
  const {
    showCloseButton,
    showMaximizeButton,
    isMaximized,
    onClose,
    onMinimize,
    toggleMaximize,
    showMinimiseButton,
  } = useWindow();
  return (
    <div className="title-bar-controls" style={{ display: "flex" }}>
      {showMinimiseButton && onMinimize ? (
        <button
          className="minimise"
          aria-label="Minimize"
          onClick={(event) => {
            event.stopPropagation();
            onMinimize();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        ></button>
      ) : null}
      {showMaximizeButton ? (
        <button
          className={isMaximized ? "restore" : "maximise"}
          aria-label={isMaximized ? "Restore" : "Maximize"}
          onClick={(event) => {
            event.stopPropagation();
            toggleMaximize();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        ></button>
      ) : null}
      {showCloseButton && onClose ? (
        <button
          aria-label="Close"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        ></button>
      ) : null}
    </div>
  );
}
