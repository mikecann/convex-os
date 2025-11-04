import type { CSSProperties, ReactNode, HTMLAttributes } from "react";
import { forwardRef } from "react";
import { createBaseStyle, type BaseStyleProps } from "./layoutProps";

interface BoxProps extends BaseStyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(({
  children,
  inline,
  className,
  style: styleOverride,
  ...rest
}, ref) => {
  // Extract style props from rest
  const {
    gap, margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft,
    padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft,
    width, minWidth, maxWidth, height, minHeight, maxHeight,
    background, border, borderRadius, shadow,
    ...htmlProps
  } = rest as any;

  const styleProps: BaseStyleProps = {
    gap, margin, marginX, marginY, marginTop, marginRight, marginBottom, marginLeft,
    padding, paddingX, paddingY, paddingTop, paddingRight, paddingBottom, paddingLeft,
    width, minWidth, maxWidth, height, minHeight, maxHeight,
    background, border, borderRadius, shadow,
  };

  const baseStyle = createBaseStyle(styleProps);

  const style: CSSProperties = {
    ...baseStyle,
    ...(inline ? { display: "inline-flex" } : {}),
    ...(styleOverride ?? {}),
  };

  return (
    <div ref={ref} className={className} style={style} {...htmlProps}>
      {children}
    </div>
  );
});

Box.displayName = "Box";

export default Box;
