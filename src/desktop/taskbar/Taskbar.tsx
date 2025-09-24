import React from "react";
import { StartButton } from "./StartButton";
import { Clock } from "./Clock";

interface TaskbarProps {
  onStartClick?: () => void;
}

export function Taskbar({ onStartClick }: TaskbarProps) {
  return (
    <div
      className="taskbar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "30px",
        background:
          "linear-gradient(to bottom, #245EDC 0%, #1E4DB5 50%, #1941A5 100%)",
        border: "1px solid #0831D9",
        borderBottom: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px",
        zIndex: 1000,
        boxShadow: "0 -1px 3px rgba(0,0,0,0.3)",
      }}
    >
      {/* Left side - Start button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        <StartButton onClick={onStartClick} />
      </div>

      {/* Center - Empty space for future taskbar items */}
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        {/* This space can be used for open windows/applications */}
      </div>

      {/* Right side - System tray with clock */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          background:
            "linear-gradient(to bottom, #1E4DB5 0%, #1941A5 50%, #0831D9 100%)",
          border: "1px inset #245EDC",
          borderRadius: "2px",
          marginRight: "2px",
        }}
      >
        <Clock />
      </div>
    </div>
  );
}
