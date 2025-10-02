interface SelectionRectangleProps {
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

export function SelectionRectangle({ rect }: SelectionRectangleProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: "1px solid rgba(96, 165, 250, 0.9)",
        background: "rgba(59, 130, 246, 0.3)",
      }}
    />
  );
}
