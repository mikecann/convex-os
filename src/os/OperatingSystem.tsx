import { createContext, PropsWithChildren, useContext } from "react";
import { TasksSystem } from "../common/tasks/TasksSystem";
import { Desktop } from "../desktop/Desktop";
import { Wallpaper } from "../common/components/Wallpaper";

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
      <TasksSystem>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            top: 0,
            left: 0,
          }}
        >
          <Wallpaper fullScreen>
            <Desktop>{children}</Desktop>
          </Wallpaper>
        </div>
      </TasksSystem>
    </OperatingSystemContext.Provider>
  );
}
