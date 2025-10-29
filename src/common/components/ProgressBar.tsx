import React from 'react';

interface ProgressBarProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  indeterminate?: boolean;
}

export function ProgressBar({ 
  indeterminate = false, 
  className = '', 
  ...props 
}: ProgressBarProps) {
  if (indeterminate) 
    return <progress className={className} {...props} />;
  

  return <progress className={className} {...props} />;
}
