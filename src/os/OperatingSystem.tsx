import {
  createContext,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Wallpaper } from "../common/components/Wallpaper";
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
  if (context === null) {
    throw new Error(
      "useOperatingSystem must be used within a OperatingSystemProvider",
    );
  }
  return context;
}

export function OperatingSystem({ children }: PropsWithChildren<{}>) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [desktopRect, setDesktopRect] = useState<DOMRect | null>(null);
  const taskbarButtonRefs = useRef<TaskbarButtonRefs>(new Map());

  useLayoutEffect(() => {
    const desktopEl = desktopRef.current;
    if (desktopEl) {
      const updateRect = () => {
        setDesktopRect(desktopEl.getBoundingClientRect());
      };
      updateRect();
      const resizeObserver = new ResizeObserver(updateRect);
      resizeObserver.observe(desktopEl);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const contextValue = useMemo(
    () => ({ desktopRect, taskbarButtonRefs }),
    [desktopRect, taskbarButtonRefs],
  );

  return (
    <OperatingSystemContext.Provider value={contextValue}>
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
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              ref={desktopRef}
              style={{
                flex: 1,
                position: "relative",
              }}
            >
              {children}
            </div>
          </div>
        </Wallpaper>
      </div>
    </OperatingSystemContext.Provider>
  );
}
