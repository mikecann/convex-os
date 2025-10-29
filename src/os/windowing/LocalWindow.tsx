import { useState, useEffect } from "react";
import { Window, WindowProps } from "./window/Window";
import { useOS } from "../OperatingSystem";

export function LocalWindow({
  children,
  width: initialWidth,
  height: initialHeight,
  ...rest
}: Omit<WindowProps, "x" | "y">) {
  const { desktopRect } = useOS();

  const [geometry, setGeometry] = useState(() => {
    const rect = desktopRect || {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const centerX = (rect.width - initialWidth) / 2;
    const centerY = (rect.height - initialHeight) / 2;
    return {
      x: centerX,
      y: centerY,
      width: initialWidth,
      height: initialHeight,
    };
  });

  return (
    <Window
      {...rest}
      x={geometry.x}
      y={geometry.y}
      width={geometry.width}
      height={geometry.height}
      onGeometryChange={setGeometry}
    >
      {children}
    </Window>
  );
}
