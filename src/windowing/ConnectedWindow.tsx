import { Doc } from "../../convex/_generated/dataModel";
import { Window } from "../common/components/window/Window";
import { SignInSignUpWindow } from "../auth/SignInSignUpWindow";
import { exhaustiveCheck, iife } from "../../shared/misc";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useOS } from "../os/OperatingSystem";
import { ImagePreview } from "../processes/imagePreview/ImagePreview";

export function ConnectedWindow({ window }: { window: Doc<"windows"> }) {
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
      onClose={() => closeWindow({ windowId: window._id })}
      onFocus={() => focusWindow({ windowId: window._id })}
      onMinimize={() => minimizeWindow({ windowId: window._id })}
      onGeometryUpdated={(position, size) =>
        updatePosition({ windowId: window._id, position, size })
      }
      isActive={window.viewState.kind === "open" && window.viewState.isActive}
      isMinimized={window.viewState.kind === "minimized"}
      taskbarButtonRect={os.taskbarButtonRefs.current
        .get(window.processId)
        ?.getBoundingClientRect()}
    >
      {iife(() => {
        if (process.kind === "image_preview")
          return <ImagePreview process={process} window={window} />;

        if (process.kind === "video_player") return null;

        exhaustiveCheck(process);
      })}
    </Window>
  );
}
