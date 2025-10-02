import { useState, useEffect } from "react";
import { Window, WindowProps } from "./window/Window";
import { useOS } from "../OperatingSystem";

export function LocalWindow({
  children,
  width: initialWidth,
  height: initialHeight,
  ...rest
}: Omit<WindowProps, "x" | "y">) {
  const [geometry, setGeometry] = useState({
    x: window.innerWidth / 2 - initialWidth / 2,
    y: window.innerHeight / 2 - initialHeight / 2,
    width: initialWidth,
    height: initialHeight,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { desktopRect } = useOS();

  // Center window on mount
  useEffect(() => {
    if (!desktopRect) return;
    const centerX = (desktopRect.width - initialWidth) / 2;
    const centerY = (desktopRect.height - initialHeight) / 2;
    setGeometry({
      x: centerX,
      y: centerY,
      width: initialWidth,
      height: initialHeight,
    });
    setIsInitialized(true);
  }, [isInitialized, desktopRect, initialWidth, initialHeight]);

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
