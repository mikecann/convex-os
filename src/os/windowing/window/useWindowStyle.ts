import React, { useMemo } from "react";
import { WindowViewState } from "../../../../convex/windows/schema";
import { iife } from "../../../../shared/misc";

interface UseWindowStyleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  viewState: WindowViewState;
  desktopRect: DOMRect | null;
  style?: React.CSSProperties;
  isDragging?: boolean;
  isResizing?: boolean;
}

export function useWindowStyle({
  x,
  y,
  width,
  height,
  viewState,
  desktopRect,
  style,
  isDragging = false,
  isResizing = false,
}: UseWindowStyleProps): React.CSSProperties {
  return useMemo(() => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: viewState.kind === "maximized" ? 0 : x,
      top: viewState.kind === "maximized" ? 0 : y,
      width:
        viewState.kind === "maximized" && desktopRect
          ? desktopRect.width
          : width,
      height:
        viewState.kind === "maximized" && desktopRect
          ? desktopRect.height
          : height,
      zIndex: iife(() => {
        if (viewState.kind === "maximized") return 9999;
        if (viewState.kind === "open") return 1000 + viewState.viewStackOrder;
      }),
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      ...(isDragging || isResizing
        ? {}
        : {
            transition: "all 0.2s ease-in-out, opacity 0.3s ease-in-out",
          }),
      ...(style || {}),
    };

    if (viewState.kind === "minimized") {
      baseStyle.transform = "scale(0)";
      baseStyle.opacity = 0;
      baseStyle.pointerEvents = "none";
    }

    baseStyle.filter = iife(() => {
      if (viewState.kind === "open" && viewState.isActive) return true;
      if (viewState.kind === "maximized") return true;
      return false;
    })
      ? "none"
      : "grayscale(100%)";

    return baseStyle;
  }, [
    x,
    y,
    width,
    height,
    viewState,
    desktopRect,
    style,
    isDragging,
    isResizing,
  ]);
}
