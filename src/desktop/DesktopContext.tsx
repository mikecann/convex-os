import { createContext, useContext } from "react";

type DesktopContextValue = {
  desktopRect: DOMRect | null;
};

export const DesktopContext = createContext<DesktopContextValue | undefined>(
  undefined,
);

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
}
