import { createContext, useContext } from "react";

type WindowContextValue = {
  isActive: boolean;
  setTitle: (title: string) => void;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
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
