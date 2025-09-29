import React from "react";

type WindowControlsProps = {
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  toggleMaximize: () => void;
};

export function WindowControls({
  showCloseButton,
  showMaximizeButton,
  isMaximized,
  onClose,
  onMinimize,
  toggleMaximize,
}: WindowControlsProps) {
  return (
    <div className="title-bar-controls" style={{ display: "flex" }}>
      {onMinimize ? (
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
