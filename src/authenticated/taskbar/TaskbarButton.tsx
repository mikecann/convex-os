import { Doc } from "../../../convex/_generated/dataModel";
import { ProcessKinds } from "../../../convex/processes/schema";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { TaskbarContextMenu } from "./TaskbarContextMenu";
import { Button } from "../../common/components/Button";
import {
  useOptimisticFocusProcess,
  useOptimisticMinimizeProcess,
} from "../../common/hooks/optimistic";
import { useOS } from "../../os/OperatingSystemContext";

const process_ICON_MAP: Record<ProcessKinds, string> = {
  image_preview: "/xp/paint.png",
  video_player: "/xp/mediaplayer.png",
  text_preview: "/xp/doc.png",
  cheffy_chat: "/cheffy.webp",
  file_browser: "/xp/folder.png",
  internet_explorer: "/xp/ie.png",
};

export function TaskbarButton({
  process,
  isActive,
}: {
  process: Doc<"processes">;
  isActive: boolean;
}) {
  const { taskbarButtonRefs } = useOS();
  const minimize = useOptimisticMinimizeProcess();
  const focus = useOptimisticFocusProcess();
  const close = useMutation(api.my.processes.close);
  const processName = useQuery(api.my.processes.findName, {
    processId: process._id,
  });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Button
        key={process._id}
        ref={(element) => {
          if (element) taskbarButtonRefs.current.set(process._id, element);
          else taskbarButtonRefs.current.delete(process._id);
        }}
        onClick={() => {
          if (isActive) {
            minimize({ processId: process._id });
            return;
          }
          focus({ processId: process._id });
        }}
        onMouseDown={(e) => {
          if (e.button != 1) return;
          e.preventDefault();
          close({ processId: process._id });
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY });
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          border: "1px solid rgba(0,0,0,0.4)",
          borderRadius: "4px",
          background: isActive
            ? isHovered
              ? "linear-gradient(0deg, #1a6bd6 0%, #20a8f9 100%)"
              : "linear-gradient(0deg, #0a5bc6 0%, #1198e9 100%)"
            : isHovered
              ? "linear-gradient(0deg, #2953c8 0%, #4380e3 100%)"
              : "linear-gradient(0deg, #1943b8 0%, #3370d3 100%)",
          color: "white",
          boxShadow: isActive
            ? "inset 1px 1px 1px rgba(255,255,255,0.4)"
            : "1px 1px 2px rgba(0,0,0,0.4)",
          cursor: "pointer",
          flex: 1,
          minWidth: "80px",
          maxWidth: "200px",
          outline: "none",
          transition: "background 0.15s ease",
          overflow: "hidden",
        }}
      >
        <img
          src={process_ICON_MAP[process.kind]}
          style={{ width: "16px", height: "16px", flexShrink: 0 }}
        />
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {processName ?? `${process.kind} ${process._id}`}
        </span>
      </Button>
      {contextMenu && (
        <TaskbarContextMenu
          processId={process._id}
          isActive={isActive}
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
