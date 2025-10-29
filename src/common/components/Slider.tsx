import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

export function Slider({ label, id, className = '', ...props }: SliderProps) {
  const sliderId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;

  if (!label) 
    return (
      <input 
        type="range" 
        id={sliderId} 
        className={className}
        {...props} 
      />
    );
  

  return (
    <div className="field-row">
      <label htmlFor={sliderId}>{label}</label>
      <input 
        type="range" 
        id={sliderId} 
        className={className}
        {...props} 
      />
    </div>
  );
}
