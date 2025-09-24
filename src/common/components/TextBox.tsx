import React from 'react';

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  stacked?: boolean;
  onChange?: (value: string) => void;
}

export function TextBox({ 
  label, 
  stacked, 
  onChange,
  className = '',
  id,
  ...props 
}: TextBoxProps) {
  const inputId = id || `textbox-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  if (!label) {
    return (
      <input 
        id={inputId}
        className={className}
        onChange={handleChange}
        {...props}
      />
    );
  }

  const containerClass = stacked ? 'field-row-stacked' : 'field-row';

  return (
    <div className={containerClass}>
      <label htmlFor={inputId}>{label}</label>
      <input 
        id={inputId}
        className={className}
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}
