import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
}

export function Checkbox({
  label,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="field-row">
      <input type="checkbox" id={checkboxId} className={className} {...props} />
      <label htmlFor={checkboxId}>{label}</label>
    </div>
  );
}
