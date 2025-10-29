import { useState, useEffect, DragEvent as ReactDragEvent } from "react";
import { DesktopFileUpload } from "../useDesktopFileUploader";
import {
  findNearestAvailablePosition,
  ICON_WIDTH,
  ICON_HEIGHT,
} from "../gridSnapping";
import { DesktopFileDoc } from "../desktopFileIcon/DesktopFileIcon";

export function useFileDrop(
  containerRef: React.RefObject<HTMLDivElement | null>,
  files: DesktopFileDoc[],
  uploadFiles: (uploads: Array<DesktopFileUpload>) => Promise<void>,
) {
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragOver(false);
    };

    window.addEventListener("dragend", handleGlobalDragEnd);
    window.addEventListener("drop", handleGlobalDragEnd);

    return () => {
      window.removeEventListener("dragend", handleGlobalDragEnd);
      window.removeEventListener("drop", handleGlobalDragEnd);
    };
  }, []);

  const handleDrop = async (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(false);

    if (event.dataTransfer.types.includes("application/x-desktop-file-id")) 
      return;
    

    if (event.dataTransfer.files.length === 0) return;

    const deskRect = containerRef.current?.getBoundingClientRect();
    if (!deskRect) return;

    const dropX = event.clientX - deskRect.left;
    const dropY = event.clientY - deskRect.top;

    // Clamp the drop position to keep within bounds
    const clampedX = Math.max(0, Math.min(dropX, deskRect.width - ICON_WIDTH));
    const clampedY = Math.max(
      0,
      Math.min(dropY, deskRect.height - ICON_HEIGHT),
    );

    // Prepare occupied positions for collision detection
    const occupiedPositions: Array<{
      id: string;
      position: { x: number; y: number };
    }> = files.map((f) => ({
      id: f._id,
      position: f.position,
    }));

    const uploads: Array<DesktopFileUpload> = [];
    const droppedFiles = Array.from(event.dataTransfer.files);

    // Find positions for each file, avoiding overlaps
    for (let index = 0; index < droppedFiles.length; index++) {
      const file = droppedFiles[index];

      // Try horizontal placement first
      const desiredX = clampedX + index * 100;
      const desiredY = clampedY;

      // Find nearest available position
      const availablePosition = findNearestAvailablePosition(
        { x: desiredX, y: desiredY },
        occupiedPositions,
        deskRect.width,
        deskRect.height,
        [],
      );

      uploads.push({
        file,
        position: availablePosition,
      });

      // Add this position to occupied list for next iteration
      occupiedPositions.push({
        id: `temp-${index}`,
        position: availablePosition,
      });
    }

    await uploadFiles(uploads);
  };

  const handleDragEnter = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.types.includes("application/x-desktop-file-id")) {
      event.dataTransfer.dropEffect = "move";
      return;
    }
    setIsDragOver(true);
  };

  const handleDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!containerRef.current) {
      setIsDragOver(false);
      return;
    }
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && containerRef.current.contains(nextTarget)) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right) {
      setIsDragOver(false);
      return;
    }
    if (event.clientY < rect.top || event.clientY > rect.bottom) {
      setIsDragOver(false);
      return;
    }
    setIsDragOver(false);
  };

  const handleDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.types.includes("application/x-desktop-file-id")) {
      event.dataTransfer.dropEffect = "move";
      return;
    }
    event.dataTransfer.dropEffect = "copy";
  };

  return {
    isDragOver,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  };
}
