import React from 'react';

interface WindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  statusBar?: React.ReactNode;
}

export function Window({ 
  title, 
  children, 
  className = '', 
  style,
  statusBar
}: WindowProps) {
  return (
    <div className={`window ${className}`} style={style}>
      {title && (
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
        </div>
      )}
      <div className="window-body">
        {children}
      </div>
      {statusBar && (
        <div className="status-bar">
          {statusBar}
        </div>
      )}
    </div>
  );
}
