import { useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { DesktopFileDoc } from "../desktopFileIcon/DesktopFileIcon";

export function useFileSelection(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onClickEmpty?: () => void,
) {
  const [selectedIds, setSelectedIds] = useState<Array<Id<"files">>>([]);
  const [selectionRect, setSelectionRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const hasDraggedRef = useRef(false);
  const iconNodesRef = useRef(
    new Map<Id<"files">, { element: HTMLDivElement; file: DesktopFileDoc }>(),
  );

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;
    selectionStartRef.current = { x: startX, y: startY };
    setSelectionRect({ left: startX, top: startY, width: 0, height: 0 });
    hasDraggedRef.current = false;
    setSelectedIds([]);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!selectionStartRef.current || !containerRef.current) return;
      moveEvent.preventDefault();
      hasDraggedRef.current = true;

      const currentX = moveEvent.clientX - rect.left;
      const currentY = moveEvent.clientY - rect.top;
      const width = currentX - selectionStartRef.current.x;
      const height = currentY - selectionStartRef.current.y;
      const normalized = {
        left:
          width >= 0
            ? selectionStartRef.current.x
            : selectionStartRef.current.x + width,
        top:
          height >= 0
            ? selectionStartRef.current.y
            : selectionStartRef.current.y + height,
        width: Math.abs(width),
        height: Math.abs(height),
      };
      setSelectionRect(normalized);

      const selected: Array<Id<"files">> = [];
      iconNodesRef.current.forEach(({ element, file }) => {
        const iconRect = element.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        const iconLeft = iconRect.left - containerRect.left;
        const iconTop = iconRect.top - containerRect.top;
        const iconWidth = iconRect.width;
        const iconHeight = iconRect.height;
        const intersects =
          normalized.left < iconLeft + iconWidth &&
          normalized.left + normalized.width > iconLeft &&
          normalized.top < iconTop + iconHeight &&
          normalized.top + normalized.height > iconTop;
        if (intersects) selected.push(file._id);
      });
      setSelectedIds(selected);
    };

    const handleMouseUp = () => {
      selectionStartRef.current = null;
      setSelectionRect(null);
      if (!hasDraggedRef.current) {
        setSelectedIds([]);
        onClickEmpty?.();
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return {
    selectedIds,
    setSelectedIds,
    selectionRect,
    iconNodesRef,
    handleMouseDown,
  };
}
