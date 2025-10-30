import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={className}
      style={{ minWidth: "30px", ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
