import React from "react";
import { WindowControls } from "./WindowControls";

interface TitleBarProps {
  title: string;
  icon?: string;
  draggable: boolean;
  handleMouseDown: (event: React.MouseEvent) => void;
  titleBarStyle?: React.CSSProperties;
  onToggleMaximize?: () => void;
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
  showMinimiseButton?: boolean;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
}

export function TitleBar({
  title,
  icon,
  draggable,
  handleMouseDown,
  titleBarStyle,
  onToggleMaximize,
  showCloseButton,
  showMaximizeButton,
  showMinimiseButton,
  isMaximized,
  onClose,
  onMinimize,
}: TitleBarProps) {
  return (
    <div
      className="title-bar"
      style={{
        userSelect: "none",
        cursor: draggable ? "move" : "default",
        ...titleBarStyle,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onToggleMaximize}
    >
      <div
        className="title-bar-text"
        style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px" }}
      >
        {icon && (
          <img
            src={icon}
            alt=""
            style={{ width: "16px", height: "16px", flexShrink: 0 }}
          />
        )}
        <span>{title}</span>
      </div>
      <WindowControls
        showCloseButton={showCloseButton}
        showMaximizeButton={showMaximizeButton}
        showMinimiseButton={showMinimiseButton}
        isMaximized={isMaximized}
        onClose={onClose}
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
      />
    </div>
  );
}
