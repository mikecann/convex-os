import { useState, useEffect } from "react";
import { Window, WindowProps } from "../common/components/window/Window";
import { useOS } from "../os/OperatingSystem";

export function LocalWindow({
  children,
  x: initialX,
  y: initialY,
  width: initialWidth,
  height: initialHeight,
  ...rest
}: WindowProps) {
  const [geometry, setGeometry] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { desktopRect } = useOS();

  // Center window on mount
  useEffect(() => {
    if (!isInitialized && desktopRect) {
      const centerX = (desktopRect.width - initialWidth) / 2;
      const centerY = (desktopRect.height - initialHeight) / 2;
      setGeometry({
        x: centerX,
        y: centerY,
        width: initialWidth,
        height: initialHeight,
      });
      setIsInitialized(true);
    }
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
