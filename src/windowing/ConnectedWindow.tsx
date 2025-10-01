import { Doc } from "../../convex/_generated/dataModel";
import { Window, WindowProps } from "../common/components/window/Window";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useOS } from "../os/OperatingSystem";

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
  const updatePosition = useMutation(api.my.windows.updatePosition);

  const handleGeometryChange = (geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    updatePosition({
      windowId: window._id,
      position: { x: geometry.x, y: geometry.y },
      size: { width: geometry.width, height: geometry.height },
    });
  };

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
      onToggleMaximize={() => toggleMaximize({ windowId: window._id })}
      onGeometryChange={handleGeometryChange}
      taskbarButtonRect={os.taskbarButtonRefs.current
        .get(window.processId)
        ?.getBoundingClientRect()}
    >
      {children}
    </Window>
  );
}
