import type { CSSProperties, ReactNode } from "react";
import {
  type Align,
  type BaseStyleProps,
  type Justify,
  createBaseStyle,
  mapAlignToCss,
  mapJustifyToCss,
} from "./layoutProps";

interface VerticalProps extends BaseStyleProps {
  children?: ReactNode;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Vertical({
  children,
  align,
  justify,
  wrap,
  reverse,
  className,
  style: styleOverride,
  ...styleProps
}: VerticalProps) {
  const baseStyle = createBaseStyle(styleProps);
  const mappedAlign = mapAlignToCss(align);
  const mappedJustify = mapJustifyToCss(justify);

  const style: CSSProperties = {
    ...baseStyle,
    display: "flex",
    flexDirection: reverse ? "column-reverse" : "column",
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
