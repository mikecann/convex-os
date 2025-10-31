import { forwardRef, type CSSProperties, type ReactNode } from "react";
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

const Vertical = forwardRef<HTMLDivElement, VerticalProps>(function Vertical(
  {
    children,
    align,
    justify,
    wrap,
    reverse,
    className,
    style: styleOverride,
    ...styleProps
  },
  ref,
) {
  const baseStyle = createBaseStyle(styleProps);
  const mappedAlign = mapAlignToCss(align);
  const mappedJustify = mapJustifyToCss(justify);

  const style: CSSProperties = {
    ...baseStyle,
    display: "flex",
    flexDirection: reverse ? "column-reverse" : "column",
    ...(wrap ? { flexWrap: "wrap" } : {}),
    ...(mappedAlign === undefined ? {} : { alignItems: mappedAlign }),
    ...(mappedJustify === undefined ? {} : { justifyContent: mappedJustify }),
    ...(styleOverride ?? {}),
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
});

export default Vertical;
