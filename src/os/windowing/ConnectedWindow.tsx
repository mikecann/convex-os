import { useOS } from "../OperatingSystem";
import { Window, WindowProps } from "./window/Window";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

export function ConnectedWindow({
  window,
  children,
  ...rest
}: {
  window: Doc<"windows">;
  children?: React.ReactNode;
} & Omit<
  WindowProps,
  | "title"
  | "viewState"
  | "isActive"
  | "x"
  | "y"
  | "width"
  | "height"
  | "onGeometryChange"
>) {
  const os = useOS();
  const focusWindow = useMutation(api.my.windows.focus);
  const closeWindow = useMutation(api.my.windows.close);
  const minimizeWindow = useMutation(api.my.windows.minimize);
  const toggleMaximize = useMutation(api.my.windows.toggleMaximize);
  const updateGeometry = useMutation(api.my.windows.updateGeometry);

  return (
    <Window
      {...rest}
      title={window.title}
      x={window.x}
      y={window.y}
      width={window.width}
      height={window.height}
      viewState={window.viewState}
      onClose={() => closeWindow({ windowId: window._id })}
      onFocus={() => focusWindow({ windowId: window._id })}
      onMinimize={() => minimizeWindow({ windowId: window._id })}
      onToggleMaximize={() => {
        toggleMaximize({ windowId: window._id });
      }}
      onGeometryChange={(geometry) =>
        updateGeometry({
          windowId: window._id,
          position: { x: geometry.x, y: geometry.y },
          size: { width: geometry.width, height: geometry.height },
        })
      }
      getTaskbarButtonRect={() =>
        os.taskbarButtonRefs.current
          .get(window.processId)
          ?.getBoundingClientRect()
      }
    >
      {children}
    </Window>
  );
}
