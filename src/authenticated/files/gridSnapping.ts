// Grid configuration for desktop icon positioning
export const GRID_SIZE = 100; // pixels

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
