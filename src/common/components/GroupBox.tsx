import React from "react";

interface GroupBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GroupBox({
  title,
  children,
  className = "",
  style,
}: GroupBoxProps) {
  return (
    <fieldset className={className} style={style}>
      {title && <legend>{title}</legend>}
      {children}
    </fieldset>
  );
}
