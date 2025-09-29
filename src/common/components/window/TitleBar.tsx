import React from "react";
import { WindowControls } from "./WindowControls";

type TitleBarProps = {
  title: string;
  draggable: boolean;
  handleMouseDown: (event: React.MouseEvent) => void;
  titleBarStyle?: React.CSSProperties;
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
  isMaximized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  toggleMaximize: () => void;
};

export function TitleBar({
  title,
  draggable,
  handleMouseDown,
  titleBarStyle,
  showCloseButton,
  showMaximizeButton,
  isMaximized,
  onClose,
  onMinimize,
  toggleMaximize,
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
    >
      <div className="title-bar-text" style={{ flex: 1 }}>
        {title}
      </div>
      <WindowControls
        showCloseButton={showCloseButton}
        showMaximizeButton={showMaximizeButton}
        isMaximized={isMaximized}
        onClose={onClose}
        onMinimize={onMinimize}
        toggleMaximize={toggleMaximize}
      />
    </div>
  );
}
