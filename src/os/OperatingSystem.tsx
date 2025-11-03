import {
  PropsWithChildren,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { Wallpaper } from "../common/components/Wallpaper";
import { ErrorsRenderer } from "../common/errors/ErrorsRenderer";
import { OperatingSystemContext } from "./OperatingSystemContext";
import { Id } from "../../convex/_generated/dataModel";

// Re-export useOS for convenience
// eslint-disable-next-line react-refresh/only-export-components
export { useOS } from "./OperatingSystemContext";

type TaskbarButtonRefs = Map<Id<"processes">, HTMLElement | null>;

export function OperatingSystem({ children }: PropsWithChildren) {
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
              width: "100%",
              height: "100%",
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
              <ErrorsRenderer />
              {children}
            </div>
          </div>
        </Wallpaper>
      </div>
    </OperatingSystemContext.Provider>
  );
}
