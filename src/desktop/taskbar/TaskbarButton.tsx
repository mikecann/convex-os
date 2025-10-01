import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";

const process_ICON_MAP: Record<process["kind"], string> = {
  image_preview: "/xp/paint.png",
  video_preview: "/xp/mediaplayer.png",
  sign_in_sign_up: "/xp/users.png",
};

export function processbarButton({ process }: { process: Doc<"processes"> }) {
  const {
    activeprocessId,
    focusprocess,
    minimizeprocess,
    processbarButtonRefs,
  } = useprocesss();

  const isActive = process._id === activeprocessId && !process.isMinimized;
  
  return (
    <button
      key={process._id}
      ref={(element) => {
        const refs = processbarButtonRefs.current;
        if (element) {
          refs.set(process._id, element);
        } else {
          refs.delete(process._id);
        }
      }}
      onClick={() => {
        if (isActive) {
          minimizeprocess(process._id);
          return;
        }
        focusprocess(process._id);
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
        alt=""
        style={{ width: "16px", height: "16px" }}
      />
      {process.title}
    </button>
  );
}
