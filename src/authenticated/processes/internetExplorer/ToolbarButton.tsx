import React from "react";

interface ToolbarButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  icon: React.ReactNode;
}

const toolbarButtonStyle: React.CSSProperties = {
  width: "24px",
  height: "22px",
  padding: 0,
  border: "1px outset #ece9d8",
  backgroundColor: "#ece9d8",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontFamily: "Tahoma, sans-serif",
  flexShrink: 0,
};

const disabledToolbarButtonStyle: React.CSSProperties = {
  ...toolbarButtonStyle,
  opacity: 0.5,
  cursor: "not-allowed",
};

export function ToolbarButton({
  onClick,
  disabled,
  title,
  icon,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={disabled ? disabledToolbarButtonStyle : toolbarButtonStyle}
      title={title}
    >
      {icon}
    </button>
  );
}

