import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { DesktopFiles } from "./files/DesktopFiles";
import { Taskbar } from "./taskbar/Taskbar";
import { StartMenu } from "./taskbar/StartMenu";
import { WindowingManager } from "../windowing/WindowingManager";
import { DesktopContext } from "./DesktopContext";

export function Desktop() {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const [desktopRect, setDesktopRect] = useState<DOMRect | null>(null);

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

  const contextValue = useMemo(() => ({ desktopRect }), [desktopRect]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <DesktopContext.Provider value={contextValue}>
        <div
          ref={desktopRef}
          style={{
            flex: 1,
            position: "relative",
          }}
        >
          <DesktopFiles />
          <WindowingManager />
        </div>
      </DesktopContext.Provider>
      {isStartMenuVisible && (
        <StartMenu
          isOpen={isStartMenuVisible}
          onClose={() => setIsStartMenuVisible(false)}
        />
      )}
      <Taskbar
        onStartClick={() => setIsStartMenuVisible((current) => !current)}
      />
    </div>
  );
}
