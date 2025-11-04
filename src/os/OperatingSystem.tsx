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
import Box from "../common/components/Box";

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
      <Box
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
          <Box
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              ref={desktopRef}
              style={{
                flex: 1,
                position: "relative",
              }}
            >
              <ErrorsRenderer />
              {children}
            </Box>
          </Box>
        </Wallpaper>
      </Box>
    </OperatingSystemContext.Provider>
  );
}
