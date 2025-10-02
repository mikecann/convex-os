import React from "react";
import { playSound } from "../../../common/sounds/soundEffects";

interface WindowControlsProps {
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
  showMinimiseButton?: boolean;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
}

export function WindowControls({
  showCloseButton,
  showMaximizeButton,
  showMinimiseButton,
  isMaximized,
  onClose,
  onMinimize,
  onToggleMaximize,
}: WindowControlsProps) {
  return (
    <div className="title-bar-controls" style={{ display: "flex" }}>
      {showMinimiseButton && onMinimize ? (
        <button
          className="minimise"
          aria-label="Minimize"
          onClick={(event) => {
            event.stopPropagation();
            playSound("minimize", 0.3);
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
            onToggleMaximize?.();
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
