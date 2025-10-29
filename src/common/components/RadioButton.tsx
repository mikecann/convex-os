import React, { useId } from "react";

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
  const generatedId = useId();
  const radioId = id || generatedId;

  return (
    <div className="field-row">
      <input type="radio" id={radioId} className={className} {...props} />
      <label htmlFor={radioId}>{label}</label>
    </div>
  );
}
