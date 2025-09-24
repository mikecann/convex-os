import type { CSSProperties, ReactNode } from "react";
import {
  type Align,
  type BaseStyleProps,
  type Justify,
  createBaseStyle,
  mapAlignToCss,
  mapJustifyToCss,
} from "./layoutProps";

interface HorizontalProps extends BaseStyleProps {
  children?: ReactNode;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Horizontal({
  children,
  align,
  justify,
  wrap,
  reverse,
  className,
  style: styleOverride,
  ...styleProps
}: HorizontalProps) {
  const baseStyle = createBaseStyle(styleProps);
  const mappedAlign = mapAlignToCss(align);
  const mappedJustify = mapJustifyToCss(justify);

  const style: CSSProperties = {
    ...baseStyle,
    display: "flex",
    flexDirection: reverse ? "row-reverse" : "row",
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...(mappedAlign !== undefined ? { alignItems: mappedAlign } : {}),
    ...(mappedJustify !== undefined ? { justifyContent: mappedJustify } : {}),
    ...(styleOverride ?? {}),
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
