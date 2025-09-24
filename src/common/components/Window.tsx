import React from "react";

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  statusBar?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  titleBarStyle?: React.CSSProperties;
}

export function Window({
  title,
  children,
  className = "",
  style,
  statusBar,
  bodyStyle,
  titleBarStyle,
}: WindowProps) {
  return (
    <div className={`window ${className}`} style={style}>
      {title && (
        <div
          className="title-bar"
          style={{ userSelect: "none", ...titleBarStyle }}
        >
          <div className="title-bar-text">{title}</div>
        </div>
      )}
      <div className="window-body" style={bodyStyle}>
        {children}
      </div>
      {statusBar && <div className="status-bar">{statusBar}</div>}
    </div>
  );
}
