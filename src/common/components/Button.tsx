import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={className}
        style={{ minWidth: "30px", ...style }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
