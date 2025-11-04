import type { CSSProperties } from "react";

export type SpaceValue = number | string;
export type SizeValue = number | string;

export interface SpacingProps {
  gap?: SpaceValue;
  margin?: SpaceValue;
  marginX?: SpaceValue;
  marginY?: SpaceValue;
  marginTop?: SpaceValue;
  marginRight?: SpaceValue;
  marginBottom?: SpaceValue;
  marginLeft?: SpaceValue;
  padding?: SpaceValue;
  paddingX?: SpaceValue;
  paddingY?: SpaceValue;
  paddingTop?: SpaceValue;
  paddingRight?: SpaceValue;
  paddingBottom?: SpaceValue;
  paddingLeft?: SpaceValue;
}

export interface SizingProps {
  width?: SizeValue;
  minWidth?: SizeValue;
  maxWidth?: SizeValue;
  height?: SizeValue;
  minHeight?: SizeValue;
  maxHeight?: SizeValue;
}

export interface DecorationProps {
  background?: CSSProperties["background"];
  border?: CSSProperties["border"];
  borderRadius?: SpaceValue;
  shadow?: CSSProperties["boxShadow"];
}

export type BaseStyleProps = SpacingProps & SizingProps & DecorationProps;

export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";

const toCssSpace = (value?: SpaceValue) => {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;
  return value;
};

const toCssSize = (value?: SizeValue) => {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}px`;
  return value;
};

const applySpacing = (style: CSSProperties, props: SpacingProps) => {
  const {
    gap,
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  } = props;
  const {
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  } = props;

  const resolvedGap = toCssSpace(gap);
  if (resolvedGap !== undefined) style.gap = resolvedGap;

  const resolvedMargin = toCssSpace(margin);
  if (resolvedMargin !== undefined) style.margin = resolvedMargin;

  const resolvedMarginX = toCssSpace(marginX);
  if (resolvedMarginX !== undefined) {
    style.marginLeft = resolvedMarginX;
    style.marginRight = resolvedMarginX;
  }

  const resolvedMarginY = toCssSpace(marginY);
  if (resolvedMarginY !== undefined) {
    style.marginTop = resolvedMarginY;
    style.marginBottom = resolvedMarginY;
  }

  const resolvedMarginTop = toCssSpace(marginTop);
  if (resolvedMarginTop !== undefined) style.marginTop = resolvedMarginTop;

  const resolvedMarginRight = toCssSpace(marginRight);
  if (resolvedMarginRight !== undefined)
    style.marginRight = resolvedMarginRight;

  const resolvedMarginBottom = toCssSpace(marginBottom);
  if (resolvedMarginBottom !== undefined)
    style.marginBottom = resolvedMarginBottom;

  const resolvedMarginLeft = toCssSpace(marginLeft);
  if (resolvedMarginLeft !== undefined) style.marginLeft = resolvedMarginLeft;

  const resolvedPadding = toCssSpace(padding);
  if (resolvedPadding !== undefined) style.padding = resolvedPadding;

  const resolvedPaddingX = toCssSpace(paddingX);
  if (resolvedPaddingX !== undefined) {
    style.paddingLeft = resolvedPaddingX;
    style.paddingRight = resolvedPaddingX;
  }

  const resolvedPaddingY = toCssSpace(paddingY);
  if (resolvedPaddingY !== undefined) {
    style.paddingTop = resolvedPaddingY;
    style.paddingBottom = resolvedPaddingY;
  }

  const resolvedPaddingTop = toCssSpace(paddingTop);
  if (resolvedPaddingTop !== undefined) style.paddingTop = resolvedPaddingTop;

  const resolvedPaddingRight = toCssSpace(paddingRight);
  if (resolvedPaddingRight !== undefined)
    style.paddingRight = resolvedPaddingRight;

  const resolvedPaddingBottom = toCssSpace(paddingBottom);
  if (resolvedPaddingBottom !== undefined)
    style.paddingBottom = resolvedPaddingBottom;

  const resolvedPaddingLeft = toCssSpace(paddingLeft);
  if (resolvedPaddingLeft !== undefined)
    style.paddingLeft = resolvedPaddingLeft;
};

const applySizing = (style: CSSProperties, props: SizingProps) => {
  const { width, minWidth, maxWidth, height, minHeight, maxHeight } = props;

  const resolvedWidth = toCssSize(width);
  if (resolvedWidth !== undefined) style.width = resolvedWidth;

  const resolvedMinWidth = toCssSize(minWidth);
  if (resolvedMinWidth !== undefined) style.minWidth = resolvedMinWidth;

  const resolvedMaxWidth = toCssSize(maxWidth);
  if (resolvedMaxWidth !== undefined) style.maxWidth = resolvedMaxWidth;

  const resolvedHeight = toCssSize(height);
  if (resolvedHeight !== undefined) style.height = resolvedHeight;

  const resolvedMinHeight = toCssSize(minHeight);
  if (resolvedMinHeight !== undefined) style.minHeight = resolvedMinHeight;

  const resolvedMaxHeight = toCssSize(maxHeight);
  if (resolvedMaxHeight !== undefined) style.maxHeight = resolvedMaxHeight;
};

const applyDecoration = (style: CSSProperties, props: DecorationProps) => {
  const { background, border, borderRadius, shadow } = props;

  if (background !== undefined) style.background = background;
  if (border !== undefined) style.border = border;

  const resolvedBorderRadius = toCssSpace(borderRadius);
  if (resolvedBorderRadius !== undefined)
    style.borderRadius = resolvedBorderRadius;

  if (shadow !== undefined) style.boxShadow = shadow;
};

export const createBaseStyle = (props: BaseStyleProps) => {
  const style: CSSProperties = {};

  applySpacing(style, props);
  applySizing(style, props);
  applyDecoration(style, props);

  return style;
};

export const mapAlignToCss = (
  align?: Align,
): CSSProperties["alignItems"] | undefined => {
  if (align === undefined) return undefined;
  if (align === "start") return "flex-start";
  if (align === "center") return "center";
  if (align === "end") return "flex-end";
  if (align === "stretch") return "stretch";
  return "baseline";
};

export const mapJustifyToCss = (
  justify?: Justify,
): CSSProperties["justifyContent"] | undefined => {
  if (justify === undefined) return undefined;
  if (justify === "start") return "flex-start";
  if (justify === "center") return "center";
  if (justify === "end") return "flex-end";
  if (justify === "space-between") return "space-between";
  if (justify === "space-around") return "space-around";
  return "space-evenly";
};
