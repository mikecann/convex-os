import React, { useState, useEffect, useRef } from "react";

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
}: WindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Center the window initially
  useEffect(() => {
    if (!draggable || isInitialized) return;

    const centerWindow = () => {
      if (windowRef.current) {
        const windowRect = windowRef.current.getBoundingClientRect();
        const centerX = (window.innerWidth - windowRect.width) / 2;
        const centerY = (window.innerHeight - windowRect.height) / 2;

        setPosition({ x: centerX, y: centerY });
        setIsInitialized(true);
      }
    };

    // Small delay to ensure the window is rendered
    const timer = setTimeout(centerWindow, 0);
    return () => clearTimeout(timer);
  }, [draggable, isInitialized]);

  // Handle mouse move and mouse up events
  useEffect(() => {
    if (!draggable) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setPosition({ x: newX, y: newY });
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
  }, [isDragging, dragOffset, draggable]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || !windowRef.current) return;

    const windowRect = windowRef.current.getBoundingClientRect();
    const offsetX = e.clientX - windowRect.left;
    const offsetY = e.clientY - windowRect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    e.preventDefault();
  };

  const windowStyle: React.CSSProperties = draggable
    ? {
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 1000,
        ...(style || {}),
      }
    : style || {};

  return (
    <div
      ref={windowRef}
      className={`window ${className}`}
      style={{ ...windowStyle }}
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
          <div className="title-bar-text">{title}</div>
          {showCloseButton && onClose && (
            <div className="title-bar-controls">
              <button
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                onMouseDown={(e) => e.stopPropagation()}
              ></button>
            </div>
          )}
        </div>
      )}
      <div className="window-body" style={bodyStyle}>
        {children}
      </div>
      {statusBar && <div className="status-bar">{statusBar}</div>}
    </div>
  );
}
