import { createContext, PropsWithChildren, useContext } from "react";

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

export function OperatingSystem({ children }: PropsWithChildren<{}>) {
  const value: OperatingSystemContextValue = {
    // TODO: Implement the OS provider
  };

  return (
    <OperatingSystemContext.Provider value={value}>
      {children}
    </OperatingSystemContext.Provider>
  );
}
