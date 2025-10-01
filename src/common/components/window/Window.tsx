import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
  CSSProperties,
} from "react";
import { WindowContext } from "./WindowContext";
import { TitleBar } from "./TitleBar";
import { ResizeHandles } from "./ResizeHandles";
import { iife } from "../../../../shared/misc";
import { useOS } from "../../../os/OperatingSystem";

interface WindowProps {
  title: string;
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
  minWidth?: number;
  minHeight?: number;
  onFocus?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  taskbarButtonRect?: DOMRect;
  isActive: boolean;
}

export function Window({
  title: initialTitle,
  children,
  className = "",
  style: initialStyle,
  statusBar,
  bodyStyle: initialBodyStyle,
  titleBarStyle,
  draggable = true,
  onClose,
  showCloseButton: initialShowCloseButton,
  resizable: initialResizable,
  showMaximizeButton: initialShowMaximizeButton,
  showMinimiseButton: initialShowMinimiseButton,
  minWidth = 240,
  minHeight = 180,
  onFocus,
  onMinimize,
  isMinimized = false,
  taskbarButtonRect,
  isActive,
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
    corner:
      | "bottom-right"
      | "bottom-left"
      | "top-right"
      | "top-left"
      | "top"
      | "bottom"
      | "left"
      | "right";
  } | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [style, setStyle] = useState<CSSProperties | undefined>(initialStyle);
  const [bodyStyle, setBodyStyle] = useState<CSSProperties | undefined>(
    initialBodyStyle,
  );
  const [resizable, setResizable] = useState(initialResizable ?? false);
  const [showCloseButton, setShowCloseButton] = useState(
    initialShowCloseButton ?? false,
  );
  const [showMaximizeButton, setShowMaximizeButton] = useState(
    initialShowMaximizeButton ?? initialResizable ?? false,
  );
  const [showMinimiseButton, setShowMinimiseButton] = useState(
    initialShowMinimiseButton ?? true,
  );
  const { desktopRect } = useOS();
  const previousStateRef = useRef<{
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null>(null);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (!desktopRect || !windowRef.current) return;

    const windowRect = windowRef.current.getBoundingClientRect();
    let needsUpdate = false;
    let newWidth = windowRect.width;
    let newHeight = windowRect.height;
    let newX = position.x;
    let newY = position.y;

    if (newWidth > desktopRect.width) {
      needsUpdate = true;
      newWidth = desktopRect.width;
    }
    if (newHeight > desktopRect.height) {
      needsUpdate = true;
      newHeight = desktopRect.height;
    }
    if (newX + newWidth > desktopRect.width) {
      needsUpdate = true;
      newX = desktopRect.width - newWidth;
    }
    if (newY + newHeight > desktopRect.height) {
      needsUpdate = true;
      newY = desktopRect.height - newHeight;
    }
    if (newX < 0) {
      needsUpdate = true;
      newX = 0;
    }
    if (newY < 0) {
      needsUpdate = true;
      newY = 0;
    }

    if (needsUpdate) {
      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  }, [desktopRect, size]);

  useLayoutEffect(() => {
    if (!windowRef.current) return;
    let newTransformOrigin = "center bottom";
    if (taskbarButtonRect) {
      const windowLeft = position.x;
      const windowTop = position.y;

      const originX =
        taskbarButtonRect.left - windowLeft + taskbarButtonRect.width / 2;
      const originY =
        taskbarButtonRect.top - windowTop + taskbarButtonRect.height / 2;
      newTransformOrigin = `${originX}px ${originY}px`;
    }
    windowRef.current.style.transformOrigin = newTransformOrigin;
  }, [taskbarButtonRect, position]);

  useEffect(() => {
    if (!draggable) setIsInitialized(true);
  }, [draggable]);

  useLayoutEffect(() => {
    if (!draggable || isInitialized) return;
    if (!windowRef.current) return;
    if (!desktopRect) return;

    const windowRect = windowRef.current.getBoundingClientRect();
    const centerX = (desktopRect.width - windowRect.width) / 2;
    const centerY = (desktopRect.height - windowRect.height) / 2;

    setPosition({ x: centerX, y: centerY });
    setIsInitialized(true);
  }, [draggable, isInitialized, desktopRect]);

  useEffect(() => {
    if (!draggable) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      let x = event.clientX - dragOffset.x;
      let y = event.clientY - dragOffset.y;

      if (desktopRect && windowRef.current) {
        const windowWidth = windowRef.current.getBoundingClientRect().width;
        const windowHeight = windowRef.current.getBoundingClientRect().height;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x + windowWidth > desktopRect.width) {
          x = desktopRect.width - windowWidth;
        }
        if (y + windowHeight > desktopRect.height) {
          y = desktopRect.height - windowHeight;
        }
      }

      setPosition({
        x,
        y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      console.log("handleMouseUp", position);
      //onPositionChange?.({ x: position.x, y: position.y });
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggable, isDragging, dragOffset, desktopRect]);

  const handleMouseDown = (event: React.MouseEvent) => {
    onFocus?.();
    if (!draggable || !windowRef.current) return;

    event.preventDefault();

    if (isMaximized) {
      const previous = previousStateRef.current;
      if (!previous || previous.size.width === null) return;

      const restoredWidth = previous.size.width;
      const clientWidth = desktopRect?.width ?? window.innerWidth;
      const dragHandleWidth = restoredWidth * (event.clientX / clientWidth);

      setSize(previous.size);
      setPosition({ x: event.clientX - dragHandleWidth, y: 0 });
      setIsMaximized(false);
      previousStateRef.current = null;

      setDragOffset({
        x: dragHandleWidth,
        y: event.clientY,
      });
      setIsDragging(true);
    } else {
      const windowRect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: event.clientX - windowRect.left,
        y: event.clientY - windowRect.top,
      });
      setIsDragging(true);
    }
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
        case "top": {
          newHeight = origin.startHeight - deltaY;
          newTop = origin.startTop + deltaY;
          break;
        }
        case "bottom": {
          newHeight = origin.startHeight + deltaY;
          break;
        }
        case "left": {
          newWidth = origin.startWidth - deltaX;
          newLeft = origin.startLeft + deltaX;
          break;
        }
        case "right": {
          newWidth = origin.startWidth + deltaX;
          break;
        }
        default:
          break;
      }

      if (desktopRect) {
        if (newLeft < 0) {
          newWidth += newLeft; // newLeft is negative, so this reduces width
          newLeft = 0;
        }
        if (newTop < 0) {
          newHeight += newTop; // newTop is negative, so this reduces height
          newTop = 0;
        }
        if (newLeft + newWidth > desktopRect.width) {
          newWidth = desktopRect.width - newLeft;
        }
        if (newTop + newHeight > desktopRect.height) {
          newHeight = desktopRect.height - newTop;
        }
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
  }, [isResizing, minWidth, minHeight, desktopRect]);

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
    corner:
      | "bottom-right"
      | "bottom-left"
      | "top-right"
      | "top-left"
      | "top"
      | "bottom"
      | "left"
      | "right",
    event: React.MouseEvent,
  ) => {
    if (!resizable || isMaximized) return;
    if (!windowRef.current) return;
    if (!desktopRect) return;

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
      const parentRect = desktopRect;
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

  const contextValue = useMemo(
    () => ({
      isActive,
      title,
      setTitle,
      onClose: onClose ?? (() => {}),
      onMinimize: onMinimize ?? (() => {}),
      onFocus: onFocus ?? (() => {}),
      draggable,
      handleMouseDown,
      titleBarStyle,
      showCloseButton,
      showMaximizeButton,
      showMinimiseButton,
      isMaximized,
      toggleMaximize,
      resizable,
      startResize,
      setResizable,
      setShowCloseButton,
      setShowMaximizeButton,
      setShowMinimiseButton,
      setBodyStyle,
      setStyle,
    }),
    [
      isActive,
      title,
      onClose,
      onMinimize,
      onFocus,
      draggable,
      handleMouseDown,
      titleBarStyle,
      showCloseButton,
      showMaximizeButton,
      showMinimiseButton,
      isMaximized,
      toggleMaximize,
      resizable,
      startResize,
    ],
  );

  return (
    <div
      ref={windowRef}
      className={`window ${className}`}
      style={iife(() => {
        const baseStyle: React.CSSProperties = {
          position: "absolute",
          left: position.x,
          top: position.y,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
          ...(style || {}),
        };

        if (isMinimized) {
          baseStyle.transform = "scale(0)";
          baseStyle.opacity = 0;
          baseStyle.pointerEvents = "none";
        }

        baseStyle.filter = isActive ? "none" : "grayscale(100%)";

        if (size.width !== null) baseStyle.width = `${size.width}px`;

        if (baseStyle.width === undefined && style?.width)
          baseStyle.width = style.width;

        if (size.height !== null) baseStyle.height = `${size.height}px`;

        if (baseStyle.height === undefined && style?.height)
          baseStyle.height = style.height;

        if (!isInitialized) baseStyle.visibility = "hidden";

        return baseStyle;
      })}
      onMouseDown={() => {
        onFocus?.();
      }}
    >
      <WindowContext.Provider value={contextValue}>
        <TitleBar />
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
        <ResizeHandles />
      </WindowContext.Provider>
    </div>
  );
}
