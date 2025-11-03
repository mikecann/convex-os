import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { TitleBar } from "./TitleBar";
import { ResizeHandles } from "./ResizeHandles";
import { WindowViewState } from "../../../../convex/windows/schema";
import { useOS } from "../../OperatingSystem";
import { useDragging } from "./useDragging";
import { useResizing } from "./useResizing";
import { useWindowStyle } from "./useWindowStyle";

export type ResizeCorner =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface WindowProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  statusBar?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  titleBarStyle?: React.CSSProperties;
  draggable?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  resizable?: boolean;
  showMaximizeButton?: boolean;
  showMinimiseButton?: boolean;
  onFocus?: () => void;
  onMinimize?: () => void;
  onToggleMaximize?: () => void;
  viewState: WindowViewState;
  getTaskbarButtonRect?: () => DOMRect | null | undefined;
  x: number;
  y: number;
  width: number;
  height: number;
  onGeometryChange?: (geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

export function Window({
  title,
  icon,
  children,
  className = "",
  style,
  statusBar,
  bodyStyle,
  titleBarStyle,
  draggable = true,
  onClose,
  showCloseButton = false,
  resizable = false,
  showMaximizeButton = false,
  showMinimiseButton = true,
  onFocus,
  onMinimize,
  onToggleMaximize,
  viewState,
  getTaskbarButtonRect,
  x,
  y,
  width,
  height,
  onGeometryChange,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const currentPositionRef = useRef({ x, y });
  const currentSizeRef = useRef({ width, height });

  const resizeOriginRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
    corner: ResizeCorner;
  } | null>(null);

  const { desktopRect } = useOS();

  // Sync props to refs
  useEffect(() => {
    currentPositionRef.current = { x, y };
    currentSizeRef.current = { width, height };
  }, [x, y, width, height]);

  useDragging({
    isDragging,
    dragOffset,
    windowRef,
    currentPositionRef,
    currentSizeRef,
    onGeometryChange,
    setIsDragging,
  });

  useResizing({
    isResizing,
    windowRef,
    resizeOriginRef,
    currentPositionRef,
    currentSizeRef,
    desktopRect,
    onGeometryChange,
    setIsResizing,
  });

  useLayoutEffect(() => {
    if (!windowRef.current) return;
    let newTransformOrigin = "center bottom";
    const taskbarButtonRect = getTaskbarButtonRect?.();
    if (taskbarButtonRect) {
      const originX = taskbarButtonRect.left - x + taskbarButtonRect.width / 2;
      const originY = taskbarButtonRect.top - y + taskbarButtonRect.height / 2;
      newTransformOrigin = `${originX}px ${originY}px`;
    }
    windowRef.current.style.transformOrigin = newTransformOrigin;
  }, [x, y, getTaskbarButtonRect]);

  const windowStyle = useWindowStyle({
    x,
    y,
    width,
    height,
    viewState,
    desktopRect,
    style,
    isDragging,
    isResizing,
  });

  return (
    <div
      ref={windowRef}
      className={`window ${className}`}
      style={windowStyle}
      onMouseDown={() => {
        onFocus?.();
      }}
    >
      <TitleBar
        title={title}
        icon={icon}
        draggable={draggable}
        handleMouseDown={(event: React.MouseEvent) => {
          onFocus?.();
          if (!draggable) return;
          event.preventDefault();

          const rect = event.currentTarget.getBoundingClientRect();
          setDragOffset({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
          setIsDragging(true);
        }}
        titleBarStyle={titleBarStyle}
        onToggleMaximize={onToggleMaximize}
        showCloseButton={showCloseButton}
        showMaximizeButton={showMaximizeButton}
        showMinimiseButton={showMinimiseButton}
        isMaximized={viewState.kind == "maximized"}
        onClose={onClose}
        onMinimize={onMinimize}
      />
      <div
        className="window-body"
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pointerEvents: isResizing || isDragging ? "none" : "auto",
          ...bodyStyle,
        }}
      >
        {children}
      </div>
      {statusBar && <div className="status-bar">{statusBar}</div>}
      <ResizeHandles
        startResize={(corner: ResizeCorner, event: React.MouseEvent) => {
          if (!resizable || viewState.kind == "maximized") return;
          event.preventDefault();
          event.stopPropagation();

          resizeOriginRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startWidth: width,
            startHeight: height,
            startLeft: x,
            startTop: y,
            corner,
          };
          setIsResizing(true);
        }}
        resizable={resizable}
        isMaximized={viewState.kind == "maximized"}
      />
    </div>
  );
}
