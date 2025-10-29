import React, { useId } from "react";

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
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <div className="field-row">
      <input type="checkbox" id={checkboxId} className={className} {...props} />
      <label htmlFor={checkboxId}>{label}</label>
    </div>
  );
}
