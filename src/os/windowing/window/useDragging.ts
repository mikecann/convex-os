import { useEffect, useRef } from "react";

interface UseDraggingProps {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  windowRef: React.RefObject<HTMLDivElement | null>;
  currentPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  currentSizeRef: React.MutableRefObject<{ width: number; height: number }>;
  onGeometryChange?: (geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  setIsDragging: (value: boolean) => void;
}

export function useDragging({
  isDragging,
  dragOffset,
  windowRef,
  currentPositionRef,
  currentSizeRef,
  onGeometryChange,
  setIsDragging,
}: UseDraggingProps) {
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!windowRef.current) return;

      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;

      // Update DOM directly (no re-render)
      currentPositionRef.current = { x: newX, y: newY };
      windowRef.current.style.left = `${newX}px`;
      windowRef.current.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Notify parent of final position
      onGeometryChange?.({
        x: currentPositionRef.current.x,
        y: currentPositionRef.current.y,
        width: currentSizeRef.current.width,
        height: currentSizeRef.current.height,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    dragOffset,
    onGeometryChange,
    windowRef,
    currentPositionRef,
    currentSizeRef,
    setIsDragging,
  ]);
}
