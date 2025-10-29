import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useOS } from "../../os/OperatingSystem";

interface TaskbarContextMenuProps {
  processId: Id<"processes">;
  isActive: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export function TaskbarContextMenu({
  processId,
  isActive,
  position,
  onClose,
}: TaskbarContextMenuProps) {
  const close = useMutation(api.my.processes.close);
  const minimize = useMutation(api.my.processes.minimize);
  const restore = useMutation(api.my.processes.restore);
  const centerOnScreen = useMutation(api.my.processes.centerOnScreen);
  const { desktopRect } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Adjust position to appear above the taskbar button
  const menuHeight = 120; // Approximate height of menu
  const adjustedY = position.y - menuHeight + 20;

  const handleRestore = () => {
    restore({ processId });
    onClose();
  };

  const handleMinimize = () => {
    minimize({ processId });
    onClose();
  };

  const handleCenterOnScreen = () => {
    if (!desktopRect) return;
    centerOnScreen({
      processId,
      desktopWidth: desktopRect.width,
      desktopHeight: desktopRect.height,
    });
    onClose();
  };

  const handleClose = () => {
    close({ processId });
    onClose();
  };

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: position.x - 80,
        top: adjustedY,
        background: "#ECE9D8",
        border: "1px solid #0054E3",
        boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
        borderRadius: "0px",
        minWidth: "140px",
        padding: "2px",
        zIndex: 100000,
        fontFamily: "Tahoma, sans-serif",
        fontSize: "11px",
      }}
    >
      {isActive ? (
        <button
          onClick={handleMinimize}
          style={{
            display: "block",
            width: "100%",
            padding: "4px 20px",
            textAlign: "left",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#000",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#316AC5";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#000";
          }}
        >
          Minimize
        </button>
      ) : (
        <button
          onClick={handleRestore}
          style={{
            display: "block",
            width: "100%",
            padding: "4px 20px",
            textAlign: "left",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#000",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#316AC5";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#000";
          }}
        >
          Restore
        </button>
      )}
      <button
        onClick={handleCenterOnScreen}
        style={{
          display: "block",
          width: "100%",
          padding: "4px 20px",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#000",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#316AC5";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#000";
        }}
      >
        Center Window on Screen
      </button>
      <div
        style={{
          height: "1px",
          background: "#919B9C",
          margin: "2px 1px",
        }}
      />
      <button
        onClick={handleClose}
        style={{
          display: "block",
          width: "100%",
          padding: "4px 20px",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#000",
          fontWeight: "bold",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#316AC5";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#000";
        }}
      >
        Close
      </button>
    </div>,
    document.body,
  );
}
