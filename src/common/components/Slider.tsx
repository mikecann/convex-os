import React, { useId } from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

export function Slider({ label, id, className = "", ...props }: SliderProps) {
  const generatedId = useId();
  const sliderId = id || generatedId;

  if (!label)
    return (
      <input type="range" id={sliderId} className={className} {...props} />
    );

  return (
    <div className="field-row">
      <label htmlFor={sliderId}>{label}</label>
      <input type="range" id={sliderId} className={className} {...props} />
    </div>
  );
}
