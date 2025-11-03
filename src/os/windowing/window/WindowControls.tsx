import React from "react";
import { playSound } from "../../../common/sounds/soundEffects";
import { Button } from "../../../common/components/Button";

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
        <Button
          className="minimise"
          aria-label="Minimize"
          onClick={(event) => {
            event.stopPropagation();
            playSound("minimize", 0.3);
            onMinimize();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        />
      ) : null}
      {showMaximizeButton ? (
        <Button
          className={isMaximized ? "restore" : "maximise"}
          aria-label={isMaximized ? "Restore" : "Maximize"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleMaximize?.();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        />
      ) : null}
      {showCloseButton && onClose ? (
        <Button
          aria-label="Close"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        />
      ) : null}
    </div>
  );
}
