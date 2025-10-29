import { createContext, useContext } from "react";
import { Id } from "../../convex/_generated/dataModel";

type TaskbarButtonRefs = Map<Id<"processes">, HTMLElement | null>;

export interface OperatingSystemContextValue {
  desktopRect: DOMRect | null;
  taskbarButtonRefs: { current: TaskbarButtonRefs };
}

export const OperatingSystemContext =
  createContext<OperatingSystemContextValue | null>(null);

export function useOS() {
  const context = useContext(OperatingSystemContext);
  if (context === null)
    throw new Error(
      "useOperatingSystem must be used within a OperatingSystemProvider",
    );

  return context;
}
