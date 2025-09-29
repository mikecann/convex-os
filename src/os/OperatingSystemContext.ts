import { createContext, useContext } from "react";

export interface OperatingSystemContextValue {
  // TODO: Define the shape of the OS context
}

export const OperatingSystemContext =
  createContext<OperatingSystemContextValue | null>(null);

export function useOperatingSystem() {
  const context = useContext(OperatingSystemContext);
  if (context === null) {
    throw new Error(
      "useOperatingSystem must be used within a OperatingSystemProvider",
    );
  }
  return context;
}
