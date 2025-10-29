import { useState, useEffect } from "react";
import { Window, WindowProps } from "./window/Window";
import { useOS } from "../OperatingSystem";
import { playSound } from "../../common/sounds/soundEffects";
import { createPortal } from "react-dom";

export function LocalModalWindow({
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

  useEffect(() => {
    playSound("balloon", 0.3);
  }, []);

  const modalContent = (
    <>
      {/* Modal overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          pointerEvents: "auto",
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />
      {/* Modal window */}
      <div style={{ position: "relative", zIndex: 9999 }}>
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
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
