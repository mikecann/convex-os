import React from "react";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  stacked?: boolean;
  containerStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

export function TextBox({
  label,
  stacked,
  className = "",
  id,
  containerStyle,
  labelStyle,
  ...props
}: TextBoxProps) {
  const inputId = id || `textbox-${Math.random().toString(36).substr(2, 9)}`;

  if (!label) 
    return <input id={inputId} className={className} {...props} />;
  

  const containerClass = stacked ? "field-row-stacked" : "field-row";

  return (
    <div className={containerClass} style={containerStyle}>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
      </label>
      <input id={inputId} className={className} {...props} />
    </div>
  );
}
