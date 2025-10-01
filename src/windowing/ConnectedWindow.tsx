import { Doc } from "../../convex/_generated/dataModel";
import { Window, WindowProps } from "../common/components/window/Window";
import { SignInSignUpWindow } from "../auth/SignInSignUpWindow";
import { exhaustiveCheck, iife } from "../../shared/misc";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useOS } from "../os/OperatingSystem";

export function ConnectedWindow({
  window,
  children,
  ...rest
}: { window: Doc<"windows"> } & Omit<
  WindowProps,
  "title" | "viewState" | "isActive"
>) {
  const os = useOS();
  const process = useQuery(api.my.processes.get, {
    processId: window.processId,
  });
  const focusWindow = useMutation(api.my.windows.focus);
  const closeWindow = useMutation(api.my.windows.close);
  const minimizeWindow = useMutation(api.my.windows.minimize);
  const updatePosition = useMutation(api.my.windows.updatePosition);

  if (!process) return null;

  return (
    <Window
      key={window._id}
      title={window.title}
      x={window.x}
      y={window.y}
      width={window.width}
      height={window.height}
      viewState={window.viewState}
      onClose={() => closeWindow({ windowId: window._id })}
      onFocus={() => focusWindow({ windowId: window._id })}
      onMinimize={() => minimizeWindow({ windowId: window._id })}
      onGeometryUpdated={(position, size) =>
        updatePosition({ windowId: window._id, position, size })
      }
      isActive={iife(() => {
        if (window.viewState.kind === "open" && window.viewState.isActive)
          return true;
        if (window.viewState.kind == "maximized") return true;
        return false;
      })}
      taskbarButtonRect={os.taskbarButtonRefs.current
        .get(window.processId)
        ?.getBoundingClientRect()}
      {...rest}
    >
      {children}
    </Window>
  );
}
