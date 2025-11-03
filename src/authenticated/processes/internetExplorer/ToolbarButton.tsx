import React from "react";
import { Button } from "../../../common/components/Button";

interface ToolbarButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  iconSrc: string;
  showLabel?: boolean;
}

export function ToolbarButton({
  onClick,
  disabled,
  title,
  iconSrc,
  showLabel = true,
}: ToolbarButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
      title={title}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.borderStyle = "inset";
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.borderStyle = "outset";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.borderStyle = "outset";
      }}
    >
      <img
        src={iconSrc}
        alt={title}
        style={{
          width: "16px",
          height: "16px",
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      {showLabel && (
        <span
          style={{
            fontSize: "9px",
            color: "#000",
            textAlign: "center",
            whiteSpace: "nowrap",
            lineHeight: "9px",
            height: "9px",
            display: "block",
          }}
        >
          {title}
        </span>
      )}
    </Button>
  );
}
