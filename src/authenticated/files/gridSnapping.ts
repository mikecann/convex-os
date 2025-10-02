// Grid configuration for desktop icon positioning
export const GRID_SIZE = 100; // pixels
export const ICON_WIDTH = 96; // pixels
export const ICON_HEIGHT = 112; // pixels

/**
 * Snaps a position to the nearest grid point
 */
export function snapToGrid(position: { x: number; y: number }): {
  x: number;
  y: number;
} {
  return {
    x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
  };
}

/**
 * Calculates the position offset needed to align to grid
 */
export function getGridOffset(position: { x: number; y: number }): {
  x: number;
  y: number;
} {
  const snapped = snapToGrid(position);
  return {
    x: snapped.x - position.x,
    y: snapped.y - position.y,
  };
}

/**
 * Checks if two icon positions overlap
 */
function doIconsOverlap(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number },
): boolean {
  return (
    pos1.x < pos2.x + ICON_WIDTH &&
    pos1.x + ICON_WIDTH > pos2.x &&
    pos1.y < pos2.y + ICON_HEIGHT &&
    pos1.y + ICON_HEIGHT > pos2.y
  );
}

/**
 * Finds the nearest available grid position that doesn't overlap with existing icons
 * @param desiredPosition The desired position (will be snapped to grid)
 * @param occupiedPositions Array of positions already occupied by other icons
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @param excludeIds Optional array of IDs to exclude from overlap checking (for moving existing icons)
 * @returns The nearest available position, or the desired position if no space is available
 */
export function findNearestAvailablePosition(
  desiredPosition: { x: number; y: number },
  occupiedPositions: Array<{ id: string; position: { x: number; y: number } }>,
  containerWidth: number,
  containerHeight: number,
  excludeIds: string[] = [],
): { x: number; y: number } {
  // Snap the desired position to grid
  const snappedDesired = snapToGrid(desiredPosition);

  // Filter out excluded IDs
  const relevantOccupied = occupiedPositions.filter(
    (p) => !excludeIds.includes(p.id),
  );

  // Check if desired position is available
  const hasOverlap = relevantOccupied.some((occupied) =>
    doIconsOverlap(snappedDesired, occupied.position),
  );

  if (!hasOverlap) {
    return snappedDesired;
  }

  // Calculate grid dimensions
  const maxCols = Math.floor(containerWidth / GRID_SIZE);
  const maxRows = Math.floor(containerHeight / GRID_SIZE);

  // Try positions in a spiral pattern starting from the desired position
  const desiredGridX = Math.round(snappedDesired.x / GRID_SIZE);
  const desiredGridY = Math.round(snappedDesired.y / GRID_SIZE);

  // Search in expanding squares around the desired position
  for (let radius = 1; radius < Math.max(maxCols, maxRows); radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        // Only check positions on the edge of the current square
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

        const gridX = desiredGridX + dx;
        const gridY = desiredGridY + dy;

        // Check bounds
        if (gridX < 0 || gridY < 0 || gridX >= maxCols || gridY >= maxRows)
          continue;

        const candidatePos = {
          x: gridX * GRID_SIZE,
          y: gridY * GRID_SIZE,
        };

        // Check if this position overlaps with any occupied position
        const overlaps = relevantOccupied.some((occupied) =>
          doIconsOverlap(candidatePos, occupied.position),
        );

        if (!overlaps) {
          return candidatePos;
        }
      }
    }
  }

  // No available position found, return the desired position (overlap as last resort)
  return snappedDesired;
}
