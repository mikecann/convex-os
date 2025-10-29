import type { CSSProperties, ReactNode } from "react";
import {
  type Align,
  type BaseStyleProps,
  type Justify,
  createBaseStyle,
  mapAlignToCss,
  mapJustifyToCss,
} from "./layoutProps";

interface FlexProps extends BaseStyleProps {
  children?: ReactNode;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Flex({
  children,
  direction = "row",
  align,
  justify,
  wrap,
  inline,
  className,
  style: styleOverride,
  ...styleProps
}: FlexProps) {
  const baseStyle = createBaseStyle(styleProps);
  const mappedAlign = mapAlignToCss(align);
  const mappedJustify = mapJustifyToCss(justify);

  const style: CSSProperties = {
    ...baseStyle,
    display: inline ? "inline-flex" : "flex",
    flexDirection: direction,
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...(mappedAlign === undefined ? {} : { alignItems: mappedAlign }),
    ...(mappedJustify === undefined ? {} : { justifyContent: mappedJustify }),
    ...(styleOverride ?? {}),
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
