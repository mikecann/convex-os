import type { CSSProperties, ReactNode } from "react";
import { createBaseStyle, type BaseStyleProps } from "./layoutProps";

interface BoxProps extends BaseStyleProps {
  children?: ReactNode;
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Box({
  children,
  inline,
  className,
  style: styleOverride,
  ...styleProps
}: BoxProps) {
  const baseStyle = createBaseStyle(styleProps);

  const style: CSSProperties = {
    ...baseStyle,
    ...(inline ? { display: "inline-flex" } : {}),
    ...(styleOverride ?? {}),
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
