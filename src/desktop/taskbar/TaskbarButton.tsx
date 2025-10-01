import { Doc } from "../../../convex/_generated/dataModel";
import { ProcessKinds } from "../../../convex/processes/schema";
import { useOS } from "../../os/OperatingSystem";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

const process_ICON_MAP: Record<ProcessKinds, string> = {
  image_preview: "/xp/paint.png",
  video_preview: "/xp/mediaplayer.png",
};

export function TaskbarButton({
  process,
  isActive,
}: {
  process: Doc<"processes">;
  isActive: boolean;
}) {
  const { taskbarButtonRefs } = useOS();
  const minimize = useMutation(api.my.processes.minimize);
  const focus = useMutation(api.my.processes.focus);
  const processName = useQuery(api.my.processes.findName, {
    processId: process._id,
  });

  return (
    <button
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        border: "1px solid rgba(0,0,0,0.4)",
        borderRadius: "4px",
        background: isActive
          ? "linear-gradient(0deg, #0a5bc6 0%, #1198e9 100%)"
          : "linear-gradient(0deg, #1943b8 0%, #3370d3 100%)",
        color: "white",
        boxShadow: isActive
          ? "inset 1px 1px 1px rgba(255,255,255,0.4)"
          : "1px 1px 2px rgba(0,0,0,0.4)",
        cursor: "pointer",
        minWidth: "120px",
        outline: "none",
      }}
    >
      <img
        src={process_ICON_MAP[process.kind]}
        style={{ width: "16px", height: "16px" }}
      />
      {processName ?? `${process.kind} ${process._id}`}
    </button>
  );
}
