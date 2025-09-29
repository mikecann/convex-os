import {
  createContext,
  useContext,
  MouseEvent as ReactMouseEvent,
  CSSProperties,
} from "react";

type WindowContextValue = {
  isActive: boolean;
  title: string;
  setTitle: (title: string) => void;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  // For TitleBar
  draggable: boolean;
  handleMouseDown: (event: ReactMouseEvent) => void;
  titleBarStyle?: React.CSSProperties;
  // For WindowControls
  showCloseButton?: boolean;
  setShowCloseButton: (show: boolean) => void;
  showMaximizeButton?: boolean;
  setShowMaximizeButton: (show: boolean) => void;
  showMinimiseButton?: boolean;
  setShowMinimiseButton: (show: boolean) => void;
  isMaximized?: boolean;
  toggleMaximize: () => void;
  // For ResizeHandles
  resizable?: boolean;
  setResizable: (resizable: boolean) => void;
  startResize: (
    corner:
      | "bottom-right"
      | "bottom-left"
      | "top-right"
      | "top-left"
      | "top"
      | "bottom"
      | "left"
      | "right",
    event: ReactMouseEvent,
  ) => void;
  // For styling
  setBodyStyle: (style: CSSProperties) => void;
  setStyle: (style: CSSProperties) => void;
};

export const WindowContext = createContext<WindowContextValue | undefined>(
  undefined,
);

export function useWindow() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
}
