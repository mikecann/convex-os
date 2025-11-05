import React, { useState } from "react";
import { playSound } from "../../common/sounds/soundEffects";
import { Button } from "../../common/components/Button";

interface StartButtonProps {
  onClick?: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Button
      className="start-button"
      onClick={() => {
        playSound("start", 0.4);
        onClick?.();
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        backgroundImage: isPressed
          ? "linear-gradient(0deg, #2f892f 0%, #4eb64e 6%, #4eb64e 51%, #4eb64e 63%, #4eb64e 77%, #c4ffc4 85%, #c4ffc4 93%, #2f892f 97%)"
          : "linear-gradient(0deg, #0c450c 0%, #308f2f 6%, #308f2f 51%, #308f2f 63%, #308f2f 77%, #97c597 95%, #97c597 99%, #308f2f 97%)",
        boxShadow: "-2px -2px 10px rgba(0,0,0,0.56) inset",
        height: "100%",
        width: "100px",
        minWidth: "100px",
        flexShrink: 0,
        color: "white",
        fontWeight: "500",
        fontSize: "1.1rem",
        fontStyle: "italic",
        fontFamily: "MS Sans Serif, sans-serif",
        border: "none",
        borderRadius: "0 8px 0 0",
        cursor: "pointer",
        outline: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        transition: "all 0.1s",
      }}
    >
      <img
        src="/convex.svg"
        alt="Windows"
        style={{
          width: "20px",
          height: "20px",
          filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.205))",
        }}
      />
      <span
        style={{
          filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.685))",
          letterSpacing: "1px",
          paddingRight: "8px",
          paddingLeft: "4px",
          paddingBottom: "2px",
        }}
      >
        start
      </span>
    </Button>
  );
}
