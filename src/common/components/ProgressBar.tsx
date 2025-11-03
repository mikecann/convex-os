import React from "react";

interface ProgressBarProps
  extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  indeterminate?: boolean;
}

export function ProgressBar({
  indeterminate = false,
  className = "",
  value,
  max = 100,
  ...props
}: ProgressBarProps) {
  if (indeterminate) return <progress className={className} {...props} />;

  return <progress className={className} max={max} value={value} {...props} />;
}
