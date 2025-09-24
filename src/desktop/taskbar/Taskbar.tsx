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
        width: "100vw",
        height: "30px",
        backgroundImage:
          "linear-gradient(0deg, #042b8e 0%, #0551f6 6%, #0453ff 51%, #0551f6 63%, #0551f6 81%, #3a8be8 99%, #0453ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      {/* Start button */}
      <StartButton onClick={onStartClick} />

      {/* IE Explorer icon */}
      {/* <img
        src="/convex.svg"
        alt="Internet Explorer"
        style={{
          marginLeft: "16px",
          marginRight: "16px",
          width: "20px",
          height: "20px",
          filter: "brightness(1.2)",
        }}
      /> */}

      {/* System tray */}
      <div
        style={{
          marginLeft: "auto",
          height: "100%",
          width: "fit-content",
          color: "white",
          borderTop: "1px solid #075dca",
          borderBottom: "1px solid #0a5bc6",
          borderRight: "1px solid transparent",
          borderLeft: "1px solid black",
          backgroundImage:
            "linear-gradient(0deg, #0a5bc6 0%, #1198e9 6%, #1198e9 51%, #1198e9 63%, #1198e9 77%, #19b9f3 95%, #075dca 97%)",
          boxShadow: "2px 0px 3px #20e2fc inset",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "1px",
          fontSize: "14px",
          gap: "4px",
        }}
      >
        <Clock />
      </div>
    </div>
  );
}
