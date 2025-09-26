import React, { useState, useEffect, useRef, useLayoutEffect } from "react";

interface WindowProps {
  title?: string;
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
  minWidth?: number;
  minHeight?: number;
  onFocus?: () => void;
}

export function Window({
  title,
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
  showMaximizeButton = resizable,
  minWidth = 240,
  minHeight = 180,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(!draggable);
  const [size, setSize] = useState<{
    width: number | null;
    height: number | null;
  }>({ width: null, height: null });
  const [isResizing, setIsResizing] = useState(false);
  const resizeOriginRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
    corner: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  } | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const previousStateRef = useRef<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);

  useEffect(() => {
    if (!draggable) setIsInitialized(true);
  }, [draggable]);

  useLayoutEffect(() => {
    if (!draggable || isInitialized) return;
    if (!windowRef.current) return;

    const windowRect = windowRef.current.getBoundingClientRect();
    const centerX = (window.innerWidth - windowRect.width) / 2;
    const centerY = (window.innerHeight - windowRect.height) / 2;

    setPosition({ x: centerX, y: centerY });
    setIsInitialized(true);
  }, [draggable, isInitialized]);

  useEffect(() => {
    if (!draggable) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggable, isDragging, dragOffset]);

  const handleMouseDown = (event: React.MouseEvent) => {
    onFocus?.();
    if (!draggable || !windowRef.current || isMaximized) return;
    const windowRect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: event.clientX - windowRect.left,
      y: event.clientY - windowRect.top,
    });
    setIsDragging(true);
    event.preventDefault();
  };

  useLayoutEffect(() => {
    if (!resizable) return;
    if (!isInitialized) return;
    if (!windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    setSize((current) => ({
      width: current.width ?? rect.width,
      height: current.height ?? rect.height,
    }));
  }, [resizable, isInitialized]);

  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (event: MouseEvent) => {
      const origin = resizeOriginRef.current;
      if (!origin) return;

      const deltaX = event.clientX - origin.startX;
      const deltaY = event.clientY - origin.startY;

      let newWidth = origin.startWidth;
      let newHeight = origin.startHeight;
      let newLeft = origin.startLeft;
      let newTop = origin.startTop;

      switch (origin.corner) {
        case "bottom-right": {
          newWidth = origin.startWidth + deltaX;
          newHeight = origin.startHeight + deltaY;
          break;
        }
        case "bottom-left": {
          newWidth = origin.startWidth - deltaX;
          newLeft = origin.startLeft + deltaX;
          newHeight = origin.startHeight + deltaY;
          break;
        }
        case "top-right": {
          newWidth = origin.startWidth + deltaX;
          newHeight = origin.startHeight - deltaY;
          newTop = origin.startTop + deltaY;
          break;
        }
        case "top-left": {
          newWidth = origin.startWidth - deltaX;
          newLeft = origin.startLeft + deltaX;
          newHeight = origin.startHeight - deltaY;
          newTop = origin.startTop + deltaY;
          break;
        }
        default:
          break;
      }

      const clampedWidth = Math.max(minWidth, newWidth);
      const clampedHeight = Math.max(minHeight, newHeight);

      if (
        clampedWidth !== newWidth &&
        (origin.corner === "top-left" || origin.corner === "bottom-left")
      ) {
        newLeft = origin.startLeft + (origin.startWidth - clampedWidth);
      }
      if (
        clampedHeight !== newHeight &&
        (origin.corner === "top-left" || origin.corner === "top-right")
      ) {
        newTop = origin.startTop + (origin.startHeight - clampedHeight);
      }

      setSize({ width: clampedWidth, height: clampedHeight });
      setPosition({ x: newLeft, y: newTop });
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      resizeOriginRef.current = null;
    };

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeUp);

    return () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeUp);
    };
  }, [isResizing, minWidth, minHeight]);

  useEffect(() => {
    if (!isMaximized) return;

    const handleWindowResize = () => {
      if (!windowRef.current) {
        setSize({ width: window.innerWidth, height: window.innerHeight });
        setPosition({ x: 0, y: 0 });
        return;
      }

      const parentRect =
        windowRef.current.parentElement?.getBoundingClientRect();
      const availableWidth = parentRect?.width ?? window.innerWidth;
      const availableHeight = parentRect?.height ?? window.innerHeight;
      setSize({ width: availableWidth, height: availableHeight });
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [isMaximized]);

  const startResize = (
    corner: "bottom-right" | "bottom-left" | "top-right" | "top-left",
    event: React.MouseEvent,
  ) => {
    if (!resizable || isMaximized) return;
    if (!windowRef.current) return;

    event.preventDefault();
    event.stopPropagation();

    const rect = windowRef.current.getBoundingClientRect();
    resizeOriginRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: rect.left,
      startTop: rect.top,
      corner,
    };
    setIsResizing(true);
  };

  const toggleMaximize = () => {
    if (!resizable) return;
    if (!windowRef.current) return;

    if (!isMaximized) {
      const rect = windowRef.current.getBoundingClientRect();
      const parentRect =
        windowRef.current.parentElement?.getBoundingClientRect();
      const availableWidth = parentRect?.width ?? window.innerWidth;
      const availableHeight = parentRect?.height ?? window.innerHeight;
      previousStateRef.current = {
        position,
        size: {
          width: size.width ?? rect.width,
          height: size.height ?? rect.height,
        },
      };
      setSize({ width: availableWidth, height: availableHeight });
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
      setIsDragging(false);
      setIsResizing(false);
    } else {
      const previous = previousStateRef.current;
      if (previous) {
        setSize(previous.size);
        setPosition(previous.position);
      }
      setIsMaximized(false);
      previousStateRef.current = null;
    }
  };

  const windowStyle: React.CSSProperties = (() => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: position.x,
      top: position.y,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      ...(style || {}),
    };

    if (size.width !== null) baseStyle.width = `${size.width}px`;
    if (baseStyle.width === undefined && style?.width)
      baseStyle.width = style.width;
    if (size.height !== null) baseStyle.height = `${size.height}px`;
    if (baseStyle.height === undefined && style?.height)
      baseStyle.height = style.height;

    if (!isInitialized) baseStyle.visibility = "hidden";

    return baseStyle;
  })();

  return (
    <div
      ref={windowRef}
      className={`window ${className}`}
      style={{ ...windowStyle }}
      onMouseDown={() => {
        onFocus?.();
      }}
    >
      {title && (
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
          {(showCloseButton || showMaximizeButton) && (
            <div className="title-bar-controls" style={{ display: "flex" }}>
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
          )}
        </div>
      )}
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
      {resizable && !isMaximized ? (
        <>
          <div
            onMouseDown={(event) => {
              startResize("bottom-right", event);
            }}
            style={{
              position: "absolute",
              width: "12px",
              height: "12px",
              right: "0",
              bottom: "0",
              cursor: "nwse-resize",
              background: "transparent",
            }}
          />
          <div
            onMouseDown={(event) => {
              startResize("bottom-left", event);
            }}
            style={{
              position: "absolute",
              width: "12px",
              height: "12px",
              left: "0",
              bottom: "0",
              cursor: "nesw-resize",
              background: "transparent",
            }}
          />
          <div
            onMouseDown={(event) => {
              startResize("top-right", event);
            }}
            style={{
              position: "absolute",
              width: "12px",
              height: "12px",
              right: "0",
              top: "0",
              cursor: "nesw-resize",
              background: "transparent",
            }}
          />
          <div
            onMouseDown={(event) => {
              startResize("top-left", event);
            }}
            style={{
              position: "absolute",
              width: "12px",
              height: "12px",
              left: "0",
              top: "0",
              cursor: "nwse-resize",
              background: "transparent",
            }}
          />
        </>
      ) : null}
    </div>
  );
}
