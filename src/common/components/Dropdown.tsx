import React, { useId } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: DropdownOption[];
  label?: string;
  id?: string;
}

export function Dropdown({
  options,
  label,
  id,
  className = "",
  ...props
}: DropdownProps) {
  const generatedId = useId();
  const dropdownId = id || generatedId;

  if (!label)
    return (
      <select id={dropdownId} className={className} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

  return (
    <div className="field-row">
      <label htmlFor={dropdownId}>{label}</label>
      <select id={dropdownId} className={className} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
