import { useRef, DragEvent as ReactDragEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useErrorHandler } from "../../../common/errors/useErrorHandler";
import {
  snapToGrid,
  findNearestAvailablePosition,
  ICON_WIDTH,
  ICON_HEIGHT,
} from "../gridSnapping";
import { DesktopFileDoc } from "./DesktopFileIcon";

export function useDragAndDrop(
  file: DesktopFileDoc,
  selectedFiles: DesktopFileDoc[],
  allFiles: DesktopFileDoc[],
  isSelected: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  isRenaming: boolean,
) {
  const updatePosition = useMutation(api.my.files.updatePosition);
  const updatePositions = useMutation(api.my.files.updatePositions);
  const onError = useErrorHandler();
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const selectedFilesOffsetsRef = useRef<
    Array<{ fileId: Id<"files">; offsetX: number; offsetY: number }>
  >([]);
  const dragStartedRef = useRef(false);

  const handleDragStart = (event: ReactDragEvent<HTMLDivElement>) => {
    if (isRenaming) {
      event.preventDefault();
      return;
    }

    dragStartedRef.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    const containerLeft = rect?.left ?? 0;
    const containerTop = rect?.top ?? 0;
    dragOffsetRef.current = {
      x: event.clientX - (containerLeft + file.position.x),
      y: event.clientY - (containerTop + file.position.y),
    };

    // If this file is selected and there are multiple selected files,
    // calculate offsets for all selected files relative to this one
    if (isSelected && selectedFiles.length > 1) {
      selectedFilesOffsetsRef.current = selectedFiles.map((f) => ({
        fileId: f._id,
        offsetX: f.position.x - file.position.x,
        offsetY: f.position.y - file.position.y,
      }));
    } else {
      selectedFilesOffsetsRef.current = [];
    }

    event.dataTransfer.effectAllowed = "copyMove";
    event.dataTransfer.setData("application/x-desktop-file-id", file._id);
  };

  const handleDragEnd = async (event: ReactDragEvent<HTMLDivElement>) => {
    if (isRenaming) return;
    if (event.dataTransfer.dropEffect === "copy") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const containerLeft = rect.left;
    const containerTop = rect.top;
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const newX = event.clientX - containerLeft - dragOffsetRef.current.x;
    const newY = event.clientY - containerTop - dragOffsetRef.current.y;

    if (Number.isNaN(newX) || Number.isNaN(newY)) return;

    // Clamp position to keep icon within bounds
    const clampedX = Math.max(0, Math.min(newX, containerWidth - ICON_WIDTH));
    const clampedY = Math.max(0, Math.min(newY, containerHeight - ICON_HEIGHT));

    // Prepare occupied positions for collision detection
    const occupiedPositions = allFiles.map((f) => ({
      id: f._id,
      position: f.position,
    }));

    try {
      // If we're dragging multiple files, update all of them
      if (selectedFilesOffsetsRef.current.length > 0) {
        // Get IDs of all files being moved (to exclude from collision check)
        const movingFileIds = selectedFilesOffsetsRef.current.map(
          (offset) => offset.fileId,
        );

        // Find available position for the primary dragged file
        const primaryPosition = findNearestAvailablePosition(
          { x: clampedX, y: clampedY },
          occupiedPositions,
          containerWidth,
          containerHeight,
          movingFileIds,
        );

        // Calculate positions for all selected files maintaining their relative offsets
        const updates: Array<{
          fileId: Id<"files">;
          position: { x: number; y: number };
        }> = selectedFilesOffsetsRef.current.map((offset) => {
          const fileX = primaryPosition.x + offset.offsetX;
          const fileY = primaryPosition.y + offset.offsetY;

          // Clamp each file's position
          const clampedFileX = Math.max(
            0,
            Math.min(fileX, containerWidth - ICON_WIDTH),
          );
          const clampedFileY = Math.max(
            0,
            Math.min(fileY, containerHeight - ICON_HEIGHT),
          );

          return {
            fileId: offset.fileId,
            position: snapToGrid({ x: clampedFileX, y: clampedFileY }),
          };
        });

        await updatePositions({ updates });
      } else {
        // Single file drag - find nearest available position
        const availablePosition = findNearestAvailablePosition(
          { x: clampedX, y: clampedY },
          occupiedPositions,
          containerWidth,
          containerHeight,
          [file._id], // Exclude the file being moved
        );

        await updatePosition({
          fileId: file._id,
          position: availablePosition,
        });
      }
    } catch (error) {
      onError(error);
    } finally {
      selectedFilesOffsetsRef.current = [];
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
    dragStartedRef,
  };
}
