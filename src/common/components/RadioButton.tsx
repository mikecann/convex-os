import React from "react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
}

export function RadioButton({
  label,
  id,
  className = "",
  ...props
}: RadioButtonProps) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="field-row">
      <input type="radio" id={radioId} className={className} {...props} />
      <label htmlFor={radioId}>{label}</label>
    </div>
  );
}
