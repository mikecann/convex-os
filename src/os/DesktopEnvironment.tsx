import {
  PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OperatingSystemContext } from "./OperatingSystem";
import { Wallpaper } from "../common/components/Wallpaper";
import { WindowingRenderer } from "../windowing/WindowingRenderer";
import { Authenticated } from "convex/react";
import { StartMenu } from "../desktop/taskbar/StartMenu";
import { Taskbar } from "../desktop/taskbar/Taskbar";

export function DesktopEnvironment({ children }: PropsWithChildren) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [desktopRect, setDesktopRect] = useState<DOMRect | null>(null);
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);

  useLayoutEffect(() => {
    const desktopEl = desktopRef.current;
    if (desktopEl) {
      const updateRect = () => {
        const newRect = desktopEl.getBoundingClientRect();
        setDesktopRect((oldRect) => {
          if (
            oldRect &&
            oldRect.top === newRect.top &&
            oldRect.right === newRect.right &&
            oldRect.bottom === newRect.bottom &&
            oldRect.left === newRect.left &&
            oldRect.width === newRect.width &&
            oldRect.height === newRect.height
          ) {
            return oldRect;
          }
          return newRect;
        });
      };
      updateRect();
      const resizeObserver = new ResizeObserver(updateRect);
      resizeObserver.observe(desktopEl);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const contextValue = useMemo(() => ({ desktopRect }), [desktopRect]);

  return (
    <OperatingSystemContext.Provider value={contextValue}>
      <Wallpaper fullScreen>
        <div
          ref={desktopRef}
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          {children}
          <WindowingRenderer />
        </div>
      </Wallpaper>
      <Authenticated>
        {isStartMenuVisible && (
          <StartMenu
            isOpen={isStartMenuVisible}
            onClose={() => setIsStartMenuVisible(false)}
          />
        )}
        <Taskbar
          onStartClick={() => setIsStartMenuVisible((current) => !current)}
        />
      </Authenticated>
    </OperatingSystemContext.Provider>
  );
}
