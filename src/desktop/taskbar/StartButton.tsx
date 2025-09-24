import React, { useState } from "react";

interface StartButtonProps {
  onClick?: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className="start-button"
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        background: isPressed
          ? "linear-gradient(to bottom, #008000 0%, #00A000 50%, #008000 100%)"
          : "linear-gradient(to bottom, #40C040 0%, #00A000 50%, #008000 100%)",
        border: "1px outset #40C040",
        borderRadius: "6px 6px 0 0",
        color: "white",
        fontFamily: "MS Sans Serif, sans-serif",
        fontSize: "11px",
        fontWeight: "bold",
        padding: "4px 24px",
        height: "30px",
        minWidth: "54px",
        cursor: "pointer",
        outline: "none",
        boxShadow: isPressed
          ? "inset 1px 1px 2px rgba(0,0,0,0.3)"
          : "1px 1px 2px rgba(0,0,0,0.2)",
        textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          background: "radial-gradient(circle, #FFD700, #FFA500)",
          borderRadius: "2px",
          border: "1px solid #FF8C00",
          boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.3)",
          display: "inline-block",
        }}
      />
      Start
    </button>
  );
}
