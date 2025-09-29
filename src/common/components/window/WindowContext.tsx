import {
  createContext,
  useContext,
  MouseEvent as ReactMouseEvent,
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
  showMaximizeButton?: boolean;
  isMaximized?: boolean;
  toggleMaximize: () => void;
  // For ResizeHandles
  resizable?: boolean;
  startResize: (
    corner: "bottom-right" | "bottom-left" | "top-right" | "top-left",
    event: ReactMouseEvent,
  ) => void;
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
