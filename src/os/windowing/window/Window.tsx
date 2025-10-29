import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { TitleBar } from "./TitleBar";
import { ResizeHandles } from "./ResizeHandles";
import { WindowViewState } from "../../../../convex/windows/schema";
import { useOS } from "../../OperatingSystem";
import { iife } from "../../../../shared/misc";

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

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!windowRef.current) return;

      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;

      // Update DOM directly (no re-render)
      currentPositionRef.current = { x: newX, y: newY };
      windowRef.current.style.left = `${newX}px`;
      windowRef.current.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Notify parent of final position
      onGeometryChange?.({
        x: currentPositionRef.current.x,
        y: currentPositionRef.current.y,
        width: currentSizeRef.current.width,
        height: currentSizeRef.current.height,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, onGeometryChange]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (event: MouseEvent) => {
      const origin = resizeOriginRef.current;
      if (!origin || !windowRef.current) return;

      const deltaX = event.clientX - origin.startX;
      const deltaY = event.clientY - origin.startY;

      let newWidth = origin.startWidth;
      let newHeight = origin.startHeight;
      let newLeft = origin.startLeft;
      let newTop = origin.startTop;

      if (origin.corner === "bottom-right") {
        newWidth = origin.startWidth + deltaX;
        newHeight = origin.startHeight + deltaY;
      } else if (origin.corner === "bottom-left") {
        newWidth = origin.startWidth - deltaX;
        newLeft = origin.startLeft + deltaX;
        newHeight = origin.startHeight + deltaY;
      } else if (origin.corner === "top-right") {
        newWidth = origin.startWidth + deltaX;
        newHeight = origin.startHeight - deltaY;
        newTop = origin.startTop + deltaY;
      } else if (origin.corner === "top-left") {
        newWidth = origin.startWidth - deltaX;
        newLeft = origin.startLeft + deltaX;
        newHeight = origin.startHeight - deltaY;
        newTop = origin.startTop + deltaY;
      } else if (origin.corner === "top") {
        newHeight = origin.startHeight - deltaY;
        newTop = origin.startTop + deltaY;
      } else if (origin.corner === "bottom") {
        newHeight = origin.startHeight + deltaY;
      } else if (origin.corner === "left") {
        newWidth = origin.startWidth - deltaX;
        newLeft = origin.startLeft + deltaX;
      } else if (origin.corner === "right") {
        newWidth = origin.startWidth + deltaX;
      }

      // Apply desktop bounds
      if (desktopRect) {
        if (newLeft < 0) {
          newWidth += newLeft;
          newLeft = 0;
        }
        if (newTop < 0) {
          newHeight += newTop;
          newTop = 0;
        }
        if (newLeft + newWidth > desktopRect.width)
          newWidth = desktopRect.width - newLeft;

        if (newTop + newHeight > desktopRect.height)
          newHeight = desktopRect.height - newTop;
      }

      // Update DOM directly (no re-render)
      currentSizeRef.current = { width: newWidth, height: newHeight };
      currentPositionRef.current = { x: newLeft, y: newTop };
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
      windowRef.current.style.left = `${newLeft}px`;
      windowRef.current.style.top = `${newTop}px`;
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      resizeOriginRef.current = null;
      // Notify parent of final geometry
      onGeometryChange?.({
        x: currentPositionRef.current.x,
        y: currentPositionRef.current.y,
        width: currentSizeRef.current.width,
        height: currentSizeRef.current.height,
      });
    };

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeUp);

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeUp);
    };
  }, [isResizing, desktopRect, onGeometryChange]);

  const handleMouseDown = (event: React.MouseEvent) => {
    onFocus?.();
    if (!draggable) return;
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleResizeStart = (corner: ResizeCorner, event: React.MouseEvent) => {
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
  };

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
  }, [x, y]);

  return (
    <div
      ref={windowRef}
      className={`window ${className}`}
      style={iife(() => {
        const baseStyle: React.CSSProperties = {
          position: "absolute",
          left: viewState.kind == "maximized" ? 0 : x,
          top: viewState.kind == "maximized" ? 0 : y,
          width:
            viewState.kind == "maximized" && desktopRect
              ? desktopRect.width
              : width,
          height:
            viewState.kind == "maximized" && desktopRect
              ? desktopRect.height
              : height,
          zIndex: iife(() => {
            if (viewState.kind == "maximized") return 9999;
            if (viewState.kind == "open")
              return 1000 + viewState.viewStackOrder;
          }),
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          ...(style || {}),
        };

        if (viewState.kind == "minimized") {
          baseStyle.transform = "scale(0)";
          baseStyle.opacity = 0;
          baseStyle.pointerEvents = "none";
        }

        baseStyle.filter = iife(() => {
          if (viewState.kind == "open" && viewState.isActive) return true;
          if (viewState.kind == "maximized") return true;
          return false;
        })
          ? "none"
          : "grayscale(100%)";

        return baseStyle;
      })}
      onMouseDown={() => {
        onFocus?.();
      }}
    >
      <TitleBar
        title={title}
        icon={icon}
        draggable={draggable}
        handleMouseDown={handleMouseDown}
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
          ...bodyStyle,
        }}
      >
        {children}
      </div>
      {statusBar && <div className="status-bar">{statusBar}</div>}
      <ResizeHandles
        startResize={handleResizeStart}
        resizable={resizable}
        isMaximized={viewState.kind == "maximized"}
      />
    </div>
  );
}
