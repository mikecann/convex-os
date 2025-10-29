import { useEffect } from "react";
import type { ResizeCorner } from "./Window";

interface ResizeOrigin {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  corner: ResizeCorner;
}

interface UseResizingProps {
  isResizing: boolean;
  windowRef: React.RefObject<HTMLDivElement | null>;
  resizeOriginRef: React.MutableRefObject<ResizeOrigin | null>;
  currentPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  currentSizeRef: React.MutableRefObject<{ width: number; height: number }>;
  desktopRect: DOMRect | null;
  onGeometryChange?: (geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  setIsResizing: (value: boolean) => void;
}

function calculateNewDimensions(
  origin: ResizeOrigin,
  deltaX: number,
  deltaY: number,
): { newWidth: number; newHeight: number; newLeft: number; newTop: number } {
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
  } else if (origin.corner === "bottom")
    newHeight = origin.startHeight + deltaY;
  else if (origin.corner === "left") {
    newWidth = origin.startWidth - deltaX;
    newLeft = origin.startLeft + deltaX;
  } else if (origin.corner === "right") newWidth = origin.startWidth + deltaX;

  return { newWidth, newHeight, newLeft, newTop };
}

function applyDesktopBounds(
  dimensions: {
    newWidth: number;
    newHeight: number;
    newLeft: number;
    newTop: number;
  },
  desktopRect: DOMRect,
): { newWidth: number; newHeight: number; newLeft: number; newTop: number } {
  let { newWidth, newHeight, newLeft, newTop } = dimensions;

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

  return { newWidth, newHeight, newLeft, newTop };
}

export function useResizing({
  isResizing,
  windowRef,
  resizeOriginRef,
  currentPositionRef,
  currentSizeRef,
  desktopRect,
  onGeometryChange,
  setIsResizing,
}: UseResizingProps) {
  useEffect(() => {
    if (!isResizing) return;

    const handleResizeMove = (event: MouseEvent) => {
      const origin = resizeOriginRef.current;
      if (!origin || !windowRef.current) return;

      const deltaX = event.clientX - origin.startX;
      const deltaY = event.clientY - origin.startY;

      let dimensions = calculateNewDimensions(origin, deltaX, deltaY);

      if (desktopRect) dimensions = applyDesktopBounds(dimensions, desktopRect);

      // Update DOM directly (no re-render)
      currentSizeRef.current = {
        width: dimensions.newWidth,
        height: dimensions.newHeight,
      };
      currentPositionRef.current = {
        x: dimensions.newLeft,
        y: dimensions.newTop,
      };
      windowRef.current.style.width = `${dimensions.newWidth}px`;
      windowRef.current.style.height = `${dimensions.newHeight}px`;
      windowRef.current.style.left = `${dimensions.newLeft}px`;
      windowRef.current.style.top = `${dimensions.newTop}px`;
    };

    const handleResizeUp = () => {
      setIsResizing(false);
      resizeOriginRef.current = null;
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
  }, [
    isResizing,
    desktopRect,
    onGeometryChange,
    windowRef,
    resizeOriginRef,
    currentPositionRef,
    currentSizeRef,
    setIsResizing,
  ]);
}
